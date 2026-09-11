import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { AccountPageSkeleton } from "@/features/account/ui/AccountPageSkeleton";
import { ChangePasswordDialog } from "@/features/account/ui/ChangePasswordDialog";
import { CreatePasswordDialog } from "@/features/account/ui/CreatePasswordDialog";
import { KeyRound, ShieldCheck } from "lucide-react";

export const SecurityPage = () => {
  const user = useAuthStore(selectUser);
  if (!user) return <AccountPageSkeleton />;

  const canCreatePassword = user.authData?.isWeb === false;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound aria-hidden="true" className="text-primary" />
            Пароль
          </CardTitle>
          <CardDescription>Керуйте доступом до особистого облікового запису.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {canCreatePassword ? (
            <Alert>
              <ShieldCheck aria-hidden="true" />
              <AlertTitle>Створіть логін і пароль</AlertTitle>
              <AlertDescription>
                Додайте вхід за паролем як незалежний спосіб авторизації в Timefy.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <KeyRound aria-hidden="true" />
              <AlertTitle>Вхід за паролем налаштовано</AlertTitle>
              <AlertDescription>
                Для зміни пароля введіть поточний пароль і задайте новий.
              </AlertDescription>
            </Alert>
          )}

          {canCreatePassword ? <CreatePasswordDialog /> : <ChangePasswordDialog />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Поради з безпеки</CardTitle>
          <CardDescription>Прості правила для захисту облікового запису.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <ShieldCheck className="size-4 shrink-0 text-success" />
              Не передавайте пароль або коди підтвердження іншим.
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="size-4 shrink-0 text-success" />
              Використовуйте унікальний пароль для Timefy.
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="size-4 shrink-0 text-success" />
              Завершуйте сесію на спільних пристроях.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPage;
