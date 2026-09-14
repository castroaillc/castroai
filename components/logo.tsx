import { cn } from "@/lib/utils"

/**
 * Castro AI wordmark. Uses the brand heading font (Space Grotesk, mapped to
 * `font-heading`) and the `primary` theme token for the accent color and
 * square, so it tracks light/dark mode automatically.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-baseline gap-[2px] font-heading font-semibold normal-case tracking-tight",
        className
      )}
    >
      <span className="text-foreground">castro</span>
      <span className="text-primary">ai</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[0.28em] w-[0.28em] -translate-y-[0.22em] bg-primary"
      />
    </span>
  )
}
