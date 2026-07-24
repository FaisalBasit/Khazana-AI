import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]",
        className,
      )}
      {...props}
    />
  );
}
