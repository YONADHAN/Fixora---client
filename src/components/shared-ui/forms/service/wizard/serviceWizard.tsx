'use client'

import { useState } from 'react'
import { Formik, Form, FormikHelpers } from 'formik'
import { IServiceFormValues } from '@/types/service_feature/service.types'
import WizardStepper from './wizardStepper'

import { serviceBasicInfoSchema } from '@/schemas/feature/service/service.basicInfo.schema'
import { servicePricingSchema } from '@/schemas/feature/service/service.pricing.schema'
import { serviceScheduleSchema } from '@/schemas/feature/service/service.schedule.schema'
import { serviceOverridesSchema } from '@/schemas/feature/service/service.override.schema'
import { serviceVariantSchema } from '@/schemas/feature/service/service.variant.schema'
import { serviceImageSchema } from '@/schemas/feature/service/service.image.schema'
import * as Yup from 'yup'

const stepSchemas = [
  serviceBasicInfoSchema,
  servicePricingSchema,
  serviceScheduleSchema,
  serviceOverridesSchema,
  serviceVariantSchema,
  serviceImageSchema,
  Yup.object({}),
]

interface ServiceWizardProps {
  initialValues: IServiceFormValues
  onSubmit: (values: IServiceFormValues) => Promise<void> | void
}

export default function ServiceWizard({
  initialValues,
  onSubmit,
}: ServiceWizardProps) {
  const [step, setStep] = useState(0)

  const handleFinalSubmit = async (
    values: IServiceFormValues,
    helpers: FormikHelpers<IServiceFormValues>
  ) => {
    // submit ONLY on last step
    if (step !== stepSchemas.length - 1) {
      helpers.setSubmitting(false)
      return
    }

    await onSubmit(values)
    helpers.setSubmitting(false)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={stepSchemas[step]}
      onSubmit={handleFinalSubmit}
      validateOnBlur
      validateOnChange
      enableReinitialize
    >
      <Form className='w-full'>
        <WizardStepper step={step} setStep={setStep} />
      </Form>
    </Formik>
  )
}
