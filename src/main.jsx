import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import store, { persistor } from './store'
import { Toaster } from '@/components/ui/sonner'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster
          position="top-left"
          closeButton={true}
          theme="dark"
          richColors={true}
          visibleToasts={5}
          toastOptions={{
            classNames: {
              closeButton: '!-right-3 !left-auto',
            },
          }}
        />
      </PersistGate>
    </Provider>
  </StrictMode>
)
