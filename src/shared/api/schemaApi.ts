import type { DataBase, Schema } from "@/features/schemas/model/types";
import { httpClient } from "./httpClient";

type SchemaResponse = {
  data: {
    database: DataBase;
    schemas: Schema[];
  };
};

//api
const API_GET_SCHEMA = "/schema";

export const getSchema = async (): Promise<SchemaResponse> => {
  return httpClient.get(API_GET_SCHEMA);
};
