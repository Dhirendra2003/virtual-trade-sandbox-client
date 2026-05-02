import Chart from '../../components/dashboard/Chart'
import SearchBar from '../../components/dashboard/SearchBar'
import WatchlistTable from '../../components/dashboard/WatchlistTable'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getUserWatchlist, removeFromWatchlist } from './actions.js'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ListX, SquareArrowOutUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link } from 'react-router-dom'

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
                className={`cursor-pointer hover:bg-green-200 hover:dark:bg-green-700  hover:scale-105 transition-all duration-200 h-9 w-9 flex items-center justify-center  bg-div-bg-color shadow-md shadow-black/10 p-1.5 rounded-lg`}
                disabled={removeFromWatchlistMutation.isPending}
              >
                <SquareArrowOutUpRight className="w-4 h-4 text-green-500 dark:text-green-400" />
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
                className={`cursor-pointer hover:scale-105 transition-all duration-200 h-9 w-9 flex items-center justify-center
                   hover:bg-red-200 hover:dark:bg-red-700 bg-div-bg-color shadow-md shadow-black/10 p-1.5 rounded-lg`}
                disabled={removeFromWatchlistMutation.isPending}
              >
                <ListX className="w-4 h-4 text-red-500 dark:text-red-400" />
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
      <div className="search-bar">
        <SearchBar />
      </div>

      <Breadcrumb className="px-4 ">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/app/home">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="cursor-pointer">Watchlist</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-4 gap-4  w-full items-start">
        <Chart
          zoomEnabled={false}
          stockId={selectedStock}
          className=" rounded-2xl overflow-hidden h-[calc(100vh-115px)] "
        />
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
