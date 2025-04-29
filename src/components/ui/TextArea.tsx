import React from "react";
import clsx from "clsx";

export type TextAreaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    className?: string;
  };

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    const baseStyles =
      "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600";
    return (
      <textarea ref={ref} className={clsx(baseStyles, className)} {...props} />
    );
  }
);
