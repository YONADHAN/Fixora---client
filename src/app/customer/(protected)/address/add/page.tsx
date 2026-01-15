'use client'

import { AddressForm, AddressFormData } from '@/components/shared-ui/address/address-form'
import { useAddAddress } from '@/lib/hooks/useAddress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AddAddressRequestDTO } from '@/dtos/address_dto'

export default function AddAddressPage() {
    const router = useRouter()
    const addMutation = useAddAddress()

    const handleSubmit = async (data: AddressFormData) => {
        // Transform FormData to DTO
        const payload: AddAddressRequestDTO = {
            ...data,

            geoLocation: {
                type: 'Point',
                coordinates: data.geoLocation.coordinates,
            },
            // location object is optional in DTO, zod ensures it matches if present
        }

        await addMutation.mutateAsync(payload)
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
                    <CardTitle>Add New Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <AddressForm
                        onSubmit={handleSubmit}
                        isLoading={addMutation.isPending}
                        submitLabel="Add Address"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
