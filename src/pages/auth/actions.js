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

const forgotPasswordAction = async email => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { email })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const resetPasswordWithTokenAction = async ({ token, newPassword }) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', {
      token,
      newPassword,
    })
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

// ─── Update User Preferences ──────────────────────────────────────────────────
const updatePreferencesAction = async preferences => {
  try {
    const response = await axiosInstance.patch('/user/update-preferences', { preferences })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
const getUserStartingFunds = async () => {
  try {
    const response = await axiosInstance.get('/user/get-user-starting-funds')
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createPaymentIntentAction = async (amount) => {
  try {
    const response = await axiosInstance.post('/payment/create-payment-intent', { amount })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const confirmPaymentAction = async (paymentIntentId) => {

  try {
    const response = await axiosInstance.post('/payment/confirm-payment', { paymentIntentId })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export {
  loginAction,
  registerAction,
  forgotPasswordAction,
  resetPasswordWithTokenAction,
  resetPasswordAction,
  updateProfilePictureAction,
  updateDisplayNameAction,
  updatePreferencesAction,
  getUserStartingFunds,
  createPaymentIntentAction,
  confirmPaymentAction,
}
