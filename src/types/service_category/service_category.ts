export interface TableItem {
  userId: string
  name: string
  status: string
  [key: string]: unknown
}

export interface ServiceCategoryItem extends TableItem {
  description: string
  bannerUrl: string
}

export interface GetAllCategoriesResponse {
  categories: ServiceCategoryItem[]
  totalPages: number
}
