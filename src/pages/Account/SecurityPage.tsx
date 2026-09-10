import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { AccountPageSkeleton } from "@/features/account/ui/AccountPageSkeleton";
import { PasswordResetDialog } from "@/features/account/ui/PasswordResetDialog";
import { KeyRound, ShieldCheck } from "lucide-react";

export const SecurityPage = () => {
  const user = useAuthStore(selectUser);
  if (!user) return <AccountPageSkeleton />;

  const usesExternalProvider = Boolean(user.authData?.isGoogle && !user.authData.isWeb);

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
          {usesExternalProvider ? (
            <Alert>
              <ShieldCheck aria-hidden="true" />
              <AlertTitle>Вхід через Google</AlertTitle>
              <AlertDescription>
                Цей обліковий запис використовує зовнішнього провайдера. Локальний пароль не
                налаштований.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <KeyRound aria-hidden="true" />
              <AlertTitle>Зміна пароля через email</AlertTitle>
              <AlertDescription>
                Для безпечної зміни пароля ми надішлемо одноразове посилання на email. Поточну сесію
                буде завершено.
              </AlertDescription>
            </Alert>
          )}

          {!usesExternalProvider && <PasswordResetDialog email={user.email} />}
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
