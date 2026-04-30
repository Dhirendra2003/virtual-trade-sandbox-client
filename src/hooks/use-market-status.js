import { useQuery } from '@tanstack/react-query'
import { getMarketStatus } from '@/pages/dashboard/actions.js'

const MARKET_STATUS_QUERY_KEY = ['marketStatus']

export const useMarketStatus = () => {
  const query = useQuery({
    queryKey: MARKET_STATUS_QUERY_KEY,
    queryFn: getMarketStatus,
    refetchInterval: 1000 * 30,
    staleTime: 1000 * 30,
  })

  return {
    ...query,
    marketStatus: query.data,
    isMarketLive: query.data?.isMarketOpen,
  }
}
