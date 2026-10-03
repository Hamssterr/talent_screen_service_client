"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ThemeToggleProps {
  className?: string;
  variant?: "dropdown" | "compact" | "segmented";
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ className, variant = "compact" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Đang tải chủ đề giao diện"
        disabled
        className={cn("opacity-50", className)}
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label="Chọn chủ đề giao diện"
        className={cn(
          "inline-flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1 text-muted-foreground",
          className,
        )}
      >
        <button
          type="button"
          role="radio"
          aria-checked={theme === "light"}
          onClick={() => setTheme("light")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            theme === "light"
              ? "bg-card text-foreground shadow-xs"
              : "hover:text-foreground",
          )}
        >
          <Sun className="h-3.5 w-3.5" />
          <span>Sáng</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={theme === "dark"}
          onClick={() => setTheme("dark")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            theme === "dark"
              ? "bg-card text-foreground shadow-xs"
              : "hover:text-foreground",
          )}
        >
          <Moon className="h-3.5 w-3.5" />
          <span>Tối</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={theme === "system"}
          onClick={() => setTheme("system")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            theme === "system"
              ? "bg-card text-foreground shadow-xs"
              : "hover:text-foreground",
          )}
        >
          <Laptop className="h-3.5 w-3.5" />
          <span>Hệ thống</span>
        </button>
      </div>
    );
  }

  // Compact cycle toggle (Light -> Dark -> System)
  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getLabel = () => {
    if (theme === "light") return "Chế độ sáng (Nhấn để chuyển sang Tối)";
    if (theme === "dark") return "Chế độ tối (Nhấn để chuyển sang Hệ thống)";
    return "Theo hệ thống (Nhấn để chuyển sang Sáng)";
  };

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={cycleTheme}
      aria-label={getLabel()}
      title={getLabel()}
      className={cn("relative transition-colors", className)}
    >
      {theme === "light" && <Sun className="h-4 w-4 text-amber-600" />}
      {theme === "dark" && <Moon className="h-4 w-4 text-primary" />}
      {theme === "system" && <Laptop className="h-4 w-4 text-muted-foreground" />}
      <span className="sr-only">{getLabel()}</span>
    </Button>
  );
}

export default ThemeToggle;
