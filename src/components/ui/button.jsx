import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default:
          'bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:shadow-sky-400/30',
        destructive:
          'bg-red-500/90 text-white shadow-sm hover:bg-red-400',
        outline:
          'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:border-slate-600 hover:text-white',
        secondary:
          'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white',
        ghost:
          'text-slate-400 hover:bg-slate-800 hover:text-white',
        link:
          'text-sky-400 underline-offset-4 hover:underline hover:text-sky-300',
        'sky-outline':
          'border border-sky-500/40 bg-sky-500/5 text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/60 hover:text-sky-300',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded-lg px-3.5 text-xs',
        lg: 'h-12 rounded-xl px-8 text-[15px]',
        xl: 'h-14 rounded-2xl px-10 text-base',
        icon: 'h-10 w-10 rounded-xl',
        'icon-sm': 'h-8 w-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
