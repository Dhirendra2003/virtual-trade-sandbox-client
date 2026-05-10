import { Button } from '@/components/ui/button'
import { FaChartPie } from 'react-icons/fa'

import { ArrowRight, ListPlus, ListX, TrendingDown, TrendingUp } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { addToWatchlist, removeFromWatchlist } from '@/pages/dashboard/actions'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { setStock } from '../../store/slices/stockSlice'
import { Spinner } from '@/components/ui/spinner'
import { registerTrade } from '../../pages/dashboard/actions.js'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import AlertTradeSummary from '@/components/dashboard/AlertTradeSummary'

const BuySellWindow = () => {
  const [tradeType, setTradeType] = useState('buy')
  const [tradeDuration, setTradeDuration] = useState('intraday')
  const [quantity, setQuantity] = useState(0)
  const stock = useSelector(state => state.stock)
  const stockPriceChange = Number(stock?.LTPdata?.change)?.toFixed(2)
  const stockPriceChangePerc = Number(stock?.LTPdata?.change_percent)?.toFixed(2)

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
  const registerTradeMutation = useMutation({
    mutationFn: ({ instrument_key, trade_type, trade_duration, quantity }) =>
      registerTrade({ instrument_key, trade_type, trade_duration, quantity }),
    onSuccess: data => {
      toast.success('Trade registered successfully!')
    },
  })

  const PlaceOrderButtonWithMutation = () => {
    return (
      <Button
        // disabled={!formikLogin.isValid}
        className="h-10 w-full bg-red-300 rounded-xl text-md  primary-gradient cursor-pointer text-white  px-0 mx-0"
        type="submit"
        onClick={() =>
          registerTradeMutation.mutate({
            instrument_key: stock?.stock?.instrument_key,
            trade_type: tradeType,
            trade_duration: tradeDuration,
            quantity: quantity,
          })
        }
      >
        Place Order <ArrowRight />
      </Button>
    )
  }
  return (
    <div className="col-span-1 glass-card lg:p-4 md:p-2 p-3 rounded-2xl">
      <div className="flex  justify-between items-start">
        <div>
          <p className="text-xs text-faded-bold-text">Symbol</p>
          <h3 className="text-md font-bold mb-2 text-title-text-color ">{stock?.stock?.trading_symbol}</h3>
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
      <div>
        <h1 className="text-3xl md:text-2xl font-bold tracking-tight text-title-text-color">
          ₹ {stock?.latestPrice?.toFixed(2).toLocaleString()}{' '}
        </h1>
        <span
          className={`flex gap-2 text-xs items-center font-semibold ${stockPriceChange > 0 ? 'text-main-green' : '  text-main-red'}`}
        >
          {stockPriceChange > 0 ? <TrendingUp className="w-3 " /> : <TrendingDown className="w-3 " />}
          <p>
            + ₹ {stockPriceChange.toLocaleString()} ({stockPriceChangePerc}%) Today
          </p>
        </span>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        {/* trade type */}
        <div>
          <label htmlFor="trade-type" className="text-xs md:hidden lg:block lg:py-1 text-faded-bold-text">
            Trade Type
          </label>
          <div id="trade-type" className="flex w-full justify-between bg-sidebar-border p-2 rounded-2xl">
            <Button
              className={cn(
                'rounded-xl p-4  border-blue-300 hover:bg-purple-800 hover:text-white text-blue-600 w-[48%]',
                tradeType === 'buy' && 'primary-gradient text-white'
              )}
              variant="outline"
              onClick={() => setTradeType('buy')}
            >
              Buy
            </Button>
            <Button
              className={cn(
                'rounded-xl p-4  border-blue-300 hover:bg-purple-800 hover:text-white text-blue-600 w-[48%]',
                tradeType === 'sell' && 'primary-gradient text-white'
              )}
              variant="outline"
              onClick={() => setTradeType('sell')}
            >
              Sell
            </Button>
          </div>
        </div>
        {/* trade duration */}
        <div>
          <label htmlFor="trade-duration" className="text-xs text-faded-bold-text md:hidden lg:block lg:py-1">
            Trade Duration
          </label>
          <div id="trade-duration" className="flex w-full justify-between bg-sidebar-border p-2 rounded-2xl">
            <Button
              className={cn(
                'rounded-xl p-4  border-blue-300 hover:bg-purple-800 hover:text-white text-blue-600 w-[48%]',
                tradeDuration === 'intraday' && 'primary-gradient text-white'
              )}
              variant="outline"
              onClick={() => setTradeDuration('intraday')}
            >
              Intraday
            </Button>
            <Button
              className={cn(
                'rounded-xl p-4  border-blue-300 hover:bg-purple-800 hover:text-white text-blue-600 w-[48%]',
                tradeDuration === 'delivery' && 'primary-gradient text-white'
              )}
              variant="outline"
              onClick={() => setTradeDuration('delivery')}
            >
              Delivery
            </Button>
          </div>
        </div>
        <div className="">
          <label htmlFor="quantity" className="text-xs text-faded-bold-text md:hidden lg:block lg:py-1">
            Quantity
          </label>
          <div id="quantity" className="flex  w-full items-center justify-between bg-div-bg-color p-1 rounded-2xl">
            <Button
              className={cn(
                'rounded-xl p-4 text-2xl border-blue-300 hover:bg-purple-800 hover:text-white text-blue-600 dark:text-blue-300 '
              )}
              variant="outline"
              onClick={() => setQuantity(quantity > 0 ? quantity - 1 : 0)}
              disabled={quantity === 0}
            >
              -
            </Button>
            <Input
              // type="number"
              value={quantity}
              onChange={e => {
                if (e.target.value === '') {
                  setQuantity(0)
                } else if (Number(e.target.value) > 0) {
                  setQuantity(Number(e.target.value))
                }
              }}
              className="text-lg w-full mx-4 text-center border-none outline-none focus:border-none focus:outline-none"
            />
            <Button
              className={cn(
                'rounded-xl p-4  text-2xl border-blue-300 hover:bg-purple-800 hover:text-white text-blue-600 dark:text-blue-300'
              )}
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>

        <AlertTradeSummary
          data={{
            tradeType,
            tradeDuration,
            quantity,
            stockSymbol: stock?.stock?.trading_symbol,
            stockName: stock?.stock?.name,
            price: stock?.latestPrice,
          }}
          button={<PlaceOrderButtonWithMutation />}
          disabled={quantity === 0}
        />
      </div>
    </div>
  )
}

export default BuySellWindow
