import { BASE_URL } from './route'

export const ADMIN_ROUTES = {
  REFRESH_TOKEN: `${BASE_URL.ADMIN}/refresh-token`,
  LOGOUT: `${BASE_URL.ADMIN}/logout`,
  GET_ALL_CUSTOMERS: `${BASE_URL.ADMIN}/get-all-customers`,
  GET_ALL_VENDORS: `${BASE_URL.ADMIN}/get-all-vendors`,
  CHANGE_MY_USER_BLOCK_STATUS: `${BASE_URL.ADMIN}/change-my-user-block-status`,
  GET_VENDOR_REQUESTS: `${BASE_URL.ADMIN}/get_vendor_requests`,
  CHANGE_VENDOR_VERIFICATION_BLOCK_STATUS: `${BASE_URL.ADMIN}/vendor-verification-status`,
  CHANGE_PASSWORD: `${BASE_URL.ADMIN}/change-password`,
  CREATE_SERVICE_CATEGORY: `${BASE_URL.ADMIN}/category`,
  EDIT_SERVICE_CATEGORY: `${BASE_URL.ADMIN}/category`,
  GET_ALL_SERVICE_CATEGORIES: `${BASE_URL.ADMIN}/category`,
  BLOCK_SERVICE_CATEGORY: `${BASE_URL.ADMIN}/category/block`,
  GET_SINGLE_SERVICE_CATEGORY: `${BASE_URL.ADMIN}/category`,
  CREATE_SUB_SERVICE_CATEGORY: `${BASE_URL.ADMIN}/sub-service-category`,
  GET_ALL_SUB_SERVICE_CATEGORIES: `${BASE_URL.ADMIN}/sub-service-category`,
  EDIT_SUB_SERVICE_CATEGORY: `${BASE_URL.ADMIN}/sub-service-category`,
  GET_SINGLE_SUB_SERVICE_CATEGORY: `${BASE_URL.ADMIN}/sub-service-category`,
  TOGGLE_SUB_SERVICE_CATEGORY_BLOCK_STATUS: `${BASE_URL.ADMIN}/sub-service-category`,
  TOGGLE_SUB_SERVICE_CATEGORY_VERIFICATION_STATUS: `${BASE_URL.ADMIN}/sub-service-category/verification`,
}

export const VENDOR_ROUTES = {
  REFRESH_TOKEN: `${BASE_URL.VENDOR}/refresh-token`,
  LOGOUT: `${BASE_URL.VENDOR}/logout`,
  GET_PROFILE_INFO: `${BASE_URL.VENDOR}/profile-info`,
  UPDATE_PROFILE_INFO: `${BASE_URL.VENDOR}/update-profile-info`,
  UPLOAD_VERIFICATION_DOCUMENT: `${BASE_URL.VENDOR}/upload_verification_document`,
  STATUS_CHECK: `${BASE_URL.VENDOR}/status`,
  CHANGE_PASSWORD: `${BASE_URL.VENDOR}/change-password`,
  UPLOAD_PROFILE_IMAGE: `${BASE_URL.VENDOR}/avatar`,
  CREATE_SUB_SERVICE_CATEGORY: `${BASE_URL.VENDOR}/sub-service-category`,
  GET_VENDOR_SUB_SERVICE_CATEGORIES: `${BASE_URL.VENDOR}/sub-service-category/vendor-created`,
  CREATE_SERVICE: `${BASE_URL.VENDOR}/service`,
  GET_ALL_SERVICES: `${BASE_URL.VENDOR}/service`,
  EDIT_SERVICE_BY_ID: `${BASE_URL.VENDOR}/service`,
}

export const CUSTOMER_ROUTES = {
  REFRESH_TOKEN: `${BASE_URL.CUSTOMER}/refresh-token`,
  LOGOUT: `${BASE_URL.CUSTOMER}/logout`,
  GET_PROFILE_INFO: `${BASE_URL.CUSTOMER}/profile-info`,
  UPDATE_PROFILE_INFO: `${BASE_URL.CUSTOMER}/update-profile-info`,
  CHANGE_PASSWORD: `${BASE_URL.CUSTOMER}/change-password`,
  UPLOAD_PROFILE_IMAGE: `${BASE_URL.CUSTOMER}/avatar`,
  GET_ACTIVE_SERVICE_CATEGORIES: `${BASE_URL.CUSTOMER}/service_category`,
  GET_SERVICES_BY_ID: `${BASE_URL.CUSTOMER}/service`,
}

export const AUTH_ROUTES = {
  SEND_OTP: `${BASE_URL.AUTH}/send-otp`,
  VERIFY_OTP: `${BASE_URL.AUTH}/verify-otp`,
  SIGNUP: `${BASE_URL.AUTH}/signup`,
  SIGNIN: `${BASE_URL.AUTH}/signin`,
  FORGOT_PASSWORD: `${BASE_URL.AUTH}/forgot-password`,
  RESET_PASSWORD: `${BASE_URL.AUTH}/reset-password`,
  LOGOUT: `${BASE_URL.AUTH}/logout`,
  GOOGLE_AUTH: `${BASE_URL.AUTH}/google-auth`,
}
