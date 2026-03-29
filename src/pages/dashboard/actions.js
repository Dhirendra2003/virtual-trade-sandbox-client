import { axiosInstance } from '../../API/axios.js'

const getMarketStatus = async () => {
  try {
    const response = await axiosInstance.get('/stocks/get-market-status')
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
const getNews = async () => {
  try {
    const response = await axiosInstance.get('/stocks/get-stock-news')
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getTredingStocks = async () => {
  try {
    const response = await axiosInstance.get('/stocks/get-trending-stock')
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

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
const getUserWatchlist = async () => {
  try {
    const response = await axiosInstance.get(`/watchlist/get-user-watchlist`)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
const addToWatchlist = async stockCode => {
  try {
    const response = await axiosInstance.post(`/watchlist/add-to-watchlist`, { stockCode })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
const removeFromWatchlist = async stockCode => {
  try {
    const response = await axiosInstance.post(`/watchlist/remove-from-watchlist`, { stockCode })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const registerTrade = async ({ instrument_key, trade_type, trade_duration, quantity }) => {
  try {
    const response = await axiosInstance.post(`/trade/register-trade`, {
      instrument_key,
      trade_type,
      trade_duration,
      quantity,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getTradesAndOrders = async () => {
  try {
    const response = await axiosInstance.get(`/trade/get-trades-and-orders`)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export {
  searchStock,
  getStockData,
  getMarketStatus,
  getNews,
  getTredingStocks,
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  registerTrade,
  getTradesAndOrders,
}
