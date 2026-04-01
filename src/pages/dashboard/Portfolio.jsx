import SearchBar from '../../components/dashboard/SearchBar'

import { Separator } from '@/components/ui/separator'
import BuySellWindow from '../../components/dashboard/BuySellWindow'
import { Button } from '@/components/ui/button'
import ProfolioTable from '@/components/dashboard/PorfolioTable'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getTradesAndOrders, cancelAMOorder, settleTrade, getUserPortfolioStats } from './actions.js'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ListX, SquareArrowOutUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import { getColors, cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ProfolioOverview from '../../components/dashboard/PortfolioOverview.jsx'

const Portfolio = () => {
  const navigate = useNavigate()
  const tradeColumns = [
    {
      accessorKey: 'trading_symbol',
      header: 'Symbol',
      cell: ({ row }) => {
        const initialLettter = row?.original?.trading_symbol[0]
        return (
          <div className="flex items-center gap-2">
            <div
              className={`${getColors(initialLettter)} w-[2em] h-[2em] rounded-xl text-xl flex items-center justify-center`}
            >
              {initialLettter}
            </div>
            <p className="text-xs">{row?.original?.trading_symbol}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'full_name',
      header: 'Stock Name',
    },
    {
      accessorKey: 'qty',
      header: 'Qty',
    },
    {
      accessorKey: 'ltp',
      header: 'Price (LTP)',
      cell: ({ row }) => {
        const ogRow = row?.original
        return (
          <div className="ml-auto flex flex-col items-start">
            <p className="text-sm font-bold text-right">₹ {ogRow?.ltp?.last_price}</p>
            <div
              className={`text-xs ${ogRow?.ltp?.change_percent > 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1 `}
            >
              {ogRow?.ltp?.change_percent > 0 ? (
                <TrendingUp className={`w-3 h-3 mr-2`} />
              ) : (
                <TrendingDown className={`w-3 h-3 `} />
              )}{' '}
              % {ogRow?.ltp?.change_percent}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'investment',
      header: 'Investment',
      cell: ({ row }) => {
        return `₹ ${Math.abs(row?.original?.investment)}`
      },
    },
    {
      accessorKey: 'pnl',
      header: 'Unrealized P&L',
      cell: ({ row }) => {
        console.log(row?.original)
        const pnl = (row?.original?.ltp?.last_price * row?.original?.qty - Math.abs(row?.original?.investment)).toFixed(
          2
        )
        return <span className={`font-semibold text-md ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹ {pnl}</span>
      },
    },
    {
      accessorKey: '-',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="ml-auto flex flex-col ">
            <Button
              className={
                'rounded-xl p-4 transition-all duration-500 ease-in-out cursor-pointer border-purple-800 hover:bg-purple-800 hover:text-white text-purple-700  hover:primary-gradient'
              }
              variant="outline"
              onClick={() => {
                mutateSettleTrade.mutate({
                  instrument_key: row?.original?.instrument_key,
                  trade_type: row?.original?.trade_type,
                  trade_duration: row?.original?.trade_duration,
                })
              }}
            >
              Settle
            </Button>
          </div>
        )
      },
    },
  ]
  const orderColumns = [
    {
      accessorKey: 'instrument_key',
      header: 'Symbol',
      cell: ({ row }) => {
        const initialLettter = row?.original?.trading_symbol[0]
        return (
          <div className="flex items-center gap-2">
            <div
              className={`${getColors(initialLettter)} w-[2em] h-[2em] rounded-xl text-xl flex items-center justify-center`}
            >
              {initialLettter}
            </div>
            <p className="text-xs">{row?.original?.trading_symbol}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'trade_type',
      header: 'Trade Type',
      cell: ({ row }) => {
        return (
          <span
            className={cn(
              'uppercase bg-white font-semibold px-3 py-1 rounded-xl',
              row?.original?.trade_type === 'buy' && 'bg-green-300',
              row?.original?.trade_type === 'sell' && 'bg-red-300'
            )}
          >
            {row?.original?.trade_type}
          </span>
        )
      },
    },
    {
      accessorKey: 'full_name',
      header: 'Stock Name',
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
    },
    {
      accessorKey: 'ltp',
      header: 'Price (LTP)',
      cell: ({ row }) => {
        const ogRow = row?.original
        return (
          <div className="ml-auto flex flex-col items-start">
            <p className="text-sm font-bold text-right">₹ {ogRow?.ltp?.last_price}</p>
            <div
              className={`text-xs ${ogRow?.ltp?.change_percent > 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1 `}
            >
              {ogRow?.ltp?.change_percent > 0 ? (
                <TrendingUp className={`w-3 h-3 mr-2`} />
              ) : (
                <TrendingDown className={`w-3 h-3 `} />
              )}{' '}
              % {ogRow?.ltp?.change_percent}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'investment',
      header: 'Funds required',
      cell: ({ row }) => {
        return (
          <span className="font-semibold text-md">
            ₹ {Math.abs(row?.original?.quantity * row?.original?.ltp?.last_price).toFixed(2)}
          </span>
        )
      },
    },
    {
      accessorKey: '-',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="ml-auto flex flex-col ">
            <Button
              className={
                'rounded-xl p-4 transition-all duration-500 ease-in-out cursor-pointer border-purple-800 hover:bg-purple-800 hover:text-white text-purple-700  hover:primary-gradient'
              }
              variant="outline"
              onClick={() => {
                mutateCancelOrder.mutate(row?.original?.id)
              }}
            >
              Cancel Order
            </Button>
          </div>
        )
      },
    },
  ]

  const {
    data: portfolioData,
    isLoading,
    isError,
    refetch: refetchPortfolio,
  } = useQuery({
    queryKey: ['portfolio'],
    queryFn: getTradesAndOrders,
    refetchInterval: 5000,
  })
  const {
    data: portfolioStats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    refetch: refetchPortfolioStats,
  } = useQuery({
    queryKey: ['portfolio-stats'],
    queryFn: getUserPortfolioStats,
    refetchInterval: 5000,
  })
  const mutateCancelOrder = useMutation({
    mutationFn: cancelAMOorder,
    onSuccess: data => {
      toast.success(data.message)
      refetchPortfolio()
    },
    onError: data => {
      toast.error(data.message)
      refetchPortfolio()
    },
  })
  const mutateSettleTrade = useMutation({
    mutationFn: ({ instrument_key, trade_type, trade_duration }) =>
      settleTrade({ instrument_key, trade_type, trade_duration }),
    onSuccess: data => {
      toast.success(data.message)
      refetchPortfolio()
    },
    onError: data => {
      toast.error(data.message)
      refetchPortfolio()
    },
  })

  return (
    <div className="p-2 space-y-4 ">
      <div className="glass-bg sticky w-full top-0 py-2 z-50 ">
        <SearchBar />
      </div>
      <div className="grid grid-cols-1 gap-2  w-full items-start">
        {portfolioStats && <ProfolioOverview data={portfolioStats?.data} loadingState={isLoadingStats} />}
        {portfolioData && (
          <>
            {portfolioData?.data?.intraday?.length > 0 && (
              <ProfolioTable
                columns={tradeColumns}
                data={portfolioData?.data?.intraday}
                loadingState={false}
                title="Intraday Holdings"
              />
            )}
            {portfolioData?.data?.delivery?.length > 0 && (
              <ProfolioTable
                columns={tradeColumns}
                data={portfolioData?.data?.delivery}
                loadingState={false}
                title="Delivery Holdings"
              />
            )}
            {portfolioData?.data?.open_orders?.length > 0 && (
              <ProfolioTable
                columns={orderColumns}
                data={portfolioData?.data?.open_orders}
                loadingState={false}
                title="Open Orders"
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Portfolio
