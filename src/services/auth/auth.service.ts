import { axiosInstance } from '@/api/interceptor'
import { RegisterPayload, LoginPayload } from '@/lib/schemas/registerSchema'
import { AUTH_ROUTES } from '@/utils/constants/api.routes'

export const sendOtp = async (email: string) => {
  const response = await axiosInstance.post(AUTH_ROUTES.SEND_OTP, { email })
  return response.data
}

export const verifyOtp = async (email: string, otp: string) => {
  const response = await axiosInstance.post(AUTH_ROUTES.VERIFY_OTP, {
    email,
    otp,
  })
  return response.data
}

export const signup = async (payload: RegisterPayload) => {
  const response = await axiosInstance.post(AUTH_ROUTES.SIGNUP, payload)
  return response.data
}

export const signin = async (payload: LoginPayload) => {
  const response = await axiosInstance.post(AUTH_ROUTES.SIGNIN, payload)
  return response.data
}

export const forgotPassword = async (email: string, role: string) => {
  const response = await axiosInstance.post(AUTH_ROUTES.FORGOT_PASSWORD, {
    email,
    role,
  })
  return response
}

export const GoogleAuthentication = async (
  credential: string,
  client_id: string,
  role: string
) => {
  const response = await axiosInstance.post(AUTH_ROUTES.GOOGLE_AUTH, {
    credential,
    client_id,
    role,
  })
  return response
}

export const resetPassword = async (
  password: string,
  token: string,
  role: string
) => {
  const response = await axiosInstance.post(AUTH_ROUTES.RESET_PASSWORD, {
    password,
    token,
    role,
  })
  return response
}

export const logout = async () => {
  const response = await axiosInstance.post(AUTH_ROUTES.LOGOUT)
  return response
}
