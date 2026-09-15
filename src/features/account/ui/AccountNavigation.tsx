import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { endCurrentSession } from "@/features/auth/model/endSession";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { OrganizationLogo } from "@/features/organization/ui/OrganizationLogo";
import { cn } from "@/lib/utils";
import { ChevronDown, CircleHelp, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_SECTIONS } from "../model/account";

type AccountNavigationProps = {
  onNavigate?: () => void;
  isCollapsed?: boolean;
};

export const AccountNavigation = ({ onNavigate, isCollapsed = false }: AccountNavigationProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const organizations = useOrganizationStore((state) => state.items);
  const selectOrganization = useOrganizationStore((state) => state.select);

  const handleLogout = async () => {
    await endCurrentSession();
    onNavigate?.();
    navigate("/login", { replace: true });
  };

  return (
    <nav aria-label="Навігація особистого кабінету" className="flex min-h-0 flex-1 flex-col">
      <ul className="space-y-1">
        {ACCOUNT_SECTIONS.map(({ href, icon: Icon, title }) => {
          const isCompanies = href === "/account/organizations";

          return (
            <li key={href} className="group relative">
              <Link
                to={href}
                onClick={onNavigate}
                aria-label={isCollapsed ? title : undefined}
                className={cn(
                  "flex min-h-11 w-full flex-row items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isCompanies && !isCollapsed && organizations.length > 0 && "pr-11",
                  isCollapsed && "justify-center px-2",
                  (pathname === href ||
                    (href !== "/account" && pathname.startsWith(`${href}/`)) ||
                    (href === "/account/organizations" &&
                      pathname.startsWith("/organizations/"))) &&
                    "bg-accent text-primary",
                )}
              >
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                {!isCollapsed && <span className="min-w-0 truncate">{title}</span>}
              </Link>
              {isCompanies && !isCollapsed && organizations.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-1 size-9 -translate-y-1/2"
                      aria-label="Швидкий перехід між компаніями"
                      title="Швидкий перехід між компаніями"
                    >
                      <ChevronDown aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="right" className="w-64">
                    <DropdownMenuLabel>Швидкий перехід</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {organizations.map((organization) => (
                      <DropdownMenuItem
                        key={organization.id}
                        className="items-center gap-3 py-2"
                        onSelect={() => {
                          selectOrganization(organization.id);
                          onNavigate?.();
                          navigate(`/organizations/${organization.id}`);
                        }}
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                          <OrganizationLogo
                            logoUrl={organization.logoUrl}
                            name={organization.displayName}
                          />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="truncate font-medium">{organization.displayName}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {organization.isOwner
                              ? "Власник"
                              : (organization.position ?? "Працівник")}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {isCollapsed && (
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-foreground px-3 py-1.5 text-xs whitespace-nowrap text-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                >
                  {title}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-6">
        <Separator className="mb-4" />
        <Button
          type="button"
          variant="ghost"
          disabled
          title="Розділ підтримки ще не підключено"
          aria-label={isCollapsed ? "Допомога" : undefined}
          className={cn(
            "w-full justify-start text-muted-foreground",
            isCollapsed && "justify-center",
          )}
        >
          <CircleHelp aria-hidden="true" />
          {!isCollapsed && "Допомога"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleLogout}
          aria-label={isCollapsed ? "Вийти" : undefined}
          title={isCollapsed ? "Вийти" : undefined}
          className={cn(
            "w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive",
            isCollapsed && "justify-center",
          )}
        >
          <LogOut aria-hidden="true" />
          {!isCollapsed && "Вийти"}
        </Button>
      </div>
    </nav>
  );
};
