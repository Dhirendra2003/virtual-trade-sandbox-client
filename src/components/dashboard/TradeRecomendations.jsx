import React from 'react'
import { getDailyRecommendations } from '../../pages/dashboard/actions'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getColors } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils.js'
import { PiStarFourFill } from 'react-icons/pi'

const StockCard = ({ stock }) => {
  const initialLettter = stock?.name[0].toUpperCase()
  const navigate = useNavigate()
  return (
    <Card
      className="p-3 z-50  border border-purple-400 hover:shadow-2xl cursor-pointer transition-all duration-300 ease-in-out  hover:z-50"
      onClick={() => navigate(`/app/stock/${stock?.instrument_key}`)}
    >
      <CardContent className="flex flex-col items-center gap-2  p-0 overflow-hidden ">
        <div className="flex w-full items-center gap-1 justify-between">
          <div
            className={`${getColors(initialLettter)} w-[2em] h-[2em] rounded-xl text-2xl flex items-center justify-center`}
          >
            {initialLettter}
          </div>
          <div className="max-w-[50%]">
            <p className="text-sm font-medium">{stock?.name.toUpperCase()}</p>
            <p className="text-xs text-gray-500">{stock?.instrument_key}</p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <p className="text-xs font-bold text-right text-green-600"> BUY @ ₹ {stock?.buyPrice}</p>
            <p className="text-xs font-bold text-right text-green-600"> TARGET @ ₹ {stock?.targetPrice}</p>
            <p className="text-xs font-bold text-right text-red-600"> STOPLOSS @ ₹ {stock?.stopLoss}</p>
          </div>
        </div>
        <div className={`text-xs flex font-thin text-neutral-700 items-center gap-1 ml-auto`}>
          {stock?.technicalAnalysis}
        </div>
      </CardContent>
    </Card>
  )
}

const TradeRecomendations = () => {
  const [all, setAll] = useState(false)
  const { data, isLoading, error } = useQuery({
    queryKey: ['daily-recommendations'],
    queryFn: getDailyRecommendations,
    enabled: true,
    staleTime: 1000 * 60 * 30,
  })
  const top3 = data?.data?.slice(0, 2) || []
  const extraStocks = data?.data?.slice(2, 10) || []
  return (
    <div className="flex flex-col w-full h-full glass-card p-4 rounded-2xl gap-2">
      <div className="flex justify-between items-center py-2">
        <h3 className="text-md font-bold flex items-center gap-2">
          <PiStarFourFill color="#8b5cf6" />
          AI Trade Recomendations
        </h3>
        <Button onClick={() => setAll(!all)} className="rounded-xl text-purple-800" variant="link">
          {all ? 'View Less' : 'View All'}
        </Button>
      </div>

      {/* Always visible top 3 items */}
      {top3.map(stock => (
        <StockCard key={stock?.instrument_key} stock={stock} />
      ))}

      {/* Hidden remaining items animated open smoothly using CSS grid rows */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
          all ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className={cn(' flex flex-col gap-1', { 'overflow-hidden': !all })}>
          {extraStocks.map(stock => (
            <StockCard key={stock?.instrument_key} stock={stock} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TradeRecomendations
