// 'use client'

// import { useState } from 'react'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import { useGetActiveServiceCategories } from '@/lib/hooks/userServiceCategory'
// import { ActiveServiceCategoryItem } from '@/types/service_category/service_category'

// export type SubServiceCategoryFormValues = {
//   name: string
//   description: string
//   serviceCategoryId: string
//   serviceCategoryName: string
//   bannerImage: File | null
// }

// type Props = {
//   initialValues?: Partial<SubServiceCategoryFormValues>
//   onSubmit: (values: SubServiceCategoryFormValues) => void
//   submitText?: string
// }

// export default function SubServiceCategoryForm({
//   initialValues,
//   onSubmit,
//   submitText = 'Submit',
// }: Props) {
//   const [formValues, setFormValues] = useState<SubServiceCategoryFormValues>({
//     name: initialValues?.name || '',
//     description: initialValues?.description || '',
//     serviceCategoryId: initialValues?.serviceCategoryId || '',
//     serviceCategoryName: initialValues?.serviceCategoryName || '',
//     bannerImage: null,
//   })

//   const { data, isLoading } = useGetActiveServiceCategories()

//   const categories: ActiveServiceCategoryItem[] =
//     data?.data?.response?.data ?? []

//   const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selected = categories.find(
//       (item) => item.serviceCategoryId === e.target.value
//     )

//     setFormValues((prev) => ({
//       ...prev,
//       serviceCategoryId: e.target.value,
//       serviceCategoryName: selected?.name ?? '',
//     }))
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormValues((prev) => ({
//       ...prev,
//       bannerImage: e.target.files?.[0] ?? null,
//     }))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!formValues.bannerImage) {
//       alert('Please upload an image before submitting.')
//       return
//     }
//     onSubmit(formValues)
//   }

//   return (
//     <form onSubmit={handleSubmit} className='space-y-6 w-full'>
//       <div className='space-y-2'>
//         <Label>Sub Service Name</Label>
//         <Input
//           name='name'
//           value={formValues.name}
//           onChange={(e) =>
//             setFormValues({ ...formValues, name: e.target.value })
//           }
//           placeholder='Enter sub service category name'
//           required
//         />
//       </div>

//       <div className='space-y-2'>
//         <Label>Description</Label>
//         <textarea
//           name='description'
//           className='border rounded-md p-2 w-full h-24'
//           placeholder='Enter short description'
//           value={formValues.description}
//           onChange={(e) =>
//             setFormValues({ ...formValues, description: e.target.value })
//           }
//           required
//         />
//       </div>

//       <div className='space-y-2'>
//         <Label>Select Parent Service Category</Label>
//         <select
//           className='border rounded-md p-2 w-full'
//           value={formValues.serviceCategoryId}
//           onChange={handleCategorySelect}
//           required
//         >
//           <option value=''>-- Select Category --</option>
//           {!isLoading &&
//             categories.map((cat) => (
//               <option key={cat.serviceCategoryId} value={cat.serviceCategoryId}>
//                 {cat.name}
//               </option>
//             ))}
//         </select>
//       </div>

//       <div className='space-y-2'>
//         <Label>Banner Image</Label>
//         <Input
//           type='file'
//           accept='image/*'
//           onChange={handleFileChange}
//           required
//         />
//       </div>

//       <Button type='submit' className='w-full'>
//         {submitText}
//       </Button>
//     </form>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useGetActiveServiceCategories } from '@/lib/hooks/userServiceCategory'
import { ActiveServiceCategoryItem } from '@/types/service_category/service_category'

export type SubServiceCategoryFormValues = {
  name: string
  description: string
  serviceCategoryId: string
  serviceCategoryName: string
  bannerImage: File | null
}

type Props = {
  initialValues?: Partial<
    SubServiceCategoryFormValues & { existingImage: string }
  >
  onSubmit: (values: SubServiceCategoryFormValues) => void
  submitText?: string
}

export default function SubServiceCategoryForm({
  initialValues,
  onSubmit,
  submitText = 'Submit',
}: Props) {
  const [formValues, setFormValues] = useState<SubServiceCategoryFormValues>({
    name: '',
    description: '',
    serviceCategoryId: '',
    serviceCategoryName: '',
    bannerImage: null,
  })

  const [existingImagePreview, setExistingImagePreview] = useState<
    string | null
  >(initialValues?.existingImage || null)

  // Prefill form values on edit
  useEffect(() => {
    if (initialValues) {
      setFormValues((prev) => ({
        ...prev,
        name: initialValues.name || '',
        description: initialValues.description || '',
        serviceCategoryId: initialValues.serviceCategoryId || '',
        serviceCategoryName: initialValues.serviceCategoryName || '',
      }))
    }
  }, [initialValues])

  // Fetch active categories
  const { data, isLoading } = useGetActiveServiceCategories()
  const categories: ActiveServiceCategoryItem[] =
    data?.data?.response?.data ?? []

  // Update category name based on selected ID
  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = categories.find(
      (c) => c.serviceCategoryId === e.target.value
    )

    setFormValues((prev) => ({
      ...prev,
      serviceCategoryId: e.target.value,
      serviceCategoryName: selected?.name ?? '',
    }))
  }

  // Handle image change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (file) setExistingImagePreview(URL.createObjectURL(file))

    setFormValues((prev) => ({
      ...prev,
      bannerImage: file,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In edit mode, image may remain unchanged → allowed
    if (!formValues.bannerImage && !existingImagePreview) {
      alert('Please upload an image.')
      return
    }

    onSubmit(formValues)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6 w-full'>
      {/* Name */}
      <div className='space-y-2'>
        <Label>Sub Service Name</Label>
        <Input
          value={formValues.name}
          onChange={(e) =>
            setFormValues({ ...formValues, name: e.target.value })
          }
          required
        />
      </div>

      {/* Description */}
      <div className='space-y-2'>
        <Label>Description</Label>
        <textarea
          className='border rounded-md p-2 w-full h-24'
          value={formValues.description}
          onChange={(e) =>
            setFormValues({ ...formValues, description: e.target.value })
          }
          required
        />
      </div>

      {/* Category Dropdown */}
      <div className='space-y-2'>
        <Label>Parent Service Category</Label>
        <select
          className='border rounded-md p-2 w-full'
          value={formValues.serviceCategoryId}
          onChange={handleCategorySelect}
          required
        >
          <option value=''>-- Select Category --</option>

          {!isLoading &&
            categories.map((cat) => (
              <option key={cat.serviceCategoryId} value={cat.serviceCategoryId}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* Image */}
      <div className='space-y-2'>
        <Label>Banner Image</Label>
        {existingImagePreview && (
          <img
            src={existingImagePreview}
            alt='Preview'
            className='w-32 h-32 object-cover rounded mb-2 border'
          />
        )}

        <Input type='file' accept='image/*' onChange={handleFileChange} />
      </div>

      <Button type='submit' className='w-full'>
        {submitText}
      </Button>
    </form>
  )
}
