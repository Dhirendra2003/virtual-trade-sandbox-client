import { ChartLine } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AlertTradeSummary({
  data,
  button,
  disabled,
  triggerText = 'Place Trade',
  triggerClassName = 'py-5 rounded-xl text-md mt-2 primary-gradient cursor-pointer',
  triggerVariant,
  dialogTitle = 'Do you want to place this trade?',
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled} variant={triggerVariant} className={triggerClassName}>
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className={cn('my-auto ', data?.tradeType === 'buy' ? 'bg-green-100' : 'bg-red-100')}>
            <ChartLine className={cn('w-10 h-10', data?.tradeType === 'buy' ? 'text-green-600' : 'text-red-600')} />
          </AlertDialogMedia>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription className="flex w-full flex-col text-neutral-700 items-start gap-2 mt-2">
            {data?.tradeType && (
              <p className="w-full flex justify-between">
                Trade Type:{' '}
                <span
                  className={cn('font-bold uppercase ', data?.tradeType === 'buy' ? 'text-green-600' : 'text-red-600')}
                >
                  {data?.tradeType}
                </span>
              </p>
            )}
            <p className="w-full flex justify-between">
              Trade Duration: <span className="font-bold uppercase">{data?.tradeDuration}</span>
            </p>
            <p className="w-full flex justify-between">
              Quantity: <span className="font-bold">{data?.quantity}</span>
            </p>
            <p className="w-full flex justify-between">
              Stock: <span className="font-bold">{data?.stockName}</span>
            </p>
            <p className="w-full flex justify-between">
              Symbol: <span className="font-thin">{data?.stockSymbol}</span>
            </p>
            <p className="w-full mt-1 flex justify-between">
              Price:{' '}
              <span className="font-bold text-xl">
                <span className="text-xs font-thin mr-1 text-slate-400">
                  ( {data?.price} X {data?.quantity} )
                </span>
                {` ₹ ${(data?.price * data?.quantity).toLocaleString()} `}{' '}
              </span>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-10 rounded-xl text-md  cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="none">{button}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
