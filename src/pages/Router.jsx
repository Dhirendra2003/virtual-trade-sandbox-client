import { useRoutes, Navigate, BrowserRouter } from 'react-router-dom'
import AuthPage from './auth/AuthPage'
import Dashboard from './dashboard/Dashboard'
import InsideOutlet from './dashboard/InsideOutlet'
import RouteProtector from '@/components/RouteProtector'
import RequestUserData from './auth/RequestUserData'

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/dashboard" />,
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
      path: '/dashboard',
      element: (
        <RouteProtector>
          <Dashboard />
        </RouteProtector>
      ),
      children: [
        { path: '', element: <h1>Dashboard base component</h1> },
        { path: 'inside-outlet', element: <InsideOutlet /> },
      ],
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
