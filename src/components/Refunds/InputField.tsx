/*
 * Reusable input field component with customizable styling and behavior.
 *
 * Last edit: April 29, 2025
 * Authors: José Manuel García Zumaya
 */
import React, { ChangeEvent } from "react";

/*
 * InputFieldProps interface to define the structure of the props for the InputField component.
 */
interface InputFieldProps {
  id?: string;
  name?: string;
  type?:
    | "text"
    | "file"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "color"
    | "checkbox"
    | "radio"
    | "range"
    | "hidden";
  value: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

/**
 * InputField component that renders a customizable input field with optional
 * styling, label, error message, disabled state, and various event handlers.
 */
const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type = "text",
  value,
  placeholder = "",
  className = `p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#0a2c6d] ${
    type === "file"
      ? "hover:cursor-pointer"
      : type === "checkbox" || type === "radio"
      ? "hover:cursor-pointer"
      : type === "color"
      ? "hover:cursor-pointer"
      : type === "range"
      ? "hover:cursor-ew-resize"
      : type === "date"
      ? "hover:cursor-pointer"
      : "hover:cursor-text"
  }`,
  disabled = false,
  required = false,
  label,
  error,
  onChange,
  onBlur,
  onFocus,
}) => {
  // Set default placeholder for date inputs
  const effectivePlaceholder =
    type === "date" && !placeholder ? "DD/MM/YYYY" : placeholder;

  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label
          htmlFor={id || name}
          className="mb-1 text-sm font-medium text-[#0a2c6d]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          placeholder={effectivePlaceholder}
          className={className}
          disabled={disabled}
          required={required}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
