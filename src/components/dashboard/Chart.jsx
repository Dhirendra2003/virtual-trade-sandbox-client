import React, { useEffect, useRef, useState } from 'react'
import { AgCharts } from 'ag-charts-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import {
  CandlestickSeriesModule,
  ContextMenuModule,
  CrosshairModule,
  LegendModule,
  ModuleRegistry,
  NumberAxisModule,
  OrdinalTimeAxisModule,
  LineSeriesModule,
  NavigatorModule,
  UnitTimeAxisModule,
  ZoomModule,
  AreaSeriesModule,
  CategoryAxisModule,
} from 'ag-charts-enterprise'
import { ChartCandlestick, ChartLine, LineChart, Maximize, Minimize } from 'lucide-react'
import { getStockData } from '../../pages/dashboard/actions.js'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment/moment.js'
import { Spinner } from '@/components/ui/spinner'
import { useDispatch, useSelector } from 'react-redux'
import { setLatestPrice, clearStockState, setStock, setLTPdata } from '../../store/slices/stockSlice'
import { useMarketStatus } from '@/hooks/use-market-status'

// Map profile interval strings to numeric minutes used by the chart API
const INTERVAL_TO_MINUTES = { '1m': 1, '5m': 5, '15m': 15, '30m': 30, '1h': 60 }

ModuleRegistry.registerModules([
  CandlestickSeriesModule,
  AreaSeriesModule,
  CrosshairModule,
  LegendModule,
  NumberAxisModule,
  OrdinalTimeAxisModule,
  ContextMenuModule,
  LineSeriesModule,
  NavigatorModule,
  UnitTimeAxisModule,
  ZoomModule,
  CategoryAxisModule,
])

const Chart = ({ className = '', stockId, zoomEnabled = true }) => {
  const dispatch = useDispatch()
  const { isMarketLive } = useMarketStatus()

  useEffect(() => {
    // console.log('stockId', stockId)
    // clear the redux
    if (!stockId) {
      dispatch(clearStockState())
    }
  }, [dispatch, stockId])
  const daysRangeOptions = [
    { label: '5 Days', value: 5 },
    { label: '10 Days', value: 10 },
    { label: '15 Days', value: 15 },
    { label: '20 Days', value: 20 },
    { label: '30 Days', value: 30 },
  ]
  const timeFrameOptions = [1, 5, 15, 30, 60]
  // const stockData = useLocation()
  const stock = useSelector(state => state.stock.stock)
  const { userPreferences } = useSelector(state => state.auth)

  // Derive initial defaults from Redux preferences; fall back to hardcoded values
  const defaultChartType = userPreferences?.chartType || 'candlestick'
  const defaultTimeFrame = INTERVAL_TO_MINUTES[userPreferences?.chartInterval] ?? 1

  const [timeFrame, setTimeframe] = useState(defaultTimeFrame)
  const [daysRange, setDaysRange] = useState(daysRangeOptions[0].value)
  const [chartType, setChartType] = useState(defaultChartType)
  const [maximize, setMaximize] = useState(false)
  const stockCode = stockId || 'NSE_INDEX|Nifty 50'
  // Date range for chart data — adjust as needed
  const to = moment().format('YYYY-MM-DD')
  const from = moment()
    .subtract(daysRange - 1, 'days')
    .format('YYYY-MM-DD')
  // Custom dropdown open state (no portals — works in fullscreen)
  const [timeFrameOpen, setTimeFrameOpen] = useState(false)
  const [daysRangeOpen, setDaysRangeOpen] = useState(false)

  const elemRef = useRef(null)

  const {
    data: stockChartData,
    isFetching,
    isStale,
  } = useQuery({
    queryKey: ['stockData', stockCode, timeFrame, from, to],
    queryFn: () => getStockData({ stockCode, timeFrame, from, to }),
    enabled: !!stockCode && !!timeFrame && !!from && !!to,
    // gcTime: 0,
    staleTime: 1000 * 15,
    refetchInterval: isMarketLive ? 10000 : 60000,
    // refetchInterval: 50000,
    placeholderData: previousData => previousData,
  })

  const data = React.useMemo(() => stockChartData?.data ?? [], [stockChartData?.data])
  const daysArray = React.useMemo(() => new Set(stockChartData?.days ?? []), [stockChartData?.days])

  // Sync chart data from React Query response (onSuccess is deprecated in RQ v5)
  useEffect(() => {
    if (stockChartData?.data) {
      //set latest price in redux
      dispatch(setStock({ ...stockChartData.stockDetails, isAddedToWatchlist: stockChartData.isAddedToWatchlist }))
      dispatch(setLatestPrice(stockChartData.data[0].close))
      dispatch(setLTPdata(stockChartData?.stockLTPobject))
    }
  }, [dispatch, stockChartData])

  // ── Compute dynamic Y-axis bounds for line/area charts ──────────────────
  // Candlestick series auto-fits, but line/area starts from 0 by default.
  // We calculate a tight min/max with a small padding so the curves are clearly visible.
  const yBounds = React.useMemo(() => {
    if (!data || data.length === 0 || chartType === 'candlestick') return { min: undefined, max: undefined }
    let lo = Infinity
    let hi = -Infinity
    for (const d of data) {
      if (d.low !== undefined && d.low < lo) lo = d.low
      if (d.high !== undefined && d.high > hi) hi = d.high
      if (d.close !== undefined) {
        if (d.close < lo) lo = d.close
        if (d.close > hi) hi = d.close
      }
    }
    if (!isFinite(lo) || !isFinite(hi)) return { min: undefined, max: undefined }
    const range = hi - lo || 1
    const padding = range * 0.1 // 5% breathing room top & bottom
    return { min: lo - padding, max: hi + padding }
  }, [data, chartType])

  function exitHandler() {
    if (!document.fullscreenElement) {
      console.log('exited')
      // if (maximize) {
      //   toggleFullScreen()
      // }
      setMaximize(false)
    } else {
      console.log('entered')
      setMaximize(true)
    }
  }

  useEffect(() => {
    document.addEventListener('fullscreenchange', exitHandler, false)
    return () => {
      document.removeEventListener('fullscreenchange', exitHandler, false)
    }
  }, [])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen mode
      if (elemRef.current.requestFullscreen) {
        elemRef.current.requestFullscreen()
      } else if (elemRef.current.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elemRef.current.webkitRequestFullscreen()
      } else if (elemRef.current.mozRequestFullScreen) {
        /* Firefox */
        elemRef.current.mozRequestFullScreen()
      }
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari & Opera */
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen()
      }
    }
  }

  const candlestickSeries = {
    type: 'candlestick',
    xKey: 'date2',
    xName: 'Date',
    lowKey: 'low',
    highKey: 'high',
    openKey: 'open',
    closeKey: 'close',
    tooltip: { renderer },
    highlight: { enabled: false },
    item: {
      up: {
        fill: userPreferences?.theme === 'dark' ? '#00c951' : '#00a63e',
        stroke: userPreferences?.theme === 'dark' ? '#00c951' : '#00a63e',
      },
      down: {
        fill: userPreferences?.theme === 'dark' ? '#fb2c36' : '#e7000b',
        stroke: userPreferences?.theme === 'dark' ? '#fb2c36' : '#e7000b',
      },
    },
  }
  const lineSeries = {
    type: 'area',
    xKey: 'date2',
    yKey: 'close',
    yName: 'close',
    stroke: '#6e11b0',
    strokeWidth: 1,
    strokeOpacity: 1,
    fill: {
      type: 'gradient',
      colorStops: [
        { color: '#ffffff00', stop: 0.7 },
        { color: '#6e11b060', stop: (yBounds?.max - (yBounds?.max - yBounds?.min)) / yBounds?.max || 0.99 },
        { color: '#6e11b0', stop: 1.0 }, //will continue to the end
      ],
    },
    tooltip: { renderer },
    highlight: { enabled: false },
  }

  // Derive options directly from data
  const options = {
    data: data || [],
    background: {
      fill: '#00000000',
    },
    zoom: {
      enabled: true,
    },
    navigator: {
      enabled: zoomEnabled,
      height: 8,
      mask: {
        fill: '#6c499e',
        strokeWidth: 0.5,
        stroke: '#6c499e',
        fillOpacity: 1,
      },
    },
    initialState: {
      zoom: {
        ratioX: { start: zoomEnabled ? 0.7 : 0, end: 1.0 },
      },
    },
    axes: {
      x: {
        // type: 'time',
        position: 'bottom',
        nice: true,
        reverse: true,
        interval: {
          unit: 'minutes',
          step: 10,
        },
        gridLine: {
          enabled: true,
          style: [
            {
              stroke: userPreferences?.theme === 'dark' ? '#2e2e2e' : '#d9d9d9',
            },
          ],
        },

        label: {
          autoRotate: false,
          formatter: ({ value }) => value.slice(11, 16),
          color: userPreferences?.theme === 'dark' ? 'white' : 'black',
        },

        crossLines: [...daysArray].map(day => ({
          type: 'line',
          value: `${day}T09:15:00+05:30`,
          stroke: '#757575',
          strokeWidth: 1,
        })),
      },
      y: {
        type: 'number',
        position: 'right',
        nice: false,
        min: yBounds.min,
        max: yBounds.max,
        label: {
          color: userPreferences?.theme === 'dark' ? 'white' : 'black',
        },
        gridLine: {
          enabled: true,
          style: [
            {
              stroke: userPreferences?.theme === 'dark' ? '#2e2e2e' : '#d9d9d9',
            },
          ],
        },
        interval: { minSpacing: 2, maxSpacing: 100 },
        line: {
          stroke: '#6c499e',
          width: 2,
        },
        crossLines: [
          {
            type: 'line',
            value: data && data[0]?.close,
            stroke: userPreferences?.theme === 'dark' ? '#9102f7' : '#49176d',
            lineDash: [4, 4],
            label: {
              text: `${data && data[0]?.close}`,
              position: 'right',
              fontSize: 14,
              fill: '#49176d',
              fillOpacity: 1,
              color: '#FFFFFF',
              cornerRadius: 4,
            },
          },
        ],
      },
    },
    series: [chartType === 'candlestick' ? candlestickSeries : lineSeries],
  }

  return (
    <div
      ref={elemRef}
      className={`${maximize ? 'bg-div-bg-color flex flex-col w-full items-center justify-center' : 'glass-card col-span-2 relative'}  ${className}`}
    >
      <Button
        className="absolute bottom-3 z-50 right-3 rounded-xl primary-gradient cursor-pointer"
        onClick={() => {
          // setMaximize(!maximize)
          toggleFullScreen()
        }}
      >
        {maximize ? <Minimize className="text-white" /> : <Maximize className="text-white" />}
      </Button>
      <div className={`flex flex-wrap  space-y-2 ${maximize ? 'w-full p-3 m-auto' : 'mx-2 mt-2'} `} id="parent">
        {/* Stock Info */}
        <div className="mr-auto">
          <h2 className="text-md pl-2 font-bold text-title-text-color ">{stock?.name || 'NIFTY 50'}</h2>
          <h2 className="text-xs pl-2  w-full flex">
            <span>{stock?.trading_symbol || 'NIFTY 50'}</span>
            <span className="text-slate-500 ml-2">
              {` ${stock?.exchange || 'NSE'} `}
              {stock?.segment && ` - (${stock?.instrument_type === 'EQ' ? 'EQUITY' : 'UNKNOWN_SEGMENT'})`}
            </span>
          </h2>
        </div>

        {/* Timeframe — custom inline dropdown, works in fullscreen */}
        <div
          className="relative mx-2"
          onBlur={e => {
            if (!e.currentTarget.contains(e.relatedTarget)) setTimeFrameOpen(false)
          }}
        >
          <button
            onClick={() => {
              setTimeFrameOpen(o => !o)
              setDaysRangeOpen(false)
            }}
            className="flex items-center gap-2 px-3 h-9 rounded-lg border-2 border-purple-700 font-bold text-sm bg-div-bg-color  min-w-12 justify-between"
          >
            <span>{timeFrame} min</span>
            <span className="text-purple-700">{timeFrameOpen ? '▲' : '▼'}</span>
          </button>
          {timeFrameOpen && (
            <div className="absolute top-full mt-1 left-0 bg-div-bg-color border border-purple-200 rounded-lg shadow-xl z-9999 min-w-28 overflow-hidden">
              <p className="text-xs text-slate-500 px-3 pt-2 pb-1 font-semibold">Time Frame</p>
              {timeFrameOptions.map(option => (
                <button
                  key={option}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    setTimeframe(option)
                    setTimeFrameOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm 
                    hover:bg-hover-bg-purple
                     font-medium text-title-text-color ${timeFrame === option && ` bg-selected-bg-purple`}`}
                >
                  {option} min
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Days Range — custom inline dropdown, works in fullscreen */}
        <div
          className="relative mx-2"
          onBlur={e => {
            if (!e.currentTarget.contains(e.relatedTarget)) setDaysRangeOpen(false)
          }}
        >
          <button
            onClick={() => {
              setDaysRangeOpen(o => !o)
              setTimeFrameOpen(false)
            }}
            className="flex items-center gap-2 px-3 h-9 rounded-lg border-2 border-purple-700 font-bold text-sm bg-div-bg-color  min-w-12 justify-between"
          >
            <span>{daysRangeOptions.find(o => o.value === daysRange)?.label ?? 'Range'}</span>
            <span className="text-purple-700">{daysRangeOpen ? '▲' : '▼'}</span>
          </button>
          {daysRangeOpen && (
            <div className="absolute top-full mt-1 left-0 bg-div-bg-color border border-purple-200 rounded-lg shadow-xl z-9999 min-w-28 overflow-hidden">
              <p className="text-xs text-slate-500 px-3 pt-2 pb-1 font-semibold">Days Range</p>
              {daysRangeOptions.map(option => (
                <button
                  key={option.value}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    setDaysRange(option.value)
                    setDaysRangeOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-hover-bg-purple font-medium text-title-text-color ${
                    daysRange === option.value && ` bg-selected-bg-purple`
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chart type buttons */}
        <div className="flex gap-2 ">
          <Tooltip>
            <TooltipTrigger
              onClick={() => setChartType('candlestick')}
              className={`cursor-pointer h-9 w-9 flex items-center justify-center ${chartType === 'candlestick' ? 'primary-gradient' : 'outline'} p-1.5 rounded-lg`}
            >
              <ChartCandlestick className={chartType === 'candlestick' ? 'text-white' : 'text-title-text-color'} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Candlestick Chart</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              onClick={() => setChartType('line')}
              className={`cursor-pointer h-9 w-9 flex items-center justify-center ${chartType === 'line' ? 'primary-gradient' : 'outline'} p-1.5 rounded-lg`}
            >
              <LineChart className={chartType === 'line' ? 'text-white' : 'text-title-text-color'} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Line Chart</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {!isFetching || !isStale ? (
        data && data.length > 0 ? (
          <AgCharts options={options} className="w-full h-[calc(100%-50px)] transition-all duration-300 ease-in-out" />
        ) : (
          <div className="w-full h-full transition-all duration-300 ease-in-out">Loading data...</div>
        )
      ) : (
        <div className=" z-50 top-48 left-48 min-h-[50vh] w-full flex items-center justify-center transition-all duration-300 ease-in-out">
          <Spinner className="size-8" color="purple" />
        </div>
      )}
    </div>
  )
}

export default Chart

function renderer({ datum, xKey, yKey, yName }) {
  console.log(datum, xKey, yKey, yName)
  return {
    heading: moment(datum?.date2).format('DD-MMM-YYYY HH:mm'),
    data: datum,
  }
}
