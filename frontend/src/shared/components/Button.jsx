import { forwardRef } from 'react'
import { cn } from '../utils/cn'

const sizeClasses = {
  sm: 'px-3 py-2 text-sm rounded-lg',
  md: 'px-5 py-3 text-base rounded-xl',
  lg: 'px-6 py-4 text-lg rounded-xl w-full',
}

const variantClasses = {
  primary:   'bg-brand-500 text-white hover:bg-brand-600 shadow-glow active:bg-brand-700',
  secondary: 'bg-surface text-ink-primary hover:bg-brand-50 border border-ink-placeholder/40',
  ghost:     'text-ink-secondary hover:bg-surface-muted',
  danger:    'bg-red-500 text-white hover:bg-red-600',
  outline:   'border-2 border-brand-500 text-brand-600 hover:bg-brand-50',
}

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  icon,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-heading font-semibold',
        'transition-all duration-200 select-none cursor-pointer',
        'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
