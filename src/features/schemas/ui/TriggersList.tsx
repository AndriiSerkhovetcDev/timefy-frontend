import { Empty } from "./Empty";
import type { SchemaTrigger } from "../model/types";
import { useSchemasStore } from "../model/schemasStore";
import { cn } from "@/lib/utils";
import { StyledSelect } from "@/shared/ui";

export const TriggersList = ({ items }: { items: SchemaTrigger[] }) => {
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
            + Створити trigger
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTable && items.find((t) => t.name === activeTable) && (
          <TriggerDetail trigger={items.find((t) => t.name === activeTable)!} />
        )}
      </div>
    </div>
  );
};

const TriggerDetail = ({ trigger }: { trigger: SchemaTrigger }) => {
  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-gray-900">Trigger: {trigger.name}</h2>
      </div>

      <section className="mb-8">
        <h3 className="text-sm font-medium text-primary mb-3">Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Table</label>
            <input
              type="text"
              defaultValue={trigger.table ?? ""}
              className="text-xs font-mono border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Function</label>
            <input
              type="text"
              defaultValue={trigger.functionName ?? ""}
              className="text-xs font-mono border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-400"
            />
          </div>

          <StyledSelect
            defaultValue={trigger.timing ?? "BEFORE"}
            options={["BEFORE", "AFTER", "INSTEAD OF"]}
          />
          <StyledSelect
            defaultValue={trigger.event ?? "UPDATE"}
            options={["INSERT", "UPDATE", "DELETE", "TRUNCATE"]}
          />
        </div>
      </section>
    </div>
  );
};
