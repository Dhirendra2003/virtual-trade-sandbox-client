import Chart from '../../components/dashboard/Chart'
import SearchBar from '../../components/dashboard/SearchBar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar'
import AppSidebar from '@/components/app-sidebar'
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

const Stock = () => {
  const { id } = useParams()
  return (
    <div className="p-2 space-y-4 ">
      <div className="glass-bg sticky w-full top-0 py-2 z-50 ">
        <SearchBar />
      </div>
      <div className="grid grid-cols-3 gap-2  w-full items-start">
        <Chart stockId={id} className=" rounded-2xl overflow-hidden " />
        <BuySellWindow />
      </div>
    </div>
  )
}

export default Stock
