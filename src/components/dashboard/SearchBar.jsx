import React from 'react'
import Logo from '/logo_v1.png'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Bell, CheckCircle, CircleX, Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSelector } from 'react-redux'

const SearchBar = () => {
  const { user } = useSelector(state => state.auth)
  console.log(user)
  const notifications = [
    {
      id: 1,
      title: 'Trade Alert:',
      message: 'Your trade is executed for @TataSteel ₹84.5 (14QTY)',
      type: 'success',
    },
    {
      id: 2,
      title: 'Balance Added:',
      message: '₹10,00,000 has been added to your account',
      type: 'success',
    },
    {
      id: 3,
      title: 'Trade Alert:',
      message: 'Your trade is failed for @Reliance ₹14.5 (104QTY)',
      type: 'error',
    },
  ]
  return (
    <div className="mb-2 rounded-2xl sticky top-2 z-50 glass-card flex items-center justify-between py-2 px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2 ">
        <img src={Logo} alt="Virtual Trade Sandbox " className="h-10 w-10  " />
        <h1 className="text-xs/3 font-bold text-slate-800">
          Virtual <br /> Trade <br /> Sandbox
        </h1>
      </div>

      <InputGroup className="bg-white --border-purple-500 max-w-sm shadow-none">
        <InputGroupInput
          placeholder="Stocks , mutual funds , options"
          required
          name="search"
          type="text"
          className=""
          // value=""
          // onChange={() => {}}
          // onBlur={() => {}}
        />
        <InputGroupAddon className="">
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h2 className="font-bold capitalize pt-1">{user?.name || 'User name'}</h2>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline " className="primary-gradient w-8 h-8 rounded-full">
              <Bell color="#FFF" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-60 shadow-2xl">
            <div className="grid gap-3">
              <h4 className="leading-none text-purple-700 text-xs text-right underline underline-offset-8 decoration-purple-700">
                Your Notifications
              </h4>

              <div>
                {notifications.map(notification => (
                  <div className="grid  gap-2 hover:bg-gray-100 cursor-pointer p-2 rounded-lg">
                    <div className="grid grid-cols-1 items-center">
                      <h1
                        className={`font-bold  text-sm  ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'} flex gap-1 items-center pb-1`}
                      >
                        {notification.type === 'success' ? <CheckCircle size={14} /> : <CircleX size={14} />}
                        {notification.title}
                      </h1>
                      <p className="text-xs font-light text-gray-500">{notification.message}</p>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default SearchBar
