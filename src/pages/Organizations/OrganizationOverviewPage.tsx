import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { ArrowRight, Link2, Settings, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export const OrganizationOverviewPage = () => {
  const { organizationId = "" } = useParams();
  const { items, details } = useOrganizationStore();
  const preview = items.find((item) => item.id === organizationId);
  const organization = preview ?? details[organizationId];
  if (!organization) return null;
  const isOwner = preview?.isOwner ?? true;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Огляд</h1>
        <p className="mt-2 text-muted-foreground">
          Основна інформація та швидкі дії для {organization.displayName}.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ваша роль</CardTitle>
            <CardDescription>Рівень доступу в цій компанії</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {isOwner ? "Власник" : (preview?.position ?? "Працівник")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Коротка адреса</CardTitle>
            <CardDescription>Унікальна адреса компанії</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Link2 className="size-4 text-muted-foreground" />
              <span className="break-all font-mono text-sm">/{organization.slug}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      {isOwner && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Керування</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="transition hover:border-primary/40">
              <CardHeader>
                <Users className="size-5 text-primary" />
                <CardTitle>Команда</CardTitle>
                <CardDescription>Створюйте запрошення для нових працівників.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link to="team">
                    Відкрити команду
                    <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="transition hover:border-primary/40">
              <CardHeader>
                <Settings className="size-5 text-primary" />
                <CardTitle>Налаштування</CardTitle>
                <CardDescription>Змініть дані, логотип або перегляньте історію.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link to="settings">
                    Відкрити налаштування
                    <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
export default OrganizationOverviewPage;
