import * as React from 'react'
import { cn } from '@/lib/utils'

const variantMap = {
  default:   'bg-sky-500/10 text-sky-400 border-sky-500/20',
  success:   'bg-green-500/10 text-green-400 border-green-500/20',
  warning:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger:    'bg-red-500/10 text-red-400 border-red-500/20',
  purple:    'bg-violet-500/10 text-violet-400 border-violet-500/20',
  secondary: 'bg-slate-800 text-slate-400 border-slate-700',
  sky:       'bg-sky-500/10 text-sky-400 border-sky-500/20',
}

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors',
      variantMap[variant] ?? variantMap.default,
      className
    )}
    {...props}
  />
))
Badge.displayName = 'Badge'

export { Badge }
