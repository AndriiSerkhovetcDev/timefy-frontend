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
import {
  createPasswordSchema,
  type CreatePasswordValues,
} from "@/features/account/model/credentialsSchema";
import { useRateLimitCooldown } from "@/features/account/model/useRateLimitCooldown";
import { useAuthStore } from "@/features/auth/model/authStore";
import { createPassword } from "@/shared/api/authApi";
import { ApiError, refreshSession } from "@/shared/api/httpClient";
import { notify } from "@/shared/lib/notify";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type CreatePasswordDialogProps = {
  onCreated?: () => void;
};

export const CreatePasswordDialog = ({ onCreated }: CreatePasswordDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { cooldown, startCooldown } = useRateLimitCooldown();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreatePasswordValues>({ resolver: zodResolver(createPasswordSchema) });

  const handleOpenChange = (open: boolean) => {
    if (isSubmitting) return;
    setIsOpen(open);
    if (open) reset();
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
        finishSuccessfully("Login і пароль уже створено");
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
      finishSuccessfully("Login і пароль створено");
    } catch (error) {
      if (error instanceof ApiError && error.errorCode === "LOGIN_ALREADY_EXISTS") {
        setError("login", { message: "Цей login уже використовується." });
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
        <Button type="button">
          <KeyRound aria-hidden="true" />
          Створити login і пароль
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Створення login і пароля</DialogTitle>
          <DialogDescription>Додайте ще один незалежний спосіб входу до Timefy.</DialogDescription>
        </DialogHeader>
        <form id="create-password-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-login">Login</Label>
            <Input id="create-login" autoComplete="username" {...register("login")} />
            {errors.login && <p className="text-xs text-destructive">{errors.login.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-password">Пароль</Label>
            <Input
              id="create-password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-password-confirm">Підтвердження пароля</Label>
            <Input
              id="create-password-confirm"
              type="password"
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
          <Button type="submit" form="create-password-form" disabled={isSubmitting || cooldown > 0}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {cooldown > 0 ? `Повторити через ${cooldown} с` : "Створити"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
