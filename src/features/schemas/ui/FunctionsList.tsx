import { cn } from "@/lib/utils";
import { useSchemasStore } from "../model/schemasStore";
import type { SchemaFunction } from "../model/types";
import { Empty } from "./Empty";

export const FunctionsList = ({ items }: { items: SchemaFunction[] }) => {
  const { activeTable, setActiveTable } = useSchemasStore();

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-64 border-r border-gray-100 shrink-0 flex flex-col">
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
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                <span className="font-mono text-xs">{item.name}</span>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-gray-100 shrink-0">
          <button className="w-full text-xs border border-dashed border-gray-300 text-gray-500 hover:border-teal-400 hover:text-teal-600 px-3 py-2 rounded-lg transition">
            + Створити функцію
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6">
        {activeTable && (
          <>
            <h2 className="text-base font-medium text-gray-900 mb-6">Function: {activeTable}</h2>
            <section>
              <h3 className="text-sm font-medium text-primary mb-3">Definition</h3>
              <textarea
                defaultValue={items.find((f) => f.name === activeTable)?.definition ?? ""}
                className="w-full text-xs font-mono border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-gray-50 focus:outline-none focus:border-teal-400"
                rows={3}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
};
