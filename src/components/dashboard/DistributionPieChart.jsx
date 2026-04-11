import { AgCharts } from 'ag-charts-react'
// import { ModuleRegistry, PieSeriesModule, LegendModule } from 'ag-charts-enterprise'
import { LegendModule, DonutSeriesModule, ModuleRegistry } from 'ag-charts-community'

// ModuleRegistry.registerModules([PieSeriesModule, LegendModule])
ModuleRegistry.registerModules([DonutSeriesModule, LegendModule])
const BRIGHT_PALETTE = ['#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#0ea5e9', '#f97316', '#14b8a6']

const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`

const MiniDonut = ({ title, chartData, emptyText = 'No data' }) => {
  const hasData = chartData && chartData.length > 0
  const total = hasData ? chartData.reduce((s, d) => s + d.value, 0) : 0

  const options = {
    data: chartData || [],
    background: { fill: '#00000000' },
    padding: { top: 4, right: 4, bottom: 4, left: 4 },
    series: [
      {
        // type: 'pie',
        type: 'donut',
        angleKey: 'value',
        legendItemKey: 'label',
        fills: BRIGHT_PALETTE,
        strokes: ['#fff'],
        strokeWidth: 2,
        // innerRadiusRatio: 0.68,
        innerRadiusRatio: 0.5,
        calloutLabel: { enabled: false },
        itemStyler: ({ datum, index }) => ({ fill: BRIGHT_PALETTE[index % BRIGHT_PALETTE.length] }),
        tooltip: {
          renderer: ({ datum, index }) => ({
            title: datum.label,
            content: `${fmt(datum.value)}  (${total ? ((datum.value / total) * 100).toFixed(1) : 0}%)`,
          }),
        },
      },
    ],
    legend: { enabled: false },
  }

  return (
    <div className="flex flex-col">
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
      {hasData ? (
        <>
          <div className="relative w-48 h-48">
            <AgCharts options={options} className="w-full h-full" />
            {/* center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-600 leading-tight">₹{(total / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>
          {/* legend */}
          <div className="flex flex-col gap-1 mt-1">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: BRIGHT_PALETTE[i % BRIGHT_PALETTE.length] }}
                  />
                  <span className="text-[10px] text-slate-600 truncate capitalize">{item.label}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-700 ml-1 flex-shrink-0">{fmt(item.value)}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-20 flex items-center justify-center">
          <p className="text-[11px] text-slate-400 italic">{emptyText}</p>
        </div>
      )}
    </div>
  )
}

const DistributionPieChart = ({ data }) => {
  const durationData = data?.duration_split?.map(d => ({ label: d.trade_duration, value: d.total }))
  const deliveryData = data?.delivery_allocation?.map(d => ({ label: d.name, value: d.total }))
  const intradayData = data?.intraday_allocation?.map(d => ({ label: d.name, value: d.total }))

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-4 min-h-[320px]">
      <h2 className="text-sm font-bold text-slate-700">Capital Distribution</h2>
      <div className="flex justify-around gap-4 overflow-hidden">
        <MiniDonut title="By Duration" chartData={durationData} emptyText="No duration data" />

        <MiniDonut title="Delivery Allocation" chartData={deliveryData} emptyText="No delivery trades" />

        <MiniDonut title="Intraday Allocation" chartData={intradayData} emptyText="No intraday trades" />
      </div>
    </div>
  )
}

export default DistributionPieChart
