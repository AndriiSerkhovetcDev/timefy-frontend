import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { endCurrentSession } from "@/features/auth/model/endSession";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { OrganizationLogo } from "@/features/organization/ui/OrganizationLogo";
import { cn } from "@/lib/utils";
import { ChevronDown, CircleHelp, LogOut } from "lucide-react";
import { useState } from "react";
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
  const [areCompaniesOpen, setAreCompaniesOpen] = useState(false);

  const handleLogout = async () => {
    await endCurrentSession();
    onNavigate?.();
    navigate("/login", { replace: true });
  };

  return (
    <TooltipProvider>
      <nav aria-label="Навігація особистого кабінету" className="flex min-h-0 flex-1 flex-col">
        <ul className="space-y-1">
          {ACCOUNT_SECTIONS.map(({ href, icon: Icon, title }) => {
            const isCompanies = href === "/account/organizations";

            return (
              <li key={href} className="relative">
                <div className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" sideOffset={8}>
                        {title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                  {isCompanies && !isCollapsed && organizations.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-1 size-9 -translate-y-1/2"
                      aria-label={
                        areCompaniesOpen ? "Згорнути список компаній" : "Показати компанії"
                      }
                      aria-expanded={areCompaniesOpen}
                      aria-controls="account-company-shortcuts"
                      onClick={() => setAreCompaniesOpen((value) => !value)}
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={cn("transition-transform", areCompaniesOpen && "rotate-180")}
                      />
                    </Button>
                  )}
                </div>
                {isCompanies && !isCollapsed && areCompaniesOpen && organizations.length > 0 && (
                  <ul
                    id="account-company-shortcuts"
                    className="mt-1 ml-5 max-h-64 space-y-1 overflow-y-auto border-l border-border pl-2"
                  >
                    {organizations.map((organization) => (
                      <li key={organization.id}>
                        <Link
                          to={`/organizations/${organization.id}`}
                          className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          onClick={() => {
                            selectOrganization(organization.id);
                            onNavigate?.();
                          }}
                        >
                          <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                            <OrganizationLogo
                              logoUrl={organization.logoUrl}
                              name={organization.displayName}
                            />
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="truncate font-medium text-foreground">
                              {organization.displayName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {organization.isOwner
                                ? "Власник"
                                : (organization.position ?? "Працівник")}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogout}
                aria-label={isCollapsed ? "Вийти" : undefined}
                className={cn(
                  "w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive",
                  isCollapsed && "justify-center",
                )}
              >
                <LogOut aria-hidden="true" />
                {!isCollapsed && "Вийти"}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" sideOffset={8}>
                Вийти
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
};
