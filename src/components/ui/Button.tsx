"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-fredoka font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-0.5 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-[3px] border-orange-600 shadow-clay hover:bg-orange-500 hover:-translate-y-0.5",
        accent:
          "bg-accent text-accent-foreground border-[3px] border-blue-700 shadow-clay hover:bg-blue-600 hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground border-[3px] border-orange-500 shadow-clay hover:bg-orange-400 hover:-translate-y-0.5",
        outline:
          "border-[3px] border-primary bg-transparent text-primary hover:bg-orange-50 shadow-clay-sm hover:shadow-clay",
        ghost: "bg-transparent text-primary hover:bg-orange-50",
        destructive:
          "bg-destructive text-destructive-foreground border-[3px] border-red-700 shadow-clay hover:bg-red-500 hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 text-base rounded-2xl",
        sm: "h-9 px-4 py-2 text-sm rounded-xl",
        lg: "h-14 px-8 py-4 text-lg rounded-2xl",
        xl: "h-16 px-10 py-5 text-xl rounded-3xl",
        icon: "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
