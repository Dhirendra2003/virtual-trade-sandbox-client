import Logo from '/logo_v1.png'
import { BarChart2, LayoutDashboard, ListOrdered, ChartPie, IndianRupee, User, History, Bell, X } from 'lucide-react'
import NavMain from './nav-main.jsx'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      key: 'home',
      url: '/app/home',
      icon: LayoutDashboard,
    },
    {
      title: 'Portfolio',
      key: 'portfolio',
      url: '/app/portfolio',
      icon: BarChart2,
    },
    {
      title: 'Watchlist',
      key: 'watchlist',
      url: '/app/watchlist',
      icon: ListOrdered,
    },
    {
      title: 'Analytics',
      key: 'analytics',
      url: '/app/analytics',
      icon: ChartPie,
    },
    {
      title: 'Profile',
      key: 'profile',
      url: '/app/profile',
      icon: User,
    },
    {
      title: 'Trade History',
      key: 'trade-history',
      url: '/app/trade-history',
      icon: History,
    },
    {
      title: 'Add Funds',
      key: 'add-funds',
      url: '/app/add-funds',
      icon: IndianRupee,
    },
    {
      title: 'Notifications',
      key: 'notifications',
      url: '/app/notifications',
      icon: Bell,
    },
  ],
}

export default function AppSidebar({ ...props }) {
  const { pathname } = useLocation()
  console.log('location', pathname)
  const exactPath = pathname.split('/')[2]
  console.log('exactPath', exactPath)
  const { setOpenMobile, isMobile, toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="offcanvas" {...props} className="max-w-40">
      <SidebarHeader className="py-4 ">
        <div className="flex items-center justify-between">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className=" h-10">
                <div className="hover:bg-transparent  ">
                  <img src={Logo} alt="Virtual Trade Sandbox " className="h-8 w-8  " />
                  <h1 className="text-[10px]/3 font-bold text-title-text-color">Virtual Trade Sandbox</h1>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setOpenMobile(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} currentPath={exactPath} />
      </SidebarContent>
    </Sidebar>
  )
}
