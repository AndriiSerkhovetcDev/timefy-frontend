import { cn } from "@/lib/utils";
import type { SchemaView } from "../model/types";
import { useSchemasStore } from "../model/schemasStore";
import { Empty } from "./Empty";

export const ViewsList = ({ items }: { items: SchemaView[] }) => {
  const { activeTable, setActiveTable } = useSchemasStore();

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-64 border-r border-border shrink-0 flex flex-col">
        <div className="flex-1 overflow-auto">
          {!items.length ? (
            <Empty />
          ) : (
            items.map((item) => (
              <div
                key={item.name}
                onClick={() => setActiveTable(item.name)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors border-b border-gray-50",
                  activeTable === item.name
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-700 hover:bg-bg-main",
                )}
              >
                <span className="font-mono text-xs">{item.name}</span>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-border shrink-0">
          <button className="w-full text-xs border border-dashed border-gray-300 text-text-muted hover:border-teal-400 hover:text-teal-600 px-3 py-2 rounded-lg transition">
            + Створити view
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTable && items.find((t) => t.name === activeTable) && (
          <ViewDetail view={items.find((t) => t.name === activeTable)!} />
        )}
      </div>
    </div>
  );
};

export const ViewDetail = ({ view }: { view: SchemaView }) => (
  <div className="px-8 py-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-base font-medium text-text-main">View: {view.name}</h2>
    </div>

    <section className="mb-8">
      <h3 className="text-sm font-medium text-primary mb-3">GraphQL</h3>
      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={!!view.graphql?.queries}
          onChange={() => {}}
          className="w-4 h-4 accent-teal-600"
        />
        <span className="text-sm text-gray-700">Queries</span>
      </label>
    </section>

    {view.code && (
      <section className="mb-8">
        <h3 className="text-sm font-medium text-primary mb-3">SQL</h3>
        <textarea
          defaultValue={view.code ?? ""}
          className="w-full text-xs font-mono border border-border rounded-lg px-4 py-3 text-gray-700 bg-bg-main focus:outline-none focus:border-teal-400"
          rows={3}
        />
      </section>
    )}
  </div>
);
