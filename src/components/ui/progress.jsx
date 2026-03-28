import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

const Progress = React.forwardRef(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        'h-full flex-1 rounded-full transition-all duration-700 ease-out',
        indicatorClassName || 'bg-gradient-to-r from-sky-500 to-sky-400'
      )}
      style={{ width: `${value || 0}%` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
