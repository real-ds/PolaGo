"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:border-[3px] group-[.toaster]:shadow-clay-lg group-[.toaster]:rounded-2xl group-[.toaster]:font-quicksand group-[.toaster]:font-semibold",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground rounded-xl border-[3px] border-orange-600 shadow-clay",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground rounded-xl border-[3px] border-border shadow-clay-sm",
          success:
            "group toast group-[.toaster]:bg-green-50 group-[.toaster]:text-green-800 group-[.toaster]:border-green-200 group-[.toaster]:border-[3px] group-[.toaster]:shadow-clay-lg group-[.toaster]:rounded-2xl group-[.toaster]:font-quicksand group-[.toaster]:font-semibold",
          error:
            "group toast group-[.toaster]:bg-red-50 group-[.toaster]:text-red-800 group-[.toaster]:border-red-200 group-[.toaster]:border-[3px] group-[.toaster]:shadow-clay-lg group-[.toaster]:rounded-2xl group-[.toaster]:font-quicksand group-[.toaster]:font-semibold",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
