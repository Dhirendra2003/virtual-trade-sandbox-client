import SearchBar from '../../components/dashboard/SearchBar'
import { useQuery } from '@tanstack/react-query'
import { getUserTradeHistory } from './actions.js'

const TradeHistory = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-trade-history'],
    queryFn: () => getUserTradeHistory(),
    enabled: true,
  })
  return (
    <div className="p-2 space-y-4 ">
      <div className="glass-bg sticky w-full top-0 py-2 z-50 ">
        <SearchBar />
      </div>

      <div className="grid grid-cols-3 gap-4 min-h-[50vh] w-full items-center">
        <h1>test use history</h1>
      </div>
    </div>
  )
}

export default TradeHistory
