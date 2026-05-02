import SearchBar from '../../components/dashboard/SearchBar'

import { Button } from '@/components/ui/button'
import ProfolioTable from '@/components/dashboard/PorfolioTable'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getTradesAndOrders, cancelAMOorder, settleTrade, getUserPortfolioStats } from './actions.js'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SquareArrowOutUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import { getColors, cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ProfolioOverview from '../../components/dashboard/PortfolioOverview.jsx'
import AlertTradeSummary from '@/components/dashboard/AlertTradeSummary'
import { ArrowRight } from 'lucide-react'
import CancelOrderAlert from '../../components/dashboard/CacelOrderAlert.jsx'
import { useMarketStatus } from '@/hooks/use-market-status'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link } from 'react-router-dom'

const Portfolio = () => {
  const navigate = useNavigate()
  const { isMarketLive } = useMarketStatus()
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
      cell: ({ row }) => {
        return (
          <p>
            {row?.original?.full_name} <span className="text-gray-500 text-xs ml-4">({row?.original?.exchange})</span>
          </p>
        )
      },
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
        const pnlValue = (
          row?.original?.ltp?.last_price * row?.original?.qty -
          Math.abs(row?.original?.investment)
        ).toFixed(2)
        return (
          <span className={`font-semibold text-md ${pnlValue >= 0 ? 'text-main-green' : 'text-main-red'}`}>
            ₹ {pnlValue}
          </span>
        )
      },
    },
    {
      accessorKey: '-',
      header: 'Actions',
      cell: ({ row }) => {
        const ogRow = row?.original
        return (
          <div className="ml-auto flex gap-4 items-center">
            <Tooltip>
              <TooltipTrigger
                onClick={e => {
                  e.preventDefault()
                  navigate(`/app/stock/${ogRow.instrument_key}`)
                }}
                className={`cursor-pointer hover:bg-green-200 hover:dark:bg-green-700  hover:scale-105 transition-all duration-200 h-9 w-9 flex items-center justify-center  bg-div-bg-color shadow-md shadow-black/10 p-1.5 rounded-lg`}
              >
                <SquareArrowOutUpRight className="w-4 h-4 text-green-500 dark:text-green-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to Trade</p>
              </TooltipContent>
            </Tooltip>
            <AlertTradeSummary
              triggerText="Settle"
              triggerVariant="outline"
              triggerClassName="rounded-xl px-4 py-2 h-9 flex items-center transition-all duration-500 ease-in-out dark:text-purple-400 dark:border-purple-500 cursor-pointer border-purple-800 hover:bg-purple-800 hover:text-white text-purple-700 hover:primary-gradient hover:dark:bg-purple-500 hover:dark:text-white"
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
      cell: ({ row }) => {
        return (
          <p>
            {row?.original?.full_name} <span className="text-gray-500 text-xs ml-4">({row?.original?.exchange})</span>
          </p>
        )
      },
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

  const { data: portfolioData, refetch: refetchPortfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: getTradesAndOrders,
    refetchInterval: isMarketLive ? 10000 : 60000,
  })
  const { data: portfolioStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['portfolio-stats'],
    queryFn: getUserPortfolioStats,
    refetchInterval: isMarketLive ? 10000 : 60000,
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
      <div className="search-bar">
        <SearchBar />
      </div>

      <Breadcrumb className="px-4 ">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/app/home">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="cursor-pointer">Portfolio</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
            {(!portfolioData?.data?.intraday || portfolioData?.data?.intraday?.length === 0) &&
              (!portfolioData?.data?.delivery || portfolioData?.data?.delivery?.length === 0) &&
              (!portfolioData?.data?.open_orders || portfolioData?.data?.open_orders?.length === 0) && (
                <div className="flex justify-center items-center p-8 glass-card rounded-2xl text-muted-foreground mt-4">
                  <p>no trades or holdings or open orders to show</p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  )
}

export default Portfolio
