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

const registerAction = async formData => {
  try {
    const response = await axiosInstance.post('/user/register', formData)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

// ─── Reset Password ─────────────────────────────────────────────────────────
const resetPasswordAction = async ({ oldPassword, newPassword }) => {
  try {
    const response = await axiosInstance.patch('/user/reset-password', {
      oldPassword,
      newPassword,
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

// ─── Update Profile Picture ──────────────────────────────────────────────────
// expects a Blob (from the PhotoUpload cropper)
const updateProfilePictureAction = async blob => {
  try {
    const formData = new FormData()
    formData.append('pfp', blob, 'profile.jpg')
    const response = await axiosInstance.patch('/user/update-profile-picture', formData)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

// ─── Update Display Name ─────────────────────────────────────────────────────
const updateDisplayNameAction = async name => {
  try {
    const response = await axiosInstance.patch('/user/update-display-name', { name })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export {
  loginAction,
  registerAction,
  resetPasswordAction,
  updateProfilePictureAction,
  updateDisplayNameAction,
}
