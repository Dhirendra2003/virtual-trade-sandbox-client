import { useMemo } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock } from 'lucide-react'
import { toast } from 'sonner'
import Logo from '/logo_v1.png'
import { resetPasswordWithTokenAction } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

const validationSchema = yup.object({
  newPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(20, 'Password must be at most 20 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*()_+={}[\]:;"'<,>.?/~-]/, 'Password must contain at least one special character')
    .test('no-whitespace', 'Password must not contain whitespaces', value => !value || !/\s/.test(value)),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
})

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: resetPasswordWithTokenAction,
    onSuccess: data => {
      toast.success('Password reset successful', {
        description: data.message,
      })
      navigate('/authenticate/login', { replace: true })
    },
  })

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
    },
    validationSchema,
    onSubmit: async values => {
      await mutateAsync({ token, newPassword: values.newPassword })
    },
  })

  const togglePasswordVisibility = () => {
    formik.setFieldValue('showPassword', !formik.values.showPassword)
  }

  return (
    <div className="primary-gradient">
      <div className="glass-bg flex min-h-svh flex-col items-center justify-center gap-6 p-6">
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="fixed top-10 left-10 hidden items-center gap-2 md:flex">
            <img src={Logo} alt="Virtual Trade Sandbox" className="h-10 w-10" />
            <h1 className="text-xs/3 font-bold text-title-text-color">
              Virtual <br /> Trade <br /> Sandbox
            </h1>
          </div>

          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-title-text-color">Create a new password</CardTitle>
              <CardDescription>
                Choose a strong password for your account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!token ? (
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                    <KeyRound className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-title-text-color">Reset link missing</h2>
                    <p className="text-sm text-sub-title-text-color">
                      This password reset link is incomplete. Request a fresh one from the forgot password page.
                    </p>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/forgot-password">Request new link</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={formik.handleSubmit}>
                  <FieldGroup className="gap-4">
                    <Field>
                      <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                      <InputGroup className="bg-white">
                        <InputGroupInput
                          id="newPassword"
                          name="newPassword"
                          placeholder="Enter new password"
                          type={formik.values.showPassword ? 'text' : 'password'}
                          value={formik.values.newPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <InputGroupAddon>
                          <Lock />
                        </InputGroupAddon>
                        <button
                          type="button"
                          className="mr-3 cursor-pointer"
                          onClick={togglePasswordVisibility}
                        >
                          {formik.values.showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                      </InputGroup>
                      {formik.touched.newPassword && formik.errors.newPassword && (
                        <p className="text-sm text-red-500">{formik.errors.newPassword}</p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                      <InputGroup className="bg-white">
                        <InputGroupInput
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Repeat new password"
                          type={formik.values.showPassword ? 'text' : 'password'}
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <InputGroupAddon>
                          <Lock />
                        </InputGroupAddon>
                      </InputGroup>
                      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p className="text-sm text-red-500">{formik.errors.confirmPassword}</p>
                      )}
                    </Field>

                    <Button
                      type="submit"
                      disabled={!formik.isValid || isPending}
                      className="py-5 rounded-lg text-md primary-gradient cursor-pointer dark:text-white"
                    >
                      {isPending ? 'Resetting password...' : 'Reset password'}
                    </Button>

                    <Button asChild type="button" variant="ghost" className="w-full">
                      <Link to="/authenticate/login">
                        <ArrowLeft />
                        Back to login
                      </Link>
                    </Button>
                  </FieldGroup>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
