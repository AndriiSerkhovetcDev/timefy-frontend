import { selectUserLogin, useAuthStore } from "@/features/auth/model/authStore";
import { resendVerifyEmail, verifyEmail } from "@/shared/api/authApi";
import {
  useRef,
  useState,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
const CODE_LENGTH = 6;
const RESEND_TIMEOUT = 60;

export const VerifyEmailForm = () => {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const userLogin = useAuthStore(selectUserLogin);
  const setEmailVerified = useAuthStore((state) => state.setEmailVerified);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLogin) {
      resendVerifyEmail({ login: userLogin });
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    setVerifyError("");

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
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
    setTimer(RESEND_TIMEOUT);
    setCanResend(false);
    setCode(Array(CODE_LENGTH).fill(""));
    inputsRef.current[0]?.focus();

    try {
      if (userLogin) {
        await resendVerifyEmail({ login: userLogin });
      }
    } catch {
      setVerifyError("Щось пішло не так");
    }
  };

  const handleSubmit = useCallback(
    async (value: string) => {
      try {
        if (!userLogin) return;

        const payload = {
          login: userLogin,
          code: value,
        };

        const { data } = await verifyEmail(payload);

        if (data.codeVerified) {
          setEmailVerified(true);
          setVerifyError("");
          navigate("/dashboard");
        } else {
          setVerifyError("Невірний код");
        }
      } catch {
        setVerifyError("Введено не вірний код");
        setCode(Array(CODE_LENGTH).fill(""));
        inputsRef.current[0]?.focus();
      }
    },
    [userLogin, setEmailVerified, navigate],
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

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-xl border rounded-lg outline-none"
          />
        ))}
      </div>
      {verifyError && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-500">{verifyError}</p>
      )}
      <div className="text-sm text-gray-500">
        {canResend ? (
          <button onClick={handleResend} className="text-blue-500 hover:underline cursor-pointer">
            Надіслати повторно
          </button>
        ) : (
          <span>Надіслати повторно через {timer}с</span>
        )}
      </div>
    </div>
  );
};
