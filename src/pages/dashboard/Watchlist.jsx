import Chart from '../../components/dashboard/Chart'
import SearchBar from '../../components/dashboard/SearchBar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import BuySellWindow from '../../components/dashboard/BuySellWindow'
import WatchlistTable from '../../components/dashboard/WatchlistTable'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getUserWatchlist, removeFromWatchlist } from './actions.js'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ListX, SquareArrowOutUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Watchlist = () => {
  const navigate = useNavigate()
  const removeFromWatchlistMutation = useMutation({
    mutationFn: instrument_key => removeFromWatchlist(instrument_key),
    onSuccess: data => {
      console.log(data)
      refetchWatchlist()
    },
  })
  const [selectedStock, setSelectedStock] = useState(null)
  const columns = [
    {
      accessorKey: 'Stock.trading_symbol',
      header: 'Symbol',
    },
    {
      accessorKey: 'Stock.name',
      header: 'Stock Name',
    },
    {
      accessorKey: 'Stock.segment',
      header: 'Segment',
    },
    {
      accessorKey: '-',
      header: 'Actions',
      cell: ({ row }) => {
        const instrument_key = row.original.Stock.instrument_key
        return (
          <div className="flex gap-4 items-center justify-center">
            <Tooltip>
              <TooltipTrigger
                onClick={e => {
                  e.preventDefault()
                  navigate(`/app/stock/${instrument_key}`)
                }}
                className={`cursor-pointer hover:bg-green-200 hover:scale-105 transition-all duration-200 h-9 w-9 flex items-center justify-center  bg-white shadow-md shadow-black/10 p-1.5 rounded-lg`}
                disabled={removeFromWatchlistMutation.isPending}
              >
                <SquareArrowOutUpRight className="w-4 h-4" color="green" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to Trade</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                onClick={e => {
                  e.preventDefault()
                  removeFromWatchlistMutation.mutate(instrument_key)
                }}
                className={`cursor-pointer hover:scale-105 transition-all duration-200 h-9 w-9 flex items-center justify-center hover:bg-red-200 bg-white shadow-md shadow-black/10 p-1.5 rounded-lg`}
                disabled={removeFromWatchlistMutation.isPending}
              >
                <ListX className="w-4 h-4" color="red" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove from Watchlist</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
  ]

  const {
    data: watchlistData,
    isLoading,
    isError,
    refetch: refetchWatchlist,
  } = useQuery({
    queryKey: ['watchlist'],
    queryFn: getUserWatchlist,
  })

  useEffect(() => {
    // React Query v5 removed `onSuccess` from `useQuery`.
    // The correct way to handle side-effects from fetched data is in a useEffect:
    if (watchlistData?.data?.length > 0) {
      const defaultStock = watchlistData.data[0].Stock.instrument_key
      console.log('### Setting default stock:', defaultStock)
      setSelectedStock(defaultStock)
    } else if (watchlistData?.data?.length === 0) {
      setSelectedStock(null)
    }
  }, [watchlistData])

  return (
    <div className="p-2 space-y-4 ">
      <div className="glass-bg sticky w-full top-0 py-2 z-50 ">
        <SearchBar />
      </div>
      <div className="grid grid-cols-4 gap-2  w-full items-center">
        <Chart zoomEnabled={false} stockId={selectedStock} className=" rounded-2xl overflow-hidden " />
        {watchlistData && (
          <WatchlistTable
            columns={columns}
            data={watchlistData?.data}
            setSelectedStock={setSelectedStock}
            selectedStock={selectedStock}
            loadingState={removeFromWatchlistMutation?.isPending}
          />
        )}
      </div>
    </div>
  )
}

export default Watchlist
