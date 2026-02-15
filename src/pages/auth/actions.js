import { axiosInstance } from '../../API/axios.js'
const loginAction = async values => {
  try {
    const response = await axiosInstance.post('/user/login', values)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const registerAction = async values => {
  try {
    const response = await axiosInstance.post('/user/register', values)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export { loginAction, registerAction }
