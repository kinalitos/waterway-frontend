import { useState, useEffect, useCallback } from "react";
import { getContaminationReports } from "../../services/contamination-reports-api";

export function useReportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchReportes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getContaminationReports();
    if (error) {
      setError(error);
    } else {
      setReportes(data);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReportes();
  }, [fetchReportes]);

  const filteredReportes = filterStatus
    ? reportes.filter((r) => r.status === filterStatus)
    : reportes;

  return {
    reportes: filteredReportes,
    loading,
    error,
    setFilterStatus,
    filterStatus,
    refresh: fetchReportes, 
  };
}
