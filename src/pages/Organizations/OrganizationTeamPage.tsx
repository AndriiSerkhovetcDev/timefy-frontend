import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { EmployeeInvitationCard } from "@/features/organization/ui/EmployeeInvitationCard";
import { Users } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";

export const OrganizationTeamPage = () => {
  const { organizationId = "" } = useParams();
  const { items, details } = useOrganizationStore();
  const preview = items.find((item) => item.id === organizationId);
  const isOwner = preview?.isOwner ?? Boolean(details[organizationId]);
  if (!isOwner) return <Navigate to={`/organizations/${organizationId}`} replace />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Команда</h1>
        <p className="mt-2 text-muted-foreground">
          Запрошуйте працівників і керуйте доступом до онлайн-запису.
        </p>
      </div>
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
            <Users className="size-5" />
          </div>
          <CardTitle>Список працівників з’явиться тут</CardTitle>
          <CardDescription>
            Наразі можна додавати людей через одноразові запрошення. Перегляд усієї команди та
            керування доступами з’являться у наступному оновленні.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Тут будуть ролі, посади, статус онлайн-запису та дії керування працівниками.
        </CardContent>
      </Card>
      <EmployeeInvitationCard organisationId={organizationId} />
    </div>
  );
};
export default OrganizationTeamPage;
