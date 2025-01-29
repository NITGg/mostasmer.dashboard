import React, { useCallback, useEffect, useState, useRef } from "react";
import { ChevronDown, Loader, X } from "lucide-react";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { useLocale } from "next-intl";
import ErrorMsg from "./ErrorMsg";
import clsx from "clsx";

type FetchResponse<T> = {
  data: T[];
  totalPages: number;
};

type FetchFunction<T> = (params: {
  search: string;
  page: number;
  limit: number;
}) => Promise<FetchResponse<T>>;

interface SelectProps<T> {
  fieldForm: string;
  label: string;
  fetchFunction: FetchFunction<T>;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string | number;
  defaultValue?: T | null;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  roles: RegisterOptions;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  disabled?: boolean;
  clearable?: boolean;
  limit?: number;
  debounceMs?: number;
}

export function Select<T>({
  fieldForm,
  label,
  fetchFunction,
  getOptionLabel,
  getOptionValue,
  defaultValue = null,
  placeholder = "Search...",
  className = "",
  icon,
  roles,
  errors,
  register,
  setValue,
  disabled = false,
  clearable = true,
  limit = 10,
  debounceMs = 300,
}: SelectProps<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<T | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const local = useLocale();

  const selectRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  const fetchOptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchFunction({
        search: searchTerm,
        page,
        limit,
      });

      setOptions((prev) =>
        page === 1 ? response.data : [...prev, ...response.data]
      );
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, searchTerm, page, limit]);

  useEffect(() => {
    if (defaultValue) {
      setSelectedOption(defaultValue);
      setValue(fieldForm, getOptionValue(defaultValue));
    }
  }, [defaultValue, fieldForm, setValue, getOptionValue]);

  useEffect(() => {
    if (isOpen) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      searchTimeout.current = setTimeout(() => {
        setPage(1);
        setOptions([]);
        fetchOptions();
      }, debounceMs);
    }
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [fetchOptions, isOpen, searchTerm, debounceMs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: T) => {
    setSelectedOption(option);
    setValue(fieldForm, getOptionValue(option));
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(null);
    setSearchTerm("");
    setValue(fieldForm, "");
  };

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      !isLoading &&
      page < totalPages
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const { ref: registerRef, ...registerRest } = register(fieldForm, roles);

  return (
    <div className="grid items-center grid-cols-[1fr_2.5fr] w-full h-min relative">
      <label className="text-nowrap" htmlFor={`${fieldForm}Id`}>
        {label}:
      </label>
      <div className="relative" ref={selectRef}>
        <input
          type="hidden"
          {...registerRest}
          ref={registerRef}
          id={`${fieldForm}Id`}
        />
        <div
          className={clsx(
            "border-2 border-[#DADADA] p-2 rounded-xl bg-transparent shadow-[0px_0px_5px_-1px_#00000040] outline-none",
            "hover:border-primary focus:border-primary transition-colors duration-200 ease-in-out",
            disabled && "bg-gray-100 cursor-not-allowed",
            className
          )}
          onClick={() => !disabled && setIsOpen(true)}
        >
          <input
            type="text"
            className="w-full bg-transparent outline-none"
            placeholder={placeholder}
            value={selectedOption ? getOptionLabel(selectedOption) : searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            disabled={disabled}
            readOnly={!isOpen}
          />
          <div
            className={clsx(
              "absolute grid place-content-center inset-y-0",
              local === "en" ? "right-2" : "left-2"
            )}
          >
            {icon || (
              <>
                {clearable && selectedOption && !disabled && (
                  <X
                    className="w-4 h-4 text-gray-400 hover:text-gray-600 mr-1"
                    onClick={handleClear}
                  />
                )}
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 text-gray-400",
                    isOpen && "transform rotate-180 transition-transform"
                  )}
                />
              </>
            )}
          </div>
        </div>

        {isOpen && (
          <ul
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            onScroll={handleScroll}
          >
            {options.map((option) => (
              <li
                key={getOptionValue(option)}
                className={clsx(
                  "px-3 py-2 cursor-pointer",
                  selectedOption &&
                    getOptionValue(selectedOption) === getOptionValue(option)
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                )}
                onClick={() => handleSelect(option)}
              >
                {getOptionLabel(option)}
              </li>
            ))}
            {isLoading && (
              <li className="px-3 py-2 text-center text-gray-500">
                <Loader className="w-4 h-4 animate-spin inline mr-2" />
                Loading...
              </li>
            )}
            {!isLoading && options.length === 0 && (
              <li className="px-3 py-2 text-center text-gray-500">
                No options found
              </li>
            )}
          </ul>
        )}
      </div>
      <div className="col-span-full">
        <ErrorMsg message={errors?.[fieldForm]?.message as string} />
      </div>
    </div>
  );
}

export default Select;
