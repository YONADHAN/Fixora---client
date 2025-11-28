import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  admin_createSubServiceCategories,
  vendor_createSubServiceCategories,
  getAllSubServiceCategories,
  editSubServiceCategories,
  getSingleSubServiceCategory,
  toggleBlockStatusOfSubServiceCategory,
  toggleVerificationStatusOfSubServiceCategory,
  getAllVendorSubServiceCategories,
  getAllSubServiceCategoriesBasedOnServiceCategoryId,
} from '@/services/sub_service_category/sub_service_category'
import {
  RequestAllSubServiceCategoriesBasedOnServiceCategoryIdDTO,
  RequestAllVendorSubServiceCategoriesDTO,
  RequestCreateSubServiceCategoryDTO,
  RequestEditSubServiceCategoriesDTO,
  RequestGetAllSubServiceCategoriesDTO,
  ResponseAllSubServiceCategoriesBasedOnServiceCategoryIdDTO,
  ResponseAllVendorSubServiceCategoriesDTO,
  ResponseGetAllSubServiceCategoriesDTO,
} from '@/dtos/sub_service_categories_dto'
import { AxiosError } from 'axios'

// ---------------------------------------------------------------
// CREATE SUB SERVICE CATEGORY (Admin & Vendor)
// ---------------------------------------------------------------
export const useCreateSubServiceCategoryAdmin = () => {
  return useMutation({
    mutationFn: (payload: RequestCreateSubServiceCategoryDTO) =>
      admin_createSubServiceCategories(payload),
    onError: (error: unknown) => {
      if (error instanceof AxiosError)
        console.log(
          'error creating sub service category',
          error?.response?.data?.message
        )
    },
  })
}

export const useCreateSubServiceCategoryVendor = () => {
  return useMutation({
    mutationFn: (payload: RequestCreateSubServiceCategoryDTO) =>
      vendor_createSubServiceCategories(payload),
    onError: (error: unknown) => {
      if (error instanceof AxiosError)
        console.log(
          'error creating sub service category',
          error?.response?.data?.message
        )
    },
  })
}

// ---------------------------------------------------------------
// GET ALL SUB SERVICE CATEGORIES
// ---------------------------------------------------------------
export const useGetAllSubServiceCategories = (
  payload: RequestGetAllSubServiceCategoriesDTO
) => {
  return useQuery<ResponseGetAllSubServiceCategoriesDTO>({
    queryKey: ['subServiceCategories', payload],
    queryFn: () => getAllSubServiceCategories(payload),
  })
}

// ---------------------------------------------------------------
// GET SINGLE SUB SERVICE CATEGORY
// ---------------------------------------------------------------
export const useGetSingleSubServiceCategory = (
  subServiceCategoryId: string
) => {
  return useQuery({
    queryKey: ['SingleSubServiceCategory', subServiceCategoryId],
    queryFn: () => getSingleSubServiceCategory({ subServiceCategoryId }),
    enabled: !!subServiceCategoryId,
  })
}

// ---------------------------------------------------------------
// EDIT SUB SERVICE CATEGORY
// ---------------------------------------------------------------
// hooks/useSubServiceCategory.ts
export const useEditSubServiceCategory = () => {
  return useMutation({
    mutationFn: (formData: FormData) => editSubServiceCategories(formData),
  })
}

// ---------------------------------------------------------------
// TOGGLE BLOCK STATUS
// ---------------------------------------------------------------
export const useToggleBlockStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleBlockStatusOfSubServiceCategory,

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['subServiceCategories'] })

      const previousData =
        queryClient.getQueryData<ResponseGetAllSubServiceCategoriesDTO>([
          'subServiceCategories',
        ])

      queryClient.setQueryData<ResponseGetAllSubServiceCategoriesDTO>(
        ['subServiceCategories'],
        (old) => {
          if (!old) return old

          return {
            ...old,
            data: old.data.map((item) =>
              item.subServiceCategoryId === payload.subServiceCategoryId
                ? { ...item, isActive: payload.blockStatus }
                : item
            ),
          }
        }
      )

      return { previousData }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previousData)
        queryClient.setQueryData(['subServiceCategories'], ctx.previousData)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['subServiceCategories'] })
    },
  })
}

// ---------------------------------------------------------------
// VENDOR GET ALL SUB SERVICES
// ---------------------------------------------------------------
export const useGetVendorSubServiceCategories = (
  payload: RequestAllVendorSubServiceCategoriesDTO
) => {
  return useQuery<ResponseAllVendorSubServiceCategoriesDTO>({
    queryKey: ['vendorSubServiceCategories', payload],
    queryFn: () => getAllVendorSubServiceCategories(payload),
  })
}
//----------------------------------------------------------------
//GET ALL SUB SERVICE CATEGORIES BY GIVING SERVICE CATEGORY ID
//---------------------------------------------------------------
export const useSubServiceCategoriesBasedOnServiceCategoryId = (
  payload: RequestAllSubServiceCategoriesBasedOnServiceCategoryIdDTO
) => {
  return useQuery<ResponseAllSubServiceCategoriesBasedOnServiceCategoryIdDTO>({
    queryKey: ['getAllSubServiceCategoriesBasedOnServiceCategoryId', payload],
    queryFn: () => getAllSubServiceCategoriesBasedOnServiceCategoryId(payload),
  })
}

// ---------------------------------------------------------------
// TOGGLE VERIFICATION STATUS
// ---------------------------------------------------------------
export const useToggleVerificationStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleVerificationStatusOfSubServiceCategory,

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['subServiceCategories'] })

      const previousData =
        queryClient.getQueryData<ResponseGetAllSubServiceCategoriesDTO>([
          'subServiceCategories',
        ])

      queryClient.setQueryData<ResponseGetAllSubServiceCategoriesDTO>(
        ['subServiceCategories'],
        (old) => {
          if (!old) return old

          return {
            ...old,
            data: old.data.map((item) =>
              item.subServiceCategoryId === payload.subServiceCategoryId
                ? { ...item, verification: payload.verificationStatus }
                : item
            ),
          }
        }
      )

      return { previousData }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previousData)
        queryClient.setQueryData(['subServiceCategories'], ctx.previousData)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['subServiceCategories'] })
    },
  })
}
