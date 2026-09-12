import { useState, type InputHTMLAttributes } from "react";
import { EyeOffIcon } from "../icons/EyeOffIcon";
import { EyeIcon } from "../icons/EyeIcon";
import { PasswordFeedback } from "../PasswordFeedback";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  required?: boolean;
  watchValue?: string;
  showPasswordFeedback?: boolean;
};

export const FormField = ({
  label,
  error,
  watchValue,
  showPasswordFeedback = false,
  required = false,
  ...rest
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-primary">
        {label}
        {required && <span className="ml-1 text-error">*</span>}
      </label>
      <div className="relative">
        <input
          {...rest}
          type={rest.type === "password" ? (showPassword ? "text" : "password") : rest.type}
          className="w-full text-base rounded-lg border border-border px-4 py-2.5 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          onBlur={(e) => {
            rest.onBlur?.(e);
          }}
        />
        {rest.type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted cursor-pointer"
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
