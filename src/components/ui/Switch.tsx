import { Switch as HSwitch } from "@headlessui/react";
import clsx from "clsx";

export interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
  srLabel?: string;
  id?: string;
}

export default function Switch({
  checked,
  onChange,
  disabled = false,
  className,
  srLabel = "toggle",
  id,
}: SwitchProps) {
  return (
    <HSwitch
      id={id}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={clsx(
        "relative inline-flex h-7 w-14 items-center rounded-full transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        checked ? "bg-indigo-600" : "bg-gray-300",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <span className="sr-only">{srLabel}</span>
      <span
        aria-hidden="true"
        className={clsx(
          "inline-block size-5 transform rounded-full bg-white shadow transition",
          checked ? "translate-x-7" : "translate-x-1"
        )}
      />
    </HSwitch>
  );
}
