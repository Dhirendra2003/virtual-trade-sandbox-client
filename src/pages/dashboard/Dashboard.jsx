import { Outlet } from 'react-router-dom'
import { axiosInstance } from '../../API/axios'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearState } from '@/store/slices/authSlice'

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  return (
    <div className="glass-bg min-h-screen">
      <h1>Dashboard parent</h1>
      <Button
        onClick={() => {
          axiosInstance
            .get('/user/logout')
            .then(res => {
              console.log(res)
              dispatch(clearState())
              navigate('/authenticate/login')
            })
            .catch(err => {
              console.log(err)
            })
        }}
      >
        Logout
      </Button>
      <Outlet />
    </div>
  )
}

export default Dashboard
