import React, { useEffect, useRef } from 'react'

// ─── SEBI Risk Level Config ────────────────────────────────────────────────
// 6 levels mapped to arc segments (0–180°), each 30° wide
const RISK_LEVELS = [
  { label: 'Low', color: '#22c55e', textColor: '#15803d' }, // 0–30°
  { label: 'Low to\nModerate', color: '#84cc16', textColor: '#4d7c0f' }, // 30–60°
  { label: 'Moderate', color: '#facc15', textColor: '#a16207' }, // 60–90°
  { label: 'Moderately\nHigh', color: '#fb923c', textColor: '#c2410c' }, // 90–120°
  { label: 'High', color: '#ef4444', textColor: '#b91c1c' }, // 120–150°
  { label: 'Very High', color: '#9b1fe8', textColor: '#7e22ce' }, // 150–180°
]

// Map any categoryName string → level index (0–5)
const mapCategoryToIndex = categoryName => {
  const name = (categoryName || '').toLowerCase()
  if (name.includes('very high')) return 5
  if (name.includes('moderately high') || name.includes('moderatly high')) return 3
  if (name.includes('high')) return 4
  if (name.includes('low to moderate') || name.includes('low-to-moderate') || name.includes('balanced')) return 1
  if (name.includes('moderate')) return 2
  if (name.includes('low')) return 0
  // fallback: try to estimate from stdDev below
  return -1
}

const mapStdDevToIndex = stdDev => {
  if (stdDev == null) return 2
  if (stdDev < 5) return 0
  if (stdDev < 12) return 1
  if (stdDev < 20) return 2
  if (stdDev < 28) return 3
  if (stdDev < 36) return 4
  return 5
}

// ─── Gauge math helpers ────────────────────────────────────────────────────
// Semicircle: left = 180°, right = 0°  (SVG angles: 0 = right, CCW = positive)
// We draw from 180° → 0° (left to right = low to very high)
const polarToXY = (cx, cy, r, angleDeg) => {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  }
}

// Build an SVG arc path for a segment from startAngle to endAngle (in degrees, 180→0 range)
const arcPath = (cx, cy, rOuter, rInner, startAngle, endAngle) => {
  const s1 = polarToXY(cx, cy, rOuter, startAngle)
  const e1 = polarToXY(cx, cy, rOuter, endAngle)
  const s2 = polarToXY(cx, cy, rInner, endAngle)
  const e2 = polarToXY(cx, cy, rInner, startAngle)
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 1 ${e2.x} ${e2.y}`,
    'Z',
  ].join(' ')
}

// ─── Component ────────────────────────────────────────────────────────────
const Riskometer = ({ categoryName, stdDev }) => {
  const needleRef = useRef(null)
  const prevAngleRef = useRef(null)

  // Resolve risk level index
  let levelIndex = mapCategoryToIndex(categoryName)
  if (levelIndex === -1) levelIndex = mapStdDevToIndex(stdDev)
  const level = RISK_LEVELS[levelIndex] ?? RISK_LEVELS[2]

  // Needle angle: each segment is 30° wide in 180→0 range
  // Center of each segment: 180 - (index * 30 + 15)
  const targetAngle = 180 - (levelIndex * 30 + 15)

  // Animate needle on mount / change
  useEffect(() => {
    const el = needleRef.current
    if (!el) return
    const from = prevAngleRef.current ?? targetAngle
    prevAngleRef.current = targetAngle

    let start = null
    const duration = 900 // ms
    const ease = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

    const animate = ts => {
      if (!start) start = ts
      const t = Math.min((ts - start) / duration, 1)
      const angle = from + (targetAngle - from) * ease(t)
      el.setAttribute('transform', `rotate(${-angle} 100 100)`)
      if (t < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [targetAngle])

  // ─── SVG constants ───────────────────────────────────────────────────────
  const CX = 100,
    CY = 100
  const R_OUTER = 85,
    R_INNER = 55

  // The full semicircle arc path (180° → 0°, i.e. left → right = low → high)
  const fullArc = arcPath(CX, CY, R_OUTER, R_INNER, 0, 180)

  return (
    <div className="riskometer-wrapper">
      {/* Title */}
      <p className="riskometer-title">Riskometer</p>

      {/* SVG Gauge */}
      <svg viewBox="0 0 201 110" className="riskometer-svg" aria-label="Risk meter">
        <defs>
          {/* Gradient: green (left/low) → yellow (center/moderate) → red (right/high) */}
          <linearGradient id="risk-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#FF0000" />
          </linearGradient>

          {/* Clip the gradient rect to the arc shape */}
          <clipPath id="arc-clip">
            <path d={fullArc} />
          </clipPath>

          {/* Drop shadow for needle */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#00000055" />
          </filter>
        </defs>

        {/* ── Single gradient arc: rect filled with gradient, clipped to arc shape ── */}
        <rect
          x={CX - R_OUTER - 2}
          y={CY - R_OUTER - 2}
          width={(R_OUTER + 2) * 2}
          height={(R_OUTER + 2) * 2}
          fill="url(#risk-gradient)"
          clipPath="url(#arc-clip)"
        />

        {/* ── Needle ── */}
        <g ref={needleRef} transform={`rotate(${-targetAngle} ${CX} ${CY})`}>
          <polygon
            points={`${CX},${CY - 3} ${CX + R_OUTER - 4},${CY} ${CX},${CY + 3}`}
            fill="#1e293b"
            filter="url(#shadow)"
          />
        </g>

        {/* ── Needle pivot ── */}
        <circle cx={CX} cy={CY} r={7} fill="#fff" stroke="#1e293b" strokeWidth="2" />
        <circle cx={CX} cy={CY} r={3} fill="#1e293b" />
      </svg>

      {/* ── Risk Level Label ── */}
      <div className="riskometer-badge" style={{ borderColor: level.color, color: level.color }}>
        <span className="riskometer-dot" style={{ background: level.color }} />
        {level.label.replace('\n', ' ')}
      </div>

      {/* ── Std Dev display ── */}
      {stdDev != null && (
        <div className="riskometer-stddev">
          <span className="riskometer-stddev-label">Std Dev</span>
          <span className="riskometer-stddev-value" style={{ color: level.color }}>
            {stdDev.toFixed(2)}
          </span>
          <span className="riskometer-stddev-unit">%</span>
        </div>
      )}
    </div>
  )
}

export default Riskometer
