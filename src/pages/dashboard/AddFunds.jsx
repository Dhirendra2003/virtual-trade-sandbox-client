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
import { useParams } from 'react-router-dom'
import BuySellWindow from '../../components/dashboard/BuySellWindow'
import StockDetails from '../../components/dashboard/StockDetails'
import PaymentBox from '../../components/dashboard/PaymentBox'

const AddFunds = () => {
  return (
    <div className="p-4 space-y-4 ">
      <div className="glass-bg sticky w-full top-0 py-2 z-50 ">
        <SearchBar />
      </div>
      <div className=" w-full ">
        <PaymentBox className=" rounded-2xl overflow-hidden h-full" />
      </div>
    </div>
  )
}

export default AddFunds
