import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../services/apiService'

// Async thunk for login
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Login failed')
  }
})

// Async thunk for checking auth status
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/auth/me')
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Auth check failed')
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await apiClient.post('/auth/logout')
    return null
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Logout failed')
  }
})

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Check Auth
      .addCase(checkAuth.pending, state => {
        state.loading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(checkAuth.rejected, state => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
      })
      // Logout
      .addCase(logoutUser.fulfilled, state => {
        state.isAuthenticated = false
        state.user = null
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
