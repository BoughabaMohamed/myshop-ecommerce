
import { useEffect } from 'react'

function Popup({
  isOpen,
  type = 'success',
  title,
  message,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onCancel?.()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const styles = {
    success: {
      icon: '✓',
      iconClass: 'bg-green-100 text-green-600',
      buttonClass: 'bg-green-600 hover:bg-green-700',
      defaultTitle: 'Success',
    },
    error: {
      icon: '✕',
      iconClass: 'bg-red-100 text-red-600',
      buttonClass: 'bg-red-600 hover:bg-red-700',
      defaultTitle: 'Error',
    },
    warning: {
      icon: '!',
      iconClass: 'bg-yellow-100 text-yellow-600',
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
      defaultTitle: 'Warning',
    },
    confirm: {
      icon: '?',
      iconClass: 'bg-blue-100 text-blue-600',
      buttonClass: 'bg-blue-600 hover:bg-blue-700',
      defaultTitle: 'Confirm Action',
    },
  }

  const currentStyle = styles[type] || styles.success
  const isConfirm = type === 'confirm'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="text-center">
          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${currentStyle.iconClass}`}
          >
            {currentStyle.icon}
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            {title || currentStyle.defaultTitle}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {message}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            {isConfirm && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg bg-gray-100 px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-lg px-5 py-2.5 font-semibold text-white transition ${currentStyle.buttonClass}`}
            >
              {isConfirm ? 'Confirm' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
