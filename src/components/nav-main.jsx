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

export default function NavMain({ items }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  return (
    <SidebarGroup className="h-full">
      <SidebarGroupContent className="flex flex-col gap-2 justify-between h-full">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2"></SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
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
