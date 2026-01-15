
export interface AddressDTO {
    addressId: string
    label: string
    addressType: 'home' | 'office' | 'other'
    isDefault: boolean
    isActive: boolean
    contactName?: string
    contactPhone?: string
    addressLine1: string
    addressLine2?: string;
    landmark?: string
    city?: string
    state?: string
    country: string
    zipCode?: string
    instructions?: string
    geoLocation: {
        type: 'Point'
        coordinates: [number, number]
    }
    location?: {
        name?: string
        displayName?: string
    }
}

export interface GetAddressRequestDTO {
    page: number
    limit: number
    search?: string
    customerId?: string
}

export interface GetAddressResponseDTO {
    data: AddressDTO[]
    page: number
    limit: number
    totalDocs: number;
    totalPages: number
}

export type AddAddressRequestDTO = Omit<AddressDTO, 'addressId'>

export type EditAddressRequestDTO = Partial<AddAddressRequestDTO> & { addressId: string }

export interface GetSingleAddressResponseDTO {
    data: AddressDTO
}
