import { Button } from '@/components/ui/Button'
import { FaChartPie } from 'react-icons/fa'
import { IoIosInformationCircle } from 'react-icons/io'
import { ArrowUpRight, Landmark, TrendingDown, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getUserPortfolioStats } from '../../pages/dashboard/actions'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

const PortFolioWindow = () => {
  const navigate = useNavigate()
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
  return (
    <div className="col-span-1 h-full glass-card p-4 rounded-2xl overflow-hidden">
      <div className="flex  justify-between items-start">
        <h3 className="text-md font-bold mb-2 ">Portfolio Value</h3>
        <IoIosInformationCircle className="w-6 h-6" color="grey" />
      </div>
      <h1 className="text-3xl font-black tracking-tight text-slate-800">
        ₹ {portfolioStats && (portfolioStats?.data?.total_current_value).toLocaleString()}
      </h1>
      <span className="flex gap-2  items-center font-medium text-green-600">
        <p
          className={cn(
            'text-sm flex items-center gap-2  ',
            portfolioStats && portfolioStats?.data?.unrealized_pnl > 0 ? 'text-green-600' : 'text-red-500'
          )}
        >
          <p>₹ {portfolioStats && (portfolioStats?.data?.unrealized_pnl).toLocaleString()} </p>
          <span
            className={cn(
              'flex items-center gap-0.5 tracking-tight',
              portfolioStats && portfolioStats?.data?.unrealized_pnl > 0 ? 'text-green-600' : 'text-red-500'
            )}
          >
            (
            {portfolioStats && portfolioStats?.data?.unrealized_pnl > 0 ? (
              <TrendingUp className="w-3" />
            ) : (
              <TrendingDown className="w-3" />
            )}
            {portfolioStats &&
              ((portfolioStats?.data?.unrealized_pnl / portfolioStats?.data?.total_invested) * 100).toFixed(2)}
            %)
          </span>
        </p>
      </span>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex  items-center justify-start gap-3 p-3 rounded-xl bg-white shadow-md shadow-black/10">
          <Landmark className="w-4 " color="#4B50F0" />
          <p className="text-sm">Buying Power</p>
          <h3 className="ml-auto text-lg font-bold">₹ {portfolioStats && portfolioStats?.data?.current_funds}</h3>
        </div>
        <div className="flex  items-center justify-start gap-3 p-3 rounded-xl bg-white shadow-md shadow-black/10">
          <FaChartPie className="w-5 " color="#3B82F6" />
          <p className="text-sm">Active Trades</p>
          <h3 className="ml-auto text-lg font-bold">18</h3>
        </div>
        <div className="flex gap-2 justify-between">
          <Button
            className=" p-6 w-1/2  h-10 rounded-xl text-md mt-1 primary-gradient cursor-pointer"
            onClick={() => navigate('/app/portfolio')}
          >
            Portfolio <ArrowUpRight />
          </Button>
          <Button
            className="rounded-xl p-6 w-1/2 bg-gray-100 text-blue-600 cursor-pointer"
            onClick={() => navigate('/app/analytics')}
            variant="outline"
          >
            Your Analysis <ArrowUpRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PortFolioWindow
