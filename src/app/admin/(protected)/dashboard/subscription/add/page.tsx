'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useCreateSubscriptionPlan } from '@/lib/hooks/useSubscription'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface SubscriptionFormValues {
    name: string
    description: string
    price: number
    currency: string
    interval: 'month' | 'year'
    features: {
        maxServices: number
        videoCallAccess: boolean
        aiChatbotAccess: boolean
    }
    benefits: string // Comma separated for input
}

export default function AddSubscriptionPage() {
    const router = useRouter()
    const { mutate: createPlan, isPending } = useCreateSubscriptionPlan()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SubscriptionFormValues>({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            currency: 'INR',
            interval: 'month',
            features: {
                maxServices: 0,
                videoCallAccess: false,
                aiChatbotAccess: false,
            },
            benefits: '',
        },
    })

    const onSubmit = (data: SubscriptionFormValues) => {
        // Transform data to match backend expectations
        // We need to cast to any because the client type might be missing 'interval' strictly
        // but the backend requires it.
        const payload: any = {
            name: data.name,
            description: data.description,
            price: Number(data.price),
            currency: data.currency,
            interval: data.interval,
            features: {
                maxServices: Number(data.features.maxServices),
                videoCallAccess: data.features.videoCallAccess,
                aiChatbotAccess: data.features.aiChatbotAccess,
            },
            benefits: data.benefits.split(',').map((b) => b.trim()).filter(Boolean),
            isActive: true,
            createdByAdminId: '', // Backend handles this from token
        }

        createPlan(payload, {
            onSuccess: () => {
                toast.success('Subscription plan created successfully')
                router.push('/admin/dashboard/subscription')
            },
            onError: (error: any) => {
                toast.error(
                    error?.response?.data?.message || 'Failed to create subscription plan',
                )
            },
        })
    }

    return (
        <div className='p-6 max-w-3xl mx-auto'>
            <Card>
                <CardHeader>
                    <CardTitle>Create Subscription Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        {/* Basic Info */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='name'>Plan Name</Label>
                                <Input
                                    id='name'
                                    {...register('name', { required: 'Name is required' })}
                                    placeholder='e.g. Premium Plan'
                                />
                                {errors.name && (
                                    <p className='text-sm text-destructive'>
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='price'>Price</Label>
                                <Input
                                    id='price'
                                    type='number'
                                    min='0'
                                    step='0.01'
                                    {...register('price', {
                                        required: 'Price is required',
                                        min: { value: 0, message: 'Price cannot be negative' },
                                    })}
                                />
                                {errors.price && (
                                    <p className='text-sm text-destructive'>
                                        {errors.price.message}
                                    </p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='currency'>Currency</Label>
                                <Input
                                    id='currency'
                                    {...register('currency', { required: 'Currency is required' })}
                                    placeholder='INR'
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='interval'>Billing Interval</Label>
                                <Controller
                                    control={control}
                                    name='interval'
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select interval' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='month'>Monthly</SelectItem>
                                                <SelectItem value='year'>Yearly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='description'>Description</Label>
                            <Textarea
                                id='description'
                                {...register('description', {
                                    required: 'Description is required',
                                })}
                                placeholder='Plan description...'
                            />
                            {errors.description && (
                                <p className='text-sm text-destructive'>
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Features */}
                        <div className='space-y-4 border p-4 rounded-md'>
                            <h3 className='font-medium'>Features</h3>
                            <div className='space-y-2'>
                                <Label htmlFor='maxServices'>Max Services</Label>
                                <Input
                                    id='maxServices'
                                    type='number'
                                    min='0'
                                    {...register('features.maxServices', {
                                        required: 'Max services is required',
                                        min: 0,
                                    })}
                                />
                            </div>

                            <div className='flex items-center space-x-2'>
                                <Controller
                                    control={control}
                                    name='features.videoCallAccess'
                                    render={({ field }) => (
                                        <Checkbox
                                            id='videoCallAccess'
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <Label htmlFor='videoCallAccess'>Video Call Access</Label>
                            </div>

                            <div className='flex items-center space-x-2'>
                                <Controller
                                    control={control}
                                    name='features.aiChatbotAccess'
                                    render={({ field }) => (
                                        <Checkbox
                                            id='aiChatbotAccess'
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <Label htmlFor='aiChatbotAccess'>AI Chatbot Access</Label>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className='space-y-2'>
                            <Label htmlFor='benefits'>Benefits (comma separated)</Label>
                            <Textarea
                                id='benefits'
                                {...register('benefits')}
                                placeholder='Priority Support, Custom Badge, etc.'
                            />
                            <p className='text-xs text-muted-foreground'>
                                Separate multiple benefits with commas.
                            </p>
                        </div>

                        <div className='flex justify-end gap-4'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button type='submit' disabled={isPending}>
                                {isPending ? 'Creating...' : 'Create Plan'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
