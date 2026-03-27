import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { getNews } from '@/pages/dashboard/actions'
import { useQuery } from '@tanstack/react-query'
import NewsPopup from './NewsPopup'
import { useState } from 'react'

export default function News() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)
  const { data } = useQuery({
    queryKey: ['news'],
    queryFn: getNews,
  })

  return (
    <>
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            active: !modalOpen,
            delay: 3000,
            stopOnMouseEnter: true,
            stopOnInteraction: modalOpen,
          }),
        ]}
        className="w-full min-w-0 max-w-full "
      >
        <CarouselContent className="px-0 ">
          {data?.data?.map((item, index) => (
            <CarouselItem key={index} className="basis-1/4 pl-1  lg:basis-2/7 ">
              <Card
                onClick={() => {
                  setSelectedNews(item)
                  setModalOpen(true)
                }}
                className="pt-0 pb-4 border-2 hover:border-primary/50 rounded-3xl  transition-all duration-300 ease-in-out  hover:z-50"
              >
                <CardContent className="flex flex-col  p-2 overflow-hidden ">
                  <img
                    src={encodeURI(item.image_url)}
                    className="w-full min-h-60 max-h-60 object-cover shrink-0 rounded-xl text-sm text-center font-medium  bg-gray-200 text-gray-500 "
                    alt={item.title}
                  />
                  <div className="flex flex-col gap-1 px-3 pt-2 min-w-0 flex-1 overflow-hidden">
                    <span className="text-sm font-semibold line-clamp-1 leading-snug">{item?.title}</span>
                    <span className="text-xs font-medium text-muted-foreground line-clamp-3 leading-snug">
                      {item?.summary}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-18" />
        <CarouselNext className="mr-18" />
      </Carousel>
      <NewsPopup news={selectedNews} open={modalOpen} setOpen={setModalOpen} />
    </>
  )
}
