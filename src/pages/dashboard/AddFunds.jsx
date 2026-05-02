import SearchBar from '../../components/dashboard/SearchBar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import PaymentBox from '../../components/dashboard/PaymentBox'
import { Link } from 'react-router-dom'

const AddFunds = () => {
  return (
    <div className="p-2 space-y-4 ">
      <div className="search-bar ">
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
            <BreadcrumbPage className="cursor-pointer">Add Funds</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className=" w-full ">
        <PaymentBox className=" rounded-2xl overflow-hidden h-full" />
      </div>
    </div>
  )
}

export default AddFunds
