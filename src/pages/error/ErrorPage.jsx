import React from 'react'
import Logo from '/logo_v1.png'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { CircleArrowLeft } from 'lucide-react'

const ErrorPage = () => {
  const navigate = useNavigate()
  return (
    <div className="primary-gradient">
      <div className="glass-bg flex min-h-svh flex-col items-center justify-center gap-6 p-6 ">
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="flex flex-col items-center justify-center  ">
            <img src={Logo} alt="Virtual Trade Sandbox " className="h-36 w-36 mb-6 grayscale  " />
            <div className="flex gap-2 items-center tracking-tight">
              <h1 className="text-4xl font-bold">404</h1>
              <p className="text-2xl">Page not found</p>
            </div>
          </div>
          <Button
            className="cursor-pointer rounded-lg py-5 text-md primary-gradient w-[50%] mx-auto"
            onClick={() => navigate(-1)}
          >
            <CircleArrowLeft />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
