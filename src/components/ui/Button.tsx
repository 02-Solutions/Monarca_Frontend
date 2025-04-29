import React from "react";
import clsx from "clsx";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => {
  const baseStyles =
    "px-5 py-2.5 text-sm font-medium text-white bg-[var(--blue)] rounded-lg focus:ring-4 focus:ring-primary-200 hover:[var(--dark-blue)] cursor-pointer block";
  return (
    <button className={clsx(baseStyles, className)} {...props}>
      {children}
    </button>
  );
};
