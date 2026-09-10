import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
  passwordResetRequestSchema,
  type PasswordResetRequestValues,
} from "@/features/account/model/passwordResetSchema";
import { useAuthStore } from "@/features/auth/model/authStore";
import { forgotPasswordEmailStep } from "@/shared/api/authApi";
import { notify } from "@/shared/lib/notify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type PasswordResetDialogProps = {
  email: string;
};

export const PasswordResetDialog = ({ email }: PasswordResetDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetRequestValues>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: { email },
  });

  const handleOpenChange = (open: boolean) => {
    if (isSubmitting) return;
    setIsOpen(open);
    if (open) reset({ email });
  };

  const handleRequest = async (values: PasswordResetRequestValues) => {
    try {
      await forgotPasswordEmailStep({ email: values.email });
      logout();
      navigate("/login", { replace: true });
      notify.success("Лист для зміни пароля надіслано", {
        description: "Перевірте вхідні повідомлення та папку «Спам».",
      });
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Не вдалося надіслати лист");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Mail aria-hidden="true" />
          Змінити пароль через email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Зміна пароля</DialogTitle>
          <DialogDescription>
            Вкажіть email, на який потрібно надіслати одноразове посилання. Після успішного
            надсилання поточну сесію буде завершено.
          </DialogDescription>
        </DialogHeader>

        <form
          id="password-reset-request"
          onSubmit={handleSubmit(handleRequest)}
          className="space-y-2"
        >
          <Label htmlFor="password-reset-email">Email</Label>
          <Input
            id="password-reset-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Скасувати
            </Button>
          </DialogClose>
          <Button type="submit" form="password-reset-request" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Надсилання…" : "Надіслати посилання"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
