import { Button } from '@/components/ui/Button'
import { LoginForm } from '@/components/login-form'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
const AuthPage = () => {
  const { path } = useParams()
  console.log(path)
  return (
    <div>
      {/* <h1>Login</h1>
      <Button onClick={() => toast.success('Login successful!')}>Login</Button> */}
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-md flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              {/* <GalleryVerticalEnd className="size-4" /> */}
            </div>
            Acme Inc.
          </a>
          <LoginForm path={path} />
        </div>
      </div>
    </div>
  )
}

export default AuthPage
