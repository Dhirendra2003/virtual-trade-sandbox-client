import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  stock: null,
}

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    clearStockState: state => {
      state.stock = null
    },
    setStock: (state, action) => {
      state.stock = action.payload
    },
    setLatestPrice: (state, action) => {
      state.latestPrice = action.payload
    },
  },
})

export const { clearStockState, setStock, setLatestPrice } = stockSlice.actions
export default stockSlice.reducer
