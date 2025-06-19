import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

// Provider
export const TooltipProvider = TooltipPrimitive.Provider

// Root tooltip wrapper
export const Tooltip = TooltipPrimitive.Root

// Trigger component
export const TooltipTrigger = TooltipPrimitive.Trigger

// Content component with inline Tailwind styles
export function TooltipContent({
  className = "",
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Content
      sideOffset={sideOffset}
      className={`z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md
        animate-in fade-in-0 zoom-in-95
        data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
        data-[side=bottom]:slide-in-from-top-2
        data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2
        data-[side=top]:slide-in-from-bottom-2
        ${className}`}
      {...props}
    />
  )
}
