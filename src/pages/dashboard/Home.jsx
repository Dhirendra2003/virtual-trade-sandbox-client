import Chart from '../../components/dashboard/Chart'
import PortFolioWindow from '../../components/dashboard/PortFolioWindow'

const Home = () => {
  return (
    <div className="m-4">
      <h1>Child 1 </h1>
      <div className="grid grid-cols-3 gap-6   w-full items-center">
        <Chart className="col-span-2 rounded-2xl overflow-hidden " />
        <PortFolioWindow />
      </div>
    </div>
  )
}

export default Home
