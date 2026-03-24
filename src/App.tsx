import { useState, useEffect, useRef } from 'react'
import { Copy, Check, Plus, X, ArrowRight, AlertCircle } from 'lucide-react'
import type { BrandData, ColorEntry, SecondaryColor } from './types'
import { AIROPS_BRAND } from './data/airops'

// ─── Utilities ────────────────────────────────────────────────────────────

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

function fontFamily(brand: BrandData, role: 'serif' | 'sans' | 'mono'): string {
  return brand.fonts[role].fallback
}

// ─── Shared UI ────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: '#a5aab6' }}>
      {copied ? <Check size={11} color="#008c44" /> : <Copy size={11} />}
    </button>
  )
}

function Tag({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: '10px', fontWeight: 500,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '2px 8px', background: color ?? '#f8fffb',
      border: '1px solid #d4e8da', color: '#676c79',
    }}>{children}</span>
  )
}

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', color: '#a5aab6' }}>{index}</span>
      <div style={{ flex: 1, height: '1px', background: '#d4e8da' }} />
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#676c79' }}>{children}</span>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', margin: '0 0 8px', color: '#000d05', lineHeight: 1.2 }}>
      {children}
    </h2>
  )
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a5aab6', marginBottom: '12px', marginTop: '32px' }}>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ borderTop: '1px solid #d4e8da', margin: '64px 0' }} />
}

// ─── Color Swatch ─────────────────────────────────────────────────────────

function ColorSwatch({ c }: { c: ColorEntry }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ width: '100%', aspectRatio: '1', background: c.hex, border: isLight(c.hex) && c.hex !== '#000d05' ? '1px solid #d4e8da' : 'none' }} />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#000d05' }}>{c.name}</span>
          <CopyBtn text={c.hex} />
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#676c79', letterSpacing: '0.04em' }}>{c.hex.toUpperCase()}</div>
        {c.variable && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: '#a5aab6' }}>{c.variable}</div>}
        {c.usage && <div style={{ fontSize: '11px', color: '#676c79', marginTop: '2px' }}>{c.usage}</div>}
      </div>
    </div>
  )
}

function SecondaryGrid({ colors, hues, tiers }: { colors: SecondaryColor[]; hues: string[]; tiers: string[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${hues.length}, 1fr)`, gap: '1px', background: '#d4e8da' }}>
      {hues.map(h => (
        <div key={h} style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', textAlign: 'center', padding: '6px 0', background: '#fff', color: '#a5aab6', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</div>
      ))}
      {tiers.map(tier => hues.map(hue => {
        const s = colors.find(c => c.hue === hue && c.tier === tier)
        if (!s) return <div key={hue + tier} style={{ background: '#fff', aspectRatio: '1' }} />
        return (
          <div key={hue + tier} title={s.hex} onClick={() => navigator.clipboard.writeText(s.hex)}
            style={{ aspectRatio: '1', background: s.hex, cursor: 'pointer', position: 'relative' }}>
            <span style={{ position: 'absolute', bottom: '3px', left: '3px', fontFamily: "'DM Mono', monospace", fontSize: '8px', color: isLight(s.hex) ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)' }}>{tier}</span>
          </div>
        )
      }))}
    </div>
  )
}

// ─── Logo Wordmark (text-based stand-in) ──────────────────────────────────

function LogoWordmark({ fill, size = 24 }: { fill: string; size?: number }) {
  return (
    <span style={{
      fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: size,
      color: fill, letterSpacing: '-0.04em', lineHeight: 1,
    }}>
      airops
    </span>
  )
}

// ─── URL Scanner Empty State ──────────────────────────────────────────────

const EXAMPLES = ['stripe.com', 'linear.app', 'vercel.com', 'notion.so', 'figma.com', 'loom.com']

const SCAN_STEPS = [
  'Fetching page…',
  'Extracting colors…',
  'Detecting fonts…',
  'Finding logo…',
  'Building profile…',
]

interface EmptyStateProps { onLoad: (brand: BrandData) => void }

function EmptyState({ onLoad }: EmptyStateProps) {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'scanning' | 'error'>('idle')
  const [step, setStep] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [warnings, setWarnings] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const stepRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function startStepTimer() {
    let s = 0
    setStep(0)
    stepRef.current = setInterval(() => {
      s = Math.min(s + 1, SCAN_STEPS.length - 1)
      setStep(s)
    }, 900)
  }

  function stopStepTimer() {
    if (stepRef.current) clearInterval(stepRef.current)
  }

  async function scan(rawUrl: string) {
    const target = rawUrl.trim()
    if (!target) return
    setStatus('scanning')
    setErrorMsg('')
    setWarnings([])
    startStepTimer()

    try {
      const res = await fetch(`/api/scan?url=${encodeURIComponent(target)}`)
      const data = await res.json()
      stopStepTimer()

      if (!res.ok || data.error) {
        setStatus('error')
        setErrorMsg(data.error ?? 'Scan failed')
        return
      }

      if (data.warnings?.length) setWarnings(data.warnings)

      // Merge scan result into a full BrandData skeleton
      const brand: BrandData = {
        name: data.name ?? target,
        url: data.url ?? target,
        primaryColor: data.primaryColor ?? '#000000',
        logoUrl: data.logoUrl ?? undefined,
        logoSvg: data.logoSvg ?? undefined,
        about: data.about ?? [],
        voiceAndTone: data.voiceAndTone ?? '',
        authorPersona: '',
        writingRules: [],
        colors: {
          brand: data.colors?.brand ?? [],
          text: data.colors?.text ?? [],
          secondary: [],
          secHues: [],
          secTiers: [],
        },
        fonts: data.fonts ?? {
          sans:  { name: 'System Sans',  fallback: 'sans-serif'  },
          serif: { name: 'System Serif', fallback: 'serif'       },
          mono:  { name: 'System Mono',  fallback: 'monospace'   },
        },
        typeScale: [],
        logoVariants: data.logoUrl
          ? [
              { id: 'light', label: 'On White', bg: '#ffffff', logoFill: data.primaryColor, labelColor: '#a5aab6', border: true },
              { id: 'dark',  label: 'On Dark',  bg: data.primaryColor, logoFill: '#ffffff', labelColor: 'rgba(255,255,255,0.4)' },
            ]
          : [],
        logoRules: [],
        logoSizes: [],
        dataViz: { palette: [], typography: [] },
        slideDesign: { ruleGroups: [], fontFallbacks: [] },
      }

      setStatus('idle')
      if (data.warnings?.length) {
        // small pause so user sees warnings before transition
        setTimeout(() => onLoad(brand), 1200)
      } else {
        onLoad(brand)
      }
    } catch {
      stopStepTimer()
      setStatus('error')
      setErrorMsg('Network error — check your connection and try again.')
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    scan(url)
  }

  const isScanning = status === 'scanning'

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '0 48px', height: '52px', borderBottom: '1px solid #d4e8da', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '20px', height: '20px', background: '#008c44', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '8px', height: '8px', background: '#00ff64' }} />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#000d05' }}>BrandBuddy</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: '#a5aab6', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Visual Foundations</span>
      </header>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>

          {/* Title */}
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#a5aab6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
            Enter any brand URL
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.05, margin: '0 0 10px', color: '#000d05' }}>
            Scan a brand
          </h1>
          <p style={{ fontSize: '14px', color: '#676c79', margin: '0 0 36px', lineHeight: 1.6 }}>
            BrandBuddy scans the site for colors, fonts, logo, and description, then builds a visual foundations view.
          </p>

          {/* URL input */}
          <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', border: '1px solid #000d05', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', background: '#f8fffb', borderRight: '1px solid #d4e8da', flexShrink: 0 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#a5aab6' }}>https://</span>
              </div>
              <input
                ref={inputRef}
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="stripe.com"
                disabled={isScanning}
                style={{
                  flex: 1, padding: '14px 16px', border: 'none', outline: 'none',
                  fontSize: '16px', color: '#000d05', fontFamily: "'DM Sans', sans-serif",
                  background: '#fff',
                }}
              />
              <button
                type="submit"
                disabled={isScanning || !url.trim()}
                style={{
                  padding: '0 24px', background: '#000d05', color: '#fff', border: 'none',
                  cursor: isScanning || !url.trim() ? 'not-allowed' : 'pointer',
                  opacity: !url.trim() ? 0.4 : 1,
                  fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                  transition: 'opacity 0.15s',
                }}
              >
                {isScanning ? 'Scanning' : 'Scan'} <ArrowRight size={14} />
              </button>
            </div>
          </form>

          {/* Step progress */}
          {isScanning && (
            <div style={{ border: '1px solid #d4e8da', padding: '20px 24px', background: '#f8fffb', marginBottom: '16px' }}>
              {SCAN_STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0' }}>
                  <div style={{
                    width: '6px', height: '6px', flexShrink: 0,
                    background: i < step ? '#008c44' : i === step ? '#00ff64' : '#d4e8da',
                    transition: 'background 0.3s',
                  }} />
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.04em',
                    color: i <= step ? '#000d05' : '#a5aab6',
                    transition: 'color 0.3s',
                  }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && status !== 'scanning' && (
            <div style={{ border: '1px solid #EEFF8C', background: '#fffdf0', padding: '14px 16px', marginBottom: '16px' }}>
              {warnings.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12px', color: '#676c79', lineHeight: 1.5 }}>
                  <AlertCircle size={12} style={{ marginTop: '2px', flexShrink: 0, color: '#888840' }} />
                  {w}
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div style={{ border: '1px solid #fca5a5', background: '#fff5f5', padding: '14px 16px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <AlertCircle size={14} style={{ color: '#dc2626', flexShrink: 0, marginTop: '1px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626', marginBottom: '2px' }}>Scan failed</div>
                <div style={{ fontSize: '12px', color: '#676c79' }}>{errorMsg}</div>
              </div>
            </div>
          )}

          {/* Example pills */}
          {!isScanning && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '36px' }}>
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => { setUrl(ex); scan(ex) }}
                  style={{
                    padding: '5px 12px', border: '1px solid #d4e8da', background: '#f8fffb',
                    fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#676c79',
                    cursor: 'pointer', letterSpacing: '0.02em',
                  }}>
                  {ex}
                </button>
              ))}
            </div>
          )}

          {/* AirOps demo divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: '#d4e8da' }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: '#a5aab6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>or try demo</span>
            <div style={{ flex: 1, height: '1px', background: '#d4e8da' }} />
          </div>
          <button onClick={() => onLoad(AIROPS_BRAND)} style={{
            width: '100%', padding: '11px 0', background: '#008c44', color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", letterSpacing: '0',
          }}>
            Load AirOps Brand Kit →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Foundations View ─────────────────────────────────────────────────────

const NAV = [
  { id: 'brand',    label: 'Brand' },
  { id: 'writing',  label: 'Writing' },
  { id: 'logo',     label: 'Logo' },
  { id: 'fonts',    label: 'Fonts' },
  { id: 'colors',   label: 'Colors' },
  { id: 'dataviz',  label: 'Data Viz' },
  { id: 'slides',   label: 'Slides' },
]

interface FoundationsViewProps { brand: BrandData; onClear: () => void }

function FoundationsView({ brand, onClear }: FoundationsViewProps) {
  const [active, setActive] = useState('brand')

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActive(id)
  }

  const ff = (role: 'serif' | 'sans' | 'mono') => fontFamily(brand, role)

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Sticky Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100, background: '#fff',
        borderBottom: '1px solid #d4e8da', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 48px', height: '52px',
        gap: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{ width: '20px', height: '20px', background: brand.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '8px', height: '8px', background: '#fff', opacity: 0.6 }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#000d05' }}>BrandBuddy</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: '#a5aab6', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{brand.name}</span>
        </div>
        <nav style={{ display: 'flex', gap: '2px', flex: 1, justifyContent: 'center' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => go(n.id)} style={{
              padding: '5px 12px', border: 'none', cursor: 'pointer', fontSize: '12px',
              fontWeight: active === n.id ? 600 : 400,
              color: active === n.id ? brand.primaryColor : '#676c79',
              background: active === n.id ? '#f8fffb' : 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}>{n.label}</button>
          ))}
        </nav>
        <button onClick={onClear} style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
          border: '1px solid #d4e8da', background: 'none', cursor: 'pointer',
          fontSize: '12px', color: '#676c79', fontFamily: "'DM Sans', sans-serif",
          flexShrink: 0,
        }}>
          <X size={12} /> Change brand
        </button>
      </header>

      {/* Hero */}
      <div style={{ padding: '72px 48px 56px', background: '#002910', borderBottom: '1px solid #1e2e24' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Tag color="#003d20">{brand.url ?? 'brandbuddy.app'}</Tag>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '64px', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.0, margin: '16px 0 0', color: '#fff', maxWidth: '700px' }}>
            {brand.name}
          </h1>
          <p style={{ fontSize: '14px', color: '#dfeae3', margin: '16px 0 0', lineHeight: 1.6, maxWidth: '520px' }}>
            Visual foundations — colors, typography, logo, writing, data viz, and slide design.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 48px' }}>

        {/* ── 01 Brand Identity ─────────────────────────────────────────── */}
        <section id="brand" style={{ marginBottom: '80px' }}>
          <SectionLabel index="01">Brand Identity</SectionLabel>

          {brand.about.length > 0 && (
            <>
              <SectionHeading>About {brand.name}</SectionHeading>
              <div style={{ marginBottom: '48px' }}>
                {brand.about.map((p, i) => (
                  <p key={i} style={{ fontSize: '15px', color: '#000d05', lineHeight: 1.75, margin: '0 0 16px', maxWidth: '720px' }}>{p}</p>
                ))}
              </div>
            </>
          )}

          {brand.voiceAndTone && (
            <>
              <SubLabel>Brand voice & tone</SubLabel>
              <div style={{ background: '#f8fffb', border: '1px solid #d4e8da', padding: '28px 32px', maxWidth: '720px' }}>
                <p style={{ fontSize: '14px', color: '#000d05', lineHeight: 1.75, margin: 0 }}>{brand.voiceAndTone}</p>
              </div>
            </>
          )}

          {brand.authorPersona && (
            <>
              <SubLabel>Author persona</SubLabel>
              <div style={{ background: '#f8fffb', border: '1px solid #d4e8da', padding: '28px 32px', maxWidth: '720px' }}>
                <p style={{ fontSize: '14px', color: '#000d05', lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>{brand.authorPersona}</p>
              </div>
            </>
          )}

          {(!brand.about.length && !brand.voiceAndTone && !brand.authorPersona) && (
            <EmptySection message="No brand identity added yet. Edit your brand to add an about, voice, and persona." />
          )}
        </section>

        <Divider />

        {/* ── 02 Writing Rules ──────────────────────────────────────────── */}
        <section id="writing" style={{ marginBottom: '80px' }}>
          <SectionLabel index="02">Writing Rules</SectionLabel>
          <SectionHeading>Global writing rules</SectionHeading>
          <p style={{ fontSize: '14px', color: '#676c79', margin: '0 0 32px', lineHeight: 1.6 }}>
            Rules that apply to every piece of content, regardless of format or channel.
          </p>

          {brand.writingRules.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {brand.writingRules.map((r, i) => (
                <div key={r.id} style={{
                  display: 'grid', gridTemplateColumns: '28px 1fr 80px', gap: '16px',
                  alignItems: 'baseline', padding: '16px 0',
                  borderBottom: '1px solid #d4e8da',
                  background: i % 2 === 0 ? '#fff' : '#fafcfb',
                }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#a5aab6', fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontSize: '13px', color: '#000d05', lineHeight: 1.6 }}>{r.rule}</span>
                  <Tag>{r.appliesTo}</Tag>
                </div>
              ))}
            </div>
          ) : (
            <EmptySection message="No writing rules defined. Add global rules to enforce consistent brand voice." />
          )}
        </section>

        <Divider />

        {/* ── 03 Logo & Lockups ─────────────────────────────────────────── */}
        <section id="logo" style={{ marginBottom: '80px' }}>
          <SectionLabel index="03">Logo & Lockups</SectionLabel>
          <SectionHeading>Logo usage</SectionHeading>
          <p style={{ fontSize: '14px', color: '#676c79', margin: '0 0 32px', lineHeight: 1.6 }}>
            Approved background contexts for the {brand.name} mark.
          </p>

          {/* Variant grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: '#d4e8da', marginBottom: '40px' }}>
            {brand.logoVariants.map(v => (
              <div key={v.id} style={{
                background: v.bg, padding: '48px 32px',
                border: v.border ? '1px solid #d4e8da' : 'none',
                display: 'flex', flexDirection: 'column', gap: '20px',
              }}>
                {brand.logoSvg ? (
                  <div
                    style={{ maxWidth: '160px', filter: isLight(v.bg) ? 'none' : 'brightness(0) invert(1)' }}
                    dangerouslySetInnerHTML={{ __html: brand.logoSvg }}
                  />
                ) : brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.name} style={{ maxWidth: '160px', maxHeight: '48px', objectFit: 'contain', filter: isLight(v.bg) ? 'none' : 'brightness(0) invert(1)' }} />
                ) : (
                  <LogoWordmark fill={v.logoFill} size={28} />
                )}
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: v.labelColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {v.label} {v.token && `· ${v.token}`}
                </div>
              </div>
            ))}
          </div>

          {/* Sizes */}
          {brand.logoSizes.length > 0 && (
            <>
              <SubLabel>Sizes</SubLabel>
              <div style={{ border: '1px solid #d4e8da', marginBottom: '32px' }}>
                {brand.logoSizes.map((s, i) => (
                  <div key={s.id} style={{
                    display: 'grid', gridTemplateColumns: '80px 180px 1fr', gap: '24px', alignItems: 'center',
                    padding: '20px 24px', borderBottom: i < brand.logoSizes.length - 1 ? '1px solid #d4e8da' : 'none',
                    background: i % 2 === 0 ? '#fff' : '#fafcfb',
                  }}>
                    <Tag>{s.label}</Tag>
                    <LogoWordmark fill="#000d05" size={s.width / 5} />
                    <span style={{ fontSize: '12px', color: '#676c79' }}>{s.usage} · <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px' }}>{s.width}px</span></span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Do/Don't rules */}
          {brand.logoRules.length > 0 && (
            <>
              <SubLabel>Do / Don't</SubLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#d4e8da' }}>
                <div style={{ background: '#fff', padding: '24px' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#008c44', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>✓ Do</div>
                  {brand.logoRules.filter(r => r.type === 'do').map(r => (
                    <div key={r.id} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '13px', color: '#000d05', lineHeight: 1.5 }}>
                      <span style={{ color: '#008c44', flexShrink: 0, marginTop: '2px' }}>→</span>
                      {r.rule}
                    </div>
                  ))}
                </div>
                <div style={{ background: '#fff', padding: '24px' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#dc2626', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>✕ Don't</div>
                  {brand.logoRules.filter(r => r.type === 'dont').map(r => (
                    <div key={r.id} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '13px', color: '#000d05', lineHeight: 1.5 }}>
                      <span style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }}>✕</span>
                      {r.rule}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        <Divider />

        {/* ── 04 Fonts ──────────────────────────────────────────────────── */}
        <section id="fonts" style={{ marginBottom: '80px' }}>
          <SectionLabel index="04">Fonts</SectionLabel>
          <SectionHeading>Font families</SectionHeading>
          <p style={{ fontSize: '14px', color: '#676c79', margin: '0 0 32px', lineHeight: 1.6 }}>
            Three families — sans, serif, mono — each with a defined role.
          </p>

          {/* Specimen cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#d4e8da', marginBottom: '48px' }}>
            {(['sans', 'serif', 'mono'] as const).map(role => {
              const f = brand.fonts[role]
              return (
                <div key={role} style={{ background: '#fff', padding: '32px' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#a5aab6', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>{role}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#000d05', marginBottom: '4px' }}>{f.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: '#a5aab6', marginBottom: '24px', wordBreak: 'break-all' }}>{f.fallback}</div>
                  <div style={{ fontFamily: f.fallback, fontSize: '32px', fontWeight: 400, lineHeight: 1.2, color: '#000d05', marginBottom: '16px' }}>
                    Aa Bb Cc Dd
                  </div>
                  <div style={{ fontFamily: f.fallback, fontSize: '14px', color: '#676c79', lineHeight: 1.6 }}>
                    The quick brown fox jumps over the lazy dog. 0123456789
                  </div>
                </div>
              )
            })}
          </div>

          {/* Type scale */}
          {brand.typeScale.length > 0 && (
            <>
              <SubLabel>Type scale</SubLabel>
              <div style={{ borderTop: '1px solid #d4e8da' }}>
                {brand.typeScale.map(row => (
                  <div key={row.name} style={{
                    display: 'grid', gridTemplateColumns: '140px 1fr 160px 140px', gap: '24px',
                    alignItems: 'baseline', padding: '20px 0', borderBottom: '1px solid #d4e8da',
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#000d05' }}>{row.name}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: '#a5aab6', marginTop: '2px' }}>{row.size} · w{row.weight}</div>
                    </div>
                    <div style={{ fontFamily: ff(row.fontRole), fontSize: row.size, fontWeight: row.weight, letterSpacing: row.tracking, lineHeight: row.lh, color: '#000d05', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      The quick brown fox
                    </div>
                    <Tag>{row.fontRole}</Tag>
                    <div style={{ fontSize: '11px', color: '#676c79' }}>{row.usage}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <Divider />

        {/* ── 05 Colors ─────────────────────────────────────────────────── */}
        <section id="colors" style={{ marginBottom: '80px' }}>
          <SectionLabel index="05">Color Palette</SectionLabel>
          <SectionHeading>Brand colors</SectionHeading>
          <p style={{ fontSize: '14px', color: '#676c79', margin: '0 0 32px', lineHeight: 1.6 }}>
            Core colors used across all surfaces. Click any hex to copy.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
            {brand.colors.brand.slice(0, 4).map(c => <ColorSwatch key={c.hex} c={c} />)}
          </div>
          {brand.colors.brand.length > 4 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
              {brand.colors.brand.slice(4).map(c => <ColorSwatch key={c.hex} c={c} />)}
            </div>
          )}

          {brand.colors.text.length > 0 && (
            <>
              <SubLabel>Text colors</SubLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                {brand.colors.text.map(c => <ColorSwatch key={c.hex} c={c} />)}
              </div>
            </>
          )}

          {brand.colors.secondary.length > 0 && (
            <>
              <SubLabel>Secondary palette — {brand.colors.secHues.length} hues × {brand.colors.secTiers.length} tiers</SubLabel>
              <p style={{ fontSize: '12px', color: '#676c79', margin: '0 0 16px' }}>Extended palette for data viz, tags, and content categories. Click to copy hex.</p>
              <SecondaryGrid colors={brand.colors.secondary} hues={brand.colors.secHues} tiers={brand.colors.secTiers} />
            </>
          )}
        </section>

        <Divider />

        {/* ── 06 Data Viz ───────────────────────────────────────────────── */}
        <section id="dataviz" style={{ marginBottom: '80px' }}>
          <SectionLabel index="06">Data Viz</SectionLabel>
          <SectionHeading>Data visualization</SectionHeading>
          <p style={{ fontSize: '14px', color: '#676c79', margin: '0 0 32px', lineHeight: 1.6 }}>
            Palette and typography rules for charts, tables, and data displays.
          </p>

          {brand.dataViz.palette.length > 0 ? (
            <>
              <SubLabel>Chart palette</SubLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#d4e8da', marginBottom: '40px' }}>
                {brand.dataViz.palette.map(p => (
                  <div key={p.hex} style={{ background: '#fff' }}>
                    <div style={{ aspectRatio: '1', background: p.hex, border: isLight(p.hex) ? '1px solid #d4e8da' : 'none' }} />
                    <div style={{ padding: '8px' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: '#676c79', marginBottom: '2px' }}>{p.hex.toUpperCase()}</div>
                      <div style={{ fontSize: '10px', color: '#a5aab6', lineHeight: 1.4 }}>{p.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <SubLabel>Data viz typography</SubLabel>
              <div style={{ border: '1px solid #d4e8da' }}>
                {brand.dataViz.typography.map((t, i) => (
                  <div key={t.role} style={{
                    display: 'grid', gridTemplateColumns: '180px 1fr', gap: '24px',
                    padding: '14px 20px', borderBottom: i < brand.dataViz.typography.length - 1 ? '1px solid #d4e8da' : 'none',
                    background: i % 2 === 0 ? '#fff' : '#fafcfb',
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#000d05' }}>{t.role}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#676c79' }}>{t.spec}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptySection message="No data viz guidelines defined yet." />
          )}
        </section>

        <Divider />

        {/* ── 07 Slide Design ───────────────────────────────────────────── */}
        <section id="slides" style={{ marginBottom: '80px' }}>
          <SectionLabel index="07">Slides</SectionLabel>
          <SectionHeading>Presentation slide design</SectionHeading>
          <p style={{ fontSize: '14px', color: '#676c79', margin: '0 0 32px', lineHeight: 1.6 }}>
            Rules for building on-brand presentations and decks.
          </p>

          {brand.slideDesign.ruleGroups.length > 0 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: '#d4e8da', marginBottom: '40px' }}>
                {brand.slideDesign.ruleGroups.map(g => (
                  <div key={g.category} style={{ background: '#fff', padding: '28px' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#008c44', marginBottom: '16px' }}>{g.category}</div>
                    {g.rules.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '13px', color: '#000d05', lineHeight: 1.55 }}>
                        <span style={{ color: '#d4e8da', flexShrink: 0, fontFamily: "'DM Mono', monospace", fontSize: '11px' }}>{String(i + 1).padStart(2, '0')}</span>
                        {r}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {brand.slideDesign.fontFallbacks.length > 0 && (
                <>
                  <SubLabel>Font fallbacks for slide tools</SubLabel>
                  <div style={{ border: '1px solid #d4e8da' }}>
                    {brand.slideDesign.fontFallbacks.map((f, i) => (
                      <div key={f.brand} style={{
                        display: 'grid', gridTemplateColumns: '120px 160px 1fr', gap: '24px',
                        padding: '14px 20px', borderBottom: i < brand.slideDesign.fontFallbacks.length - 1 ? '1px solid #d4e8da' : 'none',
                        alignItems: 'baseline',
                      }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#000d05' }}>{f.brand}</span>
                        <Tag>{f.role}</Tag>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#676c79' }}>{f.fallback}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <EmptySection message="No slide design rules defined yet." />
          )}
        </section>

      </main>

      <footer style={{ borderTop: '1px solid #d4e8da', padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#a5aab6', letterSpacing: '0.04em' }}>BrandBuddy</span>
        <button onClick={onClear} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#a5aab6', fontFamily: "'DM Sans', sans-serif" }}>
          <Plus size={11} /> Load another brand
        </button>
      </footer>
    </div>
  )
}

// ─── Empty Section placeholder ────────────────────────────────────────────

function EmptySection({ message }: { message: string }) {
  return (
    <div style={{ border: '1px dashed #d4e8da', padding: '40px', textAlign: 'center' }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#a5aab6', letterSpacing: '0.04em' }}>{message}</div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [brand, setBrand] = useState<BrandData | null>(null)
  return brand ? <FoundationsView brand={brand} onClear={() => setBrand(null)} /> : <EmptyState onLoad={setBrand} />
}
