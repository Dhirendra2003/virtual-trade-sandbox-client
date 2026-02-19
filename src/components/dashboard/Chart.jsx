import React, { useEffect, useState } from 'react'
import { AgCharts } from 'ag-charts-react'
import {
  AnimationModule,
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

ModuleRegistry.registerModules([
  AnimationModule,
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
  const chartOptions = ['candlestick', 'line']
  const [chartType, setChartType] = useState('candlestick')
  const [daysArray, setDaysArray] = useState(new Set())
  const stockCode = 'INE081A01020'
  const dataURL = `https://api.upstox.com/v3/historical-candle/NSE_EQ%7C${stockCode}/minutes/${timeFrame}/2026-02-19/2026-02-12`
  const [data, setData] = useState(null)

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
    // title: {
    //   text: 'S&P 500 Index',
    // },
    // subtitle: {
    //   text: 'Daily High and Low Prices',
    // },
    // footnote: {
    //   text: '1 Aug 2023 - 1 Nov 2023',
    // },
    zoom: {
      enabled: true,
    },
    // navigator: {
    //   enabled: true,
    //   miniChart: {
    //     enabled: true,
    //   },
    // },
    initialState: {
      zoom: {
        ratioX: { start: 0.0, end: 1.0 },
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
          stroke: 'red',
          width: 3,
        },
      },
    },
    series: [chartType === 'candlestick' ? candlestickSeries : lineSeries],
  }

  return (
    <div className={`glass-card ${className}`}>
      <div>
        {timeFrameOptions.map(option => (
          <button
            key={option}
            onClick={() => setTimeframe(option)}
            style={{
              marginRight: '5px',
              fontWeight: timeFrame === option ? 'bold' : 'normal',
            }}
          >
            {option} min
          </button>
        ))}
        {chartOptions.map(option => (
          <button
            key={option}
            onClick={() => setChartType(option)}
            style={{
              marginRight: '5px',
              fontWeight: chartType === option ? 'bold' : 'normal',
            }}
          >
            {option} min
          </button>
        ))}
      </div>
      {data && data.length > 0 ? <AgCharts options={options} /> : <div>Loading data...</div>}
    </div>
  )
}

export default Chart
