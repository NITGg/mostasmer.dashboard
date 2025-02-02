import React, { SelectHTMLAttributes } from "react";
import clsx from "clsx";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import ErrorMsg from "../ErrorMsg";
interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  defaultValue?: string | number;
  fieldForm: string;
  label: string;
  options: Array<{ value: string | number; label: string | number }>;
  className?: string;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
  roles: RegisterOptions;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  defaultValue,
  fieldForm,
  options,
  className,
  errors,
  roles,
  register,
  ...rest
}) => {
  const local = useLocale();

  const updatedOptions = [{ value: "", label: "Select..." }, ...options];

  return (
    <>
      <div className="grid items-center grid-cols-[1fr_2.5fr] max-md:grid-cols-1 w-full h-min">
        <label className="text-nowrap" htmlFor={`${fieldForm}Id`}>
          {label}:
        </label>
        <div className="relative">
          <select
            id={`${fieldForm}Id`}
            defaultValue={defaultValue}
            {...register(fieldForm, roles)}
            className={clsx(
              "border-2 border-[#DADADA] p-2 rounded-xl bg-transparent shadow-[0px_0px_5px_-1px_#00000040] outline-none appearance-none w-full",
              "hover:border-primary focus:border-primary",
              "transition-colors duration-200 ease-in-out",
              className
            )}
            {...rest}
          >
            {updatedOptions.map((option) => (
              <option
                // selected={defaultValue === option.value}
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
          <span
            className={clsx(
              "absolute inset-y-0 grid place-content-center pointer-events-none",
              local === "en" ? "right-2" : "left-2"
            )}
          >
            <ChevronDown className="text-primary size-5" />
          </span>
        </div>
      </div>
      <ErrorMsg message={errors?.[fieldForm]?.message as string} />
    </>
  );
};

export default CustomSelect;
