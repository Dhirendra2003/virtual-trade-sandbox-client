import { Button } from '@/components/ui/Button'
import { FaChartPie } from 'react-icons/fa'

import { ListPlus, ListX, TrendingUp } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { addToWatchlist, removeFromWatchlist } from '@/pages/dashboard/actions'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { setStock } from '../../store/slices/stockSlice'
import { Spinner } from '@/components/ui/spinner'

const BuySellWindow = () => {
  const stock = useSelector(state => state.stock)
  const dispatch = useDispatch()
  const addToWatchlistMutation = useMutation({
    mutationFn: () => addToWatchlist(stock?.stock?.instrument_key),
    onSuccess: data => {
      toast.success('Stock added to watchlist!')
      dispatch(setStock({ ...stock?.stock, isAddedToWatchlist: true }))
    },
  })
  const removeFromWatchlistMutation = useMutation({
    mutationFn: () => removeFromWatchlist(stock?.stock?.instrument_key),
    onSuccess: data => {
      toast.success('Stock removed from watchlist!')
      dispatch(setStock({ ...stock?.stock, isAddedToWatchlist: false }))
    },
  })
  return (
    <div className="col-span-1 h-full glass-card p-3 rounded-2xl overflow-hidden">
      <div className="flex  justify-between items-start">
        <div>
          <p className="text-xs text-slate-500">Symbol</p>
          <h3 className="text-md font-bold mb-2 text-slate-600 ">{stock?.stock?.trading_symbol}</h3>
        </div>

        {!stock?.stock?.isAddedToWatchlist ? (
          <Tooltip>
            <TooltipTrigger
              onClick={e => {
                e.preventDefault()
                addToWatchlistMutation.mutate()
              }}
              className={`cursor-pointer hover:scale-105 transition-all duration-200 h-9 w-9 flex items-center justify-center ${true ? 'primary-gradient' : 'outline'} p-1.5 rounded-lg`}
            >
              {addToWatchlistMutation.isPending ? (
                <Spinner color="white" />
              ) : (
                <ListPlus className="w-4 h-4" color="white" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to Watchlist</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger
              onClick={e => {
                e.preventDefault()
                removeFromWatchlistMutation.mutate()
              }}
              className={`cursor-pointer hover:scale-105 transition-all duration-200 h-9 w-9 flex items-center justify-center ${true ? 'bg-red-500' : 'outline'} p-1.5 rounded-lg`}
            >
              {removeFromWatchlistMutation.isPending ? (
                <Spinner color="white" />
              ) : (
                <ListX className="w-4 h-4" color="white" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove from Watchlist</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-800">
        ₹ {stock?.latestPrice?.toFixed(2).toLocaleString()}{' '}
      </h1>
      <span className="flex gap-2 text-xs items-center font-semibold text-green-600">
        <TrendingUp className="w-3 " />
        <p>+ ₹ {(12500.59).toLocaleString()} (2.5%) Today</p>
      </span>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex w-full justify-between">
          <Button className="rounded-xl p-6  border-blue-500 text-blue-600 w-[48%]" variant="outline">
            Buy
          </Button>
          <Button className="rounded-xl p-6  border-blue-500 text-blue-600 w-[48%]" variant="outline">
            Sell
          </Button>
        </div>
        <div className="flex  items-center justify-start gap-3 p-3 rounded-xl bg-white shadow-md shadow-black/10">
          <FaChartPie className="w-5 " color="#3B82F6" />
          <p className="text-sm">Active Trades</p>
          <h3 className="ml-auto text-lg font-bold">18</h3>
        </div>
      </div>
    </div>
  )
}

export default BuySellWindow
