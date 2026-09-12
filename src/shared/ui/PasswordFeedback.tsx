import { Check, Circle } from "lucide-react";
import { getPasswordRequirementResults, getPasswordStrength } from "@/shared/model/password";
import { cn } from "@/lib/utils";

type PasswordFeedbackProps = {
  password?: string;
};

const strengthColors = [
  "bg-muted",
  "bg-strength-weak",
  "bg-strength-fair",
  "bg-strength-good",
  "bg-success",
];

export const PasswordFeedback = ({ password = "" }: PasswordFeedbackProps) => {
  const requirements = getPasswordRequirementResults(password);
  const strength = getPasswordStrength(password);

  return (
    <div className="space-y-2 pt-1" aria-label="Вимоги до пароля">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground">Надійність пароля</span>
        <span className="font-medium text-foreground" aria-live="polite">
          {strength.label}
        </span>
      </div>

      <div
        className="grid grid-cols-4 gap-1"
        role="progressbar"
        aria-label={`Надійність пароля: ${strength.label}`}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={strength.score}
      >
        {requirements.map((requirement, index) => (
          <span
            key={requirement.id}
            aria-hidden="true"
            className={cn(
              "h-1.5 rounded-full transition-colors",
              index < strength.score ? strengthColors[strength.score] : "bg-muted",
            )}
          />
        ))}
      </div>

      <ul className="grid gap-x-3 gap-y-1 sm:grid-cols-2">
        {requirements.map((requirement) => (
          <li
            key={requirement.id}
            className={cn(
              "flex items-center gap-1.5 text-xs",
              requirement.met ? "text-success" : "text-muted-foreground",
            )}
          >
            {requirement.met ? (
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Circle className="size-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>{requirement.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
