import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Style Guide',
  description: 'Growdient v2 Design System — tokens, typography, colors, components',
  robots: { index: false, follow: false },
}

export default function StyleGuidePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className="label-small text-light-48">Growdient v2</p>
        <h1 className="heading">Design System</h1>
        <p className="text-h5 text-light-64">
          Phase 1 — Design tokens, typography, grid, motion
        </p>
      </header>

      {/* ═══ TYPOGRAPHY ═══════════════════════════════════════════════════ */}
      <Section title="Typography">
        <div className={styles.typeStack}>
          <TypeRow label="text-h0 / marquee" className="text-h0">
            Growdient
          </TypeRow>
          <TypeRow label="heading / H1 homepage" className="heading">
            Hello Studio.
          </TypeRow>
          <TypeRow label="text-h1 / inner pages" className="text-h1">
            Selected Works
          </TypeRow>
          <TypeRow label="text-h5 / statements" className="text-h5">
            We build where human instinct meets machine intelligence.
          </TypeRow>
          <TypeRow label="text-block-2 / body" className="text-block-2">
            Growdient is a design studio turning brand identity design and web
            development into value. We partner with forward-thinking brands to
            create experiences that matter.
          </TypeRow>
          <TypeRow label="label-small / uppercase labels" className="label-small text-light-64">
            Brand Identity · UI/UX Design · Web Development
          </TypeRow>
          <TypeRow label="text-small / locations, metadata" className="text-small text-light-48">
            Lisbon · Kyiv · Operating worldwide
          </TypeRow>
          <TypeRow label="text-editorial / Instrument Serif italic" className="text-editorial text-h1">
            Design as language
          </TypeRow>
        </div>
      </Section>

      {/* ═══ COLORS ════════════════════════════════════════════════════════ */}
      <Section title="Color System">
        <div className={styles.colorGrid}>
          <ColorSwatch name="--color-bg" value="#0C0C0C" />
          <ColorSwatch name="--color-surface" value="#141414" />
          <ColorSwatch name="--color-surface-2" value="#1C1C1C" />
          <ColorSwatch name="--color-white" value="#FAFAFA" light />
          <ColorSwatch name="--color-cream" value="#F4F1EC" light />
        </div>
        <div className={styles.colorGrid} style={{ marginTop: '2rem' }}>
          <OpacitySwatch name="text-100" style={{ color: 'var(--color-text-100)' }} />
          <OpacitySwatch name="text-64" style={{ color: 'var(--color-text-64)' }} />
          <OpacitySwatch name="text-48" style={{ color: 'var(--color-text-48)' }} />
          <OpacitySwatch name="text-32" style={{ color: 'var(--color-text-32)' }} />
        </div>
      </Section>

      {/* ═══ SPACING ═══════════════════════════════════════════════════════ */}
      <Section title="Spacing Scale">
        <div className={styles.spacingList}>
          {[1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40].map((n) => (
            <SpacingRow key={n} name={`--space-${n}`} />
          ))}
        </div>
      </Section>

      {/* ═══ MOTION ════════════════════════════════════════════════════════ */}
      <Section title="Motion Tokens">
        <div className={styles.motionGrid}>
          <MotionCard
            name="expo-out"
            curve="cubic-bezier(0.16, 1, 0.3, 1)"
            desc="Entrances, reveals"
          />
          <MotionCard
            name="quart-out"
            curve="cubic-bezier(0.25, 1, 0.5, 1)"
            desc="Hovers, interactions"
          />
          <MotionCard
            name="inout-circ"
            curve="cubic-bezier(0.85, 0, 0.15, 1)"
            desc="Page transitions"
          />
          <MotionCard
            name="spring"
            curve="cubic-bezier(0.34, 1.56, 0.64, 1)"
            desc="Playful micro"
          />
        </div>
        <div className={styles.durationList}>
          {['micro: 100ms', 'fast: 250ms', 'normal: 400ms', 'medium: 600ms', 'slow: 800ms', 'slower: 1200ms', 'dramatic: 1800ms'].map((d) => (
            <span key={d} className={`label-small text-light-48 ${styles.durationItem}`}>{d}</span>
          ))}
        </div>
      </Section>

      {/* ═══ WEBFLOW CLASSES ════════════════════════════════════════════════ */}
      <Section title="Webflow Class Map">
        <table className={styles.classTable}>
          <thead>
            <tr>
              <th className="label-small text-light-48">Webflow class</th>
              <th className="label-small text-light-48">Token used</th>
              <th className="label-small text-light-48">Usage</th>
            </tr>
          </thead>
          <tbody className="text-small text-light-64">
            <tr><td>.text-h0</td><td>--text-h0</td><td>Marquee, About hero</td></tr>
            <tr><td>.heading</td><td>--text-heading</td><td>Homepage H1</td></tr>
            <tr><td>.text-h1</td><td>--text-h1</td><td>Inner page titles</td></tr>
            <tr><td>.text-h5</td><td>--text-h5</td><td>Statements, descriptions</td></tr>
            <tr><td>.text-small</td><td>--text-small</td><td>Metadata, locations</td></tr>
            <tr><td>.label-small</td><td>--text-label</td><td>Section labels, filters</td></tr>
            <tr><td>.text-light-48</td><td>--color-text-48</td><td>Subdued text on dark</td></tr>
            <tr><td>.text-light-64</td><td>--color-text-64</td><td>Secondary text on dark</td></tr>
            <tr><td>.text-dark</td><td>--color-dark-100</td><td>Text on cream sections</td></tr>
            <tr><td>.text-dark-48</td><td>--color-dark-48</td><td>Subdued on cream</td></tr>
            <tr><td>.no-margins</td><td>margin: 0</td><td>H2 statement overrides</td></tr>
            <tr><td>.text-track-about</td><td>--text-h5, 72ch</td><td>About track phrases</td></tr>
            <tr><td>.blog-hero-title</td><td>--text-h1 uppercase</td><td>Blog page H1</td></tr>
            <tr><td>.blog-hero-subtitle</td><td>--text-h5, text-64</td><td>Blog subtitle</td></tr>
            <tr><td>.marquee-text-large</td><td>--text-h0, nowrap</td><td>Marquee ticker</td></tr>
          </tbody>
        </table>
      </Section>

      {/* ═══ FONTS ══════════════════════════════════════════════════════════ */}
      <Section title="Font Stack">
        <div className={styles.fontStack}>
          <FontItem family="42DotSans" var="--font-display" weights={['300', '400', '500', '700', '800']} />
          <FontItem family="Instrument Serif" var="--font-editorial" weights={['400', '400i']} />
          <FontItem family="Inter" var="--font-body" weights={['400', '500']} />
          <FontItem family="Geist Mono" var="--font-mono" weights={['100–900']} />
        </div>
      </Section>

      <footer className={styles.footer}>
        <p className="label-small text-light-32">
          Growdient v2 — Phase 1 Design System · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </footer>
    </main>
  )
}

/* ─── Sub-components ────────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 'var(--space-32)' }}>
      <div style={{ marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
        <span className="label-small text-light-48">{title}</span>
      </div>
      {children}
    </section>
  )
}

function TypeRow({ label, className, children }: { label: string; className: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--space-8)' }}>
      <p className="label-small text-light-32" style={{ marginBottom: 'var(--space-2)' }}>{label}</p>
      <div className={className}>{children}</div>
    </div>
  )
}

function ColorSwatch({ name, value }: { name: string; value: string; light?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{
        width: '100%',
        aspectRatio: '1',
        background: value,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
      }} />
      <p className="label-small text-light-48">{name}</p>
      <p className="text-small text-light-32">{value}</p>
    </div>
  )
}

function OpacitySwatch({ name, style }: { name: string; style: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <p className="text-h5" style={style}>Aa</p>
      <p className="label-small text-light-32">{name}</p>
    </div>
  )
}

function SpacingRow({ name }: { name: string }) {
  const match = name.match(/--space-(\d+)/)
  const n = match ? parseInt(match[1]) : 4
  const px = n * 4
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>
      <div style={{ width: `${Math.min(px, 192)}px`, height: '4px', background: 'var(--color-text-48)', borderRadius: '2px', flexShrink: 0 }} />
      <span className="label-small text-light-48">{name} = {px}px / {n * 0.25}rem</span>
    </div>
  )
}

function MotionCard({ name, curve, desc }: { name: string; curve: string; desc: string }) {
  return (
    <div style={{ padding: 'var(--space-6)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
      <p className="label-small text-light-48" style={{ marginBottom: 'var(--space-2)' }}>{name}</p>
      <p className="text-small" style={{ marginBottom: 'var(--space-3)', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-48)' }}>{curve}</p>
      <p className="text-small text-light-64">{desc}</p>
    </div>
  )
}

function FontItem({ family, var: cssVar, weights }: { family: string; var: string; weights: string[] }) {
  return (
    <div style={{ padding: 'var(--space-6) 0', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-8)' }}>
        <p style={{ fontFamily: cssVar, fontSize: 'var(--text-h5)' }}>{family}</p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {weights.map((w) => (
            <span key={w} className="label-small text-light-32">{w}</span>
          ))}
        </div>
      </div>
      <p className="label-small text-light-32" style={{ marginTop: 'var(--space-2)' }}>{cssVar}</p>
    </div>
  )
}
