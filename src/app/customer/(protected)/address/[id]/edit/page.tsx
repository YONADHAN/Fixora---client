'use client'

import { useParams, useRouter } from 'next/navigation'
import { AddressForm, AddressFormData } from '@/components/shared-ui/address/address-form'
import { useEditAddress, useSingleAddress } from '@/lib/hooks/useAddress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { EditAddressRequestDTO } from '@/dtos/address_dto'
import { useEffect, useState } from 'react'

export default function EditAddressPage() {
    const router = useRouter()
    const params = useParams()
    const addressId = params.id as string

    // Fetch existing data
    const { data: addressData, isLoading: isFetching } = useSingleAddress(addressId)
    const editMutation = useEditAddress() // Now uses toast internally from hook

    const [defaultValues, setDefaultValues] = useState<Partial<AddressFormData> | undefined>(undefined)

    useEffect(() => {
        if (addressData) {
            setDefaultValues({
                label: addressData.label,
                addressType: addressData.addressType,
                isDefault: addressData.isDefault,
                isActive: true, // Assuming active if editable
                contactName: addressData.contactName,
                contactPhone: addressData.contactPhone,
                addressLine1: addressData.addressLine1,
                addressLine2: addressData.addressLine2,
                landmark: addressData.landmark,
                city: addressData.city,
                state: addressData.state,
                country: addressData.country,
                zipCode: addressData.zipCode,
                instructions: addressData.instructions,
                geoLocation: addressData.geoLocation,
                location: addressData.location
            })
        }
    }, [addressData])

    const handleSubmit = async (data: AddressFormData) => {
        // Transform FormData to DTO
        const payload: EditAddressRequestDTO = {
            addressId, // Add ID for edit
            ...data,
            geoLocation: {
                type: 'Point',
                coordinates: data.geoLocation.coordinates
            }
        }

        await editMutation.mutateAsync(payload)
    }

    if (isFetching) {
        return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
    }

    if (!addressData) {
        return <div className="text-center py-10">Address not found</div>
    }

    return (
        <div className='container mx-auto py-8 max-w-2xl'>
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground p-0 hover:bg-transparent hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Addresses
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <AddressForm
                        defaultValues={defaultValues}
                        onSubmit={handleSubmit}
                        isLoading={editMutation.isPending}
                        submitLabel="Update Address"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
