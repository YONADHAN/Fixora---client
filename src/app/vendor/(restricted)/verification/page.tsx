'use client'

import React from 'react'
import UploadSection from '@/components/pages/vendor-verification/UploadSection'
import PendingSection from '@/components/pages/vendor-verification/PendingSection'
import RejectedSection from '@/components/pages/vendor-verification/RejectedSection'
import { useVendorVerificationDocStatusCheck } from '@/lib/hooks/useVendor'

export default function VendorVerificationPage() {
  const { data: vendorResponse, isLoading } =
    useVendorVerificationDocStatusCheck()

  if (isLoading) return <div>Loading...</div>

  const vendor = vendorResponse
  const verificationStatus = vendor?.status
  const rejectionReason = vendor?.description || ''
  const docsCount = vendor?.documentCount || 0

  console.log('Vendor verification data =>', vendor)

  if (verificationStatus === 'rejected') {
    return <RejectedSection reason={rejectionReason} docsCount={docsCount} />
  }

  if (docsCount > 0 && verificationStatus === 'pending') {
    return <PendingSection />
  }

  if (
    docsCount === 0 &&
    (!verificationStatus || verificationStatus === 'pending')
  ) {
    return <UploadSection docsCount={docsCount} />
  }

  if (verificationStatus === 'accepted') {
    return (
      <div className='p-4 text-green-600 font-semibold'>
        Your documents are verified successfully.
      </div>
    )
  }

  return <PendingSection />
}
