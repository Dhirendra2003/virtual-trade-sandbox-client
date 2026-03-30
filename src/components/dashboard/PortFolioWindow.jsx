import { Button } from '@/components/ui/Button'
import { FaChartPie } from 'react-icons/fa'
import { IoIosInformationCircle } from 'react-icons/io'
import { ArrowUpRight, Landmark, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getUserFunds } from '../../pages/dashboard/actions'

const PortFolioWindow = () => {
  const { data: userFunds } = useQuery({
    queryKey: ['getUserFunds'],
    queryFn: () => getUserFunds(),
    enabled: true,

    staleTime: 1000 * 15,
  })
  return (
    <div className="col-span-1 h-full glass-card p-4 rounded-2xl overflow-hidden">
      <div className="flex  justify-between items-start">
        <h3 className="text-md font-bold mb-2 ">Portfolio Value</h3>
        <IoIosInformationCircle className="w-6 h-6" color="grey" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-800">₹ {(425900.79).toLocaleString()} </h1>
      <span className="flex gap-2 text-xs items-center font-semibold text-green-600">
        <TrendingUp className="w-3 " />
        <p>+ ₹ {(12500.59).toLocaleString()} (2.5%) Today</p>
      </span>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex  items-center justify-start gap-3 p-3 rounded-xl bg-white shadow-md shadow-black/10">
          <Landmark className="w-4 " color="#4B50F0" />
          <p className="text-sm">Buying Power</p>
          <h3 className="ml-auto text-lg font-bold">₹ {userFunds?.data?.funds}</h3>
        </div>
        <div className="flex  items-center justify-start gap-3 p-3 rounded-xl bg-white shadow-md shadow-black/10">
          <FaChartPie className="w-5 " color="#3B82F6" />
          <p className="text-sm">Active Trades</p>
          <h3 className="ml-auto text-lg font-bold">18</h3>
        </div>
        <Button className="rounded-xl p-6  border-blue-500 text-blue-600" variant="outline">
          View Detailed Analysis <ArrowUpRight />
        </Button>
      </div>
    </div>
  )
}

export default PortFolioWindow
