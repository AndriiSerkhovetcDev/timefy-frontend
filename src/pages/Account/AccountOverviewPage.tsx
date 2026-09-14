import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ACCOUNT_SECTIONS,
  getDisplayName,
  getProfileProgress,
} from "@/features/account/model/account";
import { AccountAvatar } from "@/features/account/ui/AccountAvatar";
import { AccountPageSkeleton } from "@/features/account/ui/AccountPageSkeleton";
import { EmailStatus } from "@/features/account/ui/EmailStatus";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { OrganizationLogo } from "@/features/organization/ui/OrganizationLogo";
import { ArrowRight, Building2, CheckCircle2, CircleAlert, Pencil, Plus } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const AccountOverviewPage = () => {
  const user = useAuthStore(selectUser);
  const {
    items: organizations,
    isLoading: areOrganizationsLoading,
    load,
    select,
  } = useOrganizationStore();
  useEffect(() => {
    if (user?.email) void load(user.email).catch(() => undefined);
  }, [load, user?.email]);
  if (!user) return <AccountPageSkeleton />;
  const profile = getProfileProgress(user);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Вітаємо, {user.firstName || user.login}!
        </h2>
        <p className="mt-2 text-muted-foreground">
          Перевірте стан профілю та керуйте особистими налаштуваннями Timefy.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative">
          <CardHeader className="flex-row items-center gap-4 sm:pr-32">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <AccountAvatar user={user} className="size-16 shrink-0" />
              <div className="min-w-0">
                <CardTitle className="truncate text-xl">{getDisplayName(user)}</CardTitle>
                <CardDescription className="truncate">{user.email}</CardDescription>
                <div className="mt-2">
                  <EmailStatus verified={user.emailVerified} />
                </div>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full sm:absolute sm:right-6 sm:top-6 sm:w-auto"
            >
              <Link to="/account/personal">
                <Pencil aria-hidden="true" />
                Змінити
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Заповненість профілю</span>
              <span className="font-semibold text-primary">{profile.percentage}%</span>
            </div>
            <Progress
              value={profile.percentage}
              aria-label={`Профіль заповнено на ${profile.percentage}%`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Наступні кроки</CardTitle>
            <CardDescription>Дії, які допоможуть завершити налаштування профілю.</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.actions.length ? (
              <ul className="space-y-2">
                {profile.actions.map((action) => (
                  <li key={action.label}>
                    <Button asChild variant="ghost" className="h-auto w-full justify-between py-3">
                      <Link to={action.href}>
                        <span className="flex items-center gap-2 text-left">
                          <CircleAlert aria-hidden="true" className="text-warning" />
                          {action.label}
                        </span>
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-start gap-3 rounded-lg bg-success-surface p-4 text-success">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <p className="text-sm font-medium">Профіль повністю заповнений.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="organizations-title">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 id="organizations-title" className="text-lg font-semibold">
            Ваші організації
          </h2>
          {organizations.length > 0 && (
            <Button asChild size="sm">
              <Link to="/account/organizations/create">
                <Plus aria-hidden="true" />
                <span className="hidden sm:inline">Створити організацію</span>
                <span className="sm:hidden">Створити</span>
              </Link>
            </Button>
          )}
        </div>

        {areOrganizationsLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((item) => (
              <Skeleton key={item} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : organizations.length === 0 ? (
          <Card className="border-primary/30 bg-accent/40">
            <CardContent className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Building2 className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">Створіть свою організацію</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Додайте організацію, налаштуйте послуги, працівників і почніть приймати записи.
                  </p>
                </div>
              </div>
              <Button asChild className="w-full shrink-0 sm:w-auto">
                <Link to="/account/organizations/create">
                  <Plus aria-hidden="true" />
                  Створити організацію
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {organizations.map((organization) => (
              <Card
                key={organization.id}
                className="transition hover:border-primary/40 hover:shadow-md"
              >
                <CardContent className="flex items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                    <OrganizationLogo
                      logoUrl={organization.logoUrl}
                      name={organization.displayName}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{organization.displayName}</h3>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {organization.isOwner
                        ? "Власник"
                        : (organization.position ?? "Учасник команди")}
                    </p>
                  </div>
                  <Button asChild size="icon" variant="outline">
                    <Link
                      to={`/organizations/${organization.id}`}
                      onClick={() => select(organization.id)}
                      aria-label={`Відкрити ${organization.displayName}`}
                    >
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div>
        <h2 className="text-lg font-semibold">Швидкі переходи</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {ACCOUNT_SECTIONS.filter(
            ({ href }) => href.startsWith("/account/") && href !== "/account/organizations",
          ).map(({ title, description, href, icon: Icon }) => (
            <Card
              key={href}
              className="flex h-full flex-col transition hover:border-primary/40 hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild variant="outline" className="w-full">
                  <Link to={href}>Відкрити</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountOverviewPage;
