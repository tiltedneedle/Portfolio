import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border-0 bg-[#1c1c1e] px-4 py-3 text-[15px] text-[#f5f5f7] placeholder:text-[#86868b] transition-all duration-300 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.15)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
