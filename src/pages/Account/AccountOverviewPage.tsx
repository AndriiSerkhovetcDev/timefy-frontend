import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ACCOUNT_SECTIONS,
  getDisplayName,
  getProfileProgress,
} from "@/features/account/model/account";
import { AccountAvatar } from "@/features/account/ui/AccountAvatar";
import { AccountPageSkeleton } from "@/features/account/ui/AccountPageSkeleton";
import { EmailStatus } from "@/features/account/ui/EmailStatus";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { ArrowRight, CheckCircle2, CircleAlert, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

export const AccountOverviewPage = () => {
  const user = useAuthStore(selectUser);
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

      <div>
        <h2 className="text-lg font-semibold">Швидкі переходи</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {ACCOUNT_SECTIONS.slice(1).map(({ title, description, href, icon: Icon }) => (
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
