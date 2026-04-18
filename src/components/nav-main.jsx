// import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react"

import { Button } from '@/components/ui/button'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { IoMdExit } from 'react-icons/io'
import { axiosInstance } from '../API/axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearState } from '../store/slices/authSlice'
import { Link } from 'react-router-dom'

export default function NavMain({ items, currentPath }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  return (
    <SidebarGroup className="h-full ">
      <SidebarGroupContent className="flex flex-col gap-2 justify-between h-full">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2"></SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="bg-purple-600 hover:bg-purple-800 hover:text-white text-white transition-all duration-300 ease-in-out"
                tooltip={item.title}
                asChild
                isActive={currentPath !== item.key}
              >
                <Link to={item.url} className="bg-purple-600 text-white">
                  {item.icon && (
                    <item.icon className={`${currentPath === item.key ? 'text-white' : 'text-purple-700'}`} />
                  )}
                  <span className="">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
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
          className="border-purple-600"
          variant="outline"
        >
          <IoMdExit />
          <span>Log Out</span>
        </Button>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
