import { useSchemasStore } from "@/features/schemas/model/schemasStore";
import { useEffect } from "react";
import { getSchema } from "../api/schemaApi";
import { withNotify } from "../lib/withNotify";

export const useSchemas = () => {
  const { setSchemas, setLoading, setError } = useSchemasStore();

  useEffect(() => {
    const fetchSchemas = async () => {
      setLoading(true);
      try {
        const { data } = await withNotify(getSchema());
        if (data?.schemas) {
          setSchemas(data.schemas);
        }
      } catch {
        setError("Не вдалося завантажити схеми");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemas();
  }, []);
};
