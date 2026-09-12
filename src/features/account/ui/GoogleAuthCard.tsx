import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { disconnectGoogle } from "@/shared/api/authApi";
import { notify } from "@/shared/lib/notify";
import { CircleCheck, KeyRound, Loader2, Unlink } from "lucide-react";
import { useState } from "react";
import { CreatePasswordDialog } from "./CreatePasswordDialog";

export const GoogleAuthCard = () => {
  const user = useAuthStore(selectUser);
  const setUser = useAuthStore((state) => state.setUser);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  if (!user?.authData?.isGoogle) return null;

  const canDisconnect = user.authData.isWeb === true && user.login.trim().length > 0;

  const handleDisconnect = async () => {
    if (!canDisconnect || isDisconnecting) return;

    setIsDisconnecting(true);
    try {
      const response = await disconnectGoogle();
      setUser(response.data.user);
      setIsDialogOpen(false);
      notify.success(response.message || "Google-акаунт від’єднано");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Не вдалося від’єднати Google-акаунт");
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Способи входу</CardTitle>
          <CardDescription>Керуйте підключеними способами входу до Timefy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted font-semibold text-foreground">
                G
              </div>
              <div className="min-w-0">
                <p className="font-medium">Вхід через Google</p>
                <p className="flex items-center gap-1.5 text-sm text-success">
                  <CircleCheck className="size-4" aria-hidden="true" />
                  Підключено
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={!canDisconnect}
              onClick={() => setIsDialogOpen(true)}
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
            >
              <Unlink aria-hidden="true" />
              Від’єднати
            </Button>
          </div>

          {!canDisconnect && (
            <Alert>
              <KeyRound aria-hidden="true" />
              <AlertTitle>Спочатку створіть логін і пароль</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>
                  Google зараз є вашим єдиним способом входу. Створіть логін і пароль, щоб не
                  втратити доступ до акаунта після від’єднання.
                </p>
                <CreatePasswordDialog />
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Від’єднати Google?</DialogTitle>
            <DialogDescription>
              Ви більше не зможете входити в Timefy через цей Google-акаунт. Для входу
              використовуйте створені логін і пароль.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isDisconnecting}>
                Скасувати
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={!canDisconnect || isDisconnecting}
              onClick={handleDisconnect}
            >
              {isDisconnecting ? <Loader2 className="animate-spin" /> : <Unlink />}
              {isDisconnecting ? "Від’єднання…" : "Від’єднати Google"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
