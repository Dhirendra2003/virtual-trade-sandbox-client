import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Activity, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookSquare } from 'react-icons/fa'
import { useFormik } from 'formik'
import * as yup from 'yup'

export function LoginForm({ className, ...props }) {
  const [page, setPage] = useState('login')
  const [showPassword, setShowPassword] = useState(false)

  const UserLoginSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password must be at most 20 characters long'),
  })

  const UserRegisterSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    username: yup
      .string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters long')
      .max(40, 'Username must be at most 40 characters long'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password must be at most 20 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*()_+={}[\]:;"'<,>.?/~-]/, 'Password must contain at least one special character')
      .test('no-whitespace', 'Password must not contain whitespaces', value => !value || !/\s/.test(value)),
    repeatPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    mobileNumber: yup
      .string()
      .required('Mobile Number is required')
      .matches(/^[0-9]{10}$/, 'Enter 10 digit mobile number'),
    dateofbirth: yup.date().required('Date of Birth is required'),
  })

  const formikLogin = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: values => {
      console.log(values)
    },
    validationSchema: UserLoginSchema,
  })

  const formikRegister = useFormik({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
      mobileNumber: '',
      dateofbirth: '',
    },
    onSubmit: values => {
      console.log(values)
    },
    validationSchema: UserRegisterSchema,
  })

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <Badge variant="secondary" className="mx-auto font-bold px-3 mb-1">
            <Activity data-icon="inline-start" />
            MARKET OPEN
          </Badge>
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-xs">
            Join 1K+ People practicing trade with Virtual Trade Sandbox
          </CardDescription>
        </CardHeader>

        <div className="grid grid-cols-2 w-[90%] p-2  gap-3 items-center mx-auto bg-gray-100 rounded-xl">
          <Button
            variant={page === 'login' ? 'outline' : 'secondary'}
            className="col-span-1 hover:bg-white "
            onClick={() => setPage('login')}
          >
            Login
          </Button>
          <Button
            variant={page === 'register' ? 'outline' : 'secondary'}
            className="col-span-1 hover:bg-white "
            onClick={() => setPage('register')}
          >
            Register
          </Button>
        </div>
        {page === 'login' && (
          <CardContent>
            <form onSubmit={formikLogin.handleSubmit}>
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      placeholder="m@example.com"
                      required
                      name="email"
                      value={formikLogin.values.email}
                      onChange={formikLogin.handleChange}
                      onBlur={formikLogin.handleBlur}
                    />
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                  </InputGroup>
                  {formikLogin.touched.email && formikLogin.errors.email && (
                    <p className="text-red-500 text-sm">{formikLogin.errors.email}</p>
                  )}
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a href="#" className="ml-auto  text-sm underline-offset-4 hover:underline">
                      Forgot your password?
                    </a>
                  </div>

                  <InputGroup>
                    <InputGroupInput
                      placeholder="password"
                      name="password"
                      value={formikLogin.values.password}
                      onChange={formikLogin.handleChange}
                      onBlur={formikLogin.handleBlur}
                      type={showPassword ? 'text' : 'password'}
                      required
                    />
                    <InputGroupAddon>
                      <Lock />
                    </InputGroupAddon>
                    <Tooltip>
                      {/* <InputGroupButton> */}
                      <TooltipTrigger
                        className="cursor-pointer mr-3"
                        onClick={e => {
                          e.preventDefault()
                          setShowPassword(!showPassword)
                        }}
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </TooltipTrigger>
                      {/* </InputGroupButton> */}
                      <TooltipContent>
                        <p>{showPassword ? 'Hide password' : 'Show password'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </InputGroup>
                  {formikLogin.touched.password && formikLogin.errors.password && (
                    <p className="text-red-500 text-sm">{formikLogin.errors.password}</p>
                  )}
                </Field>
                <Button disabled={!formikLogin.isValid} className="py-5" type="submit">
                  Sign In
                </Button>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-1">
                  Or continue with
                </FieldSeparator>

                <div className="grid grid-cols-2 w-[90%]   gap-3 items-center mx-auto  rounded-xl">
                  <Field>
                    <Button className="col-span-1" variant="outline" type="button">
                      <FcGoogle />
                      Login with Google
                    </Button>
                  </Field>
                  <Field>
                    <Button className="col-span-1" variant="outline" type="button">
                      <FaFacebookSquare color="blue" />
                      Login with Facebook
                    </Button>
                  </Field>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        )}
        {page === 'register' && (
          <CardContent>
            <form onSubmit={formikRegister.handleSubmit}>
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      name="username"
                      placeholder="username"
                      value={formikRegister.values.username}
                      onChange={formikRegister.handleChange}
                      onBlur={formikRegister.handleBlur}
                      required
                    />
                    <InputGroupAddon>
                      <User />
                    </InputGroupAddon>
                  </InputGroup>
                  {formikRegister.touched.username && formikRegister.errors.username && (
                    <p className="text-red-500 text-sm">{formikRegister.errors.username}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      name="email"
                      placeholder="m@example.com"
                      value={formikRegister.values.email}
                      onChange={formikRegister.handleChange}
                      onBlur={formikRegister.handleBlur}
                      required
                    />
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                  </InputGroup>
                  {formikRegister.touched.email && formikRegister.errors.email && (
                    <p className="text-red-500 text-sm">{formikRegister.errors.email}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="mobileNumber">Mobile Number</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      // type="number"
                      maxLength={10}
                      name="mobileNumber"
                      placeholder="9876543210"
                      value={formikRegister.values.mobileNumber}
                      onChange={formikRegister.handleChange}
                      onBlur={formikRegister.handleBlur}
                      required
                    />
                    <InputGroupAddon>
                      <Phone />
                    </InputGroupAddon>
                  </InputGroup>
                  {formikRegister.touched.mobileNumber && formikRegister.errors.mobileNumber && (
                    <p className="text-red-500 text-sm">{formikRegister.errors.mobileNumber}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      name="password"
                      placeholder="password"
                      value={formikRegister.values.password}
                      onChange={formikRegister.handleChange}
                      onBlur={formikRegister.handleBlur}
                      type={showPassword ? 'text' : 'password'}
                      required
                    />
                    <InputGroupAddon>
                      <Lock />
                    </InputGroupAddon>
                    <Tooltip>
                      {/* <InputGroupButton> */}
                      <TooltipTrigger
                        className="cursor-pointer mr-3"
                        onClick={e => {
                          e.preventDefault()
                          setShowPassword(!showPassword)
                        }}
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </TooltipTrigger>
                      {/* </InputGroupButton> */}
                      <TooltipContent>
                        <p>{showPassword ? 'Hide password' : 'Show password'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </InputGroup>
                  {formikRegister.touched.password && formikRegister.errors.password && (
                    <p className="text-red-500 text-sm">{formikRegister.errors.password}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="repeatPassword">Repeat Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      name="repeatPassword"
                      placeholder="repeat password"
                      value={formikRegister.values.repeatPassword}
                      onChange={formikRegister.handleChange}
                      onBlur={formikRegister.handleBlur}
                      type={showPassword ? 'text' : 'password'}
                      required
                    />
                    <InputGroupAddon>
                      <Lock />
                    </InputGroupAddon>
                  </InputGroup>
                  {/* {formikRegister.touched.repeatPassword && formikRegister.errors.repeatPassword && (
                    <p className="text-red-500 text-sm">{formikRegister.errors.repeatPassword}</p>
                  )} */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="dateofbirth">Date of Birth</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="date"
                      name="dateofbirth"
                      placeholder="9876543210"
                      value={formikRegister.values.dateofbirth}
                      onChange={formikRegister.handleChange}
                      onBlur={formikRegister.handleBlur}
                      required
                    />
                    {/* <InputGroupAddon>
                      <Phone />
                    </InputGroupAddon> */}
                  </InputGroup>
                  {formikRegister.touched.dateofbirth && formikRegister.errors.dateofbirth && (
                    <p className="text-red-500 text-sm">{formikRegister.errors.dateofbirth}</p>
                  )}
                </Field>

                <Button className="py-5" disabled={!formikRegister.isValid} type="submit">
                  Sign Up
                </Button>
                <Field></Field>
              </FieldGroup>
            </form>
          </CardContent>
        )}
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
