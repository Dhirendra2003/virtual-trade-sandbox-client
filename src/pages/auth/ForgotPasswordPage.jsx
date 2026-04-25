import { useFormik } from 'formik'
import * as yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import Logo from '/logo_v1.png'
import { forgotPasswordAction } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'

const validationSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
})

const ForgotPasswordPage = () => {
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: forgotPasswordAction,
  })

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async values => {
      await mutateAsync(values.email)
    },
  })

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
              <CardTitle className="text-3xl font-bold text-title-text-color">Forgot password</CardTitle>
              <CardDescription>
                Enter your email and we will send you a reset link if an account exists for it.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isSuccess ? (
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                    <Send className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-title-text-color">Check your email</h2>
                    <p className="text-sm text-sub-title-text-color">
                      If an account exists for <span className="font-semibold text-title-text-color">{formik.values.email}</span>,
                      a reset link is on its way.
                    </p>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/authenticate/login">Back to login</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={formik.handleSubmit}>
                  <FieldGroup className="gap-4">
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <InputGroup className="bg-white">
                        <InputGroupInput
                          id="email"
                          name="email"
                          type="email"
                          placeholder="m@example.com"
                          autoComplete="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <InputGroupAddon>
                          <Mail />
                        </InputGroupAddon>
                      </InputGroup>
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-500">{formik.errors.email}</p>
                      )}
                      <FieldDescription>
                        We do not reveal whether the email is registered.
                      </FieldDescription>
                    </Field>

                    <Button
                      type="submit"
                      disabled={!formik.isValid || isPending}
                      className="py-5 rounded-lg text-md primary-gradient cursor-pointer dark:text-white"
                    >
                      {isPending ? 'Sending link...' : 'Send reset link'}
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

export default ForgotPasswordPage
