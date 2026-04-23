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
import AlertTradeSummary from '@/components/dashboard/AlertTradeSummary'
import { ArrowRight } from 'lucide-react'
import CancelOrderAlert from '../../components/dashboard/CacelOrderAlert.jsx'

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
              className={`text-xs ${ogRow?.ltp?.change_percent > 0 ? 'text-main-green' : 'text-main-red'} flex items-center gap-1 `}
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
        return (
          <span className={`font-semibold text-md ${pnl >= 0 ? 'text-main-green' : 'text-main-red'}`}>₹ {pnl}</span>
        )
      },
    },
    {
      accessorKey: '-',
      header: 'Actions',
      cell: ({ row }) => {
        const ogRow = row?.original
        const pnl = (ogRow?.ltp?.last_price * ogRow?.qty - Math.abs(ogRow?.investment)).toFixed(2)
        return (
          <div className="ml-auto flex flex-col ">
            <AlertTradeSummary
              triggerText="Settle"
              triggerVariant="outline"
              triggerClassName="rounded-xl p-4 transition-all duration-500 ease-in-out dark:text-purple-400 dark:border-purple-500 cursor-pointer border-purple-800 hover:bg-purple-800 hover:text-white text-purple-700 hover:primary-gradient hover:dark:bg-purple-500 hover:dark:text-white"
              dialogTitle="Do you want to settle this trade?"
              data={{
                // tradeType: ogRow?.trade_type,
                tradeDuration: ogRow?.trade_duration,
                quantity: ogRow?.qty,
                stockSymbol: ogRow?.trading_symbol,
                stockName: ogRow?.full_name,
                price: ogRow?.ltp?.last_price,
              }}
              button={
                <Button
                  className="h-10 rounded-xl text-md mt-1 primary-gradient cursor-pointer text-white"
                  onClick={() =>
                    mutateSettleTrade.mutate({
                      instrument_key: ogRow?.instrument_key,
                      trade_type: ogRow?.trade_type,
                      trade_duration: ogRow?.trade_duration,
                    })
                  }
                >
                  Settle <ArrowRight />
                </Button>
              }
            />
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
              row?.original?.trade_type === 'buy' && 'bg-green-300 dark:bg-green-700',
              row?.original?.trade_type === 'sell' && 'bg-red-300 dark:bg-red-700'
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
              className={`text-xs ${ogRow?.ltp?.change_percent > 0 ? 'text-main-green' : 'text-main-red'} flex items-center gap-1 `}
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
        const CancelButtonWithAction = () => {
          return (
            <Button
              className={
                'rounded-xl p-4 transition-all duration-500 ease-in-out cursor-pointer border-purple-800 hover:bg-purple-800 hover:text-white text-purple-700  hover:primary-gradient hover:dark:bg-purple-800 hover:dark:text-white dark:border-purple-400 dark:text-purple-400'
              }
              variant="outline"
              onClick={() => {
                mutateCancelOrder.mutate(row?.original?.id)
              }}
            >
              Cancel Order
            </Button>
          )
        }
        return (
          <div className="ml-auto flex flex-col ">
            <CancelOrderAlert triggerButton={<CancelButtonWithAction />} />
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
    <div className="p-4 space-y-4 ">
      <div className="search-bar">
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
