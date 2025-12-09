import {
  RequestEditServiceDTO,
  RequestGetAllServicesDTO,
  RequestGetServiceByIdDTO,
  RequestToggleBlockServiceDTO,
  ResponseEditServiceDTO,
  ResponseGetAllServicesDTO,
  ResponseGetServiceByIdDTO,
  ResponseToggleBlockServiceDTO,
} from '@/dtos/service_dto'
import { mapFormToCreateServiceFormData } from '@/mapper/service/createService.mapper'
import {
  createService,
  editServiceById,
  getAllServices,
  getServiceById,
  toggleServiceById,
} from '@/services/service/service.service'
import { IServiceFormValues } from '@/types/service_feature/service.types'
import { useMutation, useQuery } from '@tanstack/react-query'
export const useCreateService = () => {
  return useMutation({
    mutationFn: (values: IServiceFormValues) => {
      const fd = mapFormToCreateServiceFormData(values)
      return createService(fd)
    },
  })
}

export const useGetAllServices = (payload: RequestGetAllServicesDTO) => {
  return useQuery<ResponseGetAllServicesDTO>({
    queryKey: ['getAllServices', payload],
    queryFn: () => getAllServices(payload),
  })
}

export const useGetServicesById = (payload: RequestGetServiceByIdDTO) => {
  return useQuery<ResponseGetServiceByIdDTO>({
    queryKey: ['getServiceById', payload],
    queryFn: () => getServiceById(payload),
  })
}

export const useEditServiceById = () => {
  return useMutation({
    mutationFn: ({
      serviceId,
      payload,
    }: {
      serviceId: string
      payload: RequestEditServiceDTO
    }) => editServiceById(serviceId, payload),
  })
}

export const useToggleServiceById = () => {
  return useMutation<
    ResponseToggleBlockServiceDTO,
    Error,
    RequestToggleBlockServiceDTO
  >({
    mutationFn: (payload) => toggleServiceById(payload),
  })
}
