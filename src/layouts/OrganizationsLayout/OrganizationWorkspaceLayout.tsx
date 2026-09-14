import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { OrganizationLogo } from "@/features/organization/ui/OrganizationLogo";
import { cn } from "@/lib/utils";
import { Building2, ChevronLeft, LayoutDashboard, Settings, Users } from "lucide-react";
import { useEffect } from "react";
import { Link, NavLink, Navigate, Outlet, useNavigate, useParams } from "react-router-dom";

const navItems = [
  { label: "Огляд", href: "", icon: LayoutDashboard, ownerOnly: false },
  { label: "Команда", href: "team", icon: Users, ownerOnly: true },
  { label: "Налаштування", href: "settings", icon: Settings, ownerOnly: true },
];

export const OrganizationWorkspaceLayout = () => {
  const { organizationId = "" } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(selectUser);
  const { items, details, isLoading, error, load, select } = useOrganizationStore();
  const preview = items.find((item) => item.id === organizationId);
  const detail = details[organizationId];
  const organization = preview ?? detail;
  const isOwner = preview?.isOwner ?? Boolean(detail);

  useEffect(() => {
    if (user?.email) void load(user.email).catch(() => undefined);
  }, [load, user?.email]);

  if (isLoading && !organization)
    return (
      <div className="mx-auto w-full max-w-6xl p-8 text-muted-foreground">
        Завантажуємо організацію…
      </div>
    );
  if (!organization && !isLoading)
    return error ? (
      <div className="mx-auto w-full max-w-6xl p-8">
        <p className="text-destructive">{error}</p>
        <Button className="mt-4" asChild variant="outline">
          <Link to="/organizations">До списку організацій</Link>
        </Button>
      </div>
    ) : (
      <Navigate to="/organizations" replace />
    );
  if (!organization) return null;

  const availableNavItems = navItems.filter((item) => !item.ownerOnly || isOwner);
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
            <OrganizationLogo logoUrl={organization.logoUrl} name={organization.displayName} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{organization.displayName}</p>
            <p className="text-sm text-muted-foreground">
              {isOwner ? "Власник" : (preview?.position ?? "Працівник")}
            </p>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Select
            value={organizationId}
            onValueChange={(id) => {
              select(id);
              navigate(`/organizations/${id}`);
            }}
          >
            <SelectTrigger className="min-w-0 flex-1 sm:w-64">
              <SelectValue aria-label="Вибрана організація" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild size="icon" variant="outline">
            <Link to="/organizations" aria-label="Усі організації">
              <Building2 aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      <nav
        className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden"
        aria-label="Навігація організації"
      >
        {availableNavItems.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            end={!href}
            to={href || "."}
            className={({ isActive }) =>
              cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground",
                isActive && "bg-primary text-primary-foreground",
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="grid min-w-0 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <Button asChild variant="ghost" className="mb-3 w-full justify-start">
            <Link to="/organizations">
              <ChevronLeft />
              Усі організації
            </Link>
          </Button>
          <nav className="space-y-1" aria-label="Навігація організації">
            {availableNavItems.map(({ label, href, icon: Icon }) => (
              <NavLink
                key={href}
                end={!href}
                to={href || "."}
                className={({ isActive }) =>
                  cn(
                    "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground",
                    isActive && "bg-accent text-primary",
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default OrganizationWorkspaceLayout;
