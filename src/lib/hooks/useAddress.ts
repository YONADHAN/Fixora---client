import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    addAddress,
    deleteAddress,
    editAddress,
    getAddresses,
    getSingleAddress,
    setDefaultAddress,
} from '@/services/address/address.service'
import {
    AddAddressRequestDTO,
    EditAddressRequestDTO,
    GetAddressRequestDTO,
} from '@/dtos/address_dto'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export const useAddresses = (
    params: GetAddressRequestDTO,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ['addresses', params],
        queryFn: () => getAddresses(params),
        enabled: options?.enabled,
    })
}

export const useSingleAddress = (addressId: string) => {
    return useQuery({
        queryKey: ['address', addressId],
        queryFn: () => getSingleAddress(addressId),
        enabled: !!addressId,
    })
}

export const useAddAddress = (options?: {
    onSuccess?: (data: any) => void
    redirectPath?: string | null // null to disable redirect
}) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: (data: AddAddressRequestDTO) => addAddress(data),
        onSuccess: (data) => {
            toast.success('Address added successfully')
            queryClient.invalidateQueries({ queryKey: ['addresses'] })
            if (options?.onSuccess) {
                options.onSuccess(data)
            }
            if (options?.redirectPath !== null) {
                router.push(options?.redirectPath || '/customer/address')
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add address')
        },
    })
}

export const useEditAddress = (options?: {
    onSuccess?: (data: any) => void
    redirectPath?: string | null
}) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: (data: EditAddressRequestDTO) => editAddress(data),
        onSuccess: (data) => {
            toast.success('Address updated successfully')
            queryClient.invalidateQueries({ queryKey: ['addresses'] })
            if (options?.onSuccess) {
                options.onSuccess(data)
            }
            if (options?.redirectPath !== null) {
                router.push(options?.redirectPath || '/customer/address')
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update address')
        },
    })
}

export const useSetDefaultAddress = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (addressId: string) => setDefaultAddress(addressId),
        onSuccess: () => {
            toast.success('Default address updated')
            queryClient.invalidateQueries({ queryKey: ['addresses'] })
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || 'Failed to set default address'
            )
        },
    })
}

export const useDeleteAddress = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (addressId: string) => deleteAddress(addressId),
        onSuccess: () => {
            toast.success('Address deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['addresses'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete address')
        },
    })
}
