import * as Yup from 'yup'

export const serviceVariantSchema = Yup.object({
  serviceVariants: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().trim().required('Variant name is required'),

        description: Yup.string().trim().optional(),

        price: Yup.number()
          .typeError('Price must be a number')
          .min(0, 'Price cannot be negative')
          .optional(),
      })
    )
    .test(
      'unique-variant-names',
      'Variant names must be unique',
      (variants) => {
        if (!variants || variants.length === 0) return true
        const names = variants.map((v) => v.name.trim().toLowerCase())
        return new Set(names).size === names.length
      }
    ),
})
