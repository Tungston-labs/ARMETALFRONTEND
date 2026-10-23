import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPaymentReport,
  clearPaymentReportError,
} from "../../../../Redux/finance/reports/paymentReportSlice";
import {
  buildPaymentKpis,
  paymentMethodOptions,
  paymentStatusOptions,
  paymentTypeOptions,
} from "./PaymentReportConfig";

const initialFilters = {
  startDate: "",
  endDate: "",
  paymentType: "all",
  method: "all",
  status: "all",
  bank: "all",
  search: "",
};

export default function usePaymentReport() {
  const dispatch = useDispatch();
  const report = useSelector((state) => state.paymentReport || {});
  const rows = report.rows || [];
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchPaymentReport());
  }, [dispatch]);

  const updateFilter = useCallback((key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  }, []);

  const filteredRows = useMemo(
    () =>
      rows.filter((item) => {
        const statusMatch =
          filters.status === "all" ||
          item.status.toLowerCase() === filters.status.toLowerCase();
        const searchText =
          `${item.paymentId} ${item.customer} ${item.reference} ${item.bank}`.toLowerCase();
        return (
          (!filters.startDate ||
            !item.date ||
            item.date >= filters.startDate) &&
          (!filters.endDate || !item.date || item.date <= filters.endDate) &&
          (filters.paymentType === "all" ||
            item.type.toLowerCase() === filters.paymentType.toLowerCase()) &&
          (filters.method === "all" ||
            item.method.toLowerCase() === filters.method.toLowerCase()) &&
          statusMatch &&
          (filters.bank === "all" || item.bank === filters.bank) &&
          (!filters.search ||
            searchText.includes(filters.search.toLowerCase().trim()))
        );
      }),
    [rows, filters],
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const pageRows = useMemo(
    () =>
      filteredRows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      ),
    [filteredRows, currentPage],
  );
  const banks = useMemo(
    () =>
      [
        ...new Set(rows.map((r) => r.bank).filter((v) => v && v !== "—")),
      ].sort(),
    [rows],
  );
  const kpis = useMemo(
    () => buildPaymentKpis(filteredRows, report.summary),
    [filteredRows, report.summary],
  );

  const refresh = useCallback(
    () =>
      dispatch(
        fetchPaymentReport({
          ...(filters.startDate ? { start_date: filters.startDate } : {}),
          ...(filters.endDate ? { end_date: filters.endDate } : {}),
        }),
      ),
    [dispatch, filters.startDate, filters.endDate],
  );

  const exportReport = useCallback(() => {
    const headers = [
      "Payment ID",
      "Date",
      "Type",
      "Customer / Vendor",
      "Reference",
      "Method",
      "Amount",
      "Status",
      "Bank Account",
    ];
    const csvRows = filteredRows.map((r) => [
      r.paymentId,
      r.date,
      r.type,
      r.customer,
      r.reference,
      r.method,
      r.amount,
      r.status,
      r.bank,
    ]);
    const csv = [headers, ...csvRows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payment-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [filteredRows]);

  return {
    rows: pageRows,
    allRows: filteredRows,
    filters,
    updateFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    kpis,
    banks,
    loading: Boolean(report.loading),
    error: report.error || null,
    refresh,
    exportReport,
    clearError: () => dispatch(clearPaymentReportError()),
    paymentTypeOptions,
    paymentMethodOptions,
    paymentStatusOptions,
  };
}
