import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none border-2 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-2px_0_rgba(0,0,0,0.22)] active:translate-y-px',
  {
    variants: {
      variant: {
        default: 'border-border bg-primary text-primary-foreground hover:brightness-110',
        destructive: 'border-border bg-destructive text-destructive-foreground hover:brightness-110',
        outline: 'border-border bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'border-border bg-secondary text-secondary-foreground hover:brightness-105',
        ghost: 'border-transparent bg-transparent shadow-none hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

export { buttonVariants }
