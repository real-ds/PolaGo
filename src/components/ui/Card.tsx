"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "cute" | "dark";
}

const variants = {
  default: "bg-white border border-pink-100",
  cute: "bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200",
  dark: "bg-gray-800 border border-gray-700",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl shadow-sm ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";
