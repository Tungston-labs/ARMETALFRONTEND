import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getChangesInEquityReport,
  exportChangesInEquityReportFile,
  selectChangesInEquityReport,
} from "../../../../Redux/finance/reports/ChangesInEquitySlice";
import { equityRowsForComponent } from "./changesInEquityConfig";

const dateRangeForCurrentMonth = () => {
  const now = new Date();
  return {
    start: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`,
    end: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
    ).padStart(2, "0")}`,
  };
};

const useChangesInEquityReport = (companyPk) => {
  const dispatch = useDispatch();
  const { report, loading, error, exporting, exportError } = useSelector(
    selectChangesInEquityReport,
  );
  const initialDates = useMemo(dateRangeForCurrentMonth, []);
  const [startDate, setStartDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);
  const [selectedComponent, setSelectedComponent] = useState("all");
  const [year, setYear] = useState(new Date().getFullYear());

  const filters = useMemo(
    () => ({
      start_date: startDate,
      end_date: endDate,
      year,
      company_pk: companyPk,
    }),
    [startDate, endDate, year, companyPk],
  );

  useEffect(() => {
    if (startDate && endDate && startDate <= endDate) {
      dispatch(getChangesInEquityReport(filters));
    }
  }, [dispatch, filters, startDate, endDate]);

  const rows = useMemo(
    () => equityRowsForComponent(report?.rows || [], selectedComponent),
    [report, selectedComponent],
  );

  const handleStartDateChange = useCallback((event) => {
    setStartDate(event.target.value);
  }, []);

  const handleEndDateChange = useCallback((event) => {
    setEndDate(event.target.value);
  }, []);

  const handleComponentChange = useCallback((value) => {
    setSelectedComponent(value);
  }, []);

  const handleYearChange = useCallback((value) => {
    setYear(Number(value));
  }, []);

  const handleExport = useCallback(async () => {
    const result = await dispatch(exportChangesInEquityReportFile(filters));
    if (exportChangesInEquityReportFile.fulfilled.match(result)) {
      const { blob, filename } = result.payload;
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    }
  }, [dispatch, filters]);

  return {
    report,
    rows,
    summary: report?.summary || {},
    loading,
    error,
    exporting,
    exportError,
    startDate,
    endDate,
    selectedComponent,
    year,
    handleStartDateChange,
    handleEndDateChange,
    handleComponentChange,
    handleYearChange,
    handleExport,
  };
};

export default useChangesInEquityReport;
