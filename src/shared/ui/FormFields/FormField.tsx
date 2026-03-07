import { useState, type InputHTMLAttributes } from "react";
import { EyeOffIcon } from "../icons/EyeOffIcon";
import { EyeIcon } from "../icons/EyeIcon";
import { PasswordStrength } from "@/features/auth/ui/PasswordStrength";
import { PasswordHint } from "@/features/auth/ui/PasswordHint";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  required?: boolean;
  watchValue?: string;
};

export const FormField = ({
  label,
  error,
  watchValue,
  required = false,
  ...rest
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-primary">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
        {rest.type === "password" && (
          <PasswordHint isFocused={isFocused} password={watchValue as string} />
        )}
      </label>
      <div className="relative">
        <input
          {...rest}
          type={rest.type === "password" ? (showPassword ? "text" : "password") : rest.type}
          className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2.5 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {rest.type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
        {rest.type === "password" && rest.name !== "confirm_password" && (
          <PasswordStrength password={watchValue as string} />
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
