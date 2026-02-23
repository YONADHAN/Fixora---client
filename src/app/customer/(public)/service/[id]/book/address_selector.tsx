'use client'

import { useState } from 'react'
import { useAddresses, useAddAddress, useEditAddress } from '@/lib/hooks/useAddress'
import { AddressForm, AddressFormData } from '@/components/shared-ui/address/address-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AddAddressRequestDTO, EditAddressRequestDTO } from '@/dtos/address_dto'
import { MapPin, Plus, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

interface AddressSelectorProps {
    selectedAddressId: string | null
    onSelect: (addressId: string) => void
}

export function AddressSelector({ selectedAddressId, onSelect }: AddressSelectorProps) {
    const customer = useSelector((state: RootState) => state.customer.customer)
    const isAuthenticated = !!customer

    const [isAddingNew, setIsAddingNew] = useState(false)
    const [editingAddress, setEditingAddress] = useState<any | null>(null)

    const { data, isLoading } = useAddresses(
        { page: 1, limit: 100 },
        { enabled: isAuthenticated }
    ) // Fetch all for selection

    const addMutation = useAddAddress({
        redirectPath: null,
        onSuccess: () => {
            setIsAddingNew(false)
        }
    })

    const editMutation = useEditAddress({
        redirectPath: null,
        onSuccess: () => {
            setEditingAddress(null)
        }
    })

    const addresses = data?.data || []

    const handleAddSubmit = async (data: AddressFormData) => {
        const payload: AddAddressRequestDTO = {
            ...data,
            geoLocation: {
                type: 'Point',
                coordinates: data.geoLocation.coordinates,
            },
        }

        await addMutation.mutateAsync(payload)
    }

    const handleEditSubmit = async (data: AddressFormData) => {
        if (!editingAddress) return

        const payload: EditAddressRequestDTO = {
            addressId: editingAddress.addressId,
            ...data,
            geoLocation: {
                type: 'Point',
                coordinates: data.geoLocation.coordinates,
            },
        }

        await editMutation.mutateAsync(payload)
    }

    if (isLoading) return <div className="text-sm text-muted-foreground p-4">Loading addresses...</div>

    // If no addresses, show add form immediately
    if (addresses.length === 0 && !isLoading && !isAddingNew) {
        return (
            <Card className="border-dashed">
                <CardContent className="pt-6">
                    <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground mb-2">No addresses found.</p>
                        <Button onClick={() => setIsAddingNew(true)}>Create New Address</Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Show Add Form
    if (isAddingNew) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-sm">Add New Address</h3>
                        <Button variant="ghost" size="sm" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                    </div>
                    <AddressForm
                        onSubmit={handleAddSubmit}
                        isLoading={addMutation.isPending}
                    />
                </CardContent>
            </Card>
        )
    }

    // Show Edit Form
    if (editingAddress) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-sm">Edit Address</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingAddress(null)}>Cancel</Button>
                    </div>
                    <AddressForm
                        defaultValues={{
                            ...editingAddress,
                            // Ensure geoLocation matches schema structure if needed, 
                            // assuming API response matches what form expects for coordinates
                        }}
                        onSubmit={handleEditSubmit}
                        isLoading={editMutation.isPending}
                        submitLabel="Update Address"
                    />
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
                {addresses.map((addr) => (
                    <div
                        key={addr.addressId}
                        className={cn(
                            "relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all group",
                            selectedAddressId === addr.addressId ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"
                        )}
                        onClick={() => onSelect(addr.addressId)}
                    >
                        <MapPin className={cn("mt-0.5 h-4 w-4", selectedAddressId === addr.addressId ? "text-primary" : "text-muted-foreground")} />
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between pr-8">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{addr.label}</span>
                                    {addr.isDefault && <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">Default</span>}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {addr.addressLine1}, {addr.city}, {addr.state}
                            </p>
                        </div>

                        {/* Edit Button */}
                        <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingAddress(addr)
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                            </Button>

                            {selectedAddressId === addr.addressId && (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setIsAddingNew(true)}
            >
                <Plus className="mr-2 h-4 w-4" /> Add Another Address
            </Button>
        </div>
    )
}
