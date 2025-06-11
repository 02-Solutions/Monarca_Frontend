/**
 * Reusable button component with customizable styling and behavior.
 *
 * Last edit: April 20, 2025
 * Authors: José Manuel García Zumaya
 */
import React from "react";

/**
 * ButtonProps interface to define the structure of the props for the Button component.
 */
interface ButtonProps {
  id?: string;
  label: string;
  className?: string;
  disabled?: boolean;
  onClickFunction?: () => void;
}

/**
 * Button component that renders a customizable button with optional
 * styling, disabled state, and click handler functionality.
 */
const Button: React.FC<ButtonProps> = ({
  id,
  label,
  className = "bg-white hover:bg-gray-300 hover:cursor-pointer p-2 text-[#0a2c6d] font-bold rounded-md shadow-md",
  disabled = false,
  onClickFunction,
}) => {
  return (
    <button className={className} disabled={disabled} onClick={onClickFunction} id={id}>
      {label}
    </button>
  );
};

export default Button;
