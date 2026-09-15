import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { UserMenu } from "@/features/auth/ui";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { OrganizationLogo } from "@/features/organization/ui/OrganizationLogo";
import { cn } from "@/lib/utils";
import { Logo, ThemeToggle } from "@/shared/ui";
import {
  Building2,
  ChevronLeft,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useParams } from "react-router-dom";

type NavigationItem = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  ownerOnly: boolean;
};

const navItems: NavigationItem[] = [
  {
    label: "Головна",
    description: "Основна інформація та швидкі дії",
    href: "",
    icon: LayoutDashboard,
    ownerOnly: false,
  },
  {
    label: "Команда",
    description: "Працівники та запрошення",
    href: "team",
    icon: Users,
    ownerOnly: true,
  },
  {
    label: "Налаштування",
    description: "Дані, логотип та історія",
    href: "settings",
    icon: Settings,
    ownerOnly: true,
  },
];

export const OrganizationWorkspaceLayout = () => {
  const { organizationId = "" } = useParams();
  const { pathname } = useLocation();
  const user = useAuthStore(selectUser);
  const { items, details, isLoading, error, load } = useOrganizationStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasRequestedOrganizations, setHasRequestedOrganizations] = useState(false);
  const preview = items.find((item) => item.id === organizationId);
  const detail = details[organizationId];
  const organization = preview ?? detail;
  const isOwner = preview?.isOwner ?? Boolean(detail);

  useEffect(() => {
    if (user?.email) {
      setHasRequestedOrganizations(true);
      void load(user.email).catch(() => undefined);
    }
  }, [load, user?.email]);

  if ((!hasRequestedOrganizations || isLoading) && !organization)
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
        Завантажуємо компанію…
      </div>
    );
  if (!organization && !isLoading)
    return error ? (
      <div className="mx-auto w-full max-w-6xl p-8">
        <p className="text-destructive">{error}</p>
        <Button className="mt-4" asChild variant="outline">
          <Link to="/account/organizations">До списку компаній</Link>
        </Button>
      </div>
    ) : (
      <Navigate to="/account/organizations" replace />
    );
  if (!organization || !user) return null;

  const availableNavItems = navItems.filter((item) => !item.ownerOnly || isOwner);
  const currentSection =
    availableNavItems.find(({ href }) =>
      href ? pathname.endsWith(`/${href}`) : pathname === `/organizations/${organizationId}`,
    ) ?? availableNavItems[0];
  return (
    <div className="flex min-h-dvh bg-background">
      <aside
        className={cn(
          "sticky top-0 z-50 hidden h-dvh shrink-0 self-start overflow-visible border-r border-border bg-card p-5 transition-[width] duration-300 ease-in-out lg:flex lg:flex-col",
          isSidebarCollapsed ? "w-[90px]" : "w-64",
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={isSidebarCollapsed ? "Розгорнути бокову панель" : "Згорнути бокову панель"}
          title={isSidebarCollapsed ? "Розгорнути бокову панель" : "Згорнути бокову панель"}
          onClick={() => setIsSidebarCollapsed((value) => !value)}
          className="absolute right-0 top-[22px] z-10 size-9 translate-x-1/2 rounded-full bg-card shadow-sm"
        >
          {isSidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
        <div className="mb-10 flex items-center">
          <Link
            to={`/organizations/${organizationId}`}
            aria-label={`${organization.displayName} — на головну`}
            className={cn(
              "flex min-w-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSidebarCollapsed ? "translate-x-[5px] gap-0" : "translate-x-0 gap-2",
              "transition-transform duration-300 ease-in-out",
            )}
          >
            <Logo showText={!isSidebarCollapsed} />
          </Link>
        </div>
        <OrganizationIdentity
          collapsed={isSidebarCollapsed}
          name={organization.displayName}
          logoUrl={organization.logoUrl}
          role={isOwner ? "Власник" : (preview?.position ?? "Працівник")}
        />
        <OrganizationNavigation
          organizationId={organizationId}
          items={availableNavItems}
          collapsed={isSidebarCollapsed}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Відкрити меню компанії"
                  className="lg:hidden"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(20rem,85vw)] p-5">
                <SheetHeader className="p-0 text-left">
                  <SheetTitle>
                    <Link
                      to={`/organizations/${organizationId}`}
                      onClick={() => setIsMenuOpen(false)}
                      aria-label={`${organization.displayName} — на головну`}
                      className="flex items-center gap-2"
                    >
                      <Logo />
                    </Link>
                  </SheetTitle>
                  <SheetDescription>Керування компанією</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <OrganizationIdentity
                    name={organization.displayName}
                    logoUrl={organization.logoUrl}
                    role={isOwner ? "Власник" : (preview?.position ?? "Працівник")}
                  />
                </div>
                <OrganizationNavigation
                  organizationId={organizationId}
                  items={availableNavItems}
                  onNavigate={() => setIsMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold sm:text-xl">
                {organization.displayName}
              </h1>
              <p className="hidden truncate text-sm text-muted-foreground sm:block">
                {currentSection.description}
              </p>
            </div>
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const OrganizationIdentity = ({
  name,
  logoUrl,
  role,
  collapsed = false,
}: {
  name: string;
  logoUrl: string | null;
  role: string;
  collapsed?: boolean;
}) => (
  <div className={cn("mb-4 flex min-w-0 items-center gap-3", collapsed && "justify-center")}>
    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
      <OrganizationLogo logoUrl={logoUrl} name={name} />
    </div>
    {!collapsed && (
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{role}</p>
      </div>
    )}
  </div>
);

const OrganizationNavigation = ({
  organizationId,
  items,
  collapsed = false,
  onNavigate,
}: {
  organizationId: string;
  items: NavigationItem[];
  collapsed?: boolean;
  onNavigate?: () => void;
}) => (
  <nav aria-label="Навігація компанії" className="flex min-h-0 flex-1 flex-col">
    <ul className="space-y-1">
      {items.map(({ label, href, icon: Icon }) => (
        <li key={href} className="group relative">
          <NavLink
            end={!href}
            to={`/organizations/${organizationId}${href ? `/${href}` : ""}`}
            onClick={onNavigate}
            aria-label={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                "flex min-h-11 items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                collapsed && "justify-center px-2",
                isActive && "bg-accent text-primary",
              )
            }
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && <span className="min-w-0 truncate">{label}</span>}
          </NavLink>
          {collapsed && (
            <span
              role="tooltip"
              className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-foreground px-3 py-1.5 text-xs whitespace-nowrap text-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            >
              {label}
            </span>
          )}
        </li>
      ))}
    </ul>
    <div className="mt-auto pt-6">
      <Button
        asChild
        variant="ghost"
        className={cn("w-full justify-start text-muted-foreground", collapsed && "justify-center")}
      >
        <Link
          to="/account/organizations"
          onClick={onNavigate}
          aria-label={collapsed ? "Усі компанії" : undefined}
          title={collapsed ? "Усі компанії" : undefined}
        >
          {collapsed ? <Building2 /> : <ChevronLeft />}
          {!collapsed && "Усі компанії"}
        </Link>
      </Button>
    </div>
  </nav>
);

export default OrganizationWorkspaceLayout;
