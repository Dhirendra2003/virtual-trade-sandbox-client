import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Loader2, MailCheck } from 'lucide-react'
import { toast } from 'sonner'
import Logo from '/logo_v1.png'
import { verifyEmailAction, resendVerificationAction } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  // 'loading' | 'success' | 'error' | 'no-token'
  const [status, setStatus] = useState(token ? 'loading' : 'no-token')
  const [errorMessage, setErrorMessage] = useState('')
  const [resendDone, setResendDone] = useState(false)

  // Auto-verify on mount
  useEffect(() => {
    if (!token) return
    verifyEmailAction(token)
      .then(() => setStatus('success'))
      .catch(err => {
        setStatus('error')
        setErrorMessage(
          err?.response?.data?.message || 'Verification link is invalid or has expired.'
        )
      })
  }, [token])

  // Resend mutation
  const { mutateAsync: resend, isPending: isResending } = useMutation({
    mutationFn: resendVerificationAction,
    onSuccess: () => {
      setResendDone(true)
      toast.success('Verification email sent', {
        description: 'Check your inbox for a new verification link.',
      })
    },
    onError: err => {
      toast.error('Failed to resend', {
        description: err?.response?.data?.message || 'Something went wrong.',
      })
    },
  })

  const handleResend = () => resend({ token })

  return (
    <div className="primary-gradient">
      <div className="glass-bg flex min-h-svh flex-col items-center justify-center gap-6 p-6">
        <div className="flex w-full max-w-md flex-col gap-6">

          {/* Logo */}
          <div className="fixed top-10 left-10 hidden items-center gap-2 md:flex">
            <img src={Logo} alt="Virtual Trade Sandbox" className="h-10 w-10" />
            <h1 className="text-xs/3 font-bold text-title-text-color">
              Virtual <br /> Trade <br /> Sandbox
            </h1>
          </div>

          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-title-text-color">
                Email Verification
              </CardTitle>
              <CardDescription>
                {status === 'loading' && 'Verifying your email address...'}
                {status === 'success' && 'Your email has been verified successfully.'}
                {status === 'error' && 'We could not verify your email.'}
                {status === 'no-token' && 'This verification link appears to be broken.'}
              </CardDescription>
            </CardHeader>

            <CardContent>

              {/* ── Loading ── */}
              {status === 'loading' && (
                <div className="flex flex-col items-center gap-4 py-4">
                  <Loader2 className="size-12 animate-spin text-muted-foreground" />
                  <p className="text-sm text-sub-title-text-color">Please wait...</p>
                </div>
              )}

              {/* ── Success ── */}
              {status === 'success' && (
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15 text-green-600">
                    <CheckCircle className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-title-text-color">All done!</h2>
                    <p className="text-sm text-sub-title-text-color">
                      Your account is now active. You can log in to start trading.
                    </p>
                  </div>
                  <Button asChild className="w-full py-5 rounded-lg text-md primary-gradient cursor-pointer dark:text-white">
                    <Link to="/authenticate/login">Go to Login</Link>
                  </Button>
                </div>
              )}

              {/* ── Error (expired / invalid) ── */}
              {status === 'error' && (
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-red-600">
                    <XCircle className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-title-text-color">Link expired</h2>
                    <p className="text-sm text-sub-title-text-color">{errorMessage}</p>
                  </div>

                  {resendDone ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                      <MailCheck className="size-4" />
                      Check your inbox for a new link.
                    </div>
                  ) : (
                    <Button
                      onClick={handleResend}
                      disabled={isResending}
                      className="w-full py-5 rounded-lg text-md primary-gradient cursor-pointer dark:text-white"
                    >
                      {isResending ? 'Sending...' : 'Resend Verification Email'}
                    </Button>
                  )}

                  <Button asChild type="button" variant="ghost" className="w-full">
                    <Link to="/authenticate/login">
                      <ArrowLeft />
                      Back to login
                    </Link>
                  </Button>
                </div>
              )}

              {/* ── No token ── */}
              {status === 'no-token' && (
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                    <XCircle className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-title-text-color">Broken link</h2>
                    <p className="text-sm text-sub-title-text-color">
                      This verification link is incomplete. Please use the link sent to your email.
                    </p>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/authenticate/login">Back to login</Link>
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
