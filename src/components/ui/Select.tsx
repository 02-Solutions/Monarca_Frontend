import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type Option = {
  id: number | string;
  name: string;
};

type SelectProps = {
  options: Option[];
  value: Option | null | undefined;
  onChange: (option: Option) => void;
  direction?: "up" | "down";
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
};

export default function Select({
  options,
  value,
  onChange,
  direction = "down",
  isLoading = false,
  isDisabled = false,
  placeholder = "Selecciona una opción",
}: SelectProps) {
  return (
    <Listbox value={value || null} onChange={onChange} disabled={isDisabled}>
      <div className="relative">
        <ListboxButton
          className={`relative w-full cursor-default rounded-md p-2.5 pr-10 text-left text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
            isDisabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          }`}
        >
          <span className="block truncate">
            {isLoading ? "Cargando..." : value?.name || placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className={`absolute z-10 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none sm:text-sm ${
            direction === "up" ? "bottom-full mb-1" : "mt-1"
          }`}
        >
          {isLoading ? (
            <div className="cursor-default select-none py-2 px-4 text-gray-700">
              Cargando...
            </div>
          ) : options.length === 0 ? (
            <div className="cursor-default select-none py-2 px-4 text-gray-700">
              No hay opciones disponibles.
            </div>
          ) : (
            options.map((option) => (
              <ListboxOption
                key={option.id}
                value={option}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-9 ${
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {option.name}
                    </span>

                    {selected ? (
                      <span
                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                          active ? "text-white" : "text-indigo-600"
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </ListboxOption>
            ))
          )}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
