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
import { getUserStartingFunds } from '../../pages/auth/actions'
import { toast } from 'sonner'
import { LoaderIcon } from 'lucide-react'
import Skeleton from '../common/Skeleton'
import Notifications from './Notifications'
import { axiosInstance } from '../../API/axios'
import { useDispatch } from 'react-redux'
import { clearState } from '@/store/slices/authSlice'

const SearchBar = () => {
  const dispatch = useDispatch()
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

  const { data: userFunds, isPending: fundsPending } = useQuery({
    queryKey: ['UserFunds'],
    queryFn: () => getUserStartingFunds(),
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
    <div className=" rounded-2xl  glass-card flex items-center justify-between py-2 md:py-3 px-3 md:px-6">
      <div className="flex items-center md:gap-4 gap-1 cursor-pointer">
        <SidebarTrigger className="-ml-1" />
        <div
          onClick={() => {
            navigate('/app/home')
          }}
          className="flex items-center gap-2 min-w-10 "
        >
          <img src={Logo} alt="Virtual Trade Sandbox " className="md:h-10 md:w-10 h-8 w-8 z-[999]  " />
          <h1 className="hidden md:block text-xs/3 font-bold text-title-text-color">
            Virtual <br /> Trade <br /> Sandbox
          </h1>
        </div>
      </div>
      <div className="w-96">
        <InputGroup className="bg-white  max-w-sm shadow-none">
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
            <div className="absolute top-full left-[50%] -translate-x-1/2 md:w-xl w-[60vw]  max-h-[60vh] overflow-y-auto mt-2 bg-div-bg-color border border-sidebar-ring rounded-lg shadow-lg">
              {isPending ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div className="p-2 hover:bg-selected-bg-purple/50 cursor-pointer my-1" key={index}>
                    <Skeleton type="search" />
                    {/* <Separator /> */}
                  </div>
                ))
              ) : data?.data?.length > 0 ? (
                data.data.map(stock => (
                  <>
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
                      className="p-2 hover:bg-selected-bg-purple/50 cursor-pointer w-full flex md:flex-row sm:flex-col flex-col items-center justify-around "
                      key={stock?.instrument_key}
                    >
                      <p className="min-w-[60%] sm:text-lg text-sm text-left w-full">{stock?.name}</p>
                      <p className="text-xs text-sidebar-ring ml-2 text-right w-full">{stock?.trading_symbol}</p>
                      <p className="text-md text-sidebar-ring text-right w-full ">{stock?.exchange}</p>
                    </div>
                    <Separator />
                  </>
                ))
              ) : (
                <h1 className="p-2 text-slate-500">No results found </h1>
              )}
            </div>
          ) : (
            <div className="absolute top-full left-[50%] -translate-x-1/2 md:w-xl w-[60vw] mt-2 bg-div-bg-color border border-sidebar-ring rounded-lg shadow-lg">
              <h1 className="p-2 text-slate-500">type something .... </h1>
            </div>
          ))}
      </div>
      <div className="flex items-center gap-0 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex gap-4">
              <Avatar>
                <AvatarImage src={user?.profilePicURL || 'https://github.com/shadcn.png '} alt="shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h2 className="font-bold hidden md:block capitalize pt-1">{user?.name || 'User name'}</h2>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="w-full text-center">
                  <p className="">Available Funds :</p>
                  <p className="text-main-green text-lg font-bold">₹ {userFunds?.user?.funds}</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup
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
