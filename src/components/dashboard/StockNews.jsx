import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

export default function StockNews({ news = [] }) {
  return (
    <>
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnMouseEnter: true,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full min-w-0 max-w-full p-2 "
      >
        <CarouselContent className="px-0 ">
          {news?.map((item, index) => (
            <CarouselItem key={index} className="basis-1/2 pl-1  lg:basis-1/2 ">
              <Card className="pt-0 pb-4 border-2 rounded-3xl  transition-all duration-300 ease-in-out  ">
                <CardContent className="flex flex-col  p-2 overflow-hidden ">
                  <img
                    src={encodeURI(
                      item?.leadMedia?.image?.images?.bigImage || item?.leadMedia?.image?.images?.thumbnailImage
                    )}
                    className="w-full min-h-60 max-h-60 object-cover shrink-0 rounded-xl text-sm text-center font-medium  bg-gray-200 text-gray-500 "
                    alt={item.title}
                  />
                  <div className="flex flex-col gap-1 px-3 pt-2 min-w-0 flex-1 overflow-hidden">
                    <span className="text-sm font-semibold line-clamp-1 leading-snug">{item?.headline}</span>
                    <span className="text-xs font-medium text-muted-foreground ">{item?.summary}</span>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-18" />
        <CarouselNext className="mr-18" />
      </Carousel>
    </>
  )
}
