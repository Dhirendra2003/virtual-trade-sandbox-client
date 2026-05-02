import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { BarChart2, TrendingUp, DollarSign } from 'lucide-react'

/* ─── Column definitions ─── */

const rankCol = {
  id: 'rank',
  header: '#',
  cell: ({ row }) => <span className="text-xs font-bold text-slate-400 w-5 inline-block">{row.index + 1}</span>,
}

const mostTradedCols = [
  rankCol,
  {
    accessorKey: 'name',
    header: 'Stock',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-xs font-semibold text-sub-title-text-color leading-tight truncate lg:max-w-[140px] md:max-w-[100px]">
          {row.original.name}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'trade_count',
    header: 'Trades',
    cell: ({ getValue }) => (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold primary-gradient text-white">{getValue()}x</span>
    ),
  },
]

const profitCols = [
  rankCol,
  {
    accessorKey: 'name',
    header: 'Stock',
    cell: ({ row }) => (
      <p className="text-xs font-semibold text-sub-title-text-color truncate lg:max-w-[140px] md:max-w-[100px]">
        {row.original.name}
      </p>
    ),
  },
  {
    accessorKey: 'profit',
    header: '₹ P&L',
    cell: ({ getValue }) => {
      const v = getValue()
      return (
        <span className={`text-xs font-bold ${v >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {v >= 0 ? '+' : ''}₹{Math.abs(v).toLocaleString('en-IN')}
        </span>
      )
    },
  },
]

const percCols = [
  rankCol,
  {
    accessorKey: 'name',
    header: 'Stock',
    cell: ({ row }) => (
      <p className="text-xs font-semibold text-sub-title-text-color truncate lg:max-w-[140px] md:max-w-[100px]">
        {row.original.name}
      </p>
    ),
  },
  {
    accessorKey: 'profit_perc',
    header: '% Return',
    cell: ({ getValue }) => {
      const v = getValue()
      return (
        <span className={`text-xs font-bold ${v >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {v >= 0 ? '+' : ''}
          {v}%
        </span>
      )
    },
  },
]

/* ─── Mini table ─── */

// Returns a hex color with a rank-based alpha: rank 0 → ~14%, last rank → ~2%
const rowGradientStyle = (accentColor, rowIndex, totalRows) => {
  const maxAlpha = 0.5
  const minAlpha = 0.1
  const alpha = maxAlpha - (rowIndex / Math.max(totalRows - 1, 1)) * (maxAlpha - minAlpha)
  const pct = Math.round(alpha * 100)
  return {
    background: `linear-gradient(90deg, ${accentColor}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0')} 0%, transparent 100%)`,
  }
}

const MiniTable = React.memo(({ title, icon: Icon, columns, data, accentColor }) => {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={13} style={{ color: accentColor }} />
        <p className="text-[11px] font-bold text-sub-title-text-color uppercase tracking-wide">{title}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/80 ">
        <Table className="dark:bg-black/80">
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow
                key={hg.id}
                className="border-b border-white/60 "
                style={{
                  background: ` ${accentColor}`,
                }}
              >
                {hg.headers.map(h => (
                  <TableHead key={h.id} className="text-left text-white text-md  py-1.5 px-2 font-bold">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  className="transition-colors border-b border-white/40 hover:brightness-95 "
                  style={rowGradientStyle(accentColor, i, rows.length)}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-2 px-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-20 text-center">
                  <span className="text-xs text-slate-400 italic">No data</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
})

/* ─── Main component ─── */

const TradeRankingsTable = React.memo(({ data }) => (
  <div className="glass-card rounded-2xl p-4">
    <h2 className="text-sm font-bold text-title-text-color mb-4">Trade Rankings</h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
      <MiniTable
        title="Most Traded"
        icon={BarChart2}
        accentColor="#8b5cf6"
        columns={mostTradedCols}
        data={data?.most_traded}
      />
      <div className="sm:pl-4">
        <MiniTable
          title="Top % Gain"
          icon={TrendingUp}
          accentColor="#10b981"
          columns={percCols}
          data={data?.top_profit_percent}
        />
      </div>
      <div className="sm:pl-4">
        <MiniTable
          title="Top ₹ Gain"
          icon={DollarSign}
          accentColor="#f59e0b"
          columns={profitCols}
          data={data?.top_profit_amount}
        />
      </div>
    </div>
  </div>
))

export default TradeRankingsTable
