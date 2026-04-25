import SearchBar from '../../components/dashboard/SearchBar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { getAllUserNotifications, markAllNotificationsAsRead } from './actions.js'
import ProfolioTable from '@/components/dashboard/PorfolioTable'
import { CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import moment from 'moment'

const typeConfig = {
  success: {
    icon: <CheckCircle size={14} />,
    textColor: 'text-green-700 dark:text-green-500',
  },
  info: {
    icon: <Info size={14} />,
    textColor: 'text-blue-700 dark:text-blue-500',
  },
  warning: {
    icon: <AlertTriangle size={14} />,
    textColor: 'text-amber-600',
  },
}

const AllNotifications = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['all-notifications'],
    queryFn: () => getAllUserNotifications(),
    enabled: true,
  })

  const { mutate: markAllRead, isPending } = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const notificationColumns = [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const config = typeConfig[row?.original?.type] ?? typeConfig.info
        return (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex items-center justify-center p-2 rounded-xl bg-white dark:bg-neutral-800',
                config.textColor
              )}
            >
              {config.icon}
            </span>
            <span className="capitalize">{row?.original?.type}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const isUnread = !row?.original?.is_read
        return (
          <div className="flex items-center gap-2">
            {isUnread && <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />}
            <span className={cn('font-medium', isUnread && 'font-bold text-blue-600 dark:text-blue-400')}>
              {row?.original?.title}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => (
        <div className="w-[250px] sm:w-[200px] md:w-[40vw] lg:w-[40vw] whitespace-normal break-words text-sm text-muted-foreground">
          {row?.original?.message}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date & Time',
      cell: ({ row }) => {
        return (
          <span className={cn('uppercase  py-1 rounded-xl text-neutral-500')}>
            {moment(row?.original?.createdAt).format('hh:mm A, DD-MMM-YYYY')}
          </span>
        )
      },
    },
  ]

  const hasUnread = data?.data?.some(n => n.is_read === false) ?? false

  return (
    <div className="p-2 space-y-4">
      <div className="search-bar">
        <SearchBar />
      </div>
      <div className="grid grid-cols-1 gap-2 w-full items-start">
        {data && (
          <>
            <div className="flex justify-end mb-2">
              <Button
                disabled={!hasUnread || isPending}
                className="w-fit h-10 rounded-xl text-md mt-1 primary-gradient cursor-pointer disabled:opacity-50 text-white"
                onClick={() => markAllRead()}
              >
                {isPending ? 'Marking...' : 'Mark All as Read'}
              </Button>
            </div>
            {data?.data?.length > 0 ? (
              <ProfolioTable
                pagination={true}
                columns={notificationColumns}
                data={data?.data}
                loadingState={isLoading}
                title="All Notifications"
              />
            ) : (
              <div className="flex justify-center items-center p-8 glass-card rounded-2xl text-muted-foreground mt-4">
                <p>No notifications to show</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AllNotifications
