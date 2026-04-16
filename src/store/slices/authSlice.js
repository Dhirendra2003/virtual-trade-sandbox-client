import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  userPreferences: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearState: state => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    setUserPreferences: (state, action) => {
      state.userPreferences = action.payload
      state.loading = false
      state.error = null
    },
  },
})

export const { clearState, setUser, setUserPreferences } = authSlice.actions
export default authSlice.reducer
