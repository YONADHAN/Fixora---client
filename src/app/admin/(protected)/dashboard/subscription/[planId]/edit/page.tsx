'use client'
import React, { use, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import {
  useAdminSubscriptionPlans,
  useUpdateSubscriptionPlan,
} from '@/lib/hooks/useSubscription'
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
import {
  EditSubscriptionPlan,
  SubscriptionPlan,
} from '@/types/subscription/subscription.type'
import { AxiosError } from 'axios'

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
  benefits: string
}

interface PageProps {
  params: Promise<{ planId: string }>
}

export default function EditSubscriptionPage({ params }: PageProps) {
  const { planId } = use(params)
  const router = useRouter()
  const { data: plansData, isLoading: isFetching } = useAdminSubscriptionPlans(
    1,
    100,
  )
  const { mutate: updatePlan, isPending: isUpdating } =
    useUpdateSubscriptionPlan(planId)

  const plan = useMemo(() => {
    return plansData?.data.data.find(
      (p: EditSubscriptionPlan) => p.planId === planId,
    )
  }, [plansData, planId])

  const {
    register,
    handleSubmit,
    control,
    reset,
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

  // Pre-fill form when plan is found
  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        interval: plan.durationInDays === 365 ? 'year' : 'month',
        features: {
          maxServices: plan.features?.maxServices || 0,
          videoCallAccess: plan.features?.videoCallAccess || false,
          aiChatbotAccess: plan.features?.aiChatbotAccess || false,
        },
        benefits: plan.benefits?.join(', ') || '',
      })
    }
  }, [plan, reset])

  const onSubmit = (data: SubscriptionFormValues) => {
    const payload: Partial<SubscriptionPlan> = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      currency: data.currency,
      durationInDays: data.interval == 'month' ? 30 : 365,
      features: {
        maxServices: Number(data.features.maxServices),
        videoCallAccess: data.features.videoCallAccess,
        aiChatbotAccess: data.features.aiChatbotAccess,
      },
      benefits: data.benefits
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean),
    }

    updatePlan(payload, {
      onSuccess: () => {
        toast.success('Subscription plan updated successfully')
        router.push('/admin/dashboard/subscription')
      },
      onError: (error: unknown) => {
        if (error instanceof AxiosError) {
          toast.error(
            error?.response?.data?.message ||
              'Failed to update subscription plan',
          )
        }
      },
    })
  }

  if (isFetching) {
    return <div>Loading plan details...</div>
  }

  if (!plan) {
    return (
      <div>
        <p>Plan not found</p>
        <Button onClick={() => router.push('/admin/dashboard/subscription')}>
          Back to List
        </Button>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <Card>
        <CardHeader>
          <CardTitle>Edit Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Info */}
            <div className='space-y-2'>
              <Label htmlFor='name'>Plan Name</Label>
              <Input
                id='name'
                {...register('name', { required: 'Plan name is required' })}
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
                  min: 0,
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
              <Input id='currency' {...register('currency')} />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='interval'>Billing Interval</Label>
              <Controller
                control={control}
                name='interval'
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='month'>Monthly</SelectItem>
                      <SelectItem value='year'>Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea id='description' {...register('description')} />
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
              <Textarea id='benefits' {...register('benefits')} />
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
              <Button type='submit' disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Plan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
