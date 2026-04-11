import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import moment from 'moment'

// ─── Color scale (GitHub palette with red extension) ───────────────────────
const getProfitColor = value => {
  if (value === null || value === undefined) return '#E8E8E8'
  if (value === 0) return '#d1fae5'
  if (value > 0) {
    if (value < 500) return '#86efac'
    if (value < 2000) return '#4ade80'
    if (value < 8000) return '#22c55e'
    return '#15803d'
  } else {
    if (value > -500) return '#fca5a5'
    if (value > -2000) return '#f87171'
    if (value > -8000) return '#ef4444'
    return '#b91c1c'
  }
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const CELL = 20 // px — square cell size
const GAP = 3 // px — gap between cells

// ─── Build week → {Mon…Fri} map ────────────────────────────────────────────
const buildGrid = (trades, weeksBack = 16) => {
  const byDate = {}
  trades?.forEach(t => {
    byDate[t.trade_date] = t
  })

  const today = moment()
  const startMonday = moment().subtract(weeksBack, 'weeks').startOf('isoWeek')
  const weeks = [] // ordered array of { label, monthLabel, cells: {Mon…} }
  const weekMap = {}

  let cur = startMonday.clone()
  while (cur.isSameOrBefore(today, 'day')) {
    const dow = cur.isoWeekday()
    if (dow >= 1 && dow <= 5) {
      const weekKey = cur.clone().startOf('isoWeek').format('YYYY-MM-DD')
      const weekLabel = cur.clone().startOf('isoWeek').format('MMM D')

      if (!weekMap[weekKey]) {
        const monthLabel = cur.clone().startOf('isoWeek').format('MMM')
        weekMap[weekKey] = { key: weekKey, label: weekLabel, monthLabel, cells: {} }
        weeks.push(weekMap[weekKey])
      }

      const dayName = DAYS[dow - 1]
      const dateStr = cur.format('YYYY-MM-DD')
      const t = byDate[dateStr]
      const isFuture = cur.isAfter(today, 'day')

      weekMap[weekKey].cells[dayName] = {
        profit: isFuture ? null : (t?.total_profit ?? null),
        trades: t?.total_trades ?? 0,
        winTrades: t?.win_trades ?? 0,
        lossTrades: t?.loss_trades ?? 0,
        date: dateStr,
        hasData: !!t && !isFuture,
        isFuture,
      }
    }
    cur.add(1, 'day')
  }
  return weeks
}

// ─── Portal tooltip (escapes overflow clipping) ────────────────────────────
const PortalTooltip = ({ cell, anchorRect }) => {
  if (!cell || !anchorRect) return null
  const dateLabel = moment(cell.date).format('ddd, DD MMM YYYY')
  const pnlColor = cell.profit >= 0 ? '#15803d' : '#b91c1c'
  const pnlStr =
    cell.profit === null
      ? '—'
      : cell.profit >= 0
        ? `+₹${cell.profit.toLocaleString('en-IN')}`
        : `-₹${Math.abs(cell.profit).toLocaleString('en-IN')}`

  // Position above the cell, centered
  const left = anchorRect.left + anchorRect.width / 2 + window.scrollX
  const top = anchorRect.top + window.scrollY - 8

  return createPortal(
    <div
      className="pointer-events-none"
      style={{
        position: 'absolute',
        left,
        top,
        transform: 'translate(-50%, -100%)',
        zIndex: 9999,
        minWidth: '160px',
      }}
    >
      <div className="bg-slate-800 text-white rounded-lg px-3 py-2 text-[10px] shadow-xl whitespace-nowrap">
        <p className="font-semibold mb-0.5 text-[11px]">{dateLabel}</p>
        {cell.hasData ? (
          <>
            <p style={{ color: pnlColor }} className="font-bold">
              {pnlStr}
            </p>
            <p className="text-slate-300 mt-0.5">
              {cell.trades} trade{cell.trades !== 1 ? 's' : ''} · ✓{cell.winTrades} ✗{cell.lossTrades}
            </p>
          </>
        ) : (
          <p className="text-slate-400">{cell.isFuture ? 'Future date' : 'No trades'}</p>
        )}
        {/* Arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-slate-800" />
      </div>
    </div>,
    document.body
  )
}

// ─── Single heatmap cell ───────────────────────────────────────────────────
const Cell = ({ cell }) => {
  const [anchorRect, setAnchorRect] = useState(null)
  const cellRef = useRef(null)
  const color = getProfitColor(cell?.profit)

  const handleMouseEnter = () => {
    if (cellRef.current) setAnchorRect(cellRef.current.getBoundingClientRect())
  }
  const handleMouseLeave = () => setAnchorRect(null)

  return (
    <div style={{ width: CELL, height: CELL, position: 'relative' }}>
      <div
        ref={cellRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: CELL,
          height: CELL,
          background: color,
          borderRadius: 3,
          transition: 'transform 0.1s, box-shadow 0.1s',
          transform: anchorRect ? 'scale(1.35)' : 'scale(1)',
          boxShadow: anchorRect ? `0 0 0 2px ${color}55` : 'none',
          cursor: cell?.hasData ? 'pointer' : 'default',
        }}
      />
      <PortalTooltip cell={cell} anchorRect={anchorRect} />
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
const ConsistencyHeatmap = ({ data }) => {
  const raw = Array.isArray(data) ? data : (data?.heatmap ?? [])
  const weeks = buildGrid(raw, 52)

  const allCells = weeks.flatMap(w => Object.values(w.cells))
  const tradeDays = allCells.filter(c => c.hasData)
  const profits = tradeDays.map(c => c.profit)
  const totalPnl = profits.reduce((s, v) => s + v, 0)
  const minP = profits.length ? Math.min(...profits) : 0
  const maxP = profits.length ? Math.max(...profits) : 0

  // Month label deduplication — show label only when month changes between weeks
  const monthLabels = weeks.map((w, i) => (i === 0 || weeks[i - 1].monthLabel !== w.monthLabel ? w.monthLabel : ''))

  const stats = [
    { label: 'Trading Days', value: tradeDays.length, color: '#8b5cf6' },
    {
      label: 'Total P&L',
      value:
        totalPnl >= 0 ? `+₹${totalPnl.toLocaleString('en-IN')}` : `-₹${Math.abs(totalPnl).toLocaleString('en-IN')}`,
      color: totalPnl >= 0 ? '#10b981' : '#f43f5e',
    },
    ...(profits.length
      ? [
          { label: 'Best Day', value: `+₹${maxP.toLocaleString('en-IN')}`, color: '#15803d' },
          { label: 'Worst Day', value: `₹${minP.toLocaleString('en-IN')}`, color: '#b91c1c' },
        ]
      : []),
  ]

  return (
    <div className="glass-card rounded-2xl p-4">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-700">Trading Consistency</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Daily P&amp;L heatmap · Mon–Fri · last 16 weeks</p>
        </div>

        {/* ── Stats row ── */}
        <div className="flex flex-wrap gap-5 mb-4 bg-purple-100 p-3 rounded-lg">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide">{s.label}</span>
              <span className="text-sm font-bold" style={{ color: s.color }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Color legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span>Loss</span>
          {['#b91c1c', '#ef4444', '#f87171', '#fca5a5', '#ebedf0', '#86efac', '#4ade80', '#22c55e', '#15803d'].map(
            (c, i) => (
              <span
                key={i}
                style={{ background: c, width: 12, height: 12, borderRadius: 3, display: 'inline-block' }}
              />
            )
          )}
          <span>Profit</span>
        </div>
      </div>

      {tradeDays.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div className="flex gap-[3px]">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {Array.from({ length: 5 }, (_, j) => (
                  <div key={j} style={{ width: CELL, height: CELL, borderRadius: 3, background: '#ebedf0' }} />
                ))}
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-xs italic mt-1">No trade activity yet</p>
        </div>
      ) : (
        /* ── Heatmap grid ── */
        <div
          className="overflow-x-auto w-[90%] mx-auto"
          ref={el => {
            if (el) el.scrollLeft = el.scrollWidth
          }}
        >
          <div style={{ display: 'inline-flex', gap: 0 }}>
            {/* Day labels column */}
            <div className="flex flex-col  justify-between mr-2 mt-[18px]" style={{ gap: GAP }}>
              {DAYS.map((d, i) => (
                <div
                  key={d}
                  style={{ height: CELL, lineHeight: `${CELL}px`, fontSize: 9, color: '#94a3b8', whiteSpace: 'nowrap' }}
                >
                  {i % 2 === 0 ? d : ''}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div className="flex  flex-col">
              {/* Month labels row */}
              <div className="flex mb-1" style={{ gap: GAP }}>
                {weeks.map((w, i) => (
                  <div
                    key={w.key}
                    style={{
                      width: CELL,
                      fontSize: 9,
                      color: '#94a3b8',
                      overflow: 'visible',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {monthLabels[i]}
                  </div>
                ))}
              </div>

              {/* Cell grid — columns = weeks, rows = days */}
              <div className="flex" style={{ gap: GAP }}>
                {weeks.map(w => (
                  <div key={w.key} className="flex flex-col h-30" style={{ gap: GAP }}>
                    {DAYS.map(day => (
                      <Cell key={day} cell={w.cells[day] ?? null} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsistencyHeatmap
