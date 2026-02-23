import { statusTypes, verificationTypes } from '@/types/user.type'

//create sub service category api
export interface RequestCreateSubServiceCategoryDTO {
  name: string
  description: string
  bannerImage: File
  serviceCategoryId: string
  //serviceCategoryName: string
}

export interface ResponseCreateSubServiceCategoryDTO {
  name: string
  description: string
  bannerImage: string
  serviceCategoryId: string
  serviceCategoryName: string
  subServiceCategoryId: string
}

//get all sub service category api
export interface RequestGetAllSubServiceCategoriesDTO {
  page: number
  limit: number
  search: string
}

export interface SubServiceCategoryItem {
  name: string
  description: string
  bannerImage: string
  serviceCategoryId: string
  serviceCatgoryName: string
  subServiceCategoryId: string
  isActive: statusTypes
  verification: verificationTypes
}
export interface ResponseGetAllSubServiceCategoriesDTO {
  data: SubServiceCategoryItem[]
  currentPage: number
  totalPages: number
}

//edit all sub service category api
export interface RequestEditSubServiceCategoriesDTO {
  subServiceCategoryId: string
  name: string
  description: string
  serviceCategoryId: string
  serviceCategoryName: string
  bannerImage: File
}

export interface ResponseEditSubServiceCategoriesDTO {
  name: string
  description: string
  bannerImage: string
  serviceCategoryId: string
  serviceCategoryName: string
  subServiceCategoryId: string
}

//get single sub service category api
export interface RequestGetSingleSubServiceCategoryDTO {
  subServiceCategoryId: string
}

export interface ResponseGetSingleSubServiceCategoryDTO {
  subServiceCategoryId: string
  serviceCategoryId: string
  serviceCategoryName: string
  name: string
  description: string
  bannerImage: string
  isActive: statusTypes
  verification: verificationTypes
  createdById: string
  createdByRole: string
  createdAt: Date
  updatedAt: Date
}

//toggle block status of sub service category

export interface RequestToggleBlockStatusOfSubServiceCategoryDTO {
  subServiceCategoryId: string
  blockStatus: statusTypes
}

//toggle verification status of sub service category

export interface RequestToggleVerificationStatusOfSubServiceCategoryDTO {
  subServiceCategoryId: string
  verificationStatus: verificationTypes
}

export interface RequestAllVendorSubServiceCategoriesDTO {
  page: number
  limit: number
  search: string
}

export interface SubServiceCategoryItem {
  subServiceCategoryId: string
  serviceCategoryId: string
  serviceCategoryName: string
  name: string
  description: string
  bannerImage: string
  isActive: statusTypes
  verification: verificationTypes
}

export interface ResponseAllVendorSubServiceCategoriesDTO {
  data: SubServiceCategoryItem[]
  currentPage: number
  totalPages: number
}

export interface RequestAllSubServiceCategoriesBasedOnServiceCategoryIdDTO {
  serviceCategoryId: string
  page: string
  limit: string
  search: string
}

export interface SubServiceCategoryItemWithMinimumFields {
  subServiceCategoryId: string
  name: string
  description: string
  bannerImage: string
}

export interface ResponseAllSubServiceCategoriesBasedOnServiceCategoryIdDTO {
  data: SubServiceCategoryItemWithMinimumFields[]
  currentPage: number
  totalPages: number
}
