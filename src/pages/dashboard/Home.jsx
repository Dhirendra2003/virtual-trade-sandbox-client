import Chart from '../../components/dashboard/Chart'
import SearchBar from '../../components/dashboard/SearchBar'
import PortFolioWindow from '../../components/dashboard/PortFolioWindow'
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

const Home = () => {
  return (
    <div className="px-4 p-2 ">
      <SearchBar />

      <div className="grid grid-cols-3 gap-2  w-full items-center">
        <Chart className=" rounded-2xl overflow-hidden " />
        <PortFolioWindow />
      </div>
    </div>
  )
}

export default Home
