import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40",
        secondary:
          "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700",
        success:
          "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/40",
        destructive:
          "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40",
        warning:
          "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40",
        info:
          "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/40",
        outline:
          "border-2 border-current text-foreground hover:bg-current/10",
        glass:
          "backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/50 shadow-lg",
        gradient:
          "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40 font-bold",
        premium:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
