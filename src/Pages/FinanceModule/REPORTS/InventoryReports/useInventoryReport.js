import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventoryReportThunk } from "../../../../Redux/finance/reports/InventoryReportSlice";

export default function useInventoryReport(filters = {}) {
  const dispatch = useDispatch();

  const {
    report = {},
    loading = false,
    error = null,
    exporting = false,
    exportError = null,
  } = useSelector((state) => state.inventoryReport || {});

  const refreshReport = useCallback(() => {
    dispatch(fetchInventoryReportThunk(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    refreshReport();
  }, [refreshReport]);

  return {
    report,
    loading,
    error,
    exporting,
    exportError,
    loadReport: refreshReport,
  };
}
