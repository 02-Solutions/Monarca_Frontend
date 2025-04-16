/**
 * Reusable button component with customizable styling and behavior.
 * 
 * Last edit: April 15, 2025
 * Authors: José Zumaya
 */
import React from 'react';

/**
 * ButtonProps interface to define the structure of the props for the Button component.
 */
interface ButtonProps {
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
    label,
    className = 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded',
    disabled = false,
    onClickFunction,
}) => {
    return (
        <button
            className={className}
            disabled={disabled}
            onClick={onClickFunction}
        >
            {label}
        </button>
    );
};

export default Button;