import SearchBar from '../../components/dashboard/SearchBar'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { downloadUserTradeHistory, getUserTradeHistory } from './actions.js'
import ProfolioTable from '@/components/dashboard/PorfolioTable'
import { getColors } from '@/lib/utils'
import { Download, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import moment from 'moment/moment.js'

const TradeHistory = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-trade-history'],
    queryFn: () => getUserTradeHistory(),
    enabled: true,
  })
  const orderColumns = [
    {
      accessorKey: 'instrument_key',
      header: 'Symbol',
      cell: ({ row }) => {
        const initialLettter = row?.original?.Stock?.trading_symbol[0]
        return (
          <div className="flex items-center gap-2">
            <div
              className={`${getColors(initialLettter)} w-[2em] h-[2em] rounded-xl text-xl flex items-center justify-center`}
            >
              {initialLettter}
            </div>
            <p className="text-xs">{row?.original?.Stock?.trading_symbol}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'trade_type',
      header: 'Trade Type',
      cell: ({ row }) => {
        return (
          <span
            className={cn(
              'uppercase bg-white font-semibold px-3 py-1 rounded-xl',
              row?.original?.trade_type === 'buy' && 'bg-green-300',
              row?.original?.trade_type === 'sell' && 'bg-red-300'
            )}
          >
            {row?.original?.trade_type}
          </span>
        )
      },
    },
    {
      accessorKey: 'Stock.name',
      header: 'Stock Name',
    },

    {
      accessorKey: 'trade_duration',
      header: 'Duration',
      cell: ({ row }) => {
        return <span className={cn('uppercase')}>{row?.original?.trade_duration}</span>
      },
    },

    {
      accessorKey: 'quantity',
      header: 'Qty',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <span
            className={cn(
              'uppercase bg-white  px-3 py-1 rounded-xl',
              row?.original?.status === 'executed' && 'text-green-500',
              row?.original?.status === 'failed' && 'text-red-500',
              row?.original?.status === 'pending' && 'text-grey-500',
              row?.original?.status === 'cancelled' && 'text-red-600 line-through'
            )}
          >
            {row?.original?.status}
          </span>
        )
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: ({ row }) => {
        return (
          <span className={cn('uppercase  px-3 py-1 rounded-xl')}>
            {moment(row?.original?.updatedAt).format('DD-MMM-YYYY (hh:mm)')}
          </span>
        )
      },
    },
  ]
  return (
    <div className="p-4 space-y-4 ">
      <div className="search-bar">
        <SearchBar />
      </div>
      <div className="grid grid-cols-1 gap-2  w-full items-start">
        {data && (
          <>
            <Button
              className="w-fit ml-auto h-10 rounded-xl text-md mt-1 primary-gradient cursor-pointer"
              onClick={downloadUserTradeHistory}
            >
              Download Excel <Download />
            </Button>
            {data?.data?.length > 0 && (
              <ProfolioTable
                pagination={true}
                columns={orderColumns}
                data={data?.data}
                loadingState={false}
                title="Trade History"
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TradeHistory
