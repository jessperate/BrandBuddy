import type { IncomingMessage, ServerResponse } from 'node:http'

export const config = { maxDuration: 20 }

// ─── Types ────────────────────────────────────────────────────────────────

interface ScanResponse {
  name: string
  url: string
  primaryColor: string
  about: string[]
  voiceAndTone: string
  colors: {
    brand: Array<{ name: string; hex: string; variable?: string; usage?: string }>
    text: Array<{ name: string; hex: string; variable?: string; usage?: string }>
  }
  fonts: {
    sans: { name: string; fallback: string }
    serif: { name: string; fallback: string }
    mono: { name: string; fallback: string }
  }
  logoUrl: string | null
  logoSvg: string | null
  warnings: string[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'))
  return m ? m[1] : null
}

function resolveSrc(href: string, base: string): string {
  try {
    return new URL(href, base).href
  } catch {
    return href
  }
}

function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function normalizeHex(hex: string): string | null {
  const clean = hex.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(clean)) return clean.toLowerCase()
  if (/^#[0-9a-fA-F]{3}$/.test(clean)) {
    const [, r, g, b] = clean
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }
  return null
}

function dedupeColors(hexes: string[]): string[] {
  const seen = new Set<string>()
  return hexes.filter(h => { if (seen.has(h)) return false; seen.add(h); return true })
}

// ─── Extraction ───────────────────────────────────────────────────────────

function extractMeta(html: string): Record<string, string> {
  const out: Record<string, string> = {}
  const re = /<meta([^>]+)>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const tag = m[1]
    const name = attr(tag, '(?:name|property)')?.toLowerCase()
    const content = attr(tag, 'content')
    if (name && content) out[name] = content
  }
  return out
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return m ? m[1].trim().split(/[\|\-–—]/)[0].trim() : null
}

function extractFavicons(html: string, base: string): { url: string; type: string }[] {
  const results: { url: string; type: string }[] = []
  const re = /<link([^>]+)>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const tag = m[1]
    const rel = attr(tag, 'rel')?.toLowerCase() ?? ''
    const href = attr(tag, 'href')
    if (!href) continue
    if (rel.includes('icon') || rel.includes('apple-touch-icon')) {
      const type = attr(tag, 'type') ?? (href.endsWith('.svg') ? 'image/svg+xml' : 'image/x-icon')
      results.push({ url: resolveSrc(href, base), type })
    }
  }
  return results
}

function extractFonts(html: string): { sans: string | null; serif: string | null; mono: string | null } {
  const googleFamilies: string[] = []

  // <link href="https://fonts.googleapis.com/...">
  const linkRe = /<link([^>]+)>/gi
  let m: RegExpExecArray | null
  while ((m = linkRe.exec(html))) {
    const href = attr(m[1], 'href') ?? ''
    if (!href.includes('fonts.googleapis.com')) continue
    const familyPart = href.match(/[?&]family=([^&"']+)/)?.[1] ?? ''
    const names = decodeURIComponent(familyPart)
      .split('|')
      .map(f => f.split(':')[0].replace(/\+/g, ' ').trim())
      .filter(Boolean)
    googleFamilies.push(...names)
  }

  // @import url("https://fonts.googleapis.com/...")
  const importRe = /@import\s+url\(["']?([^"')]+fonts\.googleapis\.com[^"')]+)["']?\)/gi
  while ((m = importRe.exec(html))) {
    const familyPart = m[1].match(/[?&]family=([^&"']+)/)?.[1] ?? ''
    const names = decodeURIComponent(familyPart)
      .split('|')
      .map(f => f.split(':')[0].replace(/\+/g, ' ').trim())
      .filter(Boolean)
    googleFamilies.push(...names)
  }

  // Classify by name heuristics
  const MONO_HINTS = ['mono', 'code', 'fira', 'jetbrains', 'cascadia', 'inconsolata', 'courier', 'consolas', 'ibm plex mono', 'source code']
  const SERIF_HINTS = ['serif', 'playfair', 'merriweather', 'georgia', 'garamond', 'times', 'lora', 'libre baskerville', 'eb garamond', 'cormorant', 'freight']

  let sans: string | null = null
  let serif: string | null = null
  let mono: string | null = null

  for (const f of googleFamilies) {
    const fl = f.toLowerCase()
    if (!mono && MONO_HINTS.some(h => fl.includes(h))) { mono = f; continue }
    if (!serif && SERIF_HINTS.some(h => fl.includes(h))) { serif = f; continue }
    if (!sans) { sans = f }
  }

  return { sans, serif, mono }
}

function extractCssColors(html: string): { variable: string; hex: string }[] {
  const out: { variable: string; hex: string }[] = []
  const styleBlocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1])
  const css = styleBlocks.join('\n')

  const varRe = /(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\b/g
  let m: RegExpExecArray | null
  while ((m = varRe.exec(css))) {
    const hex = normalizeHex(m[2])
    if (hex) out.push({ variable: m[1], hex })
  }
  return out
}

function guessPrimaryFromVars(vars: { variable: string; hex: string }[]): string | null {
  const PRIMARY_HINTS = [
    'primary', 'brand', 'accent', 'main', 'highlight', 'key', 'action',
    'interactive', 'focus', 'link', 'cta',
  ]
  for (const hint of PRIMARY_HINTS) {
    const match = vars.find(v => v.variable.toLowerCase().includes(hint) && luminance(v.hex) < 0.85 && luminance(v.hex) > 0.02)
    if (match) return match.hex
  }
  // Fallback: first mid-tone color
  const mid = vars.find(v => luminance(v.hex) < 0.7 && luminance(v.hex) > 0.05)
  return mid?.hex ?? null
}

function classifyColorVars(vars: { variable: string; hex: string }[]): {
  brand: Array<{ name: string; hex: string; variable: string }>
  text: Array<{ name: string; hex: string; variable: string }>
} {
  const TEXT_HINTS = ['text', 'foreground', 'on-', 'label', 'heading', 'body', 'copy']
  const SKIP_HINTS = ['shadow', 'ring', 'radius', 'space', 'size', 'width', 'height', 'duration', 'z-', 'opacity']

  const brand: Array<{ name: string; hex: string; variable: string }> = []
  const text: Array<{ name: string; hex: string; variable: string }> = []
  const seen = new Set<string>()

  for (const { variable, hex } of vars) {
    if (seen.has(hex)) continue
    seen.add(hex)
    const vl = variable.toLowerCase()
    if (SKIP_HINTS.some(s => vl.includes(s))) continue

    const prettyName = variable
      .replace(/^--/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())

    if (TEXT_HINTS.some(h => vl.includes(h))) {
      text.push({ name: prettyName, hex, variable })
    } else {
      brand.push({ name: prettyName, hex, variable })
    }
  }

  return { brand: brand.slice(0, 12), text: text.slice(0, 6) }
}

async function fetchSvg(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'BrandBuddy/1.0' } })
    if (!r.ok) return null
    const ct = r.headers.get('content-type') ?? ''
    if (!ct.includes('svg') && !ct.includes('xml') && !url.endsWith('.svg')) return null
    const text = await r.text()
    return text.includes('<svg') ? text : null
  } catch {
    return null
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') { res.end('{}'); return }

  const rawUrl = new URL(req.url ?? '', 'http://localhost').searchParams.get('url') ?? ''
  if (!rawUrl) {
    res.statusCode = 400
    res.end(JSON.stringify({ error: 'Missing ?url= parameter' }))
    return
  }

  const targetUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
  const warnings: string[] = []

  let html = ''
  let finalUrl = targetUrl

  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 12000)
    const resp = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BrandBuddy/1.0; +https://brandbuddy-sandy.vercel.app)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })
    clearTimeout(t)
    finalUrl = resp.url
    html = await resp.text()
  } catch (err: unknown) {
    res.statusCode = 502
    res.end(JSON.stringify({ error: `Could not reach ${targetUrl}. The site may block automated requests.` }))
    return
  }

  // ── Extract everything ─────────────────────────────────────────────────

  const meta = extractMeta(html)
  const title = extractTitle(html)

  const name = meta['og:site_name'] || meta['application-name'] || title || new URL(finalUrl).hostname.replace(/^www\./, '')
  const description = meta['og:description'] || meta['description'] || ''
  const themeColor = meta['theme-color'] || meta['msapplication-tilecolor'] || null

  const favicons = extractFavicons(html, finalUrl)
  const svgFavicon = favicons.find(f => f.type === 'image/svg+xml' || f.url.endsWith('.svg'))
  const logoUrl = svgFavicon?.url
    ?? meta['og:image']
    ?? favicons[0]?.url
    ?? null

  let logoSvg: string | null = null
  if (logoUrl) {
    logoSvg = await fetchSvg(logoUrl)
    if (!logoSvg) warnings.push('Logo found but could not be fetched as SVG — displaying as image.')
  } else {
    warnings.push('No logo detected.')
  }

  const cssVars = extractCssColors(html)
  const primaryColor = normalizeHex(themeColor ?? '') ?? guessPrimaryFromVars(cssVars) ?? '#000000'

  const { brand: brandColors, text: textColors } = classifyColorVars(cssVars)
  if (cssVars.length === 0) warnings.push('No CSS variables found — styles may be loaded from external files.')

  const { sans, serif, mono } = extractFonts(html)
  if (!sans && !serif) warnings.push('No Google Fonts detected — fonts may be self-hosted or loaded dynamically.')

  const fontStack = (name: string | null, type: 'sans' | 'serif' | 'mono'): { name: string; fallback: string } => {
    const defaults = {
      sans: { name: 'System Sans', fallback: '-apple-system, BlinkMacSystemFont, sans-serif' },
      serif: { name: 'System Serif', fallback: 'Georgia, serif' },
      mono: { name: 'System Mono', fallback: 'monospace' },
    }
    if (!name) return defaults[type]
    const fallbacks = {
      sans:  `-apple-system, BlinkMacSystemFont, sans-serif`,
      serif: `Georgia, serif`,
      mono:  `monospace`,
    }
    return { name, fallback: `'${name}', ${fallbacks[type]}` }
  }

  const result: ScanResponse = {
    name: name.slice(0, 80),
    url: finalUrl,
    primaryColor,
    about: description ? [description] : [],
    voiceAndTone: '',
    colors: {
      brand: brandColors.length > 0
        ? brandColors
        : primaryColor !== '#000000'
          ? [{ name: 'Primary', hex: primaryColor, usage: 'Detected from theme-color' }]
          : [],
      text: textColors,
    },
    fonts: {
      sans:  fontStack(sans, 'sans'),
      serif: fontStack(serif, 'serif'),
      mono:  fontStack(mono, 'mono'),
    },
    logoUrl,
    logoSvg,
    warnings,
  }

  res.end(JSON.stringify(result))
}
