import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KeyRound } from "lucide-react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const ForgotPasswordDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        type="button"
        className="rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
      >
        Забули пароль?
      </button>
    </DialogTrigger>

    <DialogContent className="max-w-md gap-6 rounded-2xl border-border bg-bg-surface p-6 shadow-xl sm:p-8">
      <DialogHeader className="pr-6">
        <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
          <KeyRound className="size-5" aria-hidden="true" />
        </div>
        <DialogTitle className="text-2xl font-bold tracking-tight">Відновлення пароля</DialogTitle>
        <DialogDescription className="text-sm leading-6">
          Введіть email або логін — ми надішлемо посилання для створення нового пароля.
        </DialogDescription>
      </DialogHeader>

      <ForgotPasswordForm />
    </DialogContent>
  </Dialog>
);
