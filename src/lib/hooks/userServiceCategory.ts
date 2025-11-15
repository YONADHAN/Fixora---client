import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAllServiceCategories,
  editServiceCategories,
  createServiceCategories,
  blockServiceCategory,
  getSingleServiceCategory,
} from '@/services/service_category/service_category'

import {
  ServiceCategoryItem,
  GetAllCategoriesResponse,
} from '@/types/service_category/service_category'

/* ---------------------------
   CREATE SERVICE CATEGORY
---------------------------- */
export const useCreateServiceCategory = () => {
  return useMutation({
    mutationFn: (data: {
      name: string
      description: string
      bannerImage: File
    }) =>
      createServiceCategories(data.name, data.description, data.bannerImage),
  })
}
/* ---------------------------
   GET SINGE SERVICE CATEGORY
---------------------------- */
export const useGetSingleServiceCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['GetSingleServiceCategory', categoryId],
    queryFn: () => getSingleServiceCategory(categoryId),
    enabled: !!categoryId,
  })
}

/* ---------------------------
   EDIT SERVICE CATEGORY
---------------------------- */
export const useEditServiceCategory = () => {
  return useMutation({
    mutationFn: (data: {
      categoryId: string
      name: string
      description: string
      bannerImage?: File
    }) =>
      editServiceCategories(
        data.categoryId,
        data.name,
        data.description,
        data.bannerImage
      ),
  })
}

/* ---------------------------
   GET ALL SERVICE CATEGORIES
---------------------------- */
export const useGetAllServiceCategories = (
  page: number,
  limit: number,
  search: string
) => {
  return useQuery<GetAllCategoriesResponse>({
    queryKey: ['serviceCategories', page, limit, search],
    queryFn: () => getAllServiceCategories(page, limit, search),
  })
}

/* ---------------------------
   BLOCK / UNBLOCK CATEGORY
   (Optimistic Update)
---------------------------- */
export const useBlockServiceCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { categoryId: string; status: string }) =>
      blockServiceCategory(data.categoryId, data.status),

    onMutate: async ({ categoryId, status }) => {
      await queryClient.cancelQueries({
        queryKey: ['serviceCategories'],
      })

      const previousData = queryClient.getQueryData<GetAllCategoriesResponse>([
        'serviceCategories',
      ])

      queryClient.setQueryData<GetAllCategoriesResponse>(
        ['serviceCategories'],
        (old) => {
          if (!old) return old

          return {
            ...old,
            categories: old.categories.map((cat: ServiceCategoryItem) =>
              cat.userId === categoryId
                ? {
                    ...cat,
                    status: status === 'active' ? 'active' : 'inactive',
                  }
                : cat
            ),
          }
        }
      )

      return { previousData }
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['serviceCategories'], context.previousData)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['serviceCategories'],
      })
    },
  })
}
