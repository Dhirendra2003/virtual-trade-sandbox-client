import { Outlet } from 'react-router-dom'
import { axiosInstance } from '../../API/axios'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h1>Dashboard parent</h1>
      <Button
        onClick={() => {
          axiosInstance
            .get('/user/logout')
            .then(res => {
              console.log(res)
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
