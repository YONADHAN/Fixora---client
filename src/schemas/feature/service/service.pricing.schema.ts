import * as Yup from 'yup'
export const servicePricingSchema = Yup.object({
  pricing: Yup.object({
    pricePerSlot: Yup.number()
      .typeError('Price must be a number')
      .min(1, 'Price must be at least 1')
      .required('Price is required'),

    advanceAmountPerSlot: Yup.number()
      .typeError('Advance must be a number')
      .min(0, 'Advance cannot be negative')
      .required('Advance is required'),
  }).required(),
})
