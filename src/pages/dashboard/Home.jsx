import Chart from '../../components/dashboard/Chart'
import SearchBar from '../../components/dashboard/SearchBar'
import PortFolioWindow from '../../components/dashboard/PortFolioWindow'

import News from '../../components/dashboard/News'

const Home = () => {
  return (
    <div className="p-2 space-y-4 ">
      <div className="glass-bg sticky w-full top-0 py-2 z-50 ">
        <SearchBar />
      </div>

      <div className="grid grid-cols-3 gap-4  w-full items-center">
        <Chart className=" rounded-2xl overflow-hidden " />
        <PortFolioWindow />
      </div>
      <div className="w-full flex items-center justify-center overflow-hidden rounded-xl">
        <News />
      </div>
    </div>
  )
}

export default Home
