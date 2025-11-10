'use client'

import React, { useState } from 'react'
import { ResponsiveTable } from '@/components/shared-ui/resusable_components/table/table'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useVendorRequests } from '@/lib/hooks/useAdmin'
import type { VendorRequest } from '@/types/users/admin/vendor_request.types'
import { Download, X } from 'lucide-react'

// -------- Component --------
const VendorVerificationPage = () => {
  // ------- States -------
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVendor, setSelectedVendor] = useState<VendorRequest | null>(
    null
  )
  const [showDialog, setShowDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // 👈 new
  const [showImageDialog, setShowImageDialog] = useState(false) // 👈 new

  const { data, isLoading, isFetching, refetch } = useVendorRequests({
    page,
    limit: 10,
    search: searchTerm,
  })

  const vendors = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setPage(1)
  }

  const handleViewClick = (vendor: VendorRequest) => {
    setSelectedVendor(vendor)
    setRejectionReason('')
    setShowDialog(true)
  }

  const handleApprove = async () => {
    if (!selectedVendor) return
    try {
      setUpdatingItems((prev) => new Set(prev).add(selectedVendor.userId))
      // TODO: call approve API here
      console.log('Approved:', selectedVendor.userId)
      setShowDialog(false)
      await refetch()
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev)
        next.delete(selectedVendor.userId)
        return next
      })
    }
  }

  const handleReject = async () => {
    if (!selectedVendor) return
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason before rejecting.')
      return
    }
    try {
      setUpdatingItems((prev) => new Set(prev).add(selectedVendor.userId))
      // TODO: call reject API here
      console.log(
        'Rejected:',
        selectedVendor.userId,
        'Reason:',
        rejectionReason
      )
      setShowDialog(false)
      await refetch()
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev)
        next.delete(selectedVendor.userId)
        return next
      })
    }
  }

  // Download handler
  const handleDownload = async () => {
    if (!selectedImage) return
    try {
      const response = await fetch(selectedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `fixora-vendor-doc-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download image')
    }
  }

  const handleCloseDialog = () => setShowDialog(false)

  // Image open handler 👇
  const handleImageClick = (url: string) => {
    setSelectedImage(url)
    setShowImageDialog(true)
  }

  const columns: {
    key: keyof VendorRequest | string
    header: string
    render?: (item: VendorRequest) => React.ReactNode
  }[] = [
    { key: 'userId', header: 'User ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'verificationStatus',
      header: 'Verification Status',
      render: (item: VendorRequest) => {
        return item.isVerified?.status || 'N/A'
      },
    },
  ]

  return (
    <div className='p-6'>
      <ResponsiveTable<VendorRequest>
        data={vendors}
        loading={isLoading || isFetching}
        updatingItems={updatingItems}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        onSearchKeyPress={handleSearchKeyPress}
        onSearchClick={() => setPage(1)}
        entityType='vendor-request'
        columns={columns}
        showLabelsOnMobile
        confirmDialog={{
          isOpen: false,
          item: null,
          action: 'block',
        }}
        onConfirmAction={() => {}}
        onCancelAction={() => {}}
        showActionsColumn={true}
        customActions={(item: VendorRequest) => (
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleViewClick(item)}
          >
            View
          </Button>
        )}
      />

      {selectedVendor && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className='max-w-lg'>
            <DialogHeader>
              <DialogTitle>Vendor Verification</DialogTitle>
            </DialogHeader>

            <div className='space-y-3'>
              <p>
                <strong>User ID:</strong> {selectedVendor.userId}
              </p>
              <p>
                <strong>Name:</strong> {selectedVendor.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedVendor.email}
              </p>

              <p className='font-semibold mt-3'>Uploaded Documents:</p>
              <div className='grid grid-cols-3 gap-3'>
                {selectedVendor.documents.map((doc, index) => (
                  <img
                    key={index}
                    src={doc.url}
                    alt={doc.name}
                    className='w-full h-24 object-cover rounded border cursor-pointer hover:scale-105 transition'
                    onClick={() => handleImageClick(doc.url)}
                  />
                ))}
              </div>

              <div className='mt-4'>
                <label className='block mb-1 font-semibold'>
                  Additional Notes / Rejection Reason:
                </label>
                <Textarea
                  placeholder='Write your note or reason here...'
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className='flex justify-between mt-4'>
              <Button variant='destructive' onClick={handleReject}>
                Reject
              </Button>
              <Button onClick={handleApprove}>Approve</Button>
              <Button variant='outline' onClick={handleCloseDialog}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* -------- Full Image Preview Dialog -------- */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className='max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-0 bg-black overflow-hidden'>
          <div className='relative w-full h-full flex items-center justify-center p-4'>
            {/* Close Button */}
            <button
              className='absolute top-4 right-4 z-10 text-white bg-red-600 hover:bg-red-700 rounded-full p-3 transition-colors shadow-lg'
              onClick={() => setShowImageDialog(false)}
              aria-label='Close'
            >
              <X size={28} />
            </button>

            {/* Download Button */}
            {selectedImage && (
              <button
                onClick={handleDownload}
                className='absolute top-4 left-4 z-10 text-white bg-blue-600 hover:bg-blue-700 rounded-full p-3 transition-colors shadow-lg flex items-center gap-2'
                title='Download image'
                aria-label='Download'
              >
                <Download size={24} />
              </button>
            )}

            {/* Image - Now with zoom capability */}
            {selectedImage && (
              <div className='w-full h-full flex items-center justify-center'>
                <img
                  src={selectedImage}
                  alt='Full Preview'
                  className='max-w-full max-h-full w-auto h-auto object-contain cursor-zoom-in'
                  style={{ maxHeight: 'calc(95vh - 2rem)' }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VendorVerificationPage
