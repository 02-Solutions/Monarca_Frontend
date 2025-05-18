import React, { ChangeEvent, useState } from "react";

/*
 * TextAreaFieldProps interface to define the structure of the props for the TextAreaField component.
 */
interface TextAreaFieldProps {
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
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  // Callback for validation
  validateField?: (value: string) => string | undefined;
}

/**
 * TextAreaField component that renders a customizable textArea field with proper validation.
 * Now includes client-side validation for required fields and custom validation rules.
 */
const TextAreaField: React.FC<TextAreaFieldProps> = ({
  id,
  name,
  type = "text",
  value,
  placeholder = "",
  className = "",
  disabled = false,
  required = false,
  label,
  error,
  onChange,
  onBlur,
  onFocus,
  validateField,
}) => {
  // Set default placeholder for date textAreas
  const effectivePlaceholder =
    type === "date" && !placeholder ? "DD/MM/YYYY" : placeholder;

  // Local state to track validation errors and touched state
  const [localError, setLocalError] = useState<string | undefined>(error);
  const [isTouched, setIsTouched] = useState(false);
  const [wasChanged, setWasChanged] = useState(false);

  // Helper function to check if value is empty based on textArea type
  const isEmptyValue = (val: string, textAreaType: string = type): boolean => {
    // For checkboxes and radios, we don't use trim()
    if (textAreaType === "checkbox" || textAreaType === "radio") {
      // For these types, we might consider "false" or "0" as empty
      return val === "false" || val === "0" || val === "";
    }

    // For number textAreas
    if (textAreaType === "number") {
      return val === "" || val === null || val === undefined;
    }

    // For file textAreas
    if (textAreaType === "file") {
      return val === "";
    }

    // For color textAreas (should always have a value)
    if (textAreaType === "color") {
      return false;
    }

    // For range textAreas (should always have a value)
    if (textAreaType === "range") {
      return false;
    }

    // For normal string-based textAreas, use trim()
    return typeof val === "string"
      ? val.trim() === ""
      : val === null || val === undefined;
  };

  // Combined error message (from props or local validation)
  const errorMessage =
    error || (isTouched || wasChanged ? localError : undefined);

  // Determine if the field is in an invalid state - now checks both touched and changed state
  const isInvalid =
    required && isEmptyValue(value) && (isTouched || wasChanged);

  // Base styles for the textArea - adjusted for different textArea types
  const baseClass = `p-2 border rounded-md focus:outline-none focus:ring-2 ${
    type === "checkbox" || type === "radio"
      ? "w-auto hover:cursor-pointer" // Checkbox and radio shouldn't be full width
      : type === "file"
      ? "w-full hover:cursor-pointer"
      : type === "color"
      ? "w-auto h-10 hover:cursor-pointer" // Color picker needs specific height
      : type === "range"
      ? "w-full hover:cursor-ew-resize"
      : type === "date"
      ? "w-full hover:cursor-pointer"
      : "w-full hover:cursor-text"
  }`;

  // Final className combining all styles
  const borderClass =
    isInvalid || errorMessage
      ? "border-red-500 focus:ring-blue-500"
      : "border-gray-300 focus:ring-blue-500";

  // Text color
  const textClass = "text-[#0a2c6d]";

  // Validate the field
  const validateTextArea = (textAreaValue: string) => {
    // Check if field is required and empty
    if (required && isEmptyValue(textAreaValue)) {
      setLocalError("Este campo es obligatorio");
      return false;
    }
    // Run custom validation if provided
    else if (validateField) {
      const validationError = validateField(textAreaValue);
      setLocalError(validationError);
      return !validationError;
    }
    // Clear error if field is valid
    else {
      setLocalError(undefined);
      return true;
    }
  };

  // We don't need the useEffect anymore, validation will be handled by the touch state and event handlers

  // Handle validation on blur
  const handleBlur = () => {
    setIsTouched(true);
    validateTextArea(value);

    // Call original onBlur if provided
    if (onBlur) onBlur();
  };

  // Handle change event
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Call original onChange handler
    onChange(e);

    // Mark that the field has been changed
    setWasChanged(true);

    // Validate on change
    validateTextArea(e.target.value);
  };

  // Handle focus event
  const handleFocus = () => {
    setIsTouched(true);
    if (onFocus) onFocus();
  };

  // Handle special display requirements for different textArea types
  const renderTextArea = () => {
    // Special case for checkbox and radio textAreas
    if (type === "checkbox" || type === "radio") {
      return (
        <div className="flex items-center">
          <textarea
            id={id || name}
            name={name}
            value={value}
            className={`${baseClass} ${borderClass} ${textClass} ${className}`}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            aria-invalid={!!errorMessage}
            aria-required={required}
          />
          {label && (
            <label
              htmlFor={id || name}
              className="ml-2 text-sm font-medium text-[#0a2c6d]"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
      );
    }

    // Default case for all other textArea types
    return (
      <>
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
          <textarea
            id={id || name}
            name={name}
            value={value}
            placeholder={effectivePlaceholder}
            className={`${baseClass} ${borderClass} ${textClass} ${className}`}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            aria-invalid={!!errorMessage}
            aria-required={required}
          />
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col mb-4">
      {renderTextArea()}
      {errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextAreaField;
