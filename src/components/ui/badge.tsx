import { cva, type VariantProps } from 'class-variance-authority'
import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-none border-2 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mc-chip',
  {
    variants: {
      variant: {
        default: 'border-border bg-primary text-primary-foreground',
        secondary: 'border-border bg-secondary text-secondary-foreground',
        destructive: 'border-border bg-destructive text-destructive-foreground',
        outline: 'border-border bg-background/70 text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
