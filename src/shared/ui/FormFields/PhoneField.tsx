import { IMaskInput } from "react-imask";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils";

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  error?: string;
  required?: boolean;
  onBlur?: () => void;
  inputClassName?: string;
};

export const PhoneField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  error,
  required,
  onBlur,
  inputClassName,
}: Props<TFieldValues>) => {
  const inputId = `phone-${name}`;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={inputId}
        className="flex min-h-6 items-center text-sm font-medium leading-none text-foreground"
      >
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <IMaskInput
            id={inputId}
            mask="+38 (000) 000-00-00"
            value={String(field.value ?? "")}
            onAccept={(value) => {
              field.onChange(value);
            }}
            onBlur={() => {
              field.onBlur();
              onBlur?.();
            }}
            inputMode="tel"
            autoComplete="tel"
            placeholder="+38 (0__) ___-__-__"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
              inputClassName,
            )}
          />
        )}
      />
      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
