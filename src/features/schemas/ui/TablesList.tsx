import { useEffect, useState } from "react";
import type { SchemaColumn, SchemaTable } from "../model/types";
import { Save } from "lucide-react";
import { useSchemasStore } from "../model/schemasStore";
import { cn } from "@/lib/utils";
import { Empty } from "./Empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TablesList = ({ items }: { items: SchemaTable[] }) => {
  const { activeTable, setActiveTable, activeSchema } = useSchemasStore();

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-64 border-r border-gray-100 shrink-0 flex flex-col">
        {/* Скролена зона */}
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

        {/* Кнопка — завжди внизу */}
        <div className="p-3 border-t border-gray-100 shrink-0">
          <button className="w-full text-xs border border-dashed border-gray-300 text-gray-500 hover:border-teal-400 hover:text-teal-600 px-3 py-2 rounded-lg transition">
            + Створити таблицю
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {activeTable && activeSchema && items.find((t) => t.name === activeTable) && (
          <TableDetail
            table={items.find((t) => t.name === activeTable)!}
            schemaName={activeSchema}
          />
        )}
      </div>
    </div>
  );
};

export const TableDetail = ({ table, schemaName }: { table: SchemaTable; schemaName: string }) => {
  const { updateTable } = useSchemasStore();
  const [form, setForm] = useState<SchemaTable>(table);

  useEffect(() => {
    setForm(table);
  }, [table.name]);

  // const handleSave = () => {
  //   updateTable(schemaName, table.name, form);
  // };

  const setGraphQL = (key: string, value: boolean) => {
    setForm((prev) => {
      if (key === "queries") {
        return { ...prev, graphql: { ...prev.graphql, queries: value } };
      }
      return {
        ...prev,
        graphql: {
          ...prev.graphql,
          mutations: { ...prev.graphql?.mutations, [key]: value },
        },
      };
    });
  };

  const setHistory = (patch: Partial<SchemaTable["history"]>) => {
    setForm((prev) => ({
      ...prev,
      history: { ...prev.history, ...patch } as SchemaTable["history"],
    }));
  };

  const updateColumn = (colName: string, patch: Partial<SchemaColumn>) => {
    setForm((prev) => ({
      ...prev,
      columns: prev.columns?.map((c) => (c.name === colName ? { ...c, ...patch } : c)),
    }));
  };

  // const addColumn = (col: SchemaColumn) => {
  //   setForm((prev) => ({
  //     ...prev,
  //     columns: [...(prev.columns ?? []), col],
  //   }));
  // };

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-gray-900">Table: {table.name}</h2>
        {/* <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-xs text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg transition"
          >
            <Save size={12} />
            Зберегти зміни
          </button>
        </div> */}
      </div>

      {/* GraphQL */}
      <section className="mb-8">
        <h3 className="text-sm font-medium text-primary mb-3">GraphQL</h3>
        <div className="flex items-center gap-6">
          {(["queries", "create", "update", "delete"] as const).map((key) => {
            const checked =
              key === "queries"
                ? !!form.graphql?.queries
                : !!form.graphql?.mutations?.[key as "create" | "update" | "delete"];
            return (
              <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setGraphQL(key, e.target.checked)}
                  className="w-4 h-4 accent-teal-600"
                />
                <span className="text-sm text-gray-700 capitalize">{key}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* History */}
      <section className="mb-8">
        <h3 className="text-sm font-medium text-primary mb-3">History</h3>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.history?.enabled ?? false}
              onChange={(e) => setHistory({ enabled: e.target.checked })}
              className="w-4 h-4 accent-teal-600"
            />
            <span className="text-sm text-gray-700">Enabled</span>
          </label>

          {form.history?.enabled && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Mode</span>
                <Select
                  value={form.history?.mode ?? "snapshot"}
                  onValueChange={(v) => setHistory({ mode: v as any })}
                >
                  <SelectTrigger className="text-xs font-mono border-gray-200 h-8 min-w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["snapshot", "diff"].map((m) => (
                      <SelectItem key={m} value={m} className="text-xs font-mono">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Columns */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-primary">Columns</h3>
          <button
            // onClick={() => addColumn({ name: "", type: "", nullable: true, default: "" })}
            className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
          >
            + Column
          </button>
        </div>
        {form.columns?.length ? (
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium">Name</th>
                  <th className="text-left px-4 py-2.5 font-medium">Type</th>
                  <th className="text-left px-4 py-2.5 font-medium">Nullable</th>
                  <th className="text-left px-4 py-2.5 font-medium">Default</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {form.columns.map((col, idx) => (
                  <ColumnRow
                    key={col.name || idx}
                    col={col}
                    onChange={(patch) => updateColumn(col.name, patch)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Немає колонок</p>
        )}
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-primary mb-3">Constraints</h3>
          <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
            + Constraint
          </button>
        </div>
        {table.constraints?.length ? (
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium">Type</th>
                  <th className="text-left px-4 py-2.5 font-medium">Name</th>
                  <th className="text-left px-4 py-2.5 font-medium">Columns</th>
                  <th className="text-left px-4 py-2.5 font-medium">References</th>
                  <th className="text-left px-4 py-2.5 font-medium">On Delete</th>
                </tr>
              </thead>
              <tbody>
                {table.constraints.map((c) => (
                  <tr key={c.name} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-xs text-gray-500">{c.type}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-800">{c.name}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-500">
                      {c.columns?.join(", ") ?? c.expression ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-500">
                      {c.references
                        ? `${c.references.schema}.${c.references.table}(${c.references.columns.join(", ")})`
                        : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">{c.onDelete ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Немає constraints</p>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-primary">Indexes</h3>
          <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
            + Index
          </button>
        </div>
        {table.indexes?.length ? (
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium">Name</th>
                  <th className="text-left px-4 py-2.5 font-medium">Columns</th>
                  <th className="text-left px-4 py-2.5 font-medium">Unique</th>
                  <th className="text-left px-4 py-2.5 font-medium">Where</th>
                </tr>
              </thead>
              <tbody>
                {table.indexes.map((idx) => (
                  <tr key={idx.name} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-800">{idx.name}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-500">
                      {idx.columns.join(", ")}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-500">
                      {idx.where ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Немає indexes</p>
        )}
      </section>
    </div>
  );
};

export const ColumnRow = ({
  col,
  onChange,
}: {
  col: SchemaColumn;
  onChange: (patch: Partial<SchemaColumn>) => void;
}) => (
  <tr className="border-t border-gray-100 hover:bg-gray-50">
    <td className="px-4 py-2.5 font-mono text-xs text-gray-800">{col.name}</td>
    <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{col.type}</td>
    <td className="px-4 py-2.5 text-center">
      <input
        type="checkbox"
        checked={col.nullable}
        onChange={(e) => onChange({ nullable: e.target.checked })}
        className="accent-teal-600"
      />
    </td>
    <td className="px-4 py-2.5">
      <input
        type="text"
        defaultValue={col.default ?? ""}
        onBlur={(e) => onChange({ default: e.target.value })}
        className="w-full text-xs font-mono border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-teal-400"
      />
    </td>
    <td className="px-4 py-2.5">
      <button className="text-xs border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50 text-gray-600 transition">
        <Save size={12} />
      </button>
    </td>
  </tr>
);
