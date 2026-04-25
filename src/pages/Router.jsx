import { useRoutes, Navigate, BrowserRouter } from 'react-router-dom'
import AuthPage from './auth/AuthPage'
import Dashboard from './dashboard/Dashboard'
import InsideOutlet from './dashboard/InsideOutlet'
import RouteProtector from '@/components/RouteProtector'
import RequestUserData from './auth/RequestUserData'
import Home from './dashboard/Home'
import Stock from './dashboard/Stock'
import ErrorPage from './error/ErrorPage'
import Watchlist from './dashboard/Watchlist'
import Portfolio from './dashboard/Portfolio'
import TradeHistory from './dashboard/TradeHistory'
import AllNotifications from './dashboard/AllNotifications'
import Analytics from './dashboard/Analytics'
import Profile from './dashboard/Profile'
import AddFunds from './dashboard/AddFunds'
import ForgotPasswordPage from './auth/ForgotPasswordPage'
import ResetPasswordPage from './auth/ResetPasswordPage'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STR_PUBLISHABLE_KEY)

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/app/home" />,
    },
    {
      path: '/authenticate/:path',
      element: <AuthPage />,
    },
    {
      path: '/authenticate/google',
      element: <RequestUserData />,
    },
    {
      path: '/authenticate/facebook',
      element: <RequestUserData />,
    },
    {
      path: '/forgot-password',
      element: <ForgotPasswordPage />,
    },
    {
      path: '/reset-password',
      element: <ResetPasswordPage />,
    },
    {
      path: '/app',
      element: (
        <RouteProtector>
          <Dashboard />
        </RouteProtector>
      ),
      children: [
        { path: 'home', element: <Home /> },
        { path: 'stock/:id', element: <Stock /> },
        { path: 'watchlist', element: <Watchlist /> },
        { path: 'portfolio', element: <Portfolio /> },
        { path: 'analytics', element: <Analytics /> },
        { path: 'trade-history', element: <TradeHistory /> },
        { path: 'notifications', element: <AllNotifications /> },
        { path: 'profile', element: <Profile /> },
        {
          path: 'add-funds',
          element: (
            <Elements stripe={stripePromise}>
              <AddFunds />
            </Elements>
          ),
        },
      ],
    },
    //ERROR PAGE
    {
      path: '*',
      element: <ErrorPage />,
    },
  ])
  return routes
}

const Router = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default Router
