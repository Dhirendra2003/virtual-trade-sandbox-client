import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api/v1/',
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  resp => {
    return resp
  },
  async error => {
    console.log(' DEBUG : interceptor called')
    const originalRequest = error.config

    console.log('DEBUG: error.response:', error.response)
    console.log('DEBUG: status:', error.response?.status)
    console.log('DEBUG: data:', error.response?.data)
    console.log('DEBUG: tokenExpired:', error.response?.data?.tokenExpired)
    console.log('DEBUG: _retry:', originalRequest._retry)
    console.log('DEBUG: originalRequest:', originalRequest)

    // Check each condition separately
    console.log('DEBUG: status === 401?', error?.response?.status === 401)
    console.log('DEBUG: tokenExpired exists?', error?.response?.data?.tokenExpired)
    console.log('DEBUG: not retry?', !originalRequest._retry)
    if (error?.response?.status === 401 && error?.response.data?.tokenExpired && !originalRequest._retry) {
      console.log(' DEBUG : IF called')
      originalRequest._retry = true
      try {
        console.log(' DEBUG : before refresh call')
        await axios.get('http://localhost:4000/api/v1/user/refresh-token', {
          withCredentials: true,
        })
        console.log(' DEBUG : token refreshed')
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // window.location.href = "/login";
        window.alert('Session expired. Please log in again')
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)
