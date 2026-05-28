import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
        className
      )}
      aria-label="PrepWise AI home"
    >
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/40 transition-transform group-hover:scale-110">
        <Sparkles className="h-5 w-5 text-primary-foreground" />
        <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent opacity-50 blur-md -z-10" />
      </span>
      {showText && (
        <span className="text-lg font-bold tracking-tight">
          PrepWise<span className="text-gradient">AI</span>
        </span>
      )}
    </Link>
  );
}
