export interface DataBase {
  pool: DataBasePool;
}

export interface DataBasePool {
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

export interface Schema {
  name: string;
  graphql: { enabled: boolean };
  enums?: SchemaEnum[];
  tables?: SchemaTable[];
  views?: SchemaView[];
  functions?: SchemaFunction[];
  triggers?: SchemaTrigger[];
}

export interface SchemaGraphQL {
  enabled?: boolean;
  queries?: boolean;
  mutations?: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

export interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  unique?: boolean;
}

export interface SchemaTable {
  name: string;
  graphql?: SchemaGraphQL;
  columns?: SchemaColumn[];
}

export interface SchemaEnum {
  name: string;
  values?: string[];
}

export interface SchemaViewColumn {
  name: string;
  type: string;
  nullable: boolean;
}

export interface SchemaView {
  name: string;
  code?: string;
  columns?: SchemaViewColumn[];
  graphql?: SchemaGraphQL;
}

export interface SchemaFunction {
  name: string;
  definition?: string;
}

export interface SchemaTrigger {
  name: string;
  table?: string;
  timing?: string;
  event?: string;
  functionName?: string;
}

export type SchemaTab = "tables" | "enums" | "views" | "functions" | "triggers";

export interface SchemaTable {
  name: string;
  graphql?: SchemaGraphQL;
  columns?: SchemaColumn[];
  constraints?: SchemaConstraint[];
  indexes?: SchemaIndex[];
  history?: SchemaHistory;
  files?: SchemaFile[];
}

export interface SchemaConstraint {
  type: "primary" | "unique" | "foreign" | "check";
  name: string;
  columns?: string[];
  references?: {
    schema: string;
    table: string;
    columns: string[];
  };
  onDelete?: string;
  expression?: string;
}

export interface SchemaIndex {
  name: string;
  columns: string[];
  where?: string;
}

export interface SchemaHistory {
  enabled: boolean;
  mode: "snapshot" | "diff" | "none";
  excludeColumns?: string[];
  logInsert: boolean;
  logUpdate: boolean;
  logDelete: boolean;
}

export interface SchemaFile {
  column_name: string;
  enabled: boolean;
  provider: string;
  maxSizeMb: number;
  allowedMimeTypes: string[];
}
