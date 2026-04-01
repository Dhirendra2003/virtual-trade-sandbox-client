import { Spinner } from '@/components/ui/spinner'
import { IoIosInformationCircle } from 'react-icons/io'
import { Button } from '@/components/ui/Button'
import { Landmark, LandmarkIcon, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const ProfolioOverview = ({ data, loadingState, title = '' }) => {
  const totalValuation = (data?.current_funds + data?.total_invested).toLocaleString().split('.')
  return (
    <div>
      {/* <h2 className="text-md font-bold text-white primary-gradient w-fit px-3 pt-2 pb-6  rounded-t-xl">{title}</h2> */}

      <div className="overflow-hidden rounded-2xl grid grid-cols-3 gap-2 border relative -top-5 col-span-2  h-full p-2">
        {loadingState ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="size-8" color="purple" />
          </div>
        ) : (
          <>
            <div className="glass-card p-4 rounded-3xl">
              <h3 className=" text-neutral-600 uppercase tracking-widest text-xs mb-1 ">Total Valuation</h3>
              <p className="text-3xl font-black ">
                ₹ {totalValuation[0]}
                <span className="text-lg font-thin text-neutral-400 ml-[3px]">.{totalValuation[1]}</span>
              </p>

              <div className="flex gap-8 items-center mt-4">
                <div>
                  <p className="text-neutral-600 uppercase tracking-wider text-xs mb-0">Avaliable cash</p>
                  <p className="text-lg font-semibold text-neutral-800">₹ {data?.current_funds.toLocaleString()}</p>
                </div>
                <Button size="sm" className="py-3 rounded-lg font-semibold text-sm  primary-gradient cursor-pointer">
                  {' '}
                  Add Funds
                </Button>
              </div>
              {/* <IoIosInformationCircle className="w-6 h-6" color="grey" /> */}
            </div>
            <div className="glass-card p-5 rounded-3xl flex flex-col">
              <div className="flex justify-between">
                <div>
                  <h3 className=" text-neutral-600 uppercase tracking-widest text-xs  ">Invested Value</h3>
                  <p className="text-2xl font-black ">
                    ₹ {data?.total_invested.toLocaleString().split('.')[0]}
                    <span className="text-lg font-thin text-neutral-400 ml-[3px]">
                      .{data?.total_invested.toLocaleString().split('.')[1]}
                    </span>
                  </p>
                </div>
                <div className="rounded-full flex items-center justify-center bg-purple-200 w-10 h-10">
                  <LandmarkIcon size={20} color="#9810fa" />
                </div>
              </div>

              <div className="flex gap-8 items-center mt-auto">
                <div>
                  <p className="text-neutral-600 uppercase tracking-wider text-xs mb-0">Intraday </p>
                  <p className="text-lg font-semibold text-neutral-800">₹ {data?.current_funds.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-neutral-600 uppercase tracking-wider text-xs mb-0">Delivery </p>
                  <p className="text-lg font-semibold text-neutral-800">₹ {data?.current_funds.toLocaleString()}</p>
                </div>
              </div>
              {/* <IoIosInformationCircle className="w-6 h-6" color="grey" /> */}
            </div>
            <p>Total Invested: {data?.total_invested}</p>
            <p>Total Current Value: {data?.total_current_value}</p>
            <p>Unrealized P&L: {data?.unrealized_pnl}</p>
            <p>Overall P&L: {data?.overall_pnl}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfolioOverview
