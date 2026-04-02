import { useNavigate } from "react-router-dom";
import { Database, Plus } from "lucide-react";
import { useSchemasStore } from "../model/schemasStore";
import { cn } from "@/lib/utils";
import { Logo } from "@/shared/ui";
import { Empty } from "./Empty";

export const SchemasSidebar = () => {
  const navigate = useNavigate();
  const { schemas, activeSchema, setActiveSchema, isSidebarCollapsed } = useSchemasStore();

  if (!schemas.length) {
    <Empty />;
  }

  return (
    <aside
      className={cn(
        "sticky top-0 flex flex-col shrink-0 h-screen transition-all duration-200",
        isSidebarCollapsed ? "w-20" : "w-64",
      )}
      style={{ background: "#1a3c40" }}
    >
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10 h-14">
        <Logo isSidebarCollapsed={isSidebarCollapsed} />
      </div>
      {!isSidebarCollapsed && (
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
            Schemas
          </span>
        </div>
      )}

      {isSidebarCollapsed && (
        <div className="flex justify-center pt-4 pb-2">
          <button
            onClick={() => navigate("/dashboard/schemas/create")}
            className="text-white/50 hover:text-white transition text-lg leading-none"
          >
            +
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-auto px-2 pb-4">
        {schemas.map((schema) => (
          <div
            key={schema.name}
            className={cn(
              "flex items-center gap-2 px-2 py-2.5 rounded-lg cursor-pointer transition-colors mb-1",
              isSidebarCollapsed ? "justify-center" : "px-3",
              activeSchema === schema.name
                ? "bg-white/15 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white",
            )}
            onClick={() => setActiveSchema(schema.name)}
            title={isSidebarCollapsed ? schema.name : undefined}
          >
            <Database size={14} className="shrink-0" />
            {!isSidebarCollapsed && (
              <>
                <span className="text-sm flex-1 truncate">{schema.name}</span>
              </>
            )}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => navigate("/dashboard/schemas/create")}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition text-sm"
        >
          <Plus size={14} />
          {!isSidebarCollapsed && <span>Додати схему</span>}
        </button>
      </div>
    </aside>
  );
};
