'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ResponsiveTable,
    ColumnDefinition,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from '@/lib/hooks/useAddress'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface AddressItem {
    id: string
    addressId: string
    label: string
    addressLine1: string
    city: string
    state: string
    addressType: 'home' | 'office' | 'other'
    isDefault: boolean
}

export default function AddressListPage() {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const limit = 10

    // Hooks
    const { data, isLoading } = useAddresses({
        page: currentPage,
        limit,
        search: debouncedSearch,
        customerId: '', // Handled by backend from token
    })

    const deleteMutation = useDeleteAddress()
    const setDefaultMutation = useSetDefaultAddress()

    // Delete Modal State
    const [deleteId, setDeleteId] = useState<string | null>(null)

    // Handlers
    const handleSearch = () => {
        setDebouncedSearch(searchTerm)
        setCurrentPage(1)
    }

    const handleDeleteConfirm = async () => {
        if (deleteId) {
            await deleteMutation.mutateAsync(deleteId)
            setDeleteId(null)
        }
    }

    const handleSetDefault = async (id: string, isDefault: boolean) => {
        if (!isDefault) {
            await setDefaultMutation.mutateAsync(id)
        }
    }

    // Table Config
    const columns: ColumnDefinition<AddressItem>[] = [
        {
            key: 'label',
            header: 'Label',
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium">{item.label}</span>
                    {item.isDefault && (
                        <Badge variant="secondary" className="w-fit mt-1 text-[10px] px-1 py-0 h-4">Default</Badge>
                    )}
                </div>
            )
        },
        {
            key: 'addressLine1',
            header: 'Address',
            render: (item) => (
                <span className="text-sm text-gray-600 truncate max-w-[200px] block" title={item.addressLine1}>
                    {item.addressLine1}
                </span>
            ),
        },
        {
            key: 'city',
            header: 'Location',
            render: (item) => (
                <span className="text-sm">{item.city}, {item.state}</span>
            )
        },
        {
            key: 'addressType',
            header: 'Type',
            render: (item) => (
                <Badge variant="outline" className="capitalize">
                    {item.addressType}
                </Badge>
            ),
        },
    ]

    const addressData: AddressItem[] =
        data?.data?.map((addr) => ({
            id: addr.addressId, // Required by Table implementation
            addressId: addr.addressId,
            label: addr.label,
            addressLine1: addr.addressLine1,
            city: addr.city || '',
            state: addr.state || '',
            addressType: addr.addressType,
            isDefault: addr.isDefault,
        })) || []

    return (
        <div className='container mx-auto py-8 max-w-5xl'>
            <ResponsiveTable
                title='My Addresses'
                data={addressData}
                loading={isLoading}
                columns={columns}
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                onPageChange={setCurrentPage}
                searchTerm={searchTerm}
                onSearchTermChange={(e) => setSearchTerm(e.target.value)}
                onSearchClick={handleSearch}
                headerActions={
                    <Button onClick={() => router.push('/customer/address/add')}>
                        <Plus className='h-4 w-4 mr-2' /> Add Address
                    </Button>
                }
                actions={(item) => (
                    <div className='flex items-center gap-2'>
                        <Button
                            variant='ghost'
                            size='icon'
                            title={item.isDefault ? "Default Address" : "Set as Default"}
                            disabled={item.isDefault}
                            onClick={() => handleSetDefault(item.addressId, item.isDefault)}
                        >
                            {item.isDefault ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                                <Circle className="h-4 w-4 text-gray-400 hover:text-green-600" />
                            )}
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => router.push(`/customer/address/${item.addressId}/edit`)}
                        >
                            <Pencil className='h-4 w-4 text-blue-600' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setDeleteId(item.addressId)}
                        >
                            <Trash2 className='h-4 w-4 text-red-600' />
                        </Button>
                    </div>
                )}
            />

            {/* Delete Confirmation Modal */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Address</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this address? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button variant='destructive' onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
