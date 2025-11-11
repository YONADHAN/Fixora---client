'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useUploadVendorDocuments } from '@/lib/hooks/useVendor'
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react'

import Image from 'next/image'
import { AxiosError } from 'axios'

export default function UploadSection({ docsCount }: { docsCount: number }) {
  const [files, setFiles] = useState<File[]>([])
  const { mutate: uploadDocs, isPending } = useUploadVendorDocuments()

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  const maxSizeMB = 5
  const maxFiles = 3

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const validFiles: File[] = []
    const invalidFiles: string[] = []

    // Check if user already has 3 docs in DB
    if (docsCount >= maxFiles) {
      toast.error(`You’ve already uploaded ${maxFiles} documents.`)
      return
    }

    selectedFiles.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (Invalid type)`)
        return
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        invalidFiles.push(`${file.name} (Exceeds ${maxSizeMB}MB)`)
        return
      }
      validFiles.push(file)
    })

    if (invalidFiles.length > 0) {
      toast.error(`Some files were rejected:\n${invalidFiles.join('\n')}`)
    }

    // Total allowed remaining
    const remainingSlots = maxFiles - docsCount

    if (files.length + validFiles.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more document(s).`)
      setFiles([...files, ...validFiles].slice(0, remainingSlots))
    } else {
      setFiles([...files, ...validFiles])
    }
  }

  const handleRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0) {
      toast.info('Please select files to upload')
      return
    }

    uploadDocs(files, {
      onSuccess: (res) => {
        toast.success(res?.message || 'Documents uploaded successfully')
        setFiles([])
      },
      onError: (err) => {
        if (err instanceof AxiosError)
          toast.error(err?.response?.data?.message || 'Upload failed')
      },
    })

    window.location.reload()
  }

  return (
    <div className='max-w-lg mx-auto mt-2 p-6 rounded-2xl shadow bg-white'>
      <h2 className='text-2xl font-semibold mb-3 text-center text-green-800'>
        Upload Verification Documents
      </h2>
      <p className='text-gray-500 text-sm text-center mb-4'>
        Accepted formats: JPG, PNG, PDF, DOCX — Max {maxFiles} files,{' '}
        {maxSizeMB}MB each
      </p>

      <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition'>
        <Input
          id='file-upload'
          type='file'
          multiple
          accept='.pdf,.jpeg,.jpg,.png,.docx'
          onChange={handleFileSelect}
          className='hidden'
        />
        <label
          htmlFor='file-upload'
          className='flex flex-col items-center justify-center cursor-pointer'
        >
          <UploadCloudIcon className='w-10 h-10 text-gray-400 mb-2' />
          <span className='text-gray-600 font-medium'>
            Click to browse or drag files here
          </span>
        </label>
      </div>

      {/* Preview Section */}
      {files.length > 0 && (
        <div className='mt-5'>
          <div className='flex justify-between items-center mb-2'>
            <p className='text-sm text-gray-600'>
              {files.length} of {maxFiles} files selected
            </p>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setFiles([])}
              className='text-xs'
            >
              Clear All
            </Button>
          </div>

          <div className='grid grid-cols-1 gap-4'>
            {files.map((file, index) => (
              <div
                key={file.name}
                className='relative border rounded-lg p-2 flex items-center justify-between group hover:shadow-md transition'
              >
                {/* Preview Thumbnail */}
                {file.type.startsWith('image/') ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={60}
                    height={60}
                    className='rounded object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center w-[60px] h-[60px] bg-gray-100 rounded'>
                    {file.type === 'application/pdf' ? (
                      <FileIcon className='text-red-500 w-6 h-6' />
                    ) : (
                      <FileIcon className='text-blue-500 w-6 h-6' />
                    )}
                  </div>
                )}

                {/* File Info */}
                <div className='flex-1 ml-3'>
                  <p className='text-sm font-medium truncate'>{file.name}</p>
                  <p className='text-xs text-gray-500'>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(index)}
                  className='absolute top-1 right-1 p-1 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100'
                >
                  <XIcon className='w-4 h-4' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={isPending || files.length === 0}
        className='mt-6 w-full'
      >
        {isPending ? 'Uploading...' : 'Upload Documents'}
      </Button>
    </div>
  )
}
