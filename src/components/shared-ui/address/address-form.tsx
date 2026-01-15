'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { MapPin } from 'lucide-react'

// Dynamic import for MapSelector to avoid SSR issues
const MapSelector = dynamic(() => import('@/utils/helpers/MapSelector'), {
    ssr: false,
})

const addressSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    addressType: z.enum(['home', 'office', 'other']),
    isDefault: z.boolean().default(false),
    isActive: z.boolean().default(true),
    contactName: z.string().optional(),
    contactPhone: z.string().optional(),
    addressLine1: z.string().min(1, 'Address Line 1 is required'),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().default('India'),
    zipCode: z.string().optional(),
    instructions: z.string().optional(),
    geoLocation: z.object({
        type: z.literal('Point'),
        coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
    }),
    location: z
        .object({
            name: z.string().optional(),
            displayName: z.string().optional(),
        })
        .optional(),
})

export type AddressFormData = z.infer<typeof addressSchema>

interface AddressFormProps {
    defaultValues?: Partial<AddressFormData>
    onSubmit: (data: AddressFormData) => void
    isLoading?: boolean
    submitLabel?: string
}

export function AddressForm({
    defaultValues,
    onSubmit,
    isLoading = false,
    submitLabel = 'Save Address',
}: AddressFormProps) {
    const [mapOpen, setMapOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            label: 'Home',
            addressType: 'home',
            isDefault: false,
            isActive: true,
            country: 'India',
            geoLocation: { type: 'Point', coordinates: [78.9629, 20.5937] }, // Default India center
            ...defaultValues,
        },
    })

    // Update form when defaultValues (e.g., fetched data) changes
    useEffect(() => {
        if (defaultValues) {
            form.reset({
                label: 'Home',
                addressType: 'home',
                isDefault: false,
                isActive: true,
                country: 'India',
                geoLocation: { type: 'Point', coordinates: [78.9629, 20.5937] },
                ...defaultValues,
            })
        }
    }, [defaultValues, form])

    const handleLocationSelect = (
        lat: number,
        lng: number,
        name?: string,
        displayName?: string
    ) => {
        form.setValue('geoLocation', {
            type: 'Point',
            coordinates: [lng, lat],
        })
        form.setValue('location', { name, displayName })

        // Auto-fill address details from reverse geocoding if available
        // Note: The simple MapSelector implementation assumes basic string returns.
        // Ideally, we'd parse the displayName or use separate address components if available.
        // For now, we'll set what we can.
        if (displayName) {
            // Very basic heuristic split, can be improved or rely on user input
            const parts = displayName.split(', ')
            if (parts.length > 2) {
                // Try to pick zip code if it looks like one (last part usually)
                const lastPart = parts[parts.length - 1]
                // form.setValue('zipCode', lastPart) // Risky without validation, let user fill
            }
        }
        setMapOpen(false)
    }

    const selectedLocationName = form.watch('location.displayName')

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Left Column: Basic Info */}
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='label'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label (e.g., My Home, Mom's House)</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Home' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='contactName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='John Doe' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='contactPhone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder='1234567890' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='addressType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='home'>Home</SelectItem>
                                                <SelectItem value='office'>Office</SelectItem>
                                                <SelectItem value='other'>Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name='isDefault'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>Set as Default Address</FormLabel>
                                        <FormDescription>
                                            This address will be used for bookings by default.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Right Column: API Address + Map */}
                    <div className='space-y-4'>
                        <div className="flex flex-col gap-2">
                            <FormLabel>Location</FormLabel>
                            <Dialog open={mapOpen} onOpenChange={setMapOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal" type="button">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        {selectedLocationName ? (
                                            <span className="truncate">{selectedLocationName}</span>
                                        ) : (
                                            <span>Pick locaton on map</span>
                                        )}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl h-[500px]">
                                    <div className="h-full w-full pt-4">
                                        <MapSelector onLocationSelect={handleLocationSelect} />
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {form.formState.errors.geoLocation && (
                                <p className="text-sm font-medium text-destructive">Location is required</p>
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name='addressLine1'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address Line 1</FormLabel>
                                    <FormControl>
                                        <Input placeholder='House no, Building, Street' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='addressLine2'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Area, Colony' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='landmark'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Landmark (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Near park' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='city'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder='City' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='state'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input placeholder='State' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='country'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Country' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='zipCode'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Zip Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder='123456' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name='instructions'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Instructions (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Leave at door, Call upon arrival..." className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? (
                        <>Saving...</>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </form>
        </Form>
    )
}
