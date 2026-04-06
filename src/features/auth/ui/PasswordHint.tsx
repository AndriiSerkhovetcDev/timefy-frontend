import { Check, Circle } from "lucide-react";

type PasswordHintProps = {
  password: string;
  isFocused: boolean;
};

const requirements = [
  { label: "Мінімум 8 символів", regex: /.{8,}/ },
  { label: "Велика літера (A-Z)", regex: /[A-Z]/ },
  { label: "Цифра (0-9)", regex: /[0-9]/ },
  { label: "Спецсимвол (!@#$%^&*)", regex: /[!@#$%^&*]/ },
];

export const PasswordHint = ({ password = "", isFocused }: PasswordHintProps) => {
  const allMet = requirements.every((req) => req.regex.test(password));

  return (
    <div className="relative">
      {isFocused && password.length > 0 && !allMet && (
        <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-md p-3 border border-border z-10 w-48">
          <ul className="flex flex-col gap-1.5">
            {requirements.map((req) => {
              const isMet = req.regex.test(password);
              return (
                <li key={req.label} className="flex items-center gap-2 text-xs">
                  {isMet ? (
                    <Check size={14} color="#4ecdc4" />
                  ) : (
                    <Circle size={14} color="#d1d5db" />
                  )}
                  <span className={isMet ? "text-secondary" : "text-text-muted"}>{req.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
