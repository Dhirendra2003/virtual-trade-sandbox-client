import { useSelector } from 'react-redux'
import { AgCharts } from 'ag-charts-react'
import {
  BarSeriesModule,
  CategoryAxisModule,
  NumberAxisModule,
  LegendModule,
  ModuleRegistry,
} from 'ag-charts-enterprise'

ModuleRegistry.registerModules([BarSeriesModule, CategoryAxisModule, NumberAxisModule, LegendModule])

// Palette matched to the app's purple/warm brand
const COLORS = ['#d4b8e8', '#a07cc5', '#6c499e', '#49176d']

/**
 * Transforms shareholding API data into the flat row format AG Charts expects.
 * Groups by displayName on X-axis, one bar series per holdingDate.
 * [{ category: 'Promoter', '2025-03-31': 33.84, '2025-06-30': 33.84, ... }, ...]
 */
function transformShareholding(shareholding = []) {
  // Collect all unique holdingDates (sorted)
  const allDates = [...new Set(shareholding.flatMap(group => group.categories.map(c => c.holdingDate)))].sort()

  // One row per displayName
  const rows = shareholding.map(group => {
    const row = { category: group.displayName }
    group.categories.forEach(({ holdingDate, percentage }) => {
      row[holdingDate] = parseFloat(percentage)
    })
    return row
  })

  return { rows, allDates }
}

const ShareholdingChart = ({ shareholding = [] }) => {
  const { userPreferences } = useSelector(state => state.auth)
  const isDark = userPreferences?.theme === 'dark'
  const { rows, allDates } = transformShareholding(shareholding)

  // Build one bar series per holdingDate
  const series = allDates.map((date, i) => ({
    type: 'bar',
    xKey: 'category',
    yKey: date,
    yName: (() => {
      const [year, month] = date.split('-')
      const monthName = new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'short' })
      return `${monthName} '${year.slice(2)}`
    })(),
    fill: COLORS[i % COLORS.length],
    strokeWidth: 0,
    cornerRadius: 4,
    tooltip: {
      renderer: ({ datum, yKey, yName }) => ({
        title: yName,
        content: `${datum[yKey]}%`,
      }),
    },
  }))

  const options = {
    data: rows,
    background: { fill: 'transparent' },
    series,
    axes: {
      x: {
        type: 'category',
        position: 'bottom',
        label: {
          color: isDark ? 'white' : 'black',
        },
      },
      y: {
        type: 'number',
        position: 'left',
        label: {
          color: isDark ? 'white' : 'black',
          formatter: ({ value }) => `${value}%`,
        },
        min: 0,
        max: 100,
        gridLine: {
          enabled: true,
          style: [{ stroke: isDark ? '#2e2e2e' : '#e2e8f022', lineDash: [4, 4] }],
        },
      },
    },
    legend: {
      enabled: true,
      position: 'bottom',
      item: {
        label: {
          fontSize: 12,
          color: isDark ? 'white' : 'black',
        },
        marker: { size: 10, shape: 'circle' },
      },
    },
    padding: { top: 10, right: 20, bottom: 10, left: 10 },
  }

  if (!shareholding.length) return null

  return (
    <div className="glass-card p-4 rounded-2xl my-4">
      <h3 className="text-md pl-2 font-bold text-title-text-color mb-2">Shareholding Pattern</h3>
      <AgCharts options={options} className="w-full h-64" />
    </div>
  )
}

export default ShareholdingChart
