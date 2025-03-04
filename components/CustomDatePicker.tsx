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
  Path,
  PathValue,
  RegisterOptions,
  UseFormSetValue,
} from "react-hook-form";
import DatePicker from "react-datepicker";

interface CustomDatePickerProps<TFieldValues extends FieldValues> {
  label: string;
  fieldForm: Path<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  control: Control<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  defaultValue?: Date | null;
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    "disabled" | "setValueAs" | "valueAsNumber"
  >;
  className?: string;
}

const CustomDatePicker = <TFieldValues extends FieldValues>({
  label,
  fieldForm,
  setValue,
  errors,
  control,
  defaultValue,
  rules,
  className,
}: CustomDatePickerProps<TFieldValues>) => {
  const datePickerRef = useRef<DatePicker | null>(null);
  const local = useLocale();

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  return (
    <div className="grid items-center grid-cols-[1fr_2.5fr] max-md:grid-cols-1 w-full h-min">
      <label className="text-nowrap" htmlFor={String(fieldForm)}>
        {label}:
      </label>
      <Controller
        name={fieldForm}
        control={control}
        defaultValue={
          defaultValue as PathValue<TFieldValues, Path<TFieldValues>>
        }
        rules={rules}
        render={({ field }) => (
          <div className={clsx("relative", className)}>
            <DatePicker
              selected={field.value}
              onChange={(date) =>
                setValue(
                  fieldForm,
                  date as PathValue<TFieldValues, Path<TFieldValues>>,
                  { shouldValidate: true }
                )
              }
              dateFormat="dd-MM-yyyy"
              ref={datePickerRef}
              autoComplete="off"
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
              aria-label={`Open ${String(fieldForm)} picker`}
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