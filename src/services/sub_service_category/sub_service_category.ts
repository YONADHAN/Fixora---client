import { axiosInstance } from '@/api/interceptor'
import {
  RequestAllSubServiceCategoriesBasedOnServiceCategoryIdDTO,
  RequestAllVendorSubServiceCategoriesDTO,
  RequestCreateSubServiceCategoryDTO,
  RequestEditSubServiceCategoriesDTO,
  RequestGetAllSubServiceCategoriesDTO,
  RequestGetSingleSubServiceCategoryDTO,
  RequestToggleBlockStatusOfSubServiceCategoryDTO,
  RequestToggleVerificationStatusOfSubServiceCategoryDTO,
  ResponseAllSubServiceCategoriesBasedOnServiceCategoryIdDTO,
  ResponseAllVendorSubServiceCategoriesDTO,
  ResponseCreateSubServiceCategoryDTO,
  ResponseEditSubServiceCategoriesDTO,
  ResponseGetAllSubServiceCategoriesDTO,
  ResponseGetSingleSubServiceCategoryDTO,
} from '@/dtos/sub_service_categories_dto'
import { ADMIN_ROUTES, VENDOR_ROUTES } from '@/utils/constants/api.routes'
import { BASE_URL } from '@/utils/constants/route'

export const admin_createSubServiceCategories = async (
  payload: RequestCreateSubServiceCategoryDTO
): Promise<ResponseCreateSubServiceCategoryDTO> => {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('serviceCategoryId', payload.serviceCategoryId)
  // formData.append('serviceCategoryName', payload.serviceCategoryName)
  formData.append('SubServiceCategoryImage', payload.bannerImage)

  const response = await axiosInstance.post(
    ADMIN_ROUTES.CREATE_SUB_SERVICE_CATEGORY,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data.data as ResponseCreateSubServiceCategoryDTO
}

export const vendor_createSubServiceCategories = async (
  payload: RequestCreateSubServiceCategoryDTO
): Promise<ResponseCreateSubServiceCategoryDTO> => {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('serviceCategoryId', payload.serviceCategoryId)
  // formData.append('serviceCategoryName', payload.serviceCategoryName)
  formData.append('SubServiceCategoryImage', payload.bannerImage)

  const response = await axiosInstance.post(
    VENDOR_ROUTES.CREATE_SUB_SERVICE_CATEGORY,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data.data as ResponseCreateSubServiceCategoryDTO
}

export const getAllSubServiceCategories = async (
  payload: RequestGetAllSubServiceCategoriesDTO
): Promise<ResponseGetAllSubServiceCategoriesDTO> => {
  const response = await axiosInstance.get(
    ADMIN_ROUTES.GET_ALL_SUB_SERVICE_CATEGORIES,
    {
      params: {
        page: payload.page,
        limit: payload.limit,
        search: payload.search || '',
      },
    }
  )
  return response.data.data as ResponseGetAllSubServiceCategoriesDTO
}

export const getAllVendorSubServiceCategories = async (
  payload: RequestAllVendorSubServiceCategoriesDTO
): Promise<ResponseAllVendorSubServiceCategoriesDTO> => {
  const response = await axiosInstance.get(
    VENDOR_ROUTES.GET_VENDOR_SUB_SERVICE_CATEGORIES,
    {
      params: {
        page: payload.page,
        limit: payload.limit,
        search: payload.search || '',
      },
    }
  )
  return response.data.data as ResponseAllVendorSubServiceCategoriesDTO
}

// services/sub_service_category
export const editSubServiceCategories = async (formData: FormData) => {
  const response = await axiosInstance.patch(
    ADMIN_ROUTES.EDIT_SUB_SERVICE_CATEGORY,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  )

  return response.data.data
}

export const getSingleSubServiceCategory = async (
  payload: RequestGetSingleSubServiceCategoryDTO
): Promise<ResponseGetSingleSubServiceCategoryDTO> => {
  const response = await axiosInstance.get(
    `${ADMIN_ROUTES.GET_SINGLE_SUB_SERVICE_CATEGORY}/${payload.subServiceCategoryId}`
  )

  return response.data.data as ResponseGetSingleSubServiceCategoryDTO
}

export const toggleBlockStatusOfSubServiceCategory = async (
  payload: RequestToggleBlockStatusOfSubServiceCategoryDTO
): Promise<void> => {
  return axiosInstance.patch(
    `${ADMIN_ROUTES.TOGGLE_SUB_SERVICE_CATEGORY_BLOCK_STATUS}/${payload.subServiceCategoryId}`,
    null,
    {
      params: {
        blockStatus: payload.blockStatus,
      },
    }
  )
}
export const toggleVerificationStatusOfSubServiceCategory = async (
  payload: RequestToggleVerificationStatusOfSubServiceCategoryDTO
): Promise<void> => {
  return axiosInstance.patch(
    `${ADMIN_ROUTES.TOGGLE_SUB_SERVICE_CATEGORY_VERIFICATION_STATUS}/${payload.subServiceCategoryId}`,
    null,
    {
      params: {
        verificationStatus: payload.verificationStatus,
      },
    }
  )
}

//GET ALL APPROVED SUBS FOR PUBLIC USING SERVICE_CATEGORY_ID
export const getAllSubServiceCategoriesBasedOnServiceCategoryId = async (
  payload: RequestAllSubServiceCategoriesBasedOnServiceCategoryIdDTO
): Promise<ResponseAllSubServiceCategoriesBasedOnServiceCategoryIdDTO> => {
  const response = await axiosInstance.get(
    `${BASE_URL.CUSTOMER}/sub-service-category/search/sub-service-categories`,
    {
      params: {
        serviceCategoryId: payload.serviceCategoryId,
        page: payload.page,
        limit: payload.limit,
        search: payload.search || '',
      },
    }
  )
  console.log('response', response.data.data)
  return response.data.data
}

export const getActiveSubServiceCategories = async () => {
  const response = await axiosInstance.get(
    `${BASE_URL.VENDOR}/sub-service-category/active`
  )

  return response.data.data.data
}
