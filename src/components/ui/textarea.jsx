import * as React from "react";

import { cn } from "@/lib/utils";

const autoResizeClass = "block overflow-hidden resize-none";

function autoResize() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
}

const Textarea = React.forwardRef(
  ({ className, autoResizable, ...props }, ref) => {
    React.useEffect(() => {
      if (!autoResizable) return;

      const textarea = document.querySelector("textarea");
      textarea.addEventListener("input", autoResize, false);

      return () => {
        textarea.removeEventListener(autoResize, null);
      };
    }, []);

    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
          `${autoResizable ? `${autoResizeClass}` : ""}`
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
