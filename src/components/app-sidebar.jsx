import Logo from '/logo_v1.png'
import { BarChart2, LayoutDashboard, ListOrdered, ChartPie, IndianRupee, User, History } from 'lucide-react'
import NavMain from './nav-main.jsx'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useLocation } from 'react-router-dom'

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
  ],
}

export default function AppSidebar({ ...props }) {
  const { pathname } = useLocation()
  console.log('location', pathname)
  const exactPath = pathname.split('/')[2]
  console.log('exactPath', exactPath)
  return (
    <Sidebar collapsible="offcanvas" {...props} className="max-w-40">
      <SidebarHeader className="py-4 ">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className=" h-12">
              <div className="flex items-center gap-2 ">
                <img src={Logo} alt="Virtual Trade Sandbox " className="h-10 w-10  " />
                <h1 className="text-xs/3 font-bold text-slate-800">
                  Virtual <br /> Trade <br /> Sandbox
                </h1>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} currentPath={exactPath} />
      </SidebarContent>
    </Sidebar>
  )
}
