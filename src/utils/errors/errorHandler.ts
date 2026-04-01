export function getErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as Record<string, unknown>).response === 'object'
  ) {
    const errorWithResponse = error as { response?: { data?: { message?: unknown } } }
    const data = errorWithResponse.response?.data
    if (data?.message && typeof data.message === 'string') {
      return data.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'Unknown error occured'
}
