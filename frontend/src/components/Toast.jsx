import { useEffect } from 'react'

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      onClose()
    }, 3500)

    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  const styles = {
    success: {
      icon: '✓',
      color: 'border-green-500 text-green-600',
    },
    error: {
      icon: '✕',
      color: 'border-red-500 text-red-600',
    },
    warning: {
      icon: '!',
      color: 'border-orange-500 text-orange-600',
    },
    info: {
      icon: 'i',
      color: 'border-blue-500 text-blue-600',
    },
  }

  const currentStyle = styles[type] || styles.success

  return (
    <div className="fixed right-4 top-24 z-[100] w-[calc(100%-2rem)] max-w-sm animate-[slideIn_0.3s_ease-out] rounded-xl border-l-4 bg-white p-4 shadow-xl">
      <div className="flex items-center gap-3">
        <span className={`text-xl font-bold ${currentStyle.color}`}>
          {currentStyle.icon}
        </span>

        <p className="flex-1 text-sm font-medium text-gray-700">
          {message}
        </p>

        <button
          onClick={onClose}
          className="text-xl text-gray-400 hover:text-gray-700"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast