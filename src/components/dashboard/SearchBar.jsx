import { useState, useEffect } from 'react'
import Logo from '/logo_v1.png'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger } from '../../components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchStock } from '../../pages/dashboard/actions'
import { toast } from 'sonner'
import { LoaderIcon } from 'lucide-react'
import Skeleton from '../common/Skeleton'
import Notifications from './Notifications'

const SearchBar = () => {
  // const stockData = useLocation()
  // console.log('stockData', stockData)
  const [query, setQuery] = useState('')
  const [debounceQuery, setDebounceQuery] = useState('')
  const [isInputFocused, setIsInputFocused] = useState(false)
  // const [searchResult, setSearchResult] = useState([])

  const { data, error, isPending } = useQuery({
    queryFn: () => searchStock({ query: debounceQuery }),
    queryKey: ['SearchStock', debounceQuery],
    enabled: debounceQuery.length > 0,

    // placeholderData: previousData => previousData,
    // staleTime: 1000 * 60 * 5, // Data
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query?.length > 0) {
        setDebounceQuery(query)
        setIsInputFocused(true)
      }
      // setSearchResult(data?.data)
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const err = error
    if (err) {
      toast.error('Search failed!', {
        description: err?.response?.data?.message,
      })
    }
  }, [error])

  const navigate = useNavigate()

  const { user } = useSelector(state => state.auth)
  console.log(user)

  return (
    <div className=" rounded-2xl  glass-card flex items-center justify-between py-2 px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2 ">
        <img src={Logo} alt="Virtual Trade Sandbox " className="h-10 w-10  " />
        <h1 className="text-xs/3 font-bold text-slate-800">
          Virtual <br /> Trade <br /> Sandbox
        </h1>
      </div>
      <div className="w-96">
        <InputGroup className="bg-white --border-purple-500 max-w-sm shadow-none">
          <InputGroupInput
            placeholder="Stocks , mutual funds , options"
            required
            // name="search"
            type="text"
            className=""
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
          <InputGroupAddon className="">
            {isPending && query.length > 0 ? <LoaderIcon className="animate-spin" /> : <Search />}
          </InputGroupAddon>
        </InputGroup>
        {isInputFocused &&
          (query.length > 0 ? (
            <div className="absolute top-full w-96 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              {isPending ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div className="p-2 hover:bg-gray-100 cursor-pointer my-1" key={index}>
                    <Skeleton type="search" />
                    {/* <Separator /> */}
                  </div>
                ))
              ) : data?.data?.length > 0 ? (
                data.data.map(stock => (
                  <div
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => {
                      navigate(`/app/stock/${stock?.instrument_key}`, { state: { stock: stock } })
                      setTimeout(() => {
                        console.log('xxx')
                        setIsInputFocused(false)
                        setQuery('')
                        setDebounceQuery('')
                      }, 100)
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    key={stock?.instrument_key}
                  >
                    {stock?.name}
                    {stock?.trading_symbol}
                    <Separator />
                  </div>
                ))
              ) : (
                <h1 className="p-2 text-slate-500">No results found </h1>
              )}
            </div>
          ) : (
            <div className="absolute top-full  w-96 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              <h1 className="p-2 text-slate-500">type something .... </h1>
            </div>
          ))}
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex gap-4">
              <Avatar>
                <AvatarImage src={user?.profilePicURL || 'https://github.com/shadcn.png '} alt="shadcn" />
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

        <Notifications />
      </div>
    </div>
  )
}

export default SearchBar
