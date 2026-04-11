import { useState } from 'react'
import { AgCharts } from 'ag-charts-react'
import {
  ModuleRegistry,
  BarSeriesModule,
  CategoryAxisModule,
  NumberAxisModule,
  LegendModule,
} from 'ag-charts-enterprise'
import moment from 'moment'

ModuleRegistry.registerModules([BarSeriesModule, CategoryAxisModule, NumberAxisModule, LegendModule])

const tabs = [
  { key: 'all_trades', label: 'All' },
  { key: 'profit_trades', label: 'Profit' },
  { key: 'loss_trades', label: 'Loss' },
]

const NoData = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[220px] gap-3">
    <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path
          d="M3 17l4-8 4 4 4-6 4 10"
          stroke="#9b59b6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <p className="text-slate-400 text-sm italic font-light">No trade data available</p>
  </div>
)

const PnlBarChart = ({ data }) => {
  const [activeTab, setActiveTab] = useState('all_trades')

  const trades = data?.[activeTab]
  const hasData = trades && trades.length > 0

  const chartData = hasData
    ? trades.map(t => ({
        label: `#${t.row_num}`,
        profit: t.profit,
        date: moment(t.createdAt).format('DD MMM'),
        profitPerc: t.profit_perc,
        color: t.profit >= 0 ? '#6c499e' : '#e05c5c',
      }))
    : []

  const options = {
    data: chartData,
    background: { fill: '#00000000' },
    padding: { top: 10, right: 16, bottom: 10, left: 0 },
    axes: [
      {
        type: 'category',
        position: 'bottom',
        label: {
          fontSize: 11,
          color: '#94a3b8',
          formatter: ({ value }) => value,
        },
        gridLine: { enabled: false },
        line: { enabled: false },
      },
      {
        type: 'number',
        position: 'left',
        label: {
          fontSize: 11,
          color: '#94a3b8',
          formatter: ({ value }) => `₹${value}`,
        },
        gridLine: { enabled: true, style: [{ stroke: '#e2e8f022', lineDash: [4, 4] }] },
        crossLines: [
          {
            type: 'line',
            value: 0,
            stroke: '#64748b',
            strokeWidth: 1,
          },
        ],
      },
    ],
    series: [
      {
        type: 'bar',
        xKey: 'label',
        yKey: 'profit',
        yName: 'P&L (₹)',
        itemStyler: ({ datum }) => ({
          fill: datum.profit >= 0 ? '#6c499e' : '#e05c5c',
          cornerRadius: 4,
          fillOpacity: 0.9,
        }),
        tooltip: {
          renderer: ({ datum }) => ({
            title: `Trade ${datum.label}`,
            content: `Date: ${datum.date} | P&L: ₹${datum.profit} (${datum.profitPerc}%)`,
          }),
        },
      },
    ],
  }

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col h-full min-h-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-700">P&amp;L Overview</h2>
        <div className="flex gap-1 bg-white/60 rounded-lg p-0.5 border border-white">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.key ? 'primary-gradient text-white shadow' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {hasData ? (
        <div className="flex-1 min-h-[220px]">
          <AgCharts options={options} className="w-full h-full" />
        </div>
      ) : (
        <NoData />
      )}
    </div>
  )
}

export default PnlBarChart
