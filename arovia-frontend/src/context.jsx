import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getStoredUser, logout as clearSession } from "./api";

const AroviaContext = createContext(null);

export function AroviaProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [snapshot, setSnapshot] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setSnapshot(null);
      setRecords([]);
    };
    window.addEventListener("arovia:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("arovia:unauthorized", handleUnauthorized);
  }, []);

  const refreshSnapshot = async (force = false) => {
    if (!user?.userId) return null;
    const data = await api.fetchSnapshot(user.userId, { force });
    setSnapshot(data);
    return data;
  };

  const refreshRecords = async (force = false) => {
    if (!user?.userId) return [];
    const data = await api.fetchRecords(user.userId, { force });
    setRecords(Array.isArray(data) ? data : []);
    return data;
  };

  const refreshAll = async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      await Promise.all([refreshSnapshot(), refreshRecords()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      refreshAll().catch(() => {
      });
    } else {
      setSnapshot(null);
      setRecords([]);
    }
  }, [user?.userId]);

  const signIn = async (payload) => {
    const nextUser = await api.signin(payload);
    setUser(nextUser);
    return nextUser;
  };

  const signOut = () => {
    clearSession();
    setUser(null);
    setSnapshot(null);
    setRecords([]);
  };

  const addRecord = async (payload) => {
    if (!user?.userId) throw new Error("Please sign in first.");
    const recordId = await api.addRecord(user.userId, payload);
    await Promise.all([refreshRecords(true), refreshSnapshot(true)]);
    return recordId;
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      snapshot,
      records,
      loading,
      signIn,
      signOut,
      refreshSnapshot,
      refreshRecords,
      refreshAll,
      addRecord,
    }),
    [user, snapshot, records, loading],
  );

  return <AroviaContext.Provider value={value}>{children}</AroviaContext.Provider>;
}

export function useArovia() {
  const context = useContext(AroviaContext);
  if (!context) throw new Error("useArovia must be used inside AroviaProvider");
  return context;
}
