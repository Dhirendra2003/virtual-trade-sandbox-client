import * as React from 'react'
import Logo from '/logo_v1.png'
import {
  Camera,
  BarChart2,
  LayoutDashboard,
  Database,
  BrainCircuit,
  FileText,
  FileType,
  Folder,
  HelpCircle,
  CircleDot,
  ListOrdered,
  ClipboardList,
  Search,
  Settings,
  Users,
} from 'lucide-react'

// import { NavDocuments } from '@/components/nav-documents'
import NavMain from './nav-main.jsx'
// import { NavSecondary } from '@/components/nav-secondary'
// import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: LayoutDashboard,
    },
    {
      title: 'Lifecycle',
      url: '#',
      icon: ListOrdered,
    },
    {
      title: 'Analytics',
      url: '#',
      icon: BarChart2,
    },
    {
      title: 'Projects',
      url: '#',
      icon: Folder,
    },
    {
      title: 'Team',
      url: '#',
      icon: Users,
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: Camera,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: FileText,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: BrainCircuit,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: Settings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: HelpCircle,
    },
    {
      title: 'Search',
      url: '#',
      icon: Search,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: Database,
    },
    {
      name: 'Reports',
      url: '#',
      icon: ClipboardList,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: FileType,
    },
  ],
}

export default function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="max-w-40">
      <SidebarHeader className="py-4">
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
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  )
}
