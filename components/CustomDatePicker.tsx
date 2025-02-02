import { CalendarIcon } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { useRef } from "react";
import clsx from "clsx";
import { useLocale } from "next-intl";
import ErrorMsg from "./ErrorMsg";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormSetValue,
} from "react-hook-form";
import DatePicker from "react-datepicker";

interface CustomDatePickerProps {
  label: string;
  fieldForm: string;
  errors: FieldErrors;
  control: Control<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  defaultValue?: Date | null;
  rules?: RegisterOptions;
  className?: string;
}

const CustomDatePicker = ({
  label,
  fieldForm,
  setValue,
  errors,
  control,
  defaultValue,
  rules,
  className,
}: CustomDatePickerProps) => {
  const datePickerRef = useRef<DatePicker | null>(null);
  const local = useLocale();

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  return (
    <div className="grid items-center grid-cols-[1fr_2.5fr] max-md:grid-cols-1 w-full h-min">
      <label className="text-nowrap" htmlFor={`${fieldForm}Id`}>
        {label}:
      </label>
      <Controller
        name={fieldForm}
        control={control}
        defaultValue={defaultValue || null}
        rules={rules}
        render={({ field }) => (
          <div className={className + " relative"}>
            <DatePicker
              selected={field.value}
              onChange={(date) =>
                setValue(fieldForm, date, { shouldValidate: true })
              }
              dateFormat="dd-MM-yyyy"
              ref={datePickerRef}
              className={clsx(
                "border-2 border-[#DADADA] p-2 rounded-xl bg-transparent shadow-[0px_0px_5px_-1px_#00000040] outline-none",
                "hover:border-primary focus:border-primary w-full",
                "transition-colors duration-200 ease-in-out"
              )}
            />
            <button
              type="button"
              className={clsx(
                "absolute grid place-content-center inset-y-0",
                local === "en" ? "right-2" : "left-2"
              )}
              onClick={handleIconClick}
              aria-label={`Open ${fieldForm} picker`}
            >
              <CalendarIcon className="text-primary size-5" />
            </button>
          </div>
        )}
      />

      <div className="col-span-full">
        <ErrorMsg message={errors?.[fieldForm]?.message as string} />
      </div>
    </div>
  );
};

export default CustomDatePicker;
