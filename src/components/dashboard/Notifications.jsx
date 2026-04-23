import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserNotifications, markAllNotificationsAsRead } from '@/pages/dashboard/actions'
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
    textColor: 'text-amber-600 ',
  },
}

const NotificationItem = ({ notification }) => {
  const isUnread = notification.is_read === false
  const config = typeConfig[notification.type] ?? typeConfig.info
  console.log(notification)
  return (
    <>
      <div
        className={`relative  flex items-center gap-2 hover:bg-purple-500/20 cursor-pointer p-2 rounded-lg transition-colors ${
          isUnread ? 'bg-purple-500/10' : ''
        }`}
      >
        {/* Unread blue dot */}
        {isUnread && <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-0.5 self-start" />}

        <div className="grid grid-cols-1 items-center flex-1">
          <h1 className={`font-bold text-sm ${config.textColor} flex gap-1 items-center pb-1`}>
            {config.icon}
            {notification.title}
          </h1>
          <p className="text-xs font-light text-gray-500">{notification.message}</p>
        </div>
        <p className="text-xs mb-auto font-light text-gray-500">{moment(notification.createdAt).fromNow()}</p>
      </div>
      {!isUnread && <Separator />}
    </>
  )
}
const Notifications = () => {
  const queryClient = useQueryClient()

  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: getUserNotifications,
    refetchInterval: 10000,
  })

  const hasUnread = notifications?.data?.some(n => n.is_read === false) ?? false

  const { mutate: markAllRead, isPending } = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline " className="relative primary-gradient w-8 h-8 rounded-full">
          <Bell color="#FFF" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="md:w-[400px] sm:w-[300px] lg:w-[500px] shadow-2xl">
        <div className="grid gap-3">
          <h4 className="leading-none text-purple-700 dark:text-purple-400 text-xs text-right underline underline-offset-8 decoration-purple-700">
            Your Notifications
          </h4>
          {notifications?.data.length > 0 ? (
            <>
              <div className="flex flex-col gap-2  max-h-[300px] overflow-y-auto">
                {notifications?.data?.map(notification => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
              <Button
                disabled={!hasUnread || isPending}
                className="h-10 w-full rounded-xl text-md mt-2 primary-gradient cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white"
                type="button"
                onClick={() => markAllRead()}
              >
                {isPending ? 'Marking...' : 'Mark All as Read'}
              </Button>
            </>
          ) : (
            <div className="text-center text-lg text-gray-500 italic">No notifications</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Notifications
