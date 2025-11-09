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

  // ✅ Properly access the nested data
  const vendor = vendorResponse
  const verificationStatus = vendor?.status
  const rejectionReason = vendor?.description || ''
  const docsCount = vendor?.documentCount || 0

  console.log('Vendor verification data =>', vendor)

  // 🟢 Case 1: Rejected
  if (verificationStatus === 'rejected') {
    return <RejectedSection reason={rejectionReason} />
  }

  // 🟢 Case 2: Docs uploaded but pending
  if (docsCount > 0 && verificationStatus === 'pending') {
    return <PendingSection />
  }

  // 🟢 Case 3: No docs uploaded yet
  if (
    docsCount === 0 &&
    (!verificationStatus || verificationStatus === 'pending')
  ) {
    return <UploadSection />
  }

  // 🟢 Case 4: Approved
  if (verificationStatus === 'accepted') {
    return (
      <div className='p-4 text-green-600 font-semibold'>
        ✅ Your documents are verified successfully.
      </div>
    )
  }

  // 🟢 Default fallback
  return <PendingSection />
}
