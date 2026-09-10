import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/shared/ui";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { AccountNavigation } from "./AccountNavigation";

type AccountSidebarProps = {
  isCollapsed: boolean;
  onCollapsedChange: (isCollapsed: boolean) => void;
};

export const AccountSidebar = ({ isCollapsed, onCollapsedChange }: AccountSidebarProps) => (
  <aside
    className={cn(
      "relative z-50 hidden shrink-0 border-r border-border bg-card p-5 transition-[width] duration-300 ease-in-out lg:flex lg:flex-col",
      isCollapsed ? "w-[90px]" : "w-64",
    )}
  >
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isCollapsed ? "Розгорнути бокову панель" : "Згорнути бокову панель"}
      title={isCollapsed ? "Розгорнути бокову панель" : "Згорнути бокову панель"}
      onClick={() => onCollapsedChange(!isCollapsed)}
      className="absolute right-0 top-[22px] z-10 size-9 translate-x-1/2 rounded-full bg-card shadow-sm"
    >
      {isCollapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
    </Button>

    <div className="mb-10 flex items-center">
      <Link
        to="/"
        aria-label="Timefy — на головну"
        className={cn(
          "flex min-w-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isCollapsed ? "translate-x-[5px] gap-0" : "translate-x-0 gap-2",
          "transition-transform duration-300 ease-in-out",
        )}
      >
        <Logo showText={!isCollapsed} />
      </Link>
    </div>
    <AccountNavigation isCollapsed={isCollapsed} />
  </aside>
);
