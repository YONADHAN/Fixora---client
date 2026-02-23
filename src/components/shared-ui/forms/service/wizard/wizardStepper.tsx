import { useFormikContext, FormikErrors } from 'formik'
import ServiceBasicInfoStep from '../steps/ServiceBasicInfoStep'
import ServicePricingStep from '../steps/ServicePricingStep'
import ServiceScheduleStep from '../steps/ServiceScheduleStep'
import { IServiceFormValues } from '@/types/service_feature/service.types'
import ServiceOverridesStep from '../steps/ServiceOverridesStep'
import ServiceVariantStep from '../steps/ServiceVariantStep'
import ServiceImagesStep from '../steps/ServiceImagesStep'
import ServiceReviewStep from '../steps/ServiceReviewStep'
const steps = [
  ServiceBasicInfoStep,
  ServicePricingStep,
  ServiceScheduleStep,
  ServiceOverridesStep,
  ServiceVariantStep,
  ServiceImagesStep,
  ServiceReviewStep,
]

// Strict field mapping per step
const stepFields: (readonly string[])[] = [
  ['name', 'description', 'subServiceCategoryId'], // Step 0
  ['pricing.pricePerSlot', 'pricing.advanceAmountPerSlot'], // Step 1
  [
    'schedule.visibilityStartDate',
    'schedule.visibilityEndDate',
    'schedule.slotDurationMinutes',
    'schedule.recurrenceType',
    'schedule.dailyWorkingWindows',
  ], //Step 2
  ['schedule.overrideBlock', 'schedule.overrideCustom'],
  ['serviceVariants'],
  ['images'],
  [],
]

export default function WizardStepper({
  step,
  setStep,
}: {
  step: number
  setStep: React.Dispatch<React.SetStateAction<number>>
}) {
  const { setFieldTouched, validateForm, submitForm } =
    useFormikContext<IServiceFormValues>()

  const StepComponent = steps[step]
  const isLastStep = step === steps.length - 1

  const handleNext = async () => {
    // Touch only current step fields
    stepFields[step].forEach((field) => {
      setFieldTouched(field, true, true)
    })

    // Validate after touch
    const errors: FormikErrors<IServiceFormValues> = await validateForm()
    const hasStepErrors = stepFields[step].some((path) => {
      const value = path.split('.').reduce<unknown>((acc, key) => {
        if (acc !== null && typeof acc === 'object') {
          return (acc as Record<string, unknown>)[key]
        }
        return undefined
      }, errors)

      // Only count it as error if actual value exists
      return value !== undefined
    })

    if (!hasStepErrors) {
      setStep((s) => s + 1)
    }
  }

  return (
    <div className='relative'>
      {/* STEP CONTENT */}
      <div className='pb-24'>
        <StepComponent />
      </div>

      {/* FIXED CLEAN FOOTER BAR */}
      <div className='fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t dark:border-border shadow-sm z-50 transition-colors'>
        <div className='max-w-6xl mx-auto px-6 py-4 flex items-center justify-between'>
          {/* BACK BUTTON */}
          {step > 0 ? (
            <button
              type='button'
              onClick={() => setStep((s) => s - 1)}
              className='px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition'
            >
              Back
            </button>
          ) : (
            <div /> // Keeps spacing balanced on first step
          )}

          {/* NEXT / SUBMIT BUTTON */}
          <button
            type='button'
            onClick={() => {
              if (isLastStep) {
                submitForm()
              } else {
                handleNext()
              }
            }}
            className={`px-8 py-2 rounded-lg text-white font-medium transition ${isLastStep
                ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                : 'bg-black hover:bg-gray-900 dark:bg-primary dark:text-primary-foreground'
              }`}
          >
            {isLastStep ? 'Submit Service' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
