'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  autoFocus = false,
  className,
}: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = React.useState(autoFocus ? 0 : -1)

  // Initialize refs array
  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  // Auto-focus first input if autoFocus is true
  React.useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  // Call onComplete when value reaches target length
  React.useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value)
    }
  }, [value, length, onComplete])

  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow digits
    const newValue = inputValue.replace(/\D/g, '').slice(-1)

    const newOtpValue = value.split('')
    newOtpValue[index] = newValue

    const finalValue = newOtpValue.join('').slice(0, length)
    onChange(finalValue)

    // Move to next input if value was entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
    }
  }

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace') {
      // If current input is empty, go to previous input
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
        setFocusedIndex(index - 1)

        // Clear the previous input
        const newOtpValue = value.split('')
        newOtpValue[index - 1] = ''
        onChange(newOtpValue.join(''))
      } else {
        // Clear current input
        const newOtpValue = value.split('')
        newOtpValue[index] = ''
        onChange(newOtpValue.join(''))
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
      setFocusedIndex(index - 1)
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
    }
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index)
  }

  const handleBlur = () => {
    setFocusedIndex(-1)
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault()
    const pastedData = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length)
    onChange(pastedData)

    // Focus the last filled input or the first empty one
    const nextIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
    setFocusedIndex(nextIndex)
  }

  return (
    <div
      className={cn('flex gap-2 justify-center', className)}
      role="group"
      aria-label="One-time password input"
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={ref => {
            inputRefs.current[index] = ref
          }}
          type="text"
          inputMode="numeric"
          pattern="\d{1}"
          maxLength={1}
          value={value[index] || ''}
          onChange={e => handleInputChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            'size-12 text-center text-lg font-medium',
            'border border-input rounded-md',
            'bg-background text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            focusedIndex === index && 'ring-2 ring-ring border-transparent',
            value[index] && 'border-primary'
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
