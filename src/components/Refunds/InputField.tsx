/*
 * Reusable input field component with customizable styling and behavior.
 *
 * Last edit: April 20, 2025
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
    | "date";
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
  className = "p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#0a2c6d] hover:cursor-pointer",
  disabled = false,
  required = false,
  label,
  error,
  onChange,
  onBlur,
  onFocus,
}) => {
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
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
