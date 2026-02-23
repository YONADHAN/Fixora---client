'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSingleAddress } from '@/lib/hooks/useAddress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, MapPin, Phone, User, Home, Building, Briefcase } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import dynamic from 'next/dynamic'

// Simple Map Display component (reusing MapSelector but read-only if possible, or just a marker)
// Since MapSelector is interactive, we might just use it and disable interaction if we could, 
// but for now let's just show coordinates text or use MapContainer directly.
// To keep it simple and consistent, we'll import MapSelector but maybe not set an onSelect.
// Actually, let's just show the details for now. Map display would be nice but MapSelector is an input component.

export default function ViewAddressPage() {
    const router = useRouter()
    const params = useParams()
    const addressId = params.id as string

    const { data: address, isLoading } = useSingleAddress(addressId)

    if (isLoading) {
        return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
    }

    if (!address) {
        return <div className="text-center py-10">Address not found</div>
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'home': return <Home className="h-4 w-4" />
            case 'office': return <Building className="h-4 w-4" />
            default: return <Briefcase className="h-4 w-4" />
        }
    }

    return (
        <div className='container mx-auto py-8 max-w-2xl'>
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground p-0 hover:bg-transparent hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Addresses
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        {getTypeIcon(address.addressType)}
                        {address.label}
                    </CardTitle>
                    {address.isDefault && <Badge>Default Address</Badge>}
                </CardHeader>
                <CardContent className="space-y-6 pt-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact Details</h4>
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span>{address.contactName || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm mt-1">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>{address.contactPhone || 'N/A'}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Address</h4>
                                <p className="text-sm leading-relaxed">
                                    {address.addressLine1} <br />
                                    {address.addressLine2 && <>{address.addressLine2}<br /></>}
                                    {address.landmark && <span className="text-gray-500 text-xs">Near {address.landmark}<br /></span>}
                                    {address.city}, {address.state} <br />
                                    {address.country} - {address.zipCode}
                                </p>
                            </div>

                            {address.instructions && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Instructions</h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                                        {address.instructions}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Location</h4>
                                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center border text-center p-4">
                                    <div className="space-y-2">
                                        <MapPin className="h-8 w-8 mx-auto text-primary" />
                                        <p className="text-xs text-gray-500">
                                            Coordinates: {address.geoLocation.coordinates[1].toFixed(4)}, {address.geoLocation.coordinates[0].toFixed(4)}
                                        </p>
                                        {address.location?.displayName && (
                                            <p className="text-xs font-medium px-2">
                                                {address.location.displayName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-2">
                        <Button variant="outline" onClick={() => router.push(`/customer/address/${addressId}/edit`)}>
                            Edit Address
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
