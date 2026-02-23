'use client'

type Props = {
  call: {
    chatId: string
    role: 'customer' | 'vendor'
  }
  onAccept: () => void
  onReject: () => void
}

export function IncomingCallModal({ call, onAccept, onReject }: Props) {
  return (
    <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center'>
      <div className='bg-card rounded-xl p-6 w-80 text-center'>
        <h2 className='text-lg font-semibold mb-2'>Incoming Video Call</h2>

        <p className='text-sm text-muted-foreground mb-6'>From {call.role}</p>

        <div className='flex gap-4'>
          <button
            onClick={onReject}
            className='flex-1 bg-red-600 text-white py-2 rounded-lg'
          >
            Reject
          </button>

          <button
            onClick={onAccept}
            className='flex-1 bg-green-600 text-white py-2 rounded-lg'
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
