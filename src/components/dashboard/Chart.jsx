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

const Chart = ({ className = '' }) => {
  const [timeFrame, setTimeframe] = useState(1)
  const timeFrameOptions = [1, 5, 15, 30, 60]
  const chartOptions = [<ChartCandlestick />, <ChartLine />]
  const [chartType, setChartType] = useState('candlestick')
  const [daysArray, setDaysArray] = useState(new Set())
  const [maximize, setMaximize] = useState(false)
  const stockCode = 'INE081A01020'
  const stockSymbol = 'TATA STEEL LTD.'
  const dataURL = `https://api.upstox.com/v3/historical-candle/NSE_EQ%7C${stockCode}/minutes/${timeFrame}/2026-02-19/2026-02-12`
  const [data, setData] = useState(null)

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
  }

  useEffect(() => {
    fetch(dataURL)
      .then(response => response.json())
      .then(responseData => {
        console.log('API Response:', responseData) // Debug log
        let days = new Set()
        responseData?.data?.candles?.map(candle => days.add(candle[0].slice(0, 10)))
        console.log(days)
        setDaysArray(days)
        const modifiedData = responseData?.data?.candles?.map(candle => ({
          // date: new Date(candle[0]).toLocaleDateString() + ' ' + new Date(candle[0]).toLocaleTimeString(),
          // date1: new Date(candle[0]).toTimeString().split(' ')[0].slice(0, 5),
          // date2: candle[0].slice(8, 16),
          date2: candle[0],
          open: candle[1],
          high: candle[2],
          low: candle[3],
          close: candle[4],
          volume: candle[5],
        }))

        //for linechart
        // const modifiedData = responseData?.data?.candles?.map((candle) => (
        //   {
        //     date: new Date(candle[0]).toTimeString().split(" ")[0], // Extract time in HH:MM:SS format
        //     close: candle[4],
        //   }
        // ));

        console.log('Modified Data:', modifiedData) // Debug log

        if (modifiedData && modifiedData.length > 0) {
          setData(modifiedData)
        } else {
          console.warn('No data received from API')
          setData([])
        }
      })
      .catch(error => {
        console.error('Fetch error:', error)
        setData([])
      })
  }, [stockCode, timeFrame, dataURL])

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
      enabled: true,
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
        ratioX: { start: 0.7, end: 1.0 },
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
          strokeWidth: 1,
        })),
      },
      y: {
        type: 'number',
        position: 'right',
        nice: false,
        gridLine: {
          enabled: true,
        },
        interval: { step: 2 },
        line: {
          stroke: '#6c499e',
          width: 2,
        },
        crossLines: [
          {
            type: 'line',
            value: data && data[0]?.close,
            stroke: '#0000FF',
            lineDash: [2, 4],
            label: {
              text: `${data && data[0]?.close}`,
              position: 'right',
              fontSize: 14,
              fill: '#000000',
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
      <div className={`flex justify-between ${maximize ? 'w-full p-3 m-auto' : 'mx-2 mt-2'} `} id="parent">
        <div className="text-lg pl-2 font-bold text-slate-800">{stockSymbol}</div>

        {/* Timeframe buttons */}
        <div id="timeframe" className="flex gap-2">
          {timeFrameOptions.map(option => (
            <Button
              key={option}
              variant={timeFrame === option ? 'default' : 'outline'}
              onClick={() => setTimeframe(option)}
              className={`cursor-pointer ${timeFrame === option ? 'primary-gradient' : 'outline'} px-3  rounded-lg`}
            >
              {option} min
            </Button>
          ))}
        </div>

        {/* Chart type buttons */}
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger
              onClick={() => setChartType('candlestick')}
              className={`cursor-pointer ${chartType === 'candlestick' ? 'primary-gradient' : 'outline'} p-1.5 rounded-lg`}
            >
              <ChartCandlestick color={chartType === 'candlestick' ? '#FFF' : '#000'} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Line Chart</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              onClick={() => setChartType('line')}
              className={`cursor-pointer ${chartType === 'line' ? 'primary-gradient' : 'outline'} p-1.5 rounded-lg`}
            >
              <LineChart color={chartType === 'line' ? '#FFF' : '#000'} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Line Chart</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {data && data.length > 0 ? (
        <AgCharts options={options} className="w-full h-full transition-all duration-300 ease-in-out" />
      ) : (
        <div>Loading data...</div>
      )}
    </div>
  )
}

export default Chart
