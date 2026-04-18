import { useQuery } from '@tanstack/react-query'
import SearchBar from '../../components/dashboard/SearchBar'
import { getUserAnalytics, getUserPortfolioStats, downloadUserAnalyticsReport } from './actions'
import PnlBarChart from '../../components/dashboard/PnlBarChart'
import TradeRankingsTable from '../../components/dashboard/TradeRankingsTable'
import DistributionPieChart from '../../components/dashboard/DistributionPieChart'
import ConsistencyHeatmap from '../../components/dashboard/ConsistencyHeatmap'
import { AlertTriangle, Download, Loader2 } from 'lucide-react'
import ProfolioOverview from '../../components/dashboard/PortfolioOverview'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'

const SkeletonCard = ({ className = '' }) => (
  <div className={`glass-card rounded-2xl p-4 animate-pulse flex flex-col gap-3 min-h-[160px] ${className}`}>
    <div className="h-3.5 bg-slate-200 rounded w-1/3" />
    <div className="flex-1 bg-slate-100 rounded-xl" />
  </div>
)

const Analytics = () => {
  const [isDownloading, setIsDownloading] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['userAnalytics'],
    queryFn: getUserAnalytics,
  })

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true)
      await downloadUserAnalyticsReport()
      toast.success('Report downloaded successfully')
    } catch (error) {
      toast.error('Failed to download report')
    } finally {
      setIsDownloading(false)
    }
  }

  const {
    data: portfolioStats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    refetch: refetchPortfolioStats,
  } = useQuery({
    queryKey: ['portfolio-stats'],
    queryFn: getUserPortfolioStats,
    // refetchInterval: 5000,
  })

  const ad = data?.data // analytics data shorthand

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="glass-bg sticky w-full top-0 py-2 z-50">
          <SearchBar />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <SkeletonCard className="xl:col-span-3" />
          <SkeletonCard className="xl:col-span-2" />
          <SkeletonCard className="xl:col-span-1" />
          <SkeletonCard className="xl:col-span-3" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 space-y-4">
        <div className="glass-bg sticky w-full top-0 py-2 z-50">
          <SearchBar />
        </div>
        <div className="glass-card rounded-2xl flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center p-8">
          <AlertTriangle className="text-red-400" size={36} />
          <p className="text-slate-600 font-semibold text-lg">Failed to load analytics</p>
          <p className="text-slate-400 text-sm">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="p-4 space-y-4">
      <div className="glass-bg sticky w-full top-0 py-2 z-50">
        <SearchBar />
      </div>

      {/* Page title */}
      {portfolioStats && (
        <ProfolioOverview data={portfolioStats?.data} loadingState={isLoadingStats} showAnalysisButton={false} />
      )}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-bold text-slate-700">Trade Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">Insights across all your closed trades</p>
        </div>
        <Button
          onClick={handleDownloadReport}
          disabled={isDownloading}
          variant="outline"
          className="w-fit text-white hover:text-white ml-auto h-10 rounded-xl text-md mt-1 primary-gradient cursor-pointer"
        >
          {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          <span className="hidden sm:inline">Download Report</span>
        </Button>
      </div>

      {/* ── ROW 1: Heatmap full width ── */}
      <ConsistencyHeatmap data={ad?.consistency_heatmap} />

      {/* ── ROW 2: PnL chart + Distribution (2:1) ── */}
      <div className="grid grid-cols-1  gap-4">
        <div className="xl:col-span-1">
          <PnlBarChart data={ad?.pnl_bar_chart} />
        </div>
        <div className="xl:col-span-1">
          <DistributionPieChart data={ad?.distribution_pie_chart} />
        </div>
      </div>

      {/* ── ROW 3: Rankings full width ── */}
      <TradeRankingsTable data={ad?.trade_rankings_table} />
    </div>
  )
}

export default Analytics
