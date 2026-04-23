import { Outlet } from 'react-router-dom'
import { axiosInstance } from '../../API/axios'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearState } from '@/store/slices/authSlice'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/app-sidebar'

const Dashboard = () => {
  return (
    <SidebarProvider
      className="glass-bg"
      variant={'floating'}
      style={{
        '--sidebar-width': '10rem',
        '--sidebar-width-mobile': '10rem',
      }}
    >
      <AppSidebar />
      <div className=" min-h-screen w-[100%] min-w-0 m-0 p-0">
        <Outlet />
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
