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

  useEffect(() => {
    // console.log('stockId', stockId)
    // clear the redux
    if (!stockId) {
      dispatch(clearStockState())
    }
  }, [stockId])
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
  const [timeFrame, setTimeframe] = useState(1)
  const [daysRange, setDaysRange] = useState(daysRangeOptions[0].value)
  const [chartType, setChartType] = useState('candlestick')
  const [daysArray, setDaysArray] = useState(new Set())
  const [maximize, setMaximize] = useState(false)
  const stockCode = stockId || 'NSE_INDEX|Nifty 50'
  // Date range for chart data — adjust as needed
  const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
  const from = moment()
    .subtract(daysRange - 1, 'days')
    .format('YYYY-MM-DD')
  const [data, setData] = useState(null)
  // Custom dropdown open state (no portals — works in fullscreen)
  const [timeFrameOpen, setTimeFrameOpen] = useState(false)
  const [daysRangeOpen, setDaysRangeOpen] = useState(false)

  const elemRef = useRef(null)

  useEffect(() => {
    document.addEventListener('fullscreenchange', exitHandler, false)
    return () => {
      document.removeEventListener('fullscreenchange', exitHandler, false)
    }
  }, [])

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
  }
  const lineSeries = {
    type: 'area',
    xKey: 'date2',
    yKey: 'close',
    yName: 'close',
    stroke: '#6600ff',
    strokeWidth: 1,
    strokeOpacity: 1,
    fill: {
      type: 'gradient',
      colorStops: [
        { color: '#ffffff', stop: 0.0 },
        { color: '#ffffff', stop: 0.95 },
        { color: '#6600ff', stop: 1.0 }, //will continue to the end
      ],
    },
    tooltip: { renderer },
  }

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
    refetchInterval: 5000,
  })

  // Sync chart data from React Query response (onSuccess is deprecated in RQ v5)
  useEffect(() => {
    if (stockChartData?.data) {
      setData(stockChartData.data)
      //set latest price in redux
      dispatch(setStock({ ...stockChartData.stockDetails, isAddedToWatchlist: stockChartData.isAddedToWatchlist }))
      dispatch(setLatestPrice(stockChartData.data[0].close))
      dispatch(setLTPdata(stockChartData?.stockLTPobject))
      setDaysArray(new Set(stockChartData.days))
    }
  }, [stockChartData])

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
        ratioY: chartType === 'candlestick' ? { start: 0.0, end: 1.0 } : { start: 0.95, end: 1.0 },
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
        },

        label: {
          autoRotate: false,
          formatter: ({ value }) => value.slice(11, 16),
        },
        // crossLines: [
        //   {
        //     type: 'range',
        //     range: [
        //       // '2026-02-12T09:15:00+05:30',
        //       // '2026-02-13T09:15:00+05:30',
        //       '2026-02-16T09:15:00+05:30',
        //       '2026-02-17T09:15:00+05:30',
        //     ],
        //     fill: '#e0e0e0', // Gray
        //     fillOpacity: 0.2,
        //     strokeWidth: 0.2,
        //   },
        //   {
        //     type: 'line',
        //     value: '2026-02-13T09:15:00+05:30',
        //     stroke: 'red',
        //     strokeWidth: 0.5,
        //   },
        // ],
        crossLines: [...daysArray].map(day => ({
          type: 'line',
          value: `${day}T09:15:00+05:30`,
          stroke: 'grey',
          strokeWidth: 0.5,
        })),
      },
      y: {
        type: 'number',
        position: 'right',
        nice: false,
        gridLine: {
          enabled: true,
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
            stroke: '#49176d',
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
      className={`${maximize ? 'bg-white flex flex-col w-full items-center justify-center' : 'glass-card col-span-2'}  ${className}`}
    >
      <Button
        className="absolute bottom-3 z-50 right-3 rounded-xl primary-gradient cursor-pointer"
        onClick={() => {
          // setMaximize(!maximize)
          toggleFullScreen()
        }}
      >
        {maximize ? <Minimize /> : <Maximize />}
      </Button>
      <div className={`flex flex-wrap  space-y-2 ${maximize ? 'w-full p-3 m-auto' : 'mx-2 mt-2'} `} id="parent">
        {/* Stock Info */}
        <div className="mr-auto">
          <h2 className="text-md pl-2 font-bold text-slate-800 ">{stock?.name || 'NIFTY 50'}</h2>
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
            className="flex items-center gap-2 px-3 h-9 rounded-lg border-2 border-purple-700 font-bold text-sm bg-white min-w-12 justify-between"
          >
            <span>{timeFrame} min</span>
            <span className="text-purple-700">{timeFrameOpen ? '▲' : '▼'}</span>
          </button>
          {timeFrameOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-purple-200 rounded-lg shadow-xl z-[9999] min-w-28 overflow-hidden">
              <p className="text-xs text-slate-400 px-3 pt-2 pb-1 font-semibold">Time Frame</p>
              {timeFrameOptions.map(option => (
                <button
                  key={option}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    setTimeframe(option)
                    setTimeFrameOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-purple-50 font-medium ${
                    timeFrame === option ? 'text-purple-700 bg-purple-50' : 'text-slate-700'
                  }`}
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
            className="flex items-center gap-2 px-3 h-9 rounded-lg border-2 border-purple-700 font-bold text-sm bg-white min-w-12 justify-between"
          >
            <span>{daysRangeOptions.find(o => o.value === daysRange)?.label ?? 'Range'}</span>
            <span className="text-purple-700">{daysRangeOpen ? '▲' : '▼'}</span>
          </button>
          {daysRangeOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-purple-200 rounded-lg shadow-xl z-[9999] min-w-28 overflow-hidden">
              <p className="text-xs text-slate-400 px-3 pt-2 pb-1 font-semibold">Days Range</p>
              {daysRangeOptions.map(option => (
                <button
                  key={option.value}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    setDaysRange(option.value)
                    setDaysRangeOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-purple-50 font-medium ${
                    daysRange === option.value ? 'text-purple-700 bg-purple-50' : 'text-slate-700'
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
              <ChartCandlestick color={chartType === 'candlestick' ? '#FFF' : '#000'} />
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
              <LineChart color={chartType === 'line' ? '#FFF' : '#000'} />
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
