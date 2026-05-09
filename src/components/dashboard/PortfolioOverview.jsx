import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { LandmarkIcon, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TbPlusMinus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

const OverviewCard = ({ children, className, colSpan = 'md:col-span-2 col-span-1' }) => (
  <div
    className={cn(colSpan, ' glass-card p-4 rounded-3xl flex flex-col max-h-40 min-h-38 justify-between', className)}
  >
    {children}
  </div>
)

const Label = ({ children, className }) => (
  <h3 className={cn('text-faded-bold-text uppercase tracking-widest text-xs', className)}>{children}</h3>
)

const SubLabel = ({ children, className }) => (
  <p className={cn('text-faded-bold-text uppercase tracking-wider text-xs mb-0', className)}>{children}</p>
)

const FormattedAmount = ({ amount, decimalClassName }) => {
  const safeAmount = amount || 0
  const [whole, decimal] = safeAmount.toLocaleString().split('.')

  return (
    <>
      ₹ {whole}
      <span className={cn('text-lg font-thin text-neutral-400', decimalClassName)}>.{decimal || '00'}</span>
    </>
  )
}

const ProfolioOverview = ({ data, loadingState, title = '', showAnalysisButton = true }) => {
  const navigate = useNavigate()
  const totalValuation = (data?.current_funds || 0) + (data?.total_invested || 0)

  return (
    <div>
      {/* <h2 className="text-md font-bold text-white primary-gradient w-fit px-3 pt-2 pb-6  rounded-t-xl">{title}</h2> */}

      <div className="  grid md:grid-cols-7 grid-cols-1 gap-4 mb-4">
        {loadingState ? (
          <div className="flex items-center justify-center h-full col-span-7">
            <Spinner className="size-8" color="purple" />
          </div>
        ) : (
          <>
            <OverviewCard>
              <Label className="mb-1">Net Worth</Label>
              <p className="text-3xl font-black text-main-green tracking-tight">
                <FormattedAmount amount={totalValuation} decimalClassName="ml-[3px]" />
              </p>

              <div className="flex justify-between items-center mt-auto">
                <div>
                  <SubLabel>Avaliable cash</SubLabel>
                  <p className="text-lg font-semibold text-title-text-color tracking-tight">
                    ₹ {data?.current_funds?.toLocaleString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-10 rounded-lg  font-semibold text-sm primary-gradient cursor-pointer text-white"
                  onClick={() => navigate('/app/add-funds')}
                >
                  Add Funds
                </Button>
              </div>
            </OverviewCard>

            <OverviewCard>
              <div className="flex justify-between ">
                <div>
                  <Label>Current Value</Label>
                  <p className="text-2xl font-black tracking-tight">
                    <FormattedAmount amount={data?.total_current_value} decimalClassName="ml-[3px]" />
                  </p>
                </div>
                <div className="rounded-full flex items-center justify-center bg-selected-bg-purple/50 w-10 h-10">
                  <LandmarkIcon size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>

              <div className="gap-8 items-center">
                <SubLabel>Total Invested</SubLabel>
                <p className="text-lg font-semibold text-title-text-color tracking-tight">
                  ₹ {data?.total_invested?.toLocaleString()}
                </p>
              </div>
            </OverviewCard>

            <OverviewCard colSpan="md:col-span-3 col-span-1">
              <div className="flex justify-between">
                <div>
                  <Label>Unrealized P&L</Label>
                  {data?.total_invested > 0 ? (
                    <p
                      className={cn(
                        'text-2xl flex items-end gap-2 font-bold tracking-tight',
                        data?.unrealized_pnl > 0 ? 'text-main-green' : 'text-main-red'
                      )}
                    >
                      <FormattedAmount amount={data?.unrealized_pnl} decimalClassName="-ml-[5px]" />
                      <span
                        className={cn(
                          'text-xs flex items-center gap-0.5 -mt-1 tracking-tight',
                          data?.unrealized_pnl > 0 ? 'text-main-green' : 'text-main-red'
                        )}
                      >
                        ({data?.unrealized_pnl > 0 ? <TrendingUp className="w-3" /> : <TrendingDown className="w-3" />}
                        {((data?.unrealized_pnl / data?.total_invested) * 100).toFixed(2)}%)
                      </span>
                    </p>
                  ) : (
                    <p className="text-2xl  tracking-tight">--</p>
                  )}
                </div>
                <div className="rounded-full flex items-center justify-center bg-selected-bg-purple/50 w-10 h-10">
                  <TbPlusMinus size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>

              <div className="flex w-full justify-between items-end mt-2">
                <div>
                  <SubLabel>Realized P&L</SubLabel>
                  <div
                    className={cn(
                      'text-lg font-medium flex items-end gap-2 tracking-tight',
                      data?.overall_pnl > 0 ? 'text-main-green' : 'text-main-red'
                    )}
                  >
                    ₹ {data?.overall_pnl?.toLocaleString()}
                    <span
                      className={cn(
                        'text-xs flex font-thin items-center gap-1 -mt-1 0 tracking-tight',
                        data?.overall_pnl > 0 ? 'text-main-green' : 'text-main-red'
                      )}
                    >
                      ({data?.overall_pnl > 0 ? <TrendingUp className="w-3" /> : <TrendingDown className="w-3" />}
                      {(
                        (data?.overall_pnl / (data?.current_funds + data?.total_invested - data?.overall_pnl)) *
                        100
                      ).toFixed(2)}
                      %)
                    </span>
                  </div>
                </div>
                {showAnalysisButton && (
                  <Button
                    className="rounded-xl bg-gray-100 text-blue-600 cursor-pointer"
                    variant="outline"
                    onClick={() => navigate('/app/analytics')}
                  >
                    View Detailed Analysis <ArrowUpRight />
                  </Button>
                )}
              </div>
            </OverviewCard>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfolioOverview
