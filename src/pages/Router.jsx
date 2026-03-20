import { useRoutes, Navigate, BrowserRouter } from 'react-router-dom'
import AuthPage from './auth/AuthPage'
import Dashboard from './dashboard/Dashboard'
import InsideOutlet from './dashboard/InsideOutlet'
import RouteProtector from '@/components/RouteProtector'
import RequestUserData from './auth/RequestUserData'
import Home from './dashboard/Home'
import Stock from './dashboard/Stock'
import ErrorPage from './error/ErrorPage'

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
      path: '/app',
      element: (
        <RouteProtector>
          <Dashboard />
        </RouteProtector>
      ),
      children: [
        { path: 'home', element: <Home /> },
        { path: 'stock/:id', element: <Stock /> },

        { path: 'profile', element: <h1>profile</h1> },
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
