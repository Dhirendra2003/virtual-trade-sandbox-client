import Chart from '../../components/dashboard/Chart'
import SearchBar from '../../components/dashboard/SearchBar'
import { useParams } from 'react-router-dom'
import BuySellWindow from '../../components/dashboard/BuySellWindow'
import StockDetails from '../../components/dashboard/StockDetails'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link } from 'react-router-dom'

const Stock = () => {
  const { id } = useParams()
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
            <BreadcrumbPage className="cursor-pointer">Stock Search </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="md:grid grid-cols-3 flex flex-col-reverse sm:flex-row gap-4 w-full ">
        <div className="md:col-span-2 col-span-1">
          <div className="md:h-[60vh]  ">
            <Chart stockId={id} className=" rounded-2xl overflow-hidden lg:h-full sm:h-[500px]" />
          </div>
          <StockDetails />
        </div>
        <div className="col-span-1 md:sticky relative top-0 md:top-20 self-start">
          <BuySellWindow />
        </div>
      </div>
    </div>
  )
}

export default Stock
