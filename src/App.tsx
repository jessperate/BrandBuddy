import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

// ─── Brand Data ────────────────────────────────────────────────────────────

const BRAND_COLORS = [
  { name: 'Near Black',   hex: '#000d05', variable: '--color-near-black',   usage: 'Primary text, key UI' },
  { name: 'Green 500',    hex: '#008c44', variable: '--color-green-500',    usage: 'Primary CTAs, brand' },
  { name: 'Green 600',    hex: '#002910', variable: '--color-green-600',    usage: 'Hero backgrounds' },
  { name: 'Interaction',  hex: '#00ff64', variable: '--color-interaction',  usage: 'Hover, active states' },
  { name: 'Green 200',    hex: '#CCFFE0', variable: '--color-green-200',    usage: 'Highlight tints' },
  { name: 'Stroke Green', hex: '#d4e8da', variable: '--color-stroke-green', usage: 'Borders, dividers' },
  { name: 'Accent Label', hex: '#EEFF8C', variable: '--color-accent-label', usage: 'Pill / tag fills' },
  { name: 'White',        hex: '#ffffff', variable: '--background',         usage: 'Page backgrounds' },
]

const TEXT_COLORS = [
  { name: 'Text Primary',   hex: '#000d05', variable: '--color-text-primary',   usage: 'Body copy' },
  { name: 'Text Secondary', hex: '#676c79', variable: '--color-text-secondary', usage: 'Captions, meta' },
  { name: 'Text Tertiary',  hex: '#a5aab6', variable: '--color-text-tertiary',  usage: 'Disabled, placeholder' },
]

const SECONDARY_PALETTE: { hex: string; hue: string; tier: string }[] = [
  { hex: '#EEF5F1', hue: 'Green',   tier: '50' },
  { hex: '#F5F5E8', hue: 'Olive',   tier: '50' },
  { hex: '#E8EEF5', hue: 'Teal',    tier: '50' },
  { hex: '#E8E8F8', hue: 'Navy',    tier: '50' },
  { hex: '#EEE8F8', hue: 'Purple',  tier: '50' },
  { hex: '#F8E8F0', hue: 'Magenta', tier: '50' },
  { hex: '#F8EEE8', hue: 'Brown',   tier: '50' },
  { hex: '#D4E8DA', hue: 'Green',   tier: '100' },
  { hex: '#F4FFB8', hue: 'Olive',   tier: '100' },
  { hex: '#B8D8F0', hue: 'Teal',    tier: '100' },
  { hex: '#C8C8FF', hue: 'Navy',    tier: '100' },
  { hex: '#D8C8F0', hue: 'Purple',  tier: '100' },
  { hex: '#F0C8D8', hue: 'Magenta', tier: '100' },
  { hex: '#F0D0C8', hue: 'Brown',   tier: '100' },
  { hex: '#2D8859', hue: 'Green',   tier: '500' },
  { hex: '#88882D', hue: 'Olive',   tier: '500' },
  { hex: '#2D6B7A', hue: 'Teal',    tier: '500' },
  { hex: '#0000CC', hue: 'Navy',    tier: '500' },
  { hex: '#6B3D8B', hue: 'Purple',  tier: '500' },
  { hex: '#83428B', hue: 'Magenta', tier: '500' },
  { hex: '#8B4D42', hue: 'Brown',   tier: '500' },
  { hex: '#002910', hue: 'Green',   tier: '900' },
  { hex: '#2E2800', hue: 'Olive',   tier: '900' },
  { hex: '#00212B', hue: 'Teal',    tier: '900' },
  { hex: '#00006B', hue: 'Navy',    tier: '900' },
  { hex: '#280040', hue: 'Purple',  tier: '900' },
  { hex: '#3B0020', hue: 'Magenta', tier: '900' },
  { hex: '#2B1200', hue: 'Brown',   tier: '900' },
]

const SEC_HUES = ['Green', 'Olive', 'Teal', 'Navy', 'Purple', 'Magenta', 'Brown']
const SEC_TIERS = ['50', '100', '500', '900']

const TYPE_SCALE = [
  { name: 'Display',       family: 'Georgia, serif',        size: '56px', weight: 400, tracking: '-0.02em', lh: 1.1, usage: 'Hero headlines' },
  { name: 'H3',            family: 'Georgia, serif',        size: '32px', weight: 400, tracking: '-0.02em', lh: 1.2, usage: 'Section headings' },
  { name: 'H4 / UI Title', family: "'DM Sans', sans-serif", size: '20px', weight: 600, tracking: '-0.01em', lh: 1.3, usage: 'UI titles, labels' },
  { name: 'Body',          family: "'DM Sans', sans-serif", size: '16px', weight: 400, tracking: '0',       lh: 1.6, usage: 'Running text' },
  { name: 'Caption',       family: "'DM Sans', sans-serif", size: '14px', weight: 400, tracking: '0',       lh: 1.5, usage: 'Metadata, captions' },
  { name: 'Label / Pill',  family: "'DM Mono', monospace",  size: '11px', weight: 500, tracking: '0.08em',  lh: 1,   usage: 'Tags, axis values' },
]

const FONTS = [
  {
    name: 'DM Sans',
    role: 'Sans-serif — UI & Body',
    variable: '--font-sans',
    specimen: 'The quick brown fox jumps over the lazy dog.',
    family: "'DM Sans', sans-serif",
    weights: [300, 400, 500, 600, 700],
    note: 'Used for all UI copy, body text, buttons, and labels. Production equivalent: Saans.',
  },
  {
    name: 'Georgia',
    role: 'Serif — Display & Headings',
    variable: '--font-serif',
    specimen: 'The quick brown fox jumps over the lazy dog.',
    family: 'Georgia, serif',
    weights: [400, 700],
    note: 'Reserved for large display headings and editorial moments. Production equivalent: Serrif VF.',
  },
  {
    name: 'DM Mono',
    role: 'Monospace — Labels & Tags',
    variable: '--font-mono',
    specimen: 'const brand = "AirOps";',
    family: "'DM Mono', monospace",
    weights: [400, 500],
    note: 'Used for pills, tags, data labels, and code snippets. Production equivalent: Saans Mono.',
  },
]

// ─── Utilities ────────────────────────────────────────────────────────────

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

// ─── Components ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={copy}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '2px', display: 'flex', alignItems: 'center',
        color: 'var(--color-text-tertiary)',
      }}
    >
      {copied ? <Check size={12} color="#008c44" /> : <Copy size={12} />}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "'DM Mono', monospace", fontSize: '11px', fontWeight: 500,
      letterSpacing: '0.08em', color: 'var(--color-text-secondary)',
      textTransform: 'uppercase', marginBottom: '16px',
    }}>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ borderTop: '1px solid var(--border)', margin: '64px 0' }} />
}

function ColorSwatch({ hex, name, variable, usage }: {
  hex: string; name: string; variable?: string; usage?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{
        width: '100%', aspectRatio: '1', background: hex,
        border: hex === '#ffffff' || hex === '#F8FFFA' ? '1px solid var(--border)' : 'none',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {name}
          </span>
          <CopyButton text={hex} />
        </div>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--color-text-secondary)',
          letterSpacing: '0.04em',
        }}>
          {hex.toUpperCase()}
        </span>
        {variable && (
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--color-text-tertiary)',
            letterSpacing: '0.02em',
          }}>
            {variable}
          </span>
        )}
        {usage && (
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            {usage}
          </span>
        )}
      </div>
    </div>
  )
}

function SecondarySwatchGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border)' }}>
      {SEC_HUES.map(hue => (
        <div key={hue} style={{
          fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--color-text-tertiary)',
          textAlign: 'center', padding: '8px 0', background: 'var(--background)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {hue}
        </div>
      ))}
      {SEC_TIERS.map(tier =>
        SEC_HUES.map(hue => {
          const swatch = SECONDARY_PALETTE.find(s => s.hue === hue && s.tier === tier)
          if (!swatch) return <div key={hue + tier} />
          return (
            <div
              key={hue + tier}
              title={swatch.hex}
              onClick={() => navigator.clipboard.writeText(swatch.hex)}
              style={{ aspectRatio: '1', background: swatch.hex, position: 'relative', cursor: 'pointer' }}
            >
              <span style={{
                position: 'absolute', bottom: '4px', left: '4px',
                fontFamily: "'DM Mono', monospace", fontSize: '9px',
                color: isLight(swatch.hex) ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.5)',
                letterSpacing: '0.02em',
              }}>
                {tier}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}

function TypeScaleRow({ name, family, size, weight, tracking, lh, usage }: typeof TYPE_SCALE[0]) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '140px 1fr 200px', gap: '24px',
      alignItems: 'baseline', padding: '20px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {name}
        </span>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--color-text-tertiary)',
          letterSpacing: '0.04em',
        }}>
          {size} / {weight}
        </span>
      </div>
      <div style={{
        fontFamily: family, fontSize: size, fontWeight: weight,
        letterSpacing: tracking, lineHeight: lh, color: 'var(--color-text-primary)',
        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
      }}>
        The quick brown fox
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
        {usage}
      </div>
    </div>
  )
}

function FontCard({ name, role, specimen, family, weights, note }: typeof FONTS[0]) {
  return (
    <div style={{ border: '1px solid var(--border)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{name}</div>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--color-text-secondary)',
          letterSpacing: '0.04em',
        }}>
          {role}
        </div>
      </div>
      <div style={{
        fontFamily: family, fontSize: '28px', fontWeight: 400,
        lineHeight: 1.2, color: 'var(--color-text-primary)',
      }}>
        {specimen}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {weights.map(w => (
          <div key={w} style={{
            fontFamily: family, fontSize: '13px', fontWeight: w,
            color: 'var(--color-text-primary)', padding: '4px 12px',
            border: '1px solid var(--border)', background: 'var(--secondary)',
          }}>
            {w}
          </div>
        ))}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        {note}
      </div>
    </div>
  )
}

const NAV_SECTIONS = ['Colors', 'Typography', 'Fonts']

// ─── App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState('Colors')

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(id)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)', background: 'var(--background)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '56px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '24px', height: '24px', background: '#008c44',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: '10px', height: '10px', background: '#00ff64' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            BrandBuddy
          </span>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--color-text-tertiary)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Visual Foundations
          </span>
        </div>
        <nav style={{ display: 'flex', gap: '4px' }}>
          {NAV_SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              style={{
                padding: '6px 14px', fontSize: '13px',
                fontWeight: activeSection === s ? 600 : 400,
                color: activeSection === s ? '#008c44' : 'var(--color-text-secondary)',
                background: activeSection === s ? '#f8fffb' : 'none',
                border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {s}
            </button>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <div style={{ padding: '80px 48px 64px', borderBottom: '1px solid var(--border)', background: '#002910' }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#CCFFE0',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px',
        }}>
          AirOps — Brand System
        </div>
        <h1 style={{
          fontFamily: 'Georgia, serif', fontSize: '56px', fontWeight: 400,
          letterSpacing: '-0.02em', lineHeight: 1.05, margin: '0 0 20px',
          color: '#ffffff', maxWidth: '640px',
        }}>
          Visual Foundations
        </h1>
        <p style={{ fontSize: '16px', color: '#dfeae3', lineHeight: 1.6, margin: 0, maxWidth: '480px' }}>
          Color palettes, typography scales, and font families that define the AirOps brand.
        </p>
      </div>

      {/* Content */}
      <main style={{ padding: '64px 48px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Colors */}
        <section id="Colors" style={{ marginBottom: '64px' }}>
          <SectionLabel>01 — Colors</SectionLabel>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 400,
            letterSpacing: '-0.02em', margin: '0 0 8px', color: 'var(--color-text-primary)',
          }}>
            Brand Palette
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 32px' }}>
            Core colors across all AirOps surfaces. Click any hex to copy.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
            {BRAND_COLORS.slice(0, 4).map(c => <ColorSwatch key={c.hex} {...c} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {BRAND_COLORS.slice(4).map(c => <ColorSwatch key={c.hex} {...c} />)}
          </div>

          <Divider />
          <SectionLabel>Text Colors</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {TEXT_COLORS.map(c => <ColorSwatch key={c.hex} {...c} />)}
          </div>

          <Divider />
          <SectionLabel>Secondary Palette — 7 Hues × 4 Tiers</SectionLabel>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 24px' }}>
            Extended palette for data visualization, tags, and content categories. Click a swatch to copy.
          </p>
          <SecondarySwatchGrid />
        </section>

        <Divider />

        {/* Typography */}
        <section id="Typography" style={{ marginBottom: '64px' }}>
          <SectionLabel>02 — Typography</SectionLabel>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 400,
            letterSpacing: '-0.02em', margin: '0 0 8px', color: 'var(--color-text-primary)',
          }}>
            Type Scale
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 32px' }}>
            Six levels from Display down to Label, covering every use case in the system.
          </p>
          <div style={{ borderTop: '1px solid var(--border)' }}>
            {TYPE_SCALE.map(row => <TypeScaleRow key={row.name} {...row} />)}
          </div>
        </section>

        <Divider />

        {/* Fonts */}
        <section id="Fonts">
          <SectionLabel>03 — Fonts</SectionLabel>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 400,
            letterSpacing: '-0.02em', margin: '0 0 8px', color: 'var(--color-text-primary)',
          }}>
            Font Families
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 32px' }}>
            Three families — sans, serif, and mono — each with a defined role.
            Production uses Saans, Serrif VF, and Saans Mono (licensed); this build uses Google Fonts equivalents.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {FONTS.map(f => <FontCard key={f.name} {...f} />)}
          </div>
        </section>

      </main>

      <footer style={{
        borderTop: '1px solid var(--border)', padding: '24px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: '11px',
          color: 'var(--color-text-tertiary)', letterSpacing: '0.04em',
        }}>
          BrandBuddy — Visual Foundations
        </span>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: '11px',
          color: 'var(--color-text-tertiary)', letterSpacing: '0.04em',
        }}>
          AirOps Brand System
        </span>
      </footer>
    </div>
  )
}
