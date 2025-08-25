import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { OTPInput } from './otp-input'

describe('OTPInput Component', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders with default length of 6 inputs', () => {
      render(<OTPInput {...defaultProps} />)

      const inputs = screen.getAllByRole('textbox')
      expect(inputs).toHaveLength(6)
    })

    it('renders custom length of inputs', () => {
      render(<OTPInput {...defaultProps} length={4} />)

      const inputs = screen.getAllByRole('textbox')
      expect(inputs).toHaveLength(4)
    })

    it('renders with proper ARIA attributes', () => {
      render(<OTPInput {...defaultProps} />)

      const container = screen.getByRole('group', {
        name: 'One-time password input',
      })
      expect(container).toBeInTheDocument()

      const inputs = screen.getAllByRole('textbox')
      inputs.forEach((input, index) => {
        expect(input).toHaveAttribute('aria-label', `Digit ${index + 1}`)
      })
    })

    it('applies custom className', () => {
      render(<OTPInput {...defaultProps} className="custom-otp" />)

      const container = screen.getByRole('group')
      expect(container).toHaveClass('custom-otp')
    })
  })

  describe('Input Attributes and Styling', () => {
    it('sets correct input attributes', () => {
      render(<OTPInput {...defaultProps} />)

      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveAttribute('type', 'text')
        expect(input).toHaveAttribute('inputmode', 'numeric')
        expect(input).toHaveAttribute('pattern', '\\d{1}')
        expect(input).toHaveAttribute('maxlength', '1')
      })
    })

    it('applies correct CSS classes', () => {
      render(<OTPInput {...defaultProps} />)

      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveClass(
          'size-12',
          'text-center',
          'text-lg',
          'font-medium',
          'border',
          'border-input',
          'rounded-md',
          'bg-background',
          'text-foreground',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-ring',
          'focus:border-transparent'
        )
      })
    })

    it('applies disabled styling when disabled', () => {
      render(<OTPInput {...defaultProps} disabled />)

      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveAttribute('disabled')
        expect(input).toHaveClass(
          'disabled:cursor-not-allowed',
          'disabled:opacity-50'
        )
      })
    })
  })

  describe('Value Display', () => {
    it('displays current value in inputs', () => {
      render(<OTPInput {...defaultProps} value="123" />)

      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      expect(inputs[0]).toHaveValue('1')
      expect(inputs[1]).toHaveValue('2')
      expect(inputs[2]).toHaveValue('3')
      expect(inputs[3]).toHaveValue('')
    })

    it('handles value longer than input length', () => {
      render(<OTPInput {...defaultProps} length={4} value="123456" />)

      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      expect(inputs[0]).toHaveValue('1')
      expect(inputs[1]).toHaveValue('2')
      expect(inputs[2]).toHaveValue('3')
      expect(inputs[3]).toHaveValue('4')
    })

    it('applies filled input styling', () => {
      render(<OTPInput {...defaultProps} value="12" />)

      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveClass('border-primary')
      expect(inputs[1]).toHaveClass('border-primary')
      expect(inputs[2]).not.toHaveClass('border-primary')
    })
  })

  describe('Auto Focus', () => {
    it('focuses first input when autoFocus is true', () => {
      render(<OTPInput {...defaultProps} autoFocus />)

      const firstInput = screen.getAllByRole('textbox')[0]
      expect(document.activeElement).toBe(firstInput)
    })

    it('does not auto focus when autoFocus is false', () => {
      render(<OTPInput {...defaultProps} autoFocus={false} />)

      const firstInput = screen.getAllByRole('textbox')[0]
      expect(document.activeElement).not.toBe(firstInput)
    })
  })

  describe('User Input Behavior', () => {
    it('calls onChange when user types a digit', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()

      render(<OTPInput value="" onChange={mockOnChange} />)

      const firstInput = screen.getAllByRole('textbox')[0]
      await user.type(firstInput, '1')

      expect(mockOnChange).toHaveBeenCalledWith('1')
    })

    it('ignores non-digit characters', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()

      render(<OTPInput value="" onChange={mockOnChange} />)

      const firstInput = screen.getAllByRole('textbox')[0]
      await user.type(firstInput, 'a')

      expect(mockOnChange).toHaveBeenCalledWith('')
    })

    it('only accepts last digit when multiple characters are typed', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()

      render(<OTPInput value="" onChange={mockOnChange} />)

      const firstInput = screen.getAllByRole('textbox')[0]
      // Simulate typing multiple characters at once
      fireEvent.change(firstInput, { target: { value: '123' } })

      expect(mockOnChange).toHaveBeenCalledWith('3')
    })

    it('automatically focuses next input after digit entry', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()

      render(<OTPInput value="" onChange={mockOnChange} />)

      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[0], '1')

      expect(document.activeElement).toBe(inputs[1])
    })

    it('does not focus beyond last input', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()

      render(<OTPInput value="12345" onChange={mockOnChange} length={6} />)

      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[5], '6')

      expect(document.activeElement).toBe(inputs[5])
    })
  })

  describe('Backspace Behavior', () => {
    it('clears current input on backspace', () => {
      const mockOnChange = vi.fn()

      render(<OTPInput value="1" onChange={mockOnChange} />)

      const firstInput = screen.getAllByRole('textbox')[0]
      firstInput.focus()
      
      act(() => {
        fireEvent.keyDown(firstInput, { key: 'Backspace', code: 'Backspace' })
      })

      expect(mockOnChange).toHaveBeenCalledWith('')
    })

    it('moves to previous input and clears it when current is empty', () => {
      const mockOnChange = vi.fn()

      render(<OTPInput value="1" onChange={mockOnChange} />)

      const inputs = screen.getAllByRole('textbox')
      inputs[1].focus()
      
      act(() => {
        fireEvent.keyDown(inputs[1], { key: 'Backspace', code: 'Backspace' })
      })

      expect(document.activeElement).toBe(inputs[0])
      expect(mockOnChange).toHaveBeenCalledWith('')
    })

    it('does not move before first input', () => {
      const mockOnChange = vi.fn()

      render(<OTPInput value="" onChange={mockOnChange} />)

      const firstInput = screen.getAllByRole('textbox')[0]
      firstInput.focus()
      
      act(() => {
        fireEvent.keyDown(firstInput, { key: 'Backspace', code: 'Backspace' })
      })

      expect(document.activeElement).toBe(firstInput)
    })
  })

  describe('Arrow Key Navigation', () => {
    it('moves to previous input on ArrowLeft', () => {
      render(<OTPInput {...defaultProps} />)

      const inputs = screen.getAllByRole('textbox')
      inputs[1].focus()
      
      act(() => {
        fireEvent.keyDown(inputs[1], { key: 'ArrowLeft', code: 'ArrowLeft' })
      })

      expect(document.activeElement).toBe(inputs[0])
    })

    it('moves to next input on ArrowRight', () => {
      render(<OTPInput {...defaultProps} />)

      const inputs = screen.getAllByRole('textbox')
      inputs[0].focus()
      
      act(() => {
        fireEvent.keyDown(inputs[0], { key: 'ArrowRight', code: 'ArrowRight' })
      })

      expect(document.activeElement).toBe(inputs[1])
    })

    it('does not move beyond boundaries with arrow keys', () => {
      render(<OTPInput {...defaultProps} length={3} />)

      const inputs = screen.getAllByRole('textbox')

      // Test left boundary
      inputs[0].focus()
      act(() => {
        fireEvent.keyDown(inputs[0], { key: 'ArrowLeft', code: 'ArrowLeft' })
      })
      expect(document.activeElement).toBe(inputs[0])

      // Test right boundary
      inputs[2].focus()
      act(() => {
        fireEvent.keyDown(inputs[2], { key: 'ArrowRight', code: 'ArrowRight' })
      })
      expect(document.activeElement).toBe(inputs[2])
    })
  })

  describe('Focus Management', () => {
    it('applies focused styling to active input', async () => {
      const user = userEvent.setup()

      render(<OTPInput {...defaultProps} />)

      const inputs = screen.getAllByRole('textbox')
      await user.click(inputs[1])

      expect(inputs[1]).toHaveClass('ring-2', 'ring-ring', 'border-transparent')
    })

    it('removes focused styling when input loses focus', async () => {
      const user = userEvent.setup()

      render(<OTPInput {...defaultProps} />)

      const inputs = screen.getAllByRole('textbox')
      await user.click(inputs[1])
      await user.tab() // Move focus away

      expect(inputs[1]).not.toHaveClass(
        'ring-2',
        'ring-ring',
        'border-transparent'
      )
    })
  })

  describe('Paste Functionality', () => {
    it('handles pasted OTP code', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()

      render(<OTPInput value="" onChange={mockOnChange} />)

      const firstInput = screen.getAllByRole('textbox')[0]
      await user.click(firstInput)

      // Simulate paste event
      const pasteEvent = new Event('paste', { bubbles: true })
      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: {
          getData: () => '123456',
        },
      })

      fireEvent(firstInput, pasteEvent)

      expect(mockOnChange).toHaveBeenCalledWith('123456')
    })

    it('filters non-digit characters from pasted content', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()

      render(<OTPInput value="" onChange={mockOnChange} />)

      const firstInput = screen.getAllByRole('textbox')[0]
      await user.click(firstInput)

      const pasteEvent = new Event('paste', { bubbles: true })
      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: {
          getData: () => '1a2b3c',
        },
      })

      fireEvent(firstInput, pasteEvent)

      expect(mockOnChange).toHaveBeenCalledWith('123')
    })

    it('limits pasted content to input length', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()

      render(<OTPInput value="" onChange={mockOnChange} length={4} />)

      const firstInput = screen.getAllByRole('textbox')[0]
      await user.click(firstInput)

      const pasteEvent = new Event('paste', { bubbles: true })
      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: {
          getData: () => '123456789',
        },
      })

      fireEvent(firstInput, pasteEvent)

      expect(mockOnChange).toHaveBeenCalledWith('1234')
    })

    it('focuses appropriate input after paste', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()

      render(<OTPInput value="" onChange={mockOnChange} length={6} />)

      const firstInput = screen.getAllByRole('textbox')[0]
      const inputs = screen.getAllByRole('textbox')
      await user.click(firstInput)

      const pasteEvent = new Event('paste', { bubbles: true })
      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: {
          getData: () => '123',
        },
      })

      fireEvent(firstInput, pasteEvent)

      expect(document.activeElement).toBe(inputs[2]) // Index of last pasted character
    })
  })

  describe('Completion Callback', () => {
    it('calls onComplete when value reaches target length', () => {
      const mockOnComplete = vi.fn()

      const { rerender } = render(
        <OTPInput
          value=""
          onChange={vi.fn()}
          onComplete={mockOnComplete}
          length={4}
        />
      )

      rerender(
        <OTPInput
          value="1234"
          onChange={vi.fn()}
          onComplete={mockOnComplete}
          length={4}
        />
      )

      expect(mockOnComplete).toHaveBeenCalledWith('1234')
    })

    it('does not call onComplete when value is shorter than target length', () => {
      const mockOnComplete = vi.fn()

      const { rerender } = render(
        <OTPInput
          value=""
          onChange={vi.fn()}
          onComplete={mockOnComplete}
          length={4}
        />
      )

      rerender(
        <OTPInput
          value="123"
          onChange={vi.fn()}
          onComplete={mockOnComplete}
          length={4}
        />
      )

      expect(mockOnComplete).not.toHaveBeenCalled()
    })

    it('works without onComplete callback', () => {
      expect(() => {
        const { rerender } = render(
          <OTPInput value="" onChange={vi.fn()} length={4} />
        )

        rerender(<OTPInput value="1234" onChange={vi.fn()} length={4} />)
      }).not.toThrow()
    })
  })

  describe('Disabled State', () => {
    it('disables all inputs when disabled prop is true', () => {
      render(<OTPInput {...defaultProps} disabled />)

      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toBeDisabled()
      })
    })

    it('prevents input when disabled', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()

      render(<OTPInput value="" onChange={mockOnChange} disabled />)

      const firstInput = screen.getAllByRole('textbox')[0]
      await user.type(firstInput, '1')

      expect(mockOnChange).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('renders without crashing with minimal props', () => {
      expect(() => render(<OTPInput {...defaultProps} />)).not.toThrow()
    })

    it('handles undefined value gracefully', () => {
      expect(() =>
        render(<OTPInput value={undefined as any} onChange={vi.fn()} />)
      ).not.toThrow()
    })

    it('handles zero length gracefully', () => {
      render(<OTPInput {...defaultProps} length={0} />)

      const inputs = screen.queryAllByRole('textbox')
      expect(inputs).toHaveLength(0)
    })
  })
})
