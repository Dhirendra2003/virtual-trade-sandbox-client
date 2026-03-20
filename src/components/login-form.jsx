import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
import { Activity, Eye, EyeOff, Lock, Mail, Phone, User, X } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookSquare } from 'react-icons/fa'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { loginAction, registerAction } from '@/pages/auth/actions'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/store/slices/authSlice'
import PhotoUpload from './photo-upload'

export function LoginForm({ className, path, ...props }) {
  const [page, setPage] = useState(path)
  const [showPassword, setShowPassword] = useState(false)
  const [pfp, setPfp] = useState(null)
  const [croppedPfp, setCroppedPfp] = useState(null)
  const [cropperOpen, setCropperOpen] = useState(false)
  const pfpInputRef = useRef(null)
  const nav = useNavigate()
  const dispatch = useDispatch()

  // Sync page state with path prop when it changes
  useEffect(() => {
    setPage(path)
  }, [path])

  const UserLoginSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password must be at most 20 characters long'),
  })

  const {
    mutateAsync: loginMutation,
    data: loginData,
    error: loginError,
    isPending: loginIsPending,
  } = useMutation({
    mutationFn: loginAction,
    queryKey: ['Login'],
    onSuccess: data => {
      console.log(data)
      dispatch(setUser(data.user))
      toast.success('Login successful!', {
        description: `Welcome back ${data.user.name}!`,
      })
      nav('/app/home')
    },
  })

  const {
    mutateAsync: registerMutation,
    data: registerData,
    error: registerError,
    isPending: registerIsPending,
  } = useMutation({
    mutationFn: registerAction,
    queryKey: ['Register'],
    onSuccess: data => {
      console.log(data)
      dispatch(setUser(data.user))
      toast.success('Registration successful!', {
        description: `Welcome ${data.user.name}!`,
      })
      nav('/app/home')
    },
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
    phone: yup.string().matches(/^[0-9]{10}$/, 'Enter 10 digit mobile number'),
    dateofbirth: yup.date().required('Date of Birth is required'),
  })

  const formikLogin = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: values => {
      loginMutation(values)
    },
    validationSchema: UserLoginSchema,
  })

  const formikRegister = useFormik({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
      phone: '',
      dateofbirth: '',
    },
    onSubmit: values => {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('username', values.username)
      formData.append('password', values.password)
      formData.append('repeatPassword', values.repeatPassword)
      formData.append('phone', values.phone)
      formData.append('dateofbirth', values.dateofbirth)
      formData.append('pfp', croppedPfp.blob, 'profile.jpg')
      registerMutation(formData)
    },
    validationSchema: UserRegisterSchema,
  })

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <Card className="glass-card">
        <CardHeader className="text-center">
          <Badge
            variant="secondary"
            className="mx-auto font-bold px-3 mb-1  bg-green-100/50 border border-green-200/50 text-green-700"
          >
            <Activity color="#22c55e" />
            MARKET OPEN
          </Badge>
          <CardTitle className="text-3xl font-bold text-slate-800">Welcome back</CardTitle>
          <CardDescription className="text-xs">
            Join 1K+ People practicing trade with <span className="text-black">Virtual Trade Sandbox</span>
          </CardDescription>
        </CardHeader>

        <div className="grid  grid-cols-2 w-[90%] p-1 gap-1 items-center mx-auto bg-gray-100 rounded-xl">
          <Button
            variant={page === 'login' ? 'outline' : 'secondary'}
            className="col-span-1 hover:bg-white text-slate-800 "
            onClick={() => nav('/authenticate/login')}
          >
            Login
          </Button>
          <Button
            variant={page === 'register' ? 'outline' : 'secondary'}
            className="col-span-1 hover:bg-white text-slate-800"
            onClick={() => nav('/authenticate/register')}
          >
            Register
          </Button>
        </div>
        {page === 'login' && (
          <CardContent>
            <form onSubmit={formikLogin.handleSubmit}>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <InputGroup className="bg-white">
                    <InputGroupInput
                      placeholder="m@example.com"
                      required
                      name="email"
                      type="email"
                      autoComplete="email"
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

                  <InputGroup className="bg-white">
                    <InputGroupInput
                      autoComplete="password"
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
                <Button
                  disabled={!formikLogin.isValid}
                  className="py-5 rounded-lg text-md primary-gradient cursor-pointer"
                  type="submit"
                >
                  Sign In
                </Button>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-transparent my-1">
                  Or continue with
                </FieldSeparator>

                <div className="grid grid-cols-2 w-[90%]   gap-3 items-center mx-auto  rounded-xl">
                  <Field>
                    <Button
                      onClick={() => window.open('http://localhost:4000/api/v1/oauth/google', '_self')}
                      className="col-span-1"
                      variant="outline"
                      type="button"
                    >
                      <FcGoogle />
                      Login with Google
                    </Button>
                  </Field>
                  <Field>
                    <Button
                      onClick={() => window.open('http://localhost:4000/api/v1/oauth/facebook', '_self')}
                      className="col-span-1"
                      variant="outline"
                      type="button"
                    >
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
            <form onSubmit={formikRegister.handleSubmit} encType="multipart/form-data">
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <InputGroup className="bg-white">
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
                  <InputGroup className="bg-white">
                    <InputGroupInput
                      autoComplete="email"
                      name="email"
                      placeholder="m@example.com"
                      value={formikRegister.values.email}
                      onChange={formikRegister.handleChange}
                      onBlur={formikRegister.handleBlur}
                      required
                      type="email"
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
                  <FieldLabel htmlFor="phone">Mobile Number</FieldLabel>
                  <InputGroup className="bg-white">
                    <InputGroupInput
                      // type="number"
                      maxLength={10}
                      name="phone"
                      placeholder="9876543210"
                      value={formikRegister.values.phone}
                      onChange={formikRegister.handleChange}
                      onBlur={formikRegister.handleBlur}
                      // required
                    />
                    <InputGroupAddon>
                      <Phone />
                    </InputGroupAddon>
                  </InputGroup>
                  {formikRegister.touched.phone && formikRegister.errors.phone && (
                    <p className="text-red-500 text-sm">{formikRegister.errors.phone}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup className="bg-white">
                    <InputGroupInput
                      autoComplete="password"
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
                  <InputGroup className="bg-white">
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
                  <InputGroup className="bg-white">
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

                <Field>
                  <FieldLabel htmlFor="pfp">Profile Photo</FieldLabel>
                  <InputGroup className="bg-white">
                    <InputGroupInput
                      ref={pfpInputRef}
                      type="file"
                      accept="image/*"
                      name="pfp"
                      placeholder="Upload your profile photo"
                      onChange={e => {
                        setPfp(e.target.files[0])
                        setCropperOpen(true)
                      }}
                      required
                    />
                  </InputGroup>
                </Field>
                {pfp && croppedPfp && (
                  <div className="flex justify-center gap-2">
                    <div className="relative min-w-36 min-h-36 w-36 h-36 border-2 border-slate-800 rounded-full">
                      <button
                        type="button"
                        className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 border-2"
                        onClick={() => {
                          setPfp(null)
                          setCroppedPfp(null)
                          if (pfpInputRef.current) pfpInputRef.current.value = ''
                        }}
                      >
                        <X size={18} />
                      </button>
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={croppedPfp.url}
                        alt="profile photo preview"
                      />
                    </div>
                  </div>
                )}
                {pfp &&
                  cropperOpen &&
                  createPortal(
                    <PhotoUpload
                      image={URL.createObjectURL(pfp)}
                      setCropperOpen={setCropperOpen}
                      setCroppedPfp={setCroppedPfp}
                    />,
                    document.body
                  )}

                <Button
                  className="py-5 rounded-lg text-md primary-gradient cursor-pointer"
                  disabled={!formikRegister.isValid}
                  type="submit"
                >
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
