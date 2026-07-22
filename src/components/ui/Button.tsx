import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-accent text-canvas hover:bg-accent-hover disabled:bg-border disabled:text-fg-faint disabled:cursor-not-allowed font-medium',
  secondary: 'border border-border text-fg hover:border-accent hover:text-accent bg-transparent disabled:opacity-40 disabled:cursor-not-allowed',
  danger:    'bg-danger text-canvas hover:bg-danger-hover disabled:opacity-40 disabled:cursor-not-allowed font-medium',
  ghost:     'text-fg-muted hover:text-fg bg-transparent disabled:opacity-40 disabled:cursor-not-allowed',
}

const sizeClasses: Record<Size, string> = {
  sm:  'px-3 py-1.5 text-sm rounded',
  md:  'px-4 py-2 text-sm rounded-md',
  lg:  'px-6 py-3 text-base rounded-md',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
