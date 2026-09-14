import { selectUserLogin, useAuthStore } from "@/features/auth/model/authStore";
import { resendVerifyEmail, verifyEmail } from "@/shared/api/authApi";
import { cn } from "@/lib/utils";
import { notify } from "@/shared/lib/notify";
import { withNotify } from "@/shared/lib/withNotify";
import { LoaderCircle, RefreshCw } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";

const CODE_LENGTH = 6;
const RESEND_TIMEOUT = 60;

type VerifyEmailFormProps = {
  compact?: boolean;
  redirectTo?: string | null;
};

export const VerifyEmailForm = ({ compact = false, redirectTo = "/" }: VerifyEmailFormProps) => {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const isVerifyingRef = useRef(false);
  const userLogin = useAuthStore(selectUserLogin);
  const setEmailVerified = useAuthStore((state) => state.setEmailVerified);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLogin) {
      void withNotify(resendVerifyEmail({ login: userLogin })).catch(() => {
        // Keep the form available so the user can request a new code manually.
      });
    }
  }, [userLogin]);

  const resetCode = useCallback(() => {
    setCode(Array(CODE_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (isVerifyingRef.current || !/^\d*$/.test(value)) return;

    setVerifyError("");

    const digits = value.slice(0, CODE_LENGTH - index);
    const newCode = [...code];
    digits.split("").forEach((digit, offset) => {
      newCode[index + offset] = digit;
    });
    if (!digits) newCode[index] = "";
    setCode(newCode);

    if (digits) {
      const nextIndex = Math.min(index + digits.length, CODE_LENGTH - 1);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (isVerifyingRef.current) return;

    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isVerifyingRef.current) return;

    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);

    if (!pasted) return;

    const newCode = [...code];
    pasted.split("").forEach((char, i) => {
      newCode[i] = char;
    });
    setCode(newCode);

    const lastIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputsRef.current[lastIndex]?.focus();
  };

  const handleResend = async () => {
    if (!userLogin || isResending) return;

    setIsResending(true);
    try {
      await withNotify(resendVerifyEmail({ login: userLogin }), {
        success: "Новий код надіслано",
      });
      setTimer(RESEND_TIMEOUT);
      setCanResend(false);
      setVerifyError("");
      resetCode();
    } catch {
      // withNotify already displays the API error.
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = useCallback(
    async (value: string) => {
      if (!userLogin || isVerifyingRef.current) return;

      isVerifyingRef.current = true;
      setIsVerifying(true);
      setVerifyError("");
      try {
        const { data } = await withNotify(verifyEmail({ login: userLogin, code: value }));

        if (data.codeVerified) {
          setEmailVerified(true);
          notify.success("Email успішно підтверджено");
          if (redirectTo) navigate(redirectTo);
        } else {
          setVerifyError("Невірний код");
        }
      } catch (error) {
        setVerifyError(error instanceof Error ? error.message : "Введено невірний код");
      } finally {
        isVerifyingRef.current = false;
        setIsVerifying(false);
      }
    },
    [userLogin, setEmailVerified, navigate, redirectTo],
  );

  useEffect(() => {
    const isComplete = code.every((digit) => digit !== "");
    if (isComplete) {
      handleSubmit(code.join(""));
    }
  }, [code, handleSubmit]);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const timeout = setTimeout(() => {
      setTimer((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timer]);

  return (
    <div className={cn("flex flex-col gap-6", compact && "gap-4")}>
      <fieldset disabled={isVerifying} className="min-w-0">
        <legend className="sr-only">Шестизначний код підтвердження</legend>
        <div
          className={cn("grid grid-cols-6 gap-2 sm:gap-3", compact && "mx-auto w-full max-w-lg")}
          aria-describedby={verifyError ? "verification-code-error" : "verification-code-hint"}
        >
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              aria-label={`Цифра ${index + 1} з ${CODE_LENGTH}`}
              aria-invalid={Boolean(verifyError)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={cn(
                "h-14 min-w-0 w-full rounded-xl border border-border bg-bg-surface text-center text-xl font-semibold text-text-main shadow-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:cursor-wait disabled:opacity-60 sm:h-16 sm:text-2xl",
                compact && "h-12 rounded-lg sm:h-14 sm:text-xl",
              )}
            />
          ))}
        </div>
      </fieldset>

      <p id="verification-code-hint" className="text-center text-xs leading-5 text-text-muted">
        Код буде перевірено автоматично після введення останньої цифри.
      </p>

      {isVerifying && (
        <div
          className="flex items-center justify-center gap-2 text-sm font-medium text-primary"
          role="status"
        >
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Перевіряємо код...
        </div>
      )}

      {verifyError && (
        <p
          id="verification-code-error"
          className="rounded-xl border border-error/20 bg-error-surface px-4 py-3 text-center text-sm text-error"
          role="alert"
        >
          {verifyError}
        </p>
      )}

      <div className="flex min-h-10 items-center justify-center text-center text-sm text-text-muted">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-primary outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`size-4 ${isResending ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {isResending ? "Надсилаємо..." : "Надіслати код повторно"}
          </button>
        ) : (
          <span>
            Надіслати повторно через <span className="font-semibold text-text-main">{timer} с</span>
          </span>
        )}
      </div>
    </div>
  );
};
