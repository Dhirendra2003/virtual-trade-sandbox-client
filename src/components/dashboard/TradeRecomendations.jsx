import React from 'react'
import { getDailyRecommendations } from '../../pages/dashboard/actions'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { useMemo, useState } from 'react'
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
      className="p-3 z-50  border border-purple-400/50 hover:shadow-2xl cursor-pointer transition-all duration-300 ease-in-out  hover:z-50"
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
            <p className="text-xs font-bold text-right text-title-text-color"> BUY @ ₹ {stock?.buyPrice}</p>
            <p className="text-xs font-bold text-right text-green-600 dark:text-green-500">
              {' '}
              TARGET @ ₹ {stock?.targetPrice}
            </p>
            <p className="text-xs font-bold text-right text-red-600 dark:text-red-500">
              {' '}
              STOPLOSS @ ₹ {stock?.stopLoss}
            </p>
          </div>
        </div>
        <div className={`text-xs flex font-thin text-neutral-700 dark:text-neutral-400 items-center gap-1 ml-auto`}>
          {stock?.technicalAnalysis}
        </div>
      </CardContent>
    </Card>
  )
}

const TradeRecomendations = () => {
  const [all, setAll] = useState(false)
  const { data, isError, isLoading } = useQuery({
    queryKey: ['daily-recommendations'],
    queryFn: getDailyRecommendations,
    staleTime: Infinity,   // never re-fetch once data is loaded
    gcTime: Infinity,      // keep in cache for the session
    retry: false,          // don't retry on error
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  const recommendations = useMemo(() => data?.data ?? [], [data?.data])
  const top3 = useMemo(() => recommendations.slice(0, 2), [recommendations])
  const extraStocks = useMemo(() => recommendations.slice(2, 10), [recommendations])

  return (
    <div className="flex flex-col w-full h-full glass-card p-4 rounded-2xl gap-2">
      <div className="flex justify-between items-center py-2">
        <h3 className="text-md font-bold flex items-center gap-2">
          <PiStarFourFill color="#8b5cf6" />
          AI Trade Recomendations
        </h3>
        {!isError && !isLoading && (
          <Button onClick={() => setAll(!all)} className="rounded-xl text-purple-800 dark:text-purple-500" variant="link">
            {all ? 'View Less' : 'View All'}
          </Button>
        )}
      </div>

      {isError ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 py-6 text-center">
          <PiStarFourFill size={28} color="#6b7280" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Unable to generate recommendations
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            AI suggestions are temporarily unavailable. Try again later.
          </p>
        </div>
      ) : (
        <>
          {/* Always visible top items */}
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
        </>
      )}
    </div>
  )
}

export default TradeRecomendations

