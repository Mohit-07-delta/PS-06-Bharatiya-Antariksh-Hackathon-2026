/**
 * StatCard — reusable metric card used across Landing, Dashboard, and Field pages.
 */
export function StatCard({ label, value, subtext, accent, icon }) {
  return (
    <div className="stat-card" style={accent ? { borderColor: accent, boxShadow: `0 0 0 1px ${accent}33` } : {}}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <p className="stat-label">{label}</p>
        {icon && <span style={{ fontSize: 20, opacity: 0.8 }}>{icon}</span>}
      </div>
      <p className="stat-value" style={accent ? { color: accent } : {}}>{value}</p>
      {subtext && <p className="stat-subtext">{subtext}</p>}
    </div>
  );
}

/**
 * Card — generic container card.
 */
export function Card({ children, style, className = '' }) {
  return (
    <div className={`card card-padded ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * SectionHeader — consistent section heading + subtitle.
 */
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * StatusBadge — LIVE / CACHED / FALLBACK indicator with a dot.
 */
export function StatusBadge({ status }) {
  const map = {
    CACHED:   { cls: 'badge-live',     label: '● CACHED', icon: '' },
    LIVE:     { cls: 'badge-live',     label: '● LIVE', icon: '' },
    FALLBACK: { cls: 'badge-fallback', label: '● FALLBACK', icon: '' },
    loaded:   { cls: 'badge-live',     label: '● Loaded' },
    missing:  { cls: 'badge-fallback', label: '● Missing' },
  };
  const s = map[status] || { cls: 'badge-cached', label: status };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

/**
 * StressBadge — Healthy / Low / Medium / High stress indicator.
 */
export function StressBadge({ level }) {
  const map = {
    Healthy: 'badge-healthy',
    Low:     'badge-low',
    Medium:  'badge-medium',
    High:    'badge-high',
    Unknown: 'badge-cached',
  };
  return <span className={`badge ${map[level] || 'badge-cached'}`}>{level}</span>;
}

/**
 * LoadingSkeleton — shimmer placeholder for async content.
 */
export function LoadingSkeleton({ height = 24, width = '100%', style }) {
  return <div className="skeleton" style={{ height, width, ...style }} />;
}

/**
 * BandPill — compact satellite band value chip.
 */
export function BandPill({ label, value, color = 'var(--text-secondary)' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)', padding: '2px 8px',
      fontSize: 'var(--text-xs)', color
    }}>
      <span style={{ opacity: 0.6 }}>{label}:</span>
      <strong>{value}</strong>
    </span>
  );
}

/**
 * PhenologyTimeline — visual stage strip for growth stage display.
 */
export function PhenologyTimeline({ currentStage }) {
  const stages = ['Sowing/Germination', 'Vegetative', 'Flowering/Peak Vigour', 'Maturity/Senescence'];
  const icons  = ['🌱', '🌿', '🌸', '🌾'];
  const idx = stages.indexOf(currentStage);

  return (
    <div>
      <div className="pheno-track">
        {stages.map((s, i) => (
          <div key={s} className={`pheno-stage ${i === idx ? 'active' : i < idx ? 'passed' : ''}`}>
            <div style={{ fontSize: 20, marginBottom: 'var(--space-1)' }}>{icons[i]}</div>
            <div style={{ fontSize: 'var(--text-xs)', lineHeight: 1.3 }}>{s.replace('/', '/\n')}</div>
          </div>
        ))}
      </div>
      {currentStage && (
        <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-teal)', marginTop: 'var(--space-4)', fontWeight: 600 }}>
          Current: {currentStage}
        </p>
      )}
    </div>
  );
}
