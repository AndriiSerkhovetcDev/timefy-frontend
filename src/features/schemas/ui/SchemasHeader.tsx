import { UserMenu } from "@/features/auth/ui";
import { Bell, PanelLeftClose, PanelLeftOpen, Save, Settings } from "lucide-react";
import { useSchemasStore } from "../model/schemasStore";
import { cn } from "@/lib/utils";

export const SchemasHeader = () => {
  const { isSidebarCollapsed, toggleSidebar, activeSchema, isDirty, setDirty } = useSchemasStore();

  return (
    <header
      id="header"
      className="sticky w-full top-0 z-50 bg-bg-main border-b border-border transition-all duration-300"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            {isSidebarCollapsed ? (
              <PanelLeftOpen
                className="w-5 h-5 text-text-muted cursor-pointer hover:text-primary transition"
                onClick={toggleSidebar}
              />
            ) : (
              <PanelLeftClose
                className="w-5 h-5 text-text-muted cursor-pointer hover:text-primary transition"
                onClick={toggleSidebar}
              />
            )}
            <h1 className="pl-5 text-xl font-semibold text-text-main">{activeSchema}</h1>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setDirty(false)}
              className="relative text-text-muted hover:text-primary transition"
            >
              <Save className={cn("w-5 h-5", isDirty && "text-teal-600")} />
              {isDirty && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 rounded-full" />
              )}
            </button>
            <Settings className="w-5 h-5 text-text-muted cursor-pointer hover:text-primary transition" />
            <Bell className="w-5 h-5 text-text-muted cursor-pointer hover:text-primary transition" />
            <div className="inline-block h-8 w-px bg-gray-300"></div>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
