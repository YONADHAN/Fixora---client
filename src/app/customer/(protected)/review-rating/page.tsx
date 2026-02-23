'use client'

import React, { useState } from 'react'
import { useReviewRating } from '@/lib/hooks/useReviewRating'
import { ReviewCard } from '@/components/review-rating/ReviewCard'
import { ReviewModal } from '@/components/review-rating/ReviewModal'
import { Pagination } from '@/components/shared-ui/resusable_components/pagination/pagination'
import { IBookedServiceReviewData } from '@/services/review_rating/review_rating.service'
import { Loader2 } from 'lucide-react'

export default function ReviewRatingPage() {
    const [page, setPage] = useState(1)
    const [selectedService, setSelectedService] = useState<IBookedServiceReviewData | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { bookedServices, isServicesLoading, servicesError } = useReviewRating(page)

    const handleEdit = (service: IBookedServiceReviewData) => {
        setSelectedService(service)
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setSelectedService(null)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (isServicesLoading) {
        return (
            <div className='flex h-[calc(100vh-200px)] w-full items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
        )
    }

    if (servicesError) {
        return (
            <div className='flex h-[calc(100vh-200px)] w-full items-center justify-center flex-col gap-4'>
                <p className='text-destructive'>Failed to load booked services. Please try again later.</p>
            </div>
        )
    }

    const services = bookedServices?.data || []
    const totalPages = bookedServices?.totalPages || 0
    const currentPage = bookedServices?.currentPage || 1

    return (
        <div className='container mx-auto py-8 space-y-8'>
            <div className='flex flex-col gap-2'>
                <h1 className='text-3xl font-bold tracking-tight'>Ratings & Reviews</h1>
                <p className='text-muted-foreground'>
                    Share your feedback on services you have used. Your reviews help others make informed decisions.
                </p>
            </div>

            {services.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/20'>
                    <p className='text-lg font-medium'>No completed bookings found</p>
                    <p className='text-muted-foreground'>
                        You can only review services after your booking is completed.
                    </p>
                </div>
            ) : (
                <>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {services.map((service, index) => (
                            <ReviewCard
                                key={service.ratingReviewId || service.serviceRef || index}
                                data={service}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>

                    <div className='flex justify-center mt-8'>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}

            <ReviewModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                service={selectedService}
            />
        </div>
    )
}
