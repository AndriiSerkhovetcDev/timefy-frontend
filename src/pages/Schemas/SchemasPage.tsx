import { SchemasSidebar } from "@/features/schemas/ui/SchemasSidebar";
import { SchemaContent } from "@/features/schemas/ui/SchemaContent";
import { useSchemas } from "@/shared/hooks/useSchemas";
import { SchemasHeader } from "@/features/schemas/ui/SchemasHeader";
import { useSchemasStore } from "@/features/schemas/model/schemasStore";

export const SchemasPage = () => {
  useSchemas();
  const { error } = useSchemasStore();

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-red-400">{error}</div>
    );
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <SchemasSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SchemasHeader />
        <SchemaContent />
      </div>
    </div>
  );
};

export default SchemasPage;
