import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import { getStockInfo } from '../../pages/dashboard/actions'
import ShareholdingChart from './ShareholdingChart'
import StockNews from './StockNews'
import SkeletonMaker from '../common/Skeleton'
import Riskometer from './Riskometer'

const StockDetails = () => {
  const stock = useSelector(state => state.stock)
  const stockSymbol = stock?.stock?.trading_symbol
  const { data, isLoading, error } = useQuery({
    queryKey: ['stock-info', stockSymbol],
    queryFn: () => getStockInfo(stockSymbol),
    enabled: !!stockSymbol,
    staleTime: 1000 * 60 * 60,
    placeholderData: data => data,
  })
  const [showMore, setShowMore] = useState(false)

  if (isLoading) return <SkeletonMaker type="stockDetails" />

  return (
    <>
      {(data?.data?.companyDescription || data?.data?.companyName) && (
        <div className="md:grid md:grid-cols-4 flex flex-col  justify-center gap-4 my-4 w-full">
          <div
            className={`glass-card p-2 rounded-2xl  col-span-3 ${data?.data?.riskMeter ? 'col-span-3' : 'col-span-4'}`}
          >
            <h3 className="flex items-center justify-between text-md pl-2 font-bold text-title-text-color">
              {data?.data?.companyName}
              <p className="text-sm  font-normal p-2">Industry:{data?.data?.industry}</p>
            </h3>

            <p
              className={`text-sm text-slate-600 dark:text-slate-400  m-2 ${showMore ? '' : 'line-clamp-2 leading-snug'}`}
            >
              {data?.data?.companyDescription || 'No Data Available'}
            </p>
            <button
              onClick={() => setShowMore(s => !s)}
              className="text-xs text-purple-600 font-semibold px-2 pb-2 hover:underline self-start"
            >
              {showMore ? 'Show less ▲' : 'Show more ▼'}
            </button>
          </div>

          {data?.data?.riskMeter && (
            <div className="glass-card w-full p-2 rounded-2xl mx-auto">
              <Riskometer categoryName={data?.data?.riskMeter?.categoryName} stdDev={data?.data?.riskMeter?.stdDev} />
            </div>
          )}
        </div>
      )}
      {data?.data?.peerCompanyList?.length > 0 && (
        <div className="glass-card p-2 rounded-2xl my-4 space-y-2">
          <h3 className="text-md pl-2 font-bold text-title-text-color">Peer companies</h3>
          <div className="grid grid-cols-5 ">
            {/* map peerCompanyList */}
            {data?.data?.peerCompanyList?.map((peer, index) => (
              <div key={index} className="flex  flex-col items-center justify-start gap-2 ">
                <img
                  src={peer?.imageUrl}
                  className="md:h-17 md:w-17 h-14 w-14 object-contain rounded-full shadow-md border-2"
                  alt={peer?.companyName}
                />
                <p className="text-xs capitalize text-center">{peer?.companyName}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {data?.data?.shareholding?.length > 0 && <ShareholdingChart shareholding={data?.data?.shareholding ?? []} />}

      {data?.data?.recentNews?.length > 0 && (
        <div className="w-full glass-card p-2 rounded-2xl my-4 flex flex-col items-center justify-center ">
          <h3 className="text-md font-bold text-left w-full">Recent News</h3>
          <StockNews news={data?.data?.recentNews ?? []} />
        </div>
      )}
    </>
  )
}

export default StockDetails
