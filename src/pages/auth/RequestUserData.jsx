import { axiosInstance } from '../../API/axios.js'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { setUser } from '../../store/slices/authSlice'

const RequestUserData = () => {
  const nav = useNavigate()
  const dispatch = useDispatch()
  //call to server for getting info only on basis of cookies
  const callgetData = () =>
    axiosInstance
      .get('/user/get-user-data', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        console.log(response.data)
        dispatch(setUser(response.data.user))
        return nav('/dashboard')
      })
      .catch(error => {
        console.log(error)
        return nav('/authenticate/login')
      })

  useEffect(() => {
    callgetData()
  }, [])

  return <h1>Loading...</h1>
}

export default RequestUserData
