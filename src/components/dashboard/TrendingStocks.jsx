import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { getTredingStocks } from '@/pages/dashboard/actions'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getColors } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils.js'

const StockCard = ({ stock, type }) => {
  const initialLettter = stock.company_name[0].toUpperCase()
  const navigate = useNavigate()
  return (
    <Card
      className="p-3 z-50 border-0   hover:shadow-2xl cursor-pointer transition-all duration-300 ease-in-out  hover:z-50"
      onClick={() => navigate(`/app/stock/${stock.instrument_key}`)}
    >
      <CardContent className="flex items-center gap-2  p-0 overflow-hidden ">
        <div
          className={`${getColors(initialLettter)} w-[2em] h-[2em] rounded-xl text-2xl flex items-center justify-center`}
        >
          {initialLettter}
        </div>
        <div className="max-w-[50%]">
          <p className="text-sm font-medium">{stock?.company_name.toUpperCase()}</p>
          <p className="text-xs text-gray-500">{`Vol ${(Number(stock.volume) / 100000).toFixed(2)} L`}</p>
        </div>
        <div className="ml-auto flex flex-col items-end">
          <p className="text-sm font-bold text-right">₹ {stock?.price.toUpperCase()}</p>
          <div
            className={`text-xs ${type === 'gainers' ? 'text-green-500' : 'text-red-500'} flex items-center gap-1 ml-auto`}
          >
            {type === 'gainers' ? <TrendingUp className={`w-3 h-3 mr-2`} /> : <TrendingDown className={`w-3 h-3 `} />} %{' '}
            {stock.percent_change}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const TrendingStocks = ({ type = 'gainers' }) => {
  const [all, setAll] = useState(false)
  const { data } = useQuery({
    queryKey: ['treding-stocks'],
    queryFn: getTredingStocks,
    staleTime: 1000 * 60 * 30,
  })

  // Group our stocks list depending on the prop
  const stocksList = type === 'gainers' ? data?.data?.top_gainers : data?.data?.top_losers
  const top3 = stocksList?.slice(0, 3) || []
  const extraStocks = stocksList?.slice(3, 10) || []

  return (
    <div className="flex flex-col w-full h-full glass-card p-4 rounded-2xl gap-2">
      <div className="flex justify-between items-center py-2">
        <h3 className="text-md font-bold flex items-center gap-2">
          {type === 'gainers' ? <TrendingUp color="green" /> : <TrendingDown color="red" />}
          {type === 'gainers' ? 'Top Gainers' : 'Top Losers'}
        </h3>
        <Button onClick={() => setAll(!all)} className="rounded-xl text-purple-800 dark:text-purple-500" variant="link">
          {all ? 'View Less' : 'View All'}
        </Button>
      </div>

      {/* Always visible top 3 items */}
      {top3.map(stock => (
        <StockCard key={stock.instrument_key} stock={stock} type={type} />
      ))}

      {/* Hidden remaining items animated open smoothly using CSS grid rows */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
          all ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className={cn(' flex flex-col gap-1', { 'overflow-hidden': !all })}>
          {extraStocks.map(stock => (
            <StockCard key={stock.instrument_key} stock={stock} type={type} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrendingStocks
