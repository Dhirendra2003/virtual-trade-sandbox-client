import { axiosInstance } from '../../API/axios.js'
const searchStock = async ({ query }) => {
  console.log(query)
  try {
    const response = await axiosInstance.get(`/stocks/search-stocks?search=${query}`)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
const getStockData = async ({ stockCode, timeFrame, from, to }) => {
  console.log(stockCode, timeFrame, from, to)
  try {
    const response = await axiosInstance.get(
      `/stocks/get-stock-chart-data?stockCode=${stockCode}&timeFrame=${timeFrame}&from=${from}&to=${to}`
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export { searchStock, getStockData }
