import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// const rootReducer = combineReducers({
//    authReducer,
//   //can add more
// })

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, authReducer)

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

export default store
