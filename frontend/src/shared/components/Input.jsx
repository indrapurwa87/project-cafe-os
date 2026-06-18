import { forwardRef } from 'react'
import { cn } from '../utils/cn'

const Input = forwardRef(({
  label,
  error,
  hint,
  prefix,
  suffix,
  className,
  containerClassName,
  required,
  ...props
}, ref) => {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-sm font-semibold text-ink-secondary font-heading">
          {label}
          {required && <span className="text-brand-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-ink-muted flex-shrink-0">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'input-base',
            prefix && 'pl-10',
            suffix && 'pr-10',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 text-ink-muted flex-shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-ink-muted">{hint}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
