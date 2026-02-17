


'use client'
import React from 'react'
import UploadSection from './UploadSection'

export default function RejectedSection({
  reason,
  docsCount,
}: {
  reason: string
  docsCount: number
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-8 py-7 border-b border-gray-100 flex gap-5 items-start">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-red-50">
              <span className="text-red-600 text-2xl font-semibold">×</span>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Verification Rejected
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Your submitted documents did not meet our verification requirements.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8 space-y-8">

            {/* Reason */}
            <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
              <p className="text-sm font-medium text-red-800">
                {reason || 'Your documents were not approved.'}
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                Please review the issue above and upload clear, valid documents.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Ensure that all information is visible, unaltered, and matches your account details.
              </p>
            </div>

            {/* Upload Section */}
            <div className="pt-8 border-t border-gray-100">
              <UploadSection docsCount={docsCount} />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
