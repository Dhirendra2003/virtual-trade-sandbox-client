import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const RouteProtector = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  if (!isAuthenticated || !user) {
    return <Navigate to="/authenticate/login" />
  }
  return children
}

export default RouteProtector
