/*
 * Reusable input field component with customizable styling and behavior.
 *
 * Last edit: May 13, 2025
 * Authors: José Manuel García Zumaya
 */
import React, { ChangeEvent, useState } from "react";

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
  // New callback for validation
  validateField?: (value: string) => string | undefined;
}

/**
 * InputField component that renders a customizable input field with proper validation.
 * Now includes client-side validation for required fields and custom validation rules.
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
  validateField,
}) => {
  // Set default placeholder for date inputs
  const effectivePlaceholder =
    type === "date" && !placeholder ? "DD/MM/YYYY" : placeholder;

  // Local state to track validation errors
  const [localError, setLocalError] = useState<string | undefined>(error);
  const [isTouched, setIsTouched] = useState(false);

  // Combined error message (from props or local validation)
  const errorMessage = error || (isTouched ? localError : undefined);

  // Styles for invalid input
  const invalidClass = errorMessage ? "border-red-500 focus:ring-red-500" : "";

  // Handle validation on blur
  const handleBlur = () => {
    setIsTouched(true);

    // Check if field is required and empty
    if (required && value.trim() === "") {
      setLocalError("Este campo es obligatorio");
    }
    // Run custom validation if provided
    else if (validateField) {
      setLocalError(validateField(value));
    }
    // Clear error if field is valid
    else {
      setLocalError(undefined);
    }

    // Call original onBlur if provided
    if (onBlur) onBlur();
  };

  // Handle change event
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Call original onChange handler
    onChange(e);

    // If field has been touched, validate on change as well
    if (isTouched) {
      if (required && e.target.value.trim() === "") {
        setLocalError("Este campo es obligatorio");
      } else if (validateField) {
        setLocalError(validateField(e.target.value));
      } else {
        setLocalError(undefined);
      }
    }
  };

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
          className={`${className} ${invalidClass}`}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={(e) => {
            e.preventDefault();
            setIsTouched(true);
            if (onFocus) onFocus();
          }}
          aria-invalid={!!errorMessage}
          aria-required={required}
        />
      </div>
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputField;
