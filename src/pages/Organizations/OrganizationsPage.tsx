import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { OrganizationLogo } from "@/features/organization/ui/OrganizationLogo";
import { ArrowRight, Building2, Plus } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const OrganizationsPage = () => {
  const user = useAuthStore(selectUser);
  const { items, isLoading, error, load, select } = useOrganizationStore();
  useEffect(() => {
    if (user?.email) void load(user.email).catch(() => undefined);
  }, [load, user?.email]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Організації</h1>
          <p className="mt-2 text-muted-foreground">
            Керуйте організаціями, командою та онлайн-записом.
          </p>
        </div>
        <Button asChild>
          <Link to="/organizations/create">
            <Plus aria-hidden="true" />
            Створити організацію
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((item) => (
            <Skeleton key={item} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => user?.email && void load(user.email)}
            >
              Спробувати ще раз
            </Button>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((organization) => (
            <Card key={organization.id}>
              <CardHeader className="flex-row items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                  <OrganizationLogo
                    logoUrl={organization.logoUrl}
                    name={organization.displayName}
                  />
                </div>
                <div className="min-w-0">
                  <CardTitle className="truncate">{organization.displayName}</CardTitle>
                  <CardDescription className="truncate">/{organization.slug}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  {organization.isOwner ? "Власник" : (organization.position ?? "Учасник команди")}
                </span>
                <Button asChild size="sm" variant="outline" onClick={() => select(organization.id)}>
                  <Link to={`/organizations/${organization.id}`} state={{ organization }}>
                    Відкрити
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const EmptyState = () => (
  <Card className="flex flex-1 items-center justify-center border-dashed text-center">
    <CardHeader className="mx-auto w-full max-w-xl px-6">
      <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
        <Building2 className="size-7" aria-hidden="true" />
      </div>
      <CardTitle>У вас ще немає організацій</CardTitle>
      <CardDescription>
        Створіть першу організацію, щоб налаштувати команду та онлайн-запис.
      </CardDescription>
      <Button asChild className="mx-auto mt-3">
        <Link to="/organizations/create">
          <Plus aria-hidden="true" />
          Створити організацію
        </Link>
      </Button>
    </CardHeader>
  </Card>
);
export default OrganizationsPage;
