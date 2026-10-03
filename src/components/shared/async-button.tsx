import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AsyncButtonProps extends Omit<ButtonProps, "onClick"> {
  isPending?: boolean;
  loadingText?: string;
  pendingLabel?: string;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
}

export function AsyncButton({
  isPending: externalPending,
  loadingText,
  pendingLabel,
  icon,
  children,
  disabled,
  className,
  onClick,
  ...props
}: AsyncButtonProps) {
  const [internalPending, setInternalPending] = React.useState(false);
  const isPending = externalPending ?? internalPending;
  const activeLabel = loadingText || pendingLabel;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick || isPending) return;

    try {
      const result = onClick(e);
      if (result instanceof Promise) {
        setInternalPending(true);
        await result;
      }
    } finally {
      setInternalPending(false);
    }
  };

  return (
    <Button
      disabled={disabled || isPending}
      className={cn("gap-2", className)}
      onClick={handleClick}
      {...props}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>{activeLabel || children}</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </Button>
  );
}

export default AsyncButton;
