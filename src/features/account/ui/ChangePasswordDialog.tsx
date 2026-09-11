import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/features/account/model/credentialsSchema";
import { useRateLimitCooldown } from "@/features/account/model/useRateLimitCooldown";
import { useAuthStore } from "@/features/auth/model/authStore";
import { changePassword } from "@/shared/api/authApi";
import { ApiError } from "@/shared/api/httpClient";
import { notify } from "@/shared/lib/notify";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const ChangePasswordDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { cooldown, startCooldown } = useRateLimitCooldown();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });

  const handleOpenChange = (open: boolean) => {
    if (isSubmitting) return;
    setIsOpen(open);
    if (open) reset();
  };

  const onSubmit = async (values: ChangePasswordValues) => {
    try {
      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      login(response.data.user, response.data.token);
      setIsOpen(false);
      notify.success("Пароль успішно змінено");
    } catch (error) {
      if (error instanceof ApiError && error.errorCode === "INVALID_CREDENTIALS") {
        setError("currentPassword", { message: "Неправильний поточний пароль" });
        return;
      }
      if (error instanceof ApiError && error.errorCode === "AUTH_RATE_LIMITED") {
        startCooldown(error.retryAfterSeconds ?? 60);
        notify.warning("Забагато спроб. Дочекайтеся завершення таймера.");
        return;
      }
      if (error instanceof ApiError && error.errorCode === "ACCESS_DENIED") {
        notify.error("Ця сесія не дозволяє змінити пароль");
        return;
      }
      notify.error(error instanceof Error ? error.message : "Не вдалося змінити пароль");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">
          <KeyRound aria-hidden="true" />
          Змінити пароль
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Зміна пароля</DialogTitle>
        </DialogHeader>
        <form id="change-password-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Поточний пароль</Label>
            <PasswordInput
              id="current-password"
              autoComplete="current-password"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Новий пароль</Label>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password-confirm">Підтвердження нового пароля</Label>
            <PasswordInput
              id="new-password-confirm"
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
          <Button type="submit" form="change-password-form" disabled={isSubmitting || cooldown > 0}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {cooldown > 0 ? `Повторити через ${cooldown} с` : "Змінити пароль"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
