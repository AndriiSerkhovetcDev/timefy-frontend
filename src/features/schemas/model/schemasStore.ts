import { create } from "zustand";
import type { Schema, SchemaTab, SchemaTable } from "./types";

interface SchemasStore {
  schemas: Schema[];
  activeSchema: string | null;
  activeTab: SchemaTab;
  expandedSchemas: Record<string, boolean>;
  isSidebarCollapsed: boolean;
  activeTable: string | null;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;

  setSchemas: (schemas: Schema[]) => void;
  setActiveSchema: (name: string) => void;
  setActiveTab: (tab: SchemaTab) => void;
  toggleExpanded: (name: string) => void;
  toggleGraphQL: (name: string) => void;
  toggleSidebar: () => void;
  setActiveTable: (name: string | null) => void;
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
  updateTable: (schemaName: string, tableName: string, table: SchemaTable) => void;
  setDirty: (v: boolean) => void;
}

export const useSchemasStore = create<SchemasStore>((set) => ({
  schemas: [],
  activeSchema: null,
  activeTab: "tables",
  expandedSchemas: {},
  isSidebarCollapsed: false,
  activeTable: null,
  isLoading: false,
  error: null,
  isDirty: false,

  setSchemas: (schemas) =>
    set((state) => {
      const activeSchema = state.activeSchema ?? schemas[0]?.name ?? null;
      const schema = schemas.find((s) => s.name === activeSchema);
      const activeTable = schema?.tables?.[0]?.name ?? null;

      return {
        schemas,
        activeSchema,
        activeTable,
      };
    }),
  setActiveSchema: (name) =>
    set((state) => {
      const schema = state.schemas.find((s) => s.name === name);

      return {
        activeSchema: name,
        activeTab: "tables",
        activeTable: schema?.tables?.[0]?.name ?? null,
        expandedSchemas: {
          ...state.expandedSchemas,
          [name]: true,
        },
      };
    }),

  setActiveTab: (tab) =>
    set((state) => {
      const schema = state.schemas.find((s) => s.name === state.activeSchema);
      const items = schema?.[tab] ?? [];
      return {
        activeTab: tab,
        activeTable: items[0]?.name ?? null,
      };
    }),

  toggleExpanded: (name) =>
    set((s) => ({
      expandedSchemas: {
        ...s.expandedSchemas,
        [name]: !s.expandedSchemas[name],
      },
    })),

  toggleGraphQL: (name) =>
    set((s) => ({
      schemas: s.schemas.map((schema) =>
        schema.name === name
          ? { ...schema, graphql: { enabled: !schema.graphql.enabled } }
          : schema,
      ),
    })),
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
  setActiveTable: (name) => set({ activeTable: name }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setDirty: (isDirty) => set({ isDirty }),
  updateTable: (schemaName, tableName, updatedTable) =>
    set((s) => ({
      isDirty: true,
      schemas: s.schemas.map((schema) =>
        schema.name !== schemaName
          ? schema
          : {
              ...schema,
              tables: schema.tables?.map((t) => (t.name !== tableName ? t : updatedTable)),
            },
      ),
    })),
}));
