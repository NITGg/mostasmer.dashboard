import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { useLocale } from "next-intl";
import ErrorMsg from "../ErrorMsg";

interface UserInputProps extends InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: string | number;
  fieldForm: string;
  label: string;
  className?: string;
  icon?: React.ReactNode;
  roles: RegisterOptions;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}

const UserInput: React.FC<UserInputProps> = ({
  defaultValue,
  fieldForm,
  label,
  className,
  register,
  icon,
  roles,
  errors,
  ...rest
}) => {
  const local = useLocale();
  return (
    <div className="grid items-center grid-cols-[1fr_2.5fr] max-md:grid-cols-1 w-full h-min ">
      <label className="text-nowrap" htmlFor={`${fieldForm}Id`}>
        {label}:
      </label>
      <div className="relative">
        <input
          id={`${fieldForm}Id`}
          defaultValue={defaultValue}
          {...register(fieldForm, roles)}
          className={clsx(
            "border-2 border-[#DADADA] p-2 rounded-xl bg-transparent shadow-[0px_0px_5px_-1px_#00000040] outline-none w-full",
            "hover:border-primary focus:border-primary",
            "transition-colors duration-200 ease-in-out",
            className
          )}
          {...rest}
        />
        {icon && (
          <span
            className={clsx(
              "absolute grid place-content-center inset-y-0",
              local === "en" ? "right-2" : "left-2"
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="col-span-full">
        <ErrorMsg message={errors?.[fieldForm]?.message as string} />
      </div>
    </div>
  );
};

export default UserInput;
