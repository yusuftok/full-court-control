/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import {
  FormField,
  TextField,
  TextAreaField,
  NumberField,
  FormSection,
} from './form-field'

// Mock UI components
vi.mock('@/components/ui/input', () => ({
  Input: ({ className, ...props }: any) => (
    <input data-testid="input" className={className} {...props} />
  ),
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}))

// Test wrapper component with react-hook-form context
interface TestFormWrapperProps {
  children: React.ReactNode
  errors?: any
}

function TestFormWrapper({ children, errors = {} }: TestFormWrapperProps) {
  ;(globalThis as any).__TEST_RHF_ERRORS__ = errors
  const mockForm = {
    register: vi.fn((name: string) => ({
      name,
      onChange: vi.fn(),
      onBlur: vi.fn(),
    })),
    formState: { errors },
    handleSubmit: vi.fn(),
    watch: vi.fn(),
    setValue: vi.fn(),
    getValues: vi.fn(),
    reset: vi.fn(),
  }

  // Mock useFormContext to return our mock form
  vi.spyOn(require('react-hook-form'), 'useFormContext').mockReturnValue(
    mockForm
  )

  return <div>{children}</div>
}

describe('FormField Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders form field with label', () => {
      render(
        <TestFormWrapper>
          <FormField name="test" label="Test Field" />
        </TestFormWrapper>
      )

      expect(screen.getByText('Test Field')).toBeInTheDocument()
      expect(screen.getByTestId('input')).toBeInTheDocument()
    })

    it('renders without label when not provided', () => {
      render(
        <TestFormWrapper>
          <FormField name="test" />
        </TestFormWrapper>
      )

      expect(screen.queryByText('Test Field')).not.toBeInTheDocument()
      expect(screen.getByTestId('input')).toBeInTheDocument()
    })

    it('renders description when provided', () => {
      render(
        <TestFormWrapper>
          <FormField
            name="test"
            label="Test Field"
            description="Test description"
          />
        </TestFormWrapper>
      )

      expect(screen.getByText('Test description')).toBeInTheDocument()
    })

    it('renders custom children instead of default input', () => {
      render(
        <TestFormWrapper>
          <FormField name="test" label="Test Field">
            <select data-testid="custom-select">
              <option>Option 1</option>
            </select>
          </FormField>
        </TestFormWrapper>
      )

      expect(screen.getByTestId('custom-select')).toBeInTheDocument()
      expect(screen.queryByTestId('input')).not.toBeInTheDocument()
    })
  })

  describe('Required Field Styling', () => {
    it('shows asterisk for required fields', () => {
      render(
        <TestFormWrapper>
          <FormField name="test" label="Test Field" required />
        </TestFormWrapper>
      )

      const label = screen.getByText('Test Field')
      expect(label).toHaveClass(
        "after:content-['*']",
        'after:ml-0.5',
        'after:text-destructive'
      )
    })

    it('does not show asterisk for non-required fields', () => {
      render(
        <TestFormWrapper>
          <FormField name="test" label="Test Field" required={false} />
        </TestFormWrapper>
      )

      const label = screen.getByText('Test Field')
      expect(label).not.toHaveClass("after:content-['*']")
    })
  })

  describe('Error Handling', () => {
    it('displays error message when field has error', () => {
      const errors = {
        test: { message: 'This field is required' },
      }

      render(
        <TestFormWrapper errors={errors}>
          <FormField name="test" label="Test Field" />
        </TestFormWrapper>
      )

      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('applies error styling to label when field has error', () => {
      const errors = {
        test: { message: 'This field is required' },
      }

      render(
        <TestFormWrapper errors={errors}>
          <FormField name="test" label="Test Field" />
        </TestFormWrapper>
      )

      const label = screen.getByText('Test Field')
      expect(label).toHaveClass('text-destructive')
    })

    it('applies error styling to input when field has error', () => {
      const errors = {
        test: { message: 'This field is required' },
      }

      render(
        <TestFormWrapper errors={errors}>
          <FormField name="test" label="Test Field" />
        </TestFormWrapper>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveClass(
        'border-destructive',
        'focus:border-destructive'
      )
    })

    it('sets aria-invalid when field has error', () => {
      const errors = {
        test: { message: 'This field is required' },
      }

      render(
        <TestFormWrapper errors={errors}>
          <FormField name="test" label="Test Field" />
        </TestFormWrapper>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Accessibility', () => {
    it('associates label with input using htmlFor and id', () => {
      render(
        <TestFormWrapper>
          <FormField name="test" label="Test Field" />
        </TestFormWrapper>
      )

      const label = screen.getByText('Test Field')
      const input = screen.getByTestId('input')

      expect(label).toHaveAttribute('for', 'field-test')
      expect(input).toHaveAttribute('id', 'field-test')
    })

    it('sets aria-describedby for description', () => {
      render(
        <TestFormWrapper>
          <FormField
            name="test"
            label="Test Field"
            description="Test description"
          />
        </TestFormWrapper>
      )

      const input = screen.getByTestId('input')
      const description = screen.getByText('Test description')

      expect(input).toHaveAttribute(
        'aria-describedby',
        'field-test-description'
      )
      expect(description).toHaveAttribute('id', 'field-test-description')
    })

    it('sets aria-describedby for error message', () => {
      const errors = {
        test: { message: 'This field is required' },
      }

      render(
        <TestFormWrapper errors={errors}>
          <FormField name="test" label="Test Field" />
        </TestFormWrapper>
      )

      const input = screen.getByTestId('input')
      const errorMessage = screen.getByText('This field is required')

      expect(input).toHaveAttribute('aria-describedby', 'field-test-error')
      expect(errorMessage).toHaveAttribute('id', 'field-test-error')
      expect(errorMessage).toHaveAttribute('role', 'alert')
    })

    it('combines aria-describedby for both description and error', () => {
      const errors = {
        test: { message: 'This field is required' },
      }

      render(
        <TestFormWrapper errors={errors}>
          <FormField
            name="test"
            label="Test Field"
            description="Test description"
          />
        </TestFormWrapper>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute(
        'aria-describedby',
        'field-test-description field-test-error'
      )
    })
  })

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(
        <TestFormWrapper>
          <FormField
            name="test"
            className="custom-field"
            data-testid="field-wrapper"
          />
        </TestFormWrapper>
      )

      const wrapper = screen.getByTestId('field-wrapper')
      expect(wrapper).toHaveClass('custom-field')
    })

    it('forwards additional props', () => {
      render(
        <TestFormWrapper>
          <FormField name="test" data-testid="field-wrapper" id="custom-id" />
        </TestFormWrapper>
      )

      const wrapper = screen.getByTestId('field-wrapper')
      expect(wrapper).toHaveAttribute('id', 'custom-id')
    })
  })
})

describe('TextField Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Input Types', () => {
    const inputTypes = ['text', 'email', 'password', 'tel', 'url'] as const

    inputTypes.forEach(type => {
      it(`renders ${type} input correctly`, () => {
        render(
          <TestFormWrapper>
            <TextField name="test" type={type} label="Test Field" />
          </TestFormWrapper>
        )

        const input = screen.getByTestId('input')
        expect(input).toHaveAttribute('type', type)
      })
    })

    it('defaults to text type', () => {
      render(
        <TestFormWrapper>
          <TextField name="test" label="Test Field" />
        </TestFormWrapper>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('type', 'text')
    })
  })

  describe('Input Attributes', () => {
    it('sets placeholder attribute', () => {
      render(
        <TestFormWrapper>
          <TextField name="test" placeholder="Enter text..." />
        </TestFormWrapper>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('placeholder', 'Enter text...')
    })

    it('sets autoComplete attribute', () => {
      render(
        <TestFormWrapper>
          <TextField name="email" type="email" autoComplete="email" />
        </TestFormWrapper>
      )

      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('autocomplete', 'email')
    })
  })
})

describe('TextAreaField Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders textarea element', () => {
    render(
      <TestFormWrapper>
        <TextAreaField name="test" label="Test Area" />
      </TestFormWrapper>
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('sets default rows to 3', () => {
    render(
      <TestFormWrapper>
        <TextAreaField name="test" label="Test Area" />
      </TestFormWrapper>
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '3')
  })

  it('sets custom rows', () => {
    render(
      <TestFormWrapper>
        <TextAreaField name="test" rows={5} label="Test Area" />
      </TestFormWrapper>
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '5')
  })

  it('sets placeholder', () => {
    render(
      <TestFormWrapper>
        <TextAreaField name="test" placeholder="Enter description..." />
      </TestFormWrapper>
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('placeholder', 'Enter description...')
  })

  it('applies correct CSS classes', () => {
    render(
      <TestFormWrapper>
        <TextAreaField name="test" />
      </TestFormWrapper>
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass(
      'flex',
      'min-h-[60px]',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2',
      'text-sm',
      'resize-none'
    )
  })
})

describe('NumberField Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders number input', () => {
    render(
      <TestFormWrapper>
        <NumberField name="age" label="Age" />
      </TestFormWrapper>
    )

    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('sets min and max attributes', () => {
    render(
      <TestFormWrapper>
        <NumberField name="age" min={18} max={100} />
      </TestFormWrapper>
    )

    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('min', '18')
    expect(input).toHaveAttribute('max', '100')
  })

  it('sets step attribute', () => {
    render(
      <TestFormWrapper>
        <NumberField name="price" step={0.01} />
      </TestFormWrapper>
    )

    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('step', '0.01')
  })

  it('defaults step to 1', () => {
    render(
      <TestFormWrapper>
        <NumberField name="count" />
      </TestFormWrapper>
    )

    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('step', '1')
  })

  it('handles step="any"', () => {
    render(
      <TestFormWrapper>
        <NumberField name="decimal" step="any" />
      </TestFormWrapper>
    )

    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('step', 'any')
  })
})

describe('FormSection Component', () => {
  it('renders children correctly', () => {
    render(
      <FormSection>
        <div data-testid="section-content">Section Content</div>
      </FormSection>
    )

    expect(screen.getByTestId('section-content')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(
      <FormSection title="Personal Information">
        <div>Content</div>
      </FormSection>
    )

    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <FormSection
        title="Personal Information"
        description="Please provide your personal details"
      >
        <div>Content</div>
      </FormSection>
    )

    expect(
      screen.getByText('Please provide your personal details')
    ).toBeInTheDocument()
  })

  it('does not render header section when no title or description', () => {
    render(
      <FormSection>
        <div data-testid="section-content">Content</div>
      </FormSection>
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('applies correct spacing classes', () => {
    render(
      <FormSection data-testid="section" title="Test">
        <div>Content</div>
      </FormSection>
    )

    const section = screen.getByTestId('section')
    expect(section).toHaveClass('space-y-4')
  })

  it('applies custom className', () => {
    render(
      <FormSection className="custom-section" data-testid="section">
        <div>Content</div>
      </FormSection>
    )

    const section = screen.getByTestId('section')
    expect(section).toHaveClass('custom-section', 'space-y-4')
  })

  it('forwards additional props', () => {
    render(
      <FormSection data-testid="section" id="personal-section">
        <div>Content</div>
      </FormSection>
    )

    const section = screen.getByTestId('section')
    expect(section).toHaveAttribute('id', 'personal-section')
  })
})
