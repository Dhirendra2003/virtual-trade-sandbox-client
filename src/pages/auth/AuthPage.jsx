import { LoginForm } from '@/components/login-form'
import { useParams, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Logo from '/logo_v1.png'
import { useMarketStatus } from '@/hooks/use-market-status'

const AuthPage = () => {
  const { path } = useParams()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { marketStatus } = useMarketStatus()

  // Redirect to dashboard if already logged in
  if (isAuthenticated && user) {
    return <Navigate to="/app/home" replace />
  }

  return (
    <div className="primary-gradient">
      <div className="glass-bg flex min-h-svh flex-col items-center justify-center gap-6 p-6 ">
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="lg:fixed md:fixed sm:relative md:top-10 md:left-10  flex items-center justify-center gap-2 ">
            <img src={Logo} alt="Virtual Trade Sandbox " className="h-10 w-10  " />
            <h1 className="text-xs/3 font-bold text-title-text-color">
              Virtual <br /> Trade <br /> Sandbox
            </h1>
          </div>
          <LoginForm path={path} marketState={marketStatus} />
        </div>
      </div>
    </div>
  )
}

export default AuthPage
