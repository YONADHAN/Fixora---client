'use client'

import React from 'react'
import UploadSection from '@/components/pages/vendor-verification/UploadSection'
import PendingSection from '@/components/pages/vendor-verification/PendingSection'
import RejectedSection from '@/components/pages/vendor-verification/RejectedSection'
import { useVendorVerificationDocStatusCheck } from '@/lib/hooks/useVendor'
// import SuccessfulSection from '@/components/pages/vendor-verification/SuccessfulSection'
import { useRouter } from 'next/navigation'
export default function VendorVerificationPage() {
  const router = useRouter()
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
  
    return (
  <div className="min-h-screen bg-gray-50 py-20 px-4">
    <div className="max-w-2xl mx-auto">

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-8 py-8 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Verify Your Account
          </h1>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            To activate your vendor account, please upload a valid government-issued identification document.
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-1 space-y-8">

          {/* Accepted Documents */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-0">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Accepted Documents
            </h2>

            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Aadhaar Card</li>
              <li>• PAN Card</li>
              <li>• Voter ID</li>
              <li>• Driving Licence</li>
            </ul>
          </div>

      
          <div className="pt-6 pb-6 border-t border-gray-100">
            <UploadSection docsCount={docsCount} />
          </div>

        </div>

      </div>

    </div>
  </div>
)

  }

  if (verificationStatus === 'accepted') {
 
   router.replace('/vendor/dashboard')
  }

  return <PendingSection />
}
