import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { selectIsAuthenticated, selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { startExternalAuthorization } from "@/features/auth/model/externalAuth";
import {
  acceptEmployeeInvitation,
  previewEmployeeInvitation,
} from "@/features/organization/api/organizationApi";
import {
  captureEmployeeInvitationToken,
  clearEmployeeInvitation,
  hasEmployeeInvitationIntent,
  prepareInvitationAuth,
} from "@/shared/lib/employeeInvitationSession";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import type { InvitationPreview } from "@/features/organization/model/types";
import { OrganizationLogo } from "@/features/organization/ui/OrganizationLogo";
import { ApiError } from "@/shared/api/httpClient";
import { CheckCircle2, LoaderCircle, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

type Status = "loading" | "ready" | "accepting" | "accepted" | "invalid" | "retry";

export const EmployeeInvitePage = () => {
  const [token] = useState(captureEmployeeInvitationToken);
  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [status, setStatus] = useState<Status>(token ? "loading" : "invalid");
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore(selectUser);
  const accepting = useRef(false);

  const accept = useCallback(
    async (currentToken = token) => {
      if (!currentToken || accepting.current) return;
      accepting.current = true;
      setStatus("accepting");
      try {
        await acceptEmployeeInvitation(currentToken);
        clearEmployeeInvitation();
        if (user?.email) await useOrganizationStore.getState().load(user.email);
        setStatus("accepted");
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.errorCode === "ORGANISATION_EMPLOYEE_ALREADY_EXISTS"
        ) {
          clearEmployeeInvitation();
          if (user?.email) await useOrganizationStore.getState().load(user.email);
          setStatus("accepted");
        } else if (
          error instanceof ApiError &&
          (error.status === 400 || error.errorCode === "ORGANISATION_EMPLOYEE_INVITATION_NOT_FOUND")
        ) {
          clearEmployeeInvitation();
          setStatus("invalid");
        } else setStatus("retry");
      } finally {
        accepting.current = false;
      }
    },
    [token, user?.email],
  );

  useEffect(() => {
    if (!token) return;
    let active = true;
    previewEmployeeInvitation(token)
      .then((result) => {
        if (!active) return;
        setPreview(result);
        setStatus("ready");
        if (isAuthenticated && hasEmployeeInvitationIntent()) void accept(token);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (
          error instanceof ApiError &&
          error.errorCode === "ORGANISATION_EMPLOYEE_INVITATION_NOT_FOUND"
        ) {
          clearEmployeeInvitation();
          setStatus("invalid");
        } else setStatus("retry");
      });
    return () => {
      active = false;
    };
  }, [accept, isAuthenticated, token]);

  if (status === "loading" || status === "accepting")
    return (
      <InviteShell>
        <LoaderCircle className="mx-auto size-8 animate-spin text-primary" />
        <p className="mt-4 text-center text-muted-foreground">
          {status === "loading" ? "Перевіряємо запрошення…" : "Приймаємо запрошення…"}
        </p>
      </InviteShell>
    );
  if (status === "invalid")
    return (
      <InviteShell>
        <CardTitle className="text-center">Запрошення недійсне</CardTitle>
        <CardDescription className="mt-2 text-center">
          Посилання неправильне, прострочене, відкликане або вже використане.
        </CardDescription>
      </InviteShell>
    );
  if (status === "accepted")
    return (
      <InviteShell>
        <CheckCircle2 className="mx-auto size-10 text-success" />
        <CardTitle className="mt-4 text-center">Запрошення прийнято</CardTitle>
        <CardDescription className="mt-2 text-center">
          Компанію додано до вашого списку.
        </CardDescription>
        <Button asChild className="mt-6 w-full">
          <Link to="/account/organizations">Перейти до компаній</Link>
        </Button>
      </InviteShell>
    );
  if (!preview)
    return (
      <InviteShell>
        <CardTitle className="text-center">Не вдалося перевірити запрошення</CardTitle>
        <Button className="mt-6 w-full" onClick={() => window.location.reload()}>
          Спробувати ще раз
        </Button>
      </InviteShell>
    );

  const startGoogle = () => {
    prepareInvitationAuth(true);
    startExternalAuthorization("GOOGLE");
  };
  return (
    <InviteShell>
      <div className="mx-auto flex size-20 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
        <OrganizationLogo
          logoUrl={preview.organisationLogoUrl}
          name={preview.organisationDisplayName}
          iconClassName="size-9 text-muted-foreground"
        />
      </div>
      <CardTitle className="mt-5 text-center">{preview.organisationDisplayName}</CardTitle>
      <CardDescription className="mt-2 text-center">
        Вас запрошують приєднатися як працівника
        {preview.position ? ` на посаду «${preview.position}»` : ""}.
      </CardDescription>
      <div className="mt-5 rounded-lg bg-muted/50 p-3 text-sm">
        <p>Онлайн-запис: {preview.isBookable ? "доступний" : "недоступний"}</p>
        <p className="mt-1 text-muted-foreground">
          Запрошення дійсне до {new Date(preview.expiresAt).toLocaleString("uk-UA")}
        </p>
      </div>
      {isAuthenticated ? (
        <Button className="mt-6 w-full" onClick={() => void accept()}>
          Прийняти запрошення
        </Button>
      ) : (
        <div className="mt-6 space-y-3">
          <Button className="w-full" onClick={startGoogle}>
            Прийняти та продовжити через Google
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full"
            onClick={() => prepareInvitationAuth(false)}
          >
            <Link to="/login">Увійти іншим способом</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="w-full"
            onClick={() => prepareInvitationAuth(false)}
          >
            <Link to="/register">Зареєструватися</Link>
          </Button>
        </div>
      )}
    </InviteShell>
  );
};

const InviteShell = ({ children }: { children: ReactNode }) => (
  <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-lg items-center px-4 py-10">
    <Card className="w-full">
      <CardHeader>
        <div className="mx-auto flex items-center gap-2 text-sm font-semibold text-primary">
          <Users className="size-4" />
          Запрошення до команди
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </main>
);
export default EmployeeInvitePage;
