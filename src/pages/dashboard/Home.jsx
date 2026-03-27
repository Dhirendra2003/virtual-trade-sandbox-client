import Chart from '../../components/dashboard/Chart'
import SearchBar from '../../components/dashboard/SearchBar'
import PortFolioWindow from '../../components/dashboard/PortFolioWindow'

import News from '../../components/dashboard/News'
import TrendingStocks from '../../components/dashboard/TrendingStocks'
import TradeRecomendations from '../../components/dashboard/TradeRecomendations'

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
      <div className="w-full grid grid-cols-3 gap-4 items-start justify-around overflow-hidden rounded-xl ">
        <TrendingStocks type="gainers" />
        <TrendingStocks type="losers" />
        <TradeRecomendations />
      </div>
      <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-xl">
        <h3 className="text-md font-bold text-left w-full">Top News</h3>
        <News />
      </div>
    </div>
  )
}

export default Home
