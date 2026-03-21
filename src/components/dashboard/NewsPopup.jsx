import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import moment from 'moment'
import { Badge } from '../ui/badge'
import { SquareArrowOutUpRight } from 'lucide-react'

export default function NewsPopup({ news, open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[70vw] max-w-[70vw]">
        <DialogHeader>
          <DialogTitle className="leading-tight">{news?.title}</DialogTitle>
          {news?.topics?.length > 0 && (
            <div className="flex gap-2">
              {news?.topics?.map(topic => (
                <Badge className="text-xs bg-purple-500" key={topic}>
                  {topic}
                </Badge>
              ))}
            </div>
          )}

          <DialogDescription>
            {news?.source} | {moment(news?.pub_date).format('DD-MM-YYYY')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <img
            src={encodeURI(news?.image_url)}
            className="w-[50%] min-h-[200px] h-full rounded-xl object-cover text-sm text-center font-medium    bg-gray-200 text-gray-500 "
            alt={news?.title}
          />
          <div className="flex flex-col gap-1 px-3 pt-2 min-w-0 flex-1 overflow-hidden">
            <span className="text-sm font-thin text-justify tracking-tight text-muted-foreground">{news?.summary}</span>
            <a href={news?.url} className="text-right " target="_blank" rel="noopener noreferrer">
              <Button variant="link" className="mt-4 text-purple-500 border-0">
                Read More <SquareArrowOutUpRight />
              </Button>
            </a>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          {/* <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
