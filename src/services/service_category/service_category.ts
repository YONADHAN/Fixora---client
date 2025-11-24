import { axiosInstance } from '@/api/interceptor'
import { ADMIN_ROUTES, CUSTOMER_ROUTES } from '@/utils/constants/api.routes'
import { ServiceCategoryItem } from '@/types/service_category/service_category'

// Backend structure from API
interface BackendServiceCategory {
  serviceCategoryId: string
  name: string
  description: string
  bannerImage: string
  isActive: boolean
}

// Returned to frontend
export interface GetAllCategoriesResponse {
  categories: ServiceCategoryItem[]
  currentPage: number
  totalPages: number
}

export const createServiceCategories = async (
  name: string,
  description: string,
  bannerImage: File
) => {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('description', description)
  formData.append('ServiceCategoryBannerImage', bannerImage)

  return axiosInstance.post(ADMIN_ROUTES.CREATE_SERVICE_CATEGORY, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const editServiceCategories = async (
  categoryId: string,
  name: string,
  description: string,
  bannerImage?: File
) => {
  const formData = new FormData()
  formData.append('categoryId', categoryId)
  formData.append('name', name)
  formData.append('description', description)

  if (bannerImage) {
    formData.append('bannerImage', bannerImage)
  }

  return axiosInstance.patch(ADMIN_ROUTES.EDIT_SERVICE_CATEGORY, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getAllServiceCategories = async (
  page: number,
  limit: number,
  search: string
): Promise<GetAllCategoriesResponse> => {
  const response = await axiosInstance.get<{
    success: boolean
    response: {
      data: BackendServiceCategory[]
      currentPage: number
      totalPages: number
    }
  }>(ADMIN_ROUTES.GET_ALL_SERVICE_CATEGORIES, {
    params: { page, limit, search },
  })

  const { data, currentPage, totalPages } = response.data.response

  const mapped: ServiceCategoryItem[] = data.map((cat) => ({
    id: cat.serviceCategoryId,
    categoryId: cat.serviceCategoryId,
    name: cat.name,
    description: cat.description,
    bannerUrl: cat.bannerImage,
    status: cat.isActive ? 'active' : 'inactive',
  }))

  return {
    categories: mapped,
    currentPage,
    totalPages,
  }
}

export const blockServiceCategory = async (
  categoryId: string,
  status: string
) => {
  return axiosInstance.patch(ADMIN_ROUTES.BLOCK_SERVICE_CATEGORY, {
    categoryId,
    status,
  })
}

export const getSingleServiceCategory = async (categoryId: string) => {
  return axiosInstance.get(
    `${ADMIN_ROUTES.GET_SINGLE_SERVICE_CATEGORY}/${categoryId}`
  )
}

export const getActiveServiceCategories = async () => {
  return axiosInstance.get(`${CUSTOMER_ROUTES.GET_ACTIVE_SERVICE_CATEGORIES}`)
}
