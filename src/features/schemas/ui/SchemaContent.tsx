import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useSchemasStore } from "../model/schemasStore";
import type { SchemaTab } from "../model/types";
import { TablesList } from "./TablesList";
import { EnumsList } from "./EnumsList";
import { ViewsList } from "./ViewsList";
import { FunctionsList } from "./FunctionsList";
import { TriggersList } from "./TriggersList";
import { Empty } from "./Empty";

const TAB_DEFS: { key: SchemaTab; label: string }[] = [
  { key: "tables", label: "Tables" },
  { key: "enums", label: "Enums" },
  { key: "views", label: "Views" },
  { key: "functions", label: "Functions" },
  { key: "triggers", label: "Triggers" },
];

export const SchemaContent = () => {
  const { schemas, activeSchema, activeTab, setActiveTab, toggleGraphQL, isLoading } =
    useSchemasStore();

  const schema = schemas.find((s) => s.name === activeSchema);

  if (isLoading) return null;

  if (!schema) {
    return <Empty />;
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as SchemaTab)}
      className="flex-1 flex flex-col min-w-0 h-[calc(100vh-3.5rem)] overflow-hidden"
    >
      <div className="px-6 pt-5 pb-0 bg-white border-b border-gray-100 shrink-0">
        <div className="flex justify-between items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">GraphQL API</span>
            <Switch
              checked={schema.graphql.enabled}
              onCheckedChange={() => toggleGraphQL(schema.name)}
              onClick={(e) => e.stopPropagation()}
              className="scale-75"
            />
          </div>
        </div>

        <TabsList className="bg-transparent p-0 h-auto shadow-none">
          {TAB_DEFS.map((t) => {
            const count = (schema[t.key] ?? []).length;
            return (
              <TabsTrigger
                key={t.key}
                value={t.key}
                className="
                  px-4 pb-3 text-sm text-gray-500 hover:text-gray-800
                  rounded-none border-b-2 border-transparent
                  data-[state=active]:border-b-teal-600
                  data-[state=active]:text-teal-700
                  data-[state=active]:bg-transparent
                  data-[state=active]:shadow-none!"
              >
                {t.label}
                <span className="ml-1.5 text-xs text-gray-400">{count}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <TabsContent value="tables" className="mt-0 flex-1 overflow-hidden data-[state=active]:flex">
        <TablesList items={schema.tables ?? []} />
      </TabsContent>
      <TabsContent value="enums" className="mt-0 flex-1 overflow-auto data-[state=active]:block">
        <EnumsList items={schema.enums ?? []} />
      </TabsContent>
      <TabsContent value="views" className="mt-0 flex-1 overflow-hidden data-[state=active]:flex">
        <ViewsList items={schema.views ?? []} />
      </TabsContent>
      <TabsContent
        value="functions"
        className="mt-0 flex-1 overflow-hidden data-[state=active]:flex"
      >
        <FunctionsList items={schema.functions ?? []} />
      </TabsContent>
      <TabsContent value="triggers" className="mt-0 flex-1 overflow-auto data-[state=active]:block">
        <TriggersList items={schema.triggers ?? []} />
      </TabsContent>
    </Tabs>
  );
};
