import { Button } from '@/components/ui/Button'
import { LoginForm } from '@/components/login-form'
import { toast } from 'sonner'
import { useParams, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Logo from '/logo_v1.png'

const AuthPage = () => {
  const { path } = useParams()
  const { isAuthenticated, user } = useSelector(state => state.auth)

  // Redirect to dashboard if already logged in
  if (isAuthenticated && user) {
    return <Navigate to="/app/home" replace />
  }

  return (
    <div className="primary-gradient">
      <div className="glass-bg flex min-h-svh flex-col items-center justify-center gap-6 p-6 ">
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="fixed top-10 left-10 flex items-center gap-2 ">
            <img src={Logo} alt="Virtual Trade Sandbox " className="h-10 w-10  " />
            <h1 className="text-xs/3 font-bold text-slate-800">
              Virtual <br /> Trade <br /> Sandbox
            </h1>
          </div>
          <LoginForm path={path} />
        </div>
      </div>
    </div>
  )
}

export default AuthPage
