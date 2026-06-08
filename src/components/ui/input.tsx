import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-none border-2 border-input bg-background/90 px-3 py-1 text-sm shadow-[inset_0_2px_0_rgba(255,255,255,0.08),inset_0_-2px_0_rgba(0,0,0,0.18)] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
