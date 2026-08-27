import { useCallback, useEffect, useState } from "react";
import { listRecords } from "../api/records";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export function useRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(
    async ({ skipCache = false } = {}) => {
      if (!user?.userId) return;
      setLoading(true);
      setError("");
      try {
        const data = await listRecords(user.userId, { skipCache });
        setRecords(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Couldn't load your records.");
      } finally {
        setLoading(false);
      }
    },
    [user?.userId]
  );

  useEffect(() => {
    load();
  }, [load]);

  return { records, loading, error, refresh: () => load({ skipCache: true }) };
}
