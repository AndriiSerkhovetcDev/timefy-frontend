import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  createPasswordSchema,
  type CreatePasswordValues,
} from "@/features/account/model/credentialsSchema";
import { useRateLimitCooldown } from "@/features/account/model/useRateLimitCooldown";
import { useAuthStore } from "@/features/auth/model/authStore";
import { checkIsExists, createPassword } from "@/shared/api/authApi";
import { ApiError, refreshSession } from "@/shared/api/httpClient";
import { notify } from "@/shared/lib/notify";
import { PasswordFeedback } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { useRef, useState, type FocusEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type CreatePasswordDialogProps = {
  onCreated?: () => void;
};

export const CreatePasswordDialog = ({ onCreated }: CreatePasswordDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginCheckStatus, setLoginCheckStatus] = useState<
    "idle" | "checking" | "available" | "failed"
  >("idle");
  const loginCheckRequestRef = useRef(0);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { cooldown, startCooldown } = useRateLimitCooldown();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    getValues,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePasswordValues>({ resolver: zodResolver(createPasswordSchema) });
  const password = watch("password", "");
  const { onBlur: onLoginBlur, onChange: onLoginChange, ...loginField } = register("login");

  const handleOpenChange = (open: boolean) => {
    if (isSubmitting) return;
    setIsOpen(open);
    if (open) {
      reset();
      loginCheckRequestRef.current += 1;
      setLoginCheckStatus("idle");
    }
  };

  const handleLoginBlur = async (event: FocusEvent<HTMLInputElement>) => {
    onLoginBlur(event);
    setLoginCheckStatus("idle");

    if (!(await trigger("login"))) return;

    const loginValue = getValues("login").trim();
    const requestId = ++loginCheckRequestRef.current;
    setLoginCheckStatus("checking");
    try {
      const response = await checkIsExists("login", loginValue);
      if (requestId !== loginCheckRequestRef.current) return;

      if (!response.data.checkLogin) {
        setError("login", { message: "Цей логін уже використовується" });
        setLoginCheckStatus("idle");
        return;
      }

      clearErrors("login");
      setLoginCheckStatus("available");
    } catch {
      if (requestId !== loginCheckRequestRef.current) return;
      setLoginCheckStatus("failed");
    }
  };

  const finishSuccessfully = (message: string) => {
    setIsOpen(false);
    onCreated?.();
    notify.success(message);
  };

  const recoverUncertainResult = async () => {
    try {
      const response = await refreshSession();
      if (response.data.user.authData?.isWeb) {
        finishSuccessfully("Логін і пароль уже створено");
        return;
      }
    } catch {
      // The original operation remains uncertain; a manual retry is safer than an automatic one.
    }
    notify.error("Не вдалося підтвердити створення пароля. Спробуйте ще раз вручну.");
  };

  const onSubmit = async (values: CreatePasswordValues) => {
    try {
      const response = await createPassword({ login: values.login, password: values.password });
      setUser(response.data.user);
      finishSuccessfully("Логін і пароль створено");
    } catch (error) {
      if (error instanceof ApiError && error.errorCode === "LOGIN_ALREADY_EXISTS") {
        setError("login", { message: "Цей логін уже використовується." });
        return;
      }

      if (error instanceof ApiError && error.errorCode === "PASSWORD_ALREADY_CONFIGURED") {
        setIsOpen(false);
        await recoverUncertainResult();
        return;
      }

      if (
        error instanceof ApiError &&
        (error.errorCode === "USER_INACTIVE" || error.errorCode === "USER_NOT_FOUND")
      ) {
        logout();
        navigate("/login", { replace: true });
        return;
      }

      if (error instanceof ApiError && error.errorCode === "AUTH_RATE_LIMITED") {
        startCooldown(error.retryAfterSeconds ?? 60);
        notify.warning("Забагато запитів. Дочекайтеся завершення таймера.");
        return;
      }

      if (error instanceof TypeError || (error instanceof ApiError && error.status >= 500)) {
        await recoverUncertainResult();
        return;
      }

      notify.error(error instanceof Error ? error.message : "Не вдалося створити пароль");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" className="w-full sm:w-auto">
          <KeyRound aria-hidden="true" />
          Створити логін і пароль
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Створення логіна і пароля</DialogTitle>
          <DialogDescription>Додайте ще один незалежний спосіб входу до Timefy.</DialogDescription>
        </DialogHeader>
        <form id="create-password-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-login">Логін</Label>
            <div className="relative">
              <Input
                id="create-login"
                autoComplete="username"
                aria-invalid={Boolean(errors.login)}
                aria-describedby={
                  errors.login || loginCheckStatus === "available" || loginCheckStatus === "failed"
                    ? "create-login-status"
                    : undefined
                }
                {...loginField}
                onChange={(event) => {
                  loginCheckRequestRef.current += 1;
                  setLoginCheckStatus("idle");
                  onLoginChange(event);
                }}
                onBlur={handleLoginBlur}
              />
              {loginCheckStatus === "checking" && (
                <Loader2
                  className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              {loginCheckStatus === "available" && (
                <CheckCircle2
                  className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-success"
                  aria-hidden="true"
                />
              )}
            </div>
            {errors.login && (
              <p id="create-login-status" className="text-xs text-destructive">
                {errors.login.message}
              </p>
            )}
            {!errors.login && loginCheckStatus === "available" && (
              <p id="create-login-status" className="text-xs text-success" aria-live="polite">
                Логін доступний
              </p>
            )}
            {!errors.login && loginCheckStatus === "failed" && (
              <p
                id="create-login-status"
                className="text-xs text-muted-foreground"
                aria-live="polite"
              >
                Не вдалося перевірити логін. Доступність буде перевірено під час створення.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-password">Пароль</Label>
            <PasswordInput
              id="create-password"
              autoComplete="new-password"
              {...register("password")}
            />
            <PasswordFeedback password={password} />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-password-confirm">Підтвердження пароля</Label>
            <PasswordInput
              id="create-password-confirm"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => setIsOpen(false)}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            form="create-password-form"
            disabled={isSubmitting || loginCheckStatus === "checking" || cooldown > 0}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {cooldown > 0 ? `Повторити через ${cooldown} с` : "Створити"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
