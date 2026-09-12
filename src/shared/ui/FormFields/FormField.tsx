import { useState, type InputHTMLAttributes } from "react";
import { EyeOffIcon } from "../icons/EyeOffIcon";
import { EyeIcon } from "../icons/EyeIcon";
import { PasswordFeedback } from "../PasswordFeedback";
import { cn } from "@/lib/utils";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  required?: boolean;
  watchValue?: string;
  showPasswordFeedback?: boolean;
  inputClassName?: string;
};

export const FormField = ({
  label,
  error,
  watchValue,
  showPasswordFeedback = false,
  required = false,
  inputClassName,
  ...rest
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = rest.id ?? rest.name;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-primary">
        {label}
        {required && <span className="ml-1 text-error">*</span>}
      </label>
      <div className="relative">
        <input
          {...rest}
          id={inputId}
          type={rest.type === "password" ? (showPassword ? "text" : "password") : rest.type}
          className={cn(
            "w-full rounded-lg border border-border px-4 py-2.5 text-base outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20",
            inputClassName,
          )}
          onBlur={(e) => {
            rest.onBlur?.(e);
          }}
        />
        {rest.type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm text-text-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {rest.type === "password" && showPasswordFeedback && (
        <PasswordFeedback password={watchValue} />
      )}

      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
};
