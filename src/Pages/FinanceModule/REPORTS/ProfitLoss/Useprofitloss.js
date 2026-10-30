import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// NOTE: adjust this path to where you saved the slice in your project
import {
  getProfitLossReport,
  clearProfitLossReportError,
} from "../../../../Redux/finance/reports/Profitlossreportslice";

const ROWS_PER_PAGE = 10;

const getErrorMessage = (error) =>
  typeof error === "string"
    ? error
    : error?.detail || error?.message || "Failed to load profit & loss report";

// Flatten the API sections into the row format the table uses:
// { type: "section" | "total" | undefined, particular, currentYear, lastYear, variance }
const buildProfitLossRows = (sections) => {
  const rows = [];

  const addSection = (title, section, totalLabel) => {
    rows.push({ type: "section", particular: title });

    section.rows.forEach((row) =>
      rows.push({
        key: `${title}-${row.accountId ?? row.particular}`,
        particular: row.particular,
        currentYear: row.currentYear,
        lastYear: row.lastYear,
        variance: row.variance,
      }),
    );

    rows.push({
      type: "total",
      particular: totalLabel,
      currentYear: section.total,
      lastYear: section.lastYearTotal,
      variance: section.variance,
    });
  };

  const addResult = (label, result) =>
    rows.push({
      type: "total",
      particular: label,
      currentYear: result.currentYear,
      lastYear: result.lastYear,
      variance: result.variance,
    });

  addSection("REVENUE", sections.revenue, "Total Revenue");
  addSection(
    "COST OF GOODS SOLD",
    sections.costOfGoodsSold,
    "Total Cost of Goods Sold",
  );
  addResult("Gross Profit", sections.grossProfit);
  addSection(
    "OPERATING EXPENSES",
    sections.operatingExpenses,
    "Total Operating Expenses",
  );

  // Only show Other Expenses when there is something in it
  if (sections.otherExpenses.rows.length > 0) {
    addSection(
      "OTHER EXPENSES",
      sections.otherExpenses,
      "Total Other Expenses",
    );
  }

  addResult("Net Profit", sections.netProfit);

  return rows;
};

const downloadCsv = (rows) => {
  const header = ["Particular", "Current Year", "Last Year", "Variance"];

  const body = rows.map((item) =>
    item.type === "section"
      ? [item.particular, "", "", ""]
      : [item.particular, item.currentYear, item.lastYear, item.variance],
  );

  const csv = [header, ...body]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "profit-loss-statement.csv";
  link.click();
  URL.revokeObjectURL(url);
};

const useProfitLoss = () => {
  const dispatch = useDispatch();

  const { kpis, sections, loading, error } = useSelector(
    (state) => state.profitLossReport,
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Fetch on mount and whenever the date range changes.
  // Empty dates => backend returns the default year-to-date report.
  useEffect(() => {
    const params = {};
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;

    const request = dispatch(getProfitLossReport(params));
    return () => request.abort();
  }, [dispatch, dateFrom, dateTo]);

  const profitLossData = useMemo(
    () => buildProfitLossRows(sections),
    [sections],
  );

  const filteredData = useMemo(
    () =>
      profitLossData.filter((item) =>
        item.particular.toLowerCase().includes(search.toLowerCase()),
      ),
    [profitLossData, search],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ROWS_PER_PAGE),
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredData.slice(start, start + ROWS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Keep pagination valid if the search reduces the number of pages.
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value);
    setCurrentPage(1);
    if (error) dispatch(clearProfitLossReportError());
  };

  const handleDateToChange = (e) => {
    setDateTo(e.target.value);
    setCurrentPage(1);
    if (error) dispatch(clearProfitLossReportError());
  };

  const handleExport = () => downloadCsv(profitLossData);

  return {
    kpis,
    loading,
    error,
    errorMessage: error ? getErrorMessage(error) : "",
    search,
    dateFrom,
    dateTo,
    currentPage,
    totalPages,
    totalRecords: filteredData.length,
    rows: paginatedData,
    handleSearch,
    handleDateFromChange,
    handleDateToChange,
    handleExport,
    setCurrentPage,
  };
};

export default useProfitLoss;
