import { axiosInstance } from '@/api/interceptor'
import {
    AddAddressRequestDTO,
    GetAddressRequestDTO,
    GetAddressResponseDTO,
    EditAddressRequestDTO,
    GetSingleAddressResponseDTO,
} from '@/dtos/address_dto'
import { ADDRESS_ROUTES } from '@/utils/constants/api.routes'

// Get all addresses
export const getAddresses = async (
    params: GetAddressRequestDTO
): Promise<GetAddressResponseDTO> => {
    const { page, limit, search } = params
    const res = await axiosInstance.get(ADDRESS_ROUTES.GET_MY_ADDRESSES, {
        params: { page, limit, search },
    })
    return res.data.data
}

// Get single address
export const getSingleAddress = async (
    addressId: string
): Promise<GetSingleAddressResponseDTO['data']> => {
    const res = await axiosInstance.get(
        `${ADDRESS_ROUTES.GET_SINGLE_ADDRESS}/${addressId}`
    )
    return res.data.data
}

// Add address
export const addAddress = async (data: AddAddressRequestDTO) => {
    const res = await axiosInstance.post(ADDRESS_ROUTES.ADD_ADDRESS, data)
    return res.data
}

// Edit address
export const editAddress = async (data: EditAddressRequestDTO) => {
    const { addressId, ...payload } = data
    const res = await axiosInstance.patch(
        `${ADDRESS_ROUTES.EDIT_ADDRESS}/${addressId}`,
        payload
    )
    return res.data
}

// Set default address
export const setDefaultAddress = async (addressId: string) => {
    const res = await axiosInstance.patch(
        `${ADDRESS_ROUTES.SET_DEFAULT_ADDRESS}/${addressId}/default`
    )
    return res.data
}

// Delete address
export const deleteAddress = async (addressId: string) => {
    const res = await axiosInstance.delete(
        `${ADDRESS_ROUTES.DELETE_ADDRESS}/${addressId}`
    )
    return res.data
}
