import { useSchemasStore } from "@/features/schemas/model/schemasStore";
import { useEffect } from "react";
import { getSchema } from "../api/schemaApi";

export const useSchemas = () => {
  const { setSchemas, setLoading, setError } = useSchemasStore();

  useEffect(() => {
    const fetchSchemas = async () => {
      setLoading(true);
      try {
        const { data } = await getSchema();
        if (data?.schemas) {
          setSchemas(data.schemas);
        }
      } catch (error) {
        console.warn(error);
        setError("Не вдалося завантажити схеми");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemas();
  }, []);
};
