export interface TableItem {
  userId: string
  name: string
  status: string
  [key: string]: unknown
}

export interface ServiceCategoryItem {
  id: string
  categoryId: string
  name: string
  description: string
  bannerUrl: string
  status: string
  [key: string]: unknown
}

export interface GetAllCategoriesResponse {
  categories: ServiceCategoryItem[]
  totalPages: number
  currentPage: number
}

export interface ActiveServiceCategoryItem {
  serviceCategoryId: string
  name: string
  description: string
  bannerImage: string
}

export interface GetActiveServiceCategoryResponse {
  data: ActiveServiceCategoryItem[]
}
