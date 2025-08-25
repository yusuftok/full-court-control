'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormFieldProps extends React.ComponentProps<'div'> {
  name: string
  label?: string
  description?: string
  required?: boolean
  children?: React.ReactNode
  className?: string
}

export function FormField({
  name,
  label,
  description,
  required = false,
  children,
  className,
  ...props
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]
  const fieldId = `field-${name}`
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`

  return (
    <div className={cn('grid gap-2', className)} {...props}>
      {label && (
        <Label
          htmlFor={fieldId}
          className={cn(
            'text-sm font-medium',
            error && 'text-destructive',
            required &&
              "after:content-['*'] after:ml-0.5 after:text-destructive"
          )}
        >
          {label}
        </Label>
      )}

      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      <div className="relative">
        {children || (
          <Input
            id={fieldId}
            {...register(name)}
            aria-describedby={cn(
              description && descriptionId,
              error && errorId
            )}
            aria-invalid={!!error}
            className={cn(
              error &&
                'border-destructive focus:border-destructive focus:ring-destructive/20'
            )}
          />
        )}
      </div>

      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error.message as string}
        </p>
      )}
    </div>
  )
}

// Specialized form fields
interface TextFieldProps extends Omit<FormFieldProps, 'children'> {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  placeholder?: string
  autoComplete?: string
}

export function TextField({
  type = 'text',
  placeholder,
  autoComplete,
  name,
  ...props
}: TextFieldProps) {
  const { register } = useFormContext()

  return (
    <FormField name={name} {...props}>
      <Input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register(name)}
      />
    </FormField>
  )
}

interface TextAreaFieldProps extends Omit<FormFieldProps, 'children'> {
  placeholder?: string
  rows?: number
}

export function TextAreaField({
  placeholder,
  rows = 3,
  name,
  ...props
}: TextAreaFieldProps) {
  const { register } = useFormContext()

  return (
    <FormField name={name} {...props}>
      <textarea
        placeholder={placeholder}
        rows={rows}
        {...register(name)}
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-none'
        )}
      />
    </FormField>
  )
}

interface NumberFieldProps extends Omit<FormFieldProps, 'children'> {
  placeholder?: string
  min?: number
  max?: number
  step?: number | 'any'
}

export function NumberField({
  placeholder,
  min,
  max,
  step = 1,
  name,
  ...props
}: NumberFieldProps) {
  const { register } = useFormContext()

  return (
    <FormField name={name} {...props}>
      <Input
        type="number"
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        {...register(name, {
          valueAsNumber: true,
          min: min
            ? { value: min, message: `Minimum value is ${min}` }
            : undefined,
          max: max
            ? { value: max, message: `Maximum value is ${max}` }
            : undefined,
        })}
      />
    </FormField>
  )
}

// Form section wrapper
interface FormSectionProps extends React.ComponentProps<'div'> {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({
  title,
  description,
  children,
  className,
  ...props
}: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  )
}
