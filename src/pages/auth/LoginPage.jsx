import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
const LoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <Button onClick={() => toast.success('Login successful!')}>Login</Button>
    </div>
  )
}

export default LoginPage
