import { Button } from '@/components/ui/Button'
import { LoginForm } from '@/components/login-form'
import { toast } from 'sonner'
import { useParams, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthPage = () => {
  const { path } = useParams()
  const { isAuthenticated, user } = useSelector(state => state.auth)

  // Redirect to dashboard if already logged in
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="primary-gradient">
      <div className="glass-bg flex min-h-svh flex-col items-center justify-center gap-6 p-6 ">
        <div className="flex w-full max-w-md flex-col gap-6">
          <a href="#" className="flex fixed top-10 left-10 items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              {/* <GalleryVerticalEnd className="size-4" /> */}
            </div>
            Virtual Trade Sandbox
          </a>
          <LoginForm path={path} />
        </div>
      </div>
    </div>
  )
}

export default AuthPage
