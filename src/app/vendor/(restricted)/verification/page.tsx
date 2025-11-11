'use client'

import React from 'react'
import UploadSection from '@/components/pages/vendor-verification/UploadSection'
import PendingSection from '@/components/pages/vendor-verification/PendingSection'
import RejectedSection from '@/components/pages/vendor-verification/RejectedSection'
import { useVendorVerificationDocStatusCheck } from '@/lib/hooks/useVendor'
import SuccessfulSection from '@/components/pages/vendor-verification/SuccessfulSection'

export default function VendorVerificationPage() {
  const { data: vendorResponse, isLoading } =
    useVendorVerificationDocStatusCheck()

  if (isLoading) return <div>Loading...</div>

  const vendor = vendorResponse
  const verificationStatus = vendor?.status
  const rejectionReason = vendor?.description || ''
  const docsCount = vendor?.documentCount || 0

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
    return <SuccessfulSection />
  }

  return <PendingSection />
}
