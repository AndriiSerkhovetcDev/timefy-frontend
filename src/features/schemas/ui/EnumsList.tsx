import { Save } from "lucide-react";
import { useState } from "react";
import type { SchemaEnum } from "../model/types";
import { useSchemasStore } from "../model/schemasStore";
import { Empty } from "./Empty";
import { cn } from "@/lib/utils";

export const EnumsList = ({ items }: { items: SchemaEnum[] }) => {
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
            + Створити enum
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTable && items.find((e) => e.name === activeTable) && (
          <EnumDetail enum_={items.find((e) => e.name === activeTable)!} />
        )}
      </div>
    </div>
  );
};

const EnumDetail = ({ enum_ }: { enum_: SchemaEnum }) => {
  const [values, setValues] = useState<string[]>(enum_.values ?? []);
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    const trimmed = newValue.trim().toUpperCase();
    if (!trimmed || values.includes(trimmed)) return;
    setValues((prev) => [...prev, trimmed]);
    setNewValue("");
  };

  const handleDelete = (val: string) => {
    setValues((prev) => prev.filter((v) => v !== val));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-gray-900">Enum: {enum_.name}</h2>
      </div>

      <section>
        <h3 className="text-sm font-medium text-primary mb-3">Values</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {values.map((val) => (
            <div
              key={val}
              className="flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-lg text-xs font-mono"
            >
              {val}
              <button
                onClick={() => handleDelete(val)}
                className="text-teal-400 hover:text-red-500 transition leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="NEW_VALUE"
            className="text-xs font-mono border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-400 w-48"
          />
          <button
            onClick={handleAdd}
            className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition text-gray-600"
          >
            + Add
          </button>
        </div>
      </section>
    </div>
  );
};
