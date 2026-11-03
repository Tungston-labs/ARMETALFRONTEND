import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import {
  FiDollarSign,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { AiOutlineTransaction } from "react-icons/ai";
import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";
import { vendorLedgerColumns } from "./VendorLedgerColumns";
import {
  getVendorLedger,
  clearVendorLedger,
  selectVendorDetail,
} from "../../../../../Redux/finance/purchases/Vendordetailslice";

const LEDGER_TYPES = [
  "Opening Balance",
  "Manual Entry",
  "Credit Note",
  "Debit Note",
];
const ROWS_PER_PAGE = 10;

const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatError = (error) => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error.detail) return error.detail;
  return Object.entries(error)
    .map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(", ") : m}`)
    .join(" | ");
};

// vendorId can come from the parent as a prop, the outlet context, or the route
const VendorLedgerTab = ({ vendorId: vendorIdProp }) => {
  const dispatch = useDispatch();
  const params = useParams();

  // Context from VendorLayout (may be undefined if rendered outside the Outlet)
  const outlet = useOutletContext() || {};
  const vendorId =
    vendorIdProp ?? outlet.vendorId ?? params.id ?? params.vendorId;

  // Dates come from the date picker in the layout header (YYYY-MM-DD or "")
  const dateFrom = outlet.dateRange?.date_from || "";
  const dateTo = outlet.dateRange?.date_to || "";

  const {
    ledger = [],
    ledgerCards = null,
    ledgerLoading = false,
    ledgerError = null,
  } = useSelector(selectVendorDetail) || {};

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search so we don't call the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch whenever vendor, filters or header dates change
  useEffect(() => {
    if (!vendorId) return;
    dispatch(
      getVendorLedger({
        vendorId,
        params: {
          search: debouncedSearch,
          type,
          date_from: dateFrom,
          date_to: dateTo,
        },
      }),
    );
    setCurrentPage(1);
  }, [dispatch, vendorId, debouncedSearch, type, dateFrom, dateTo]);

  // Clear stale data when leaving the tab or switching vendors
  useEffect(() => {
    return () => {
      dispatch(clearVendorLedger());
    };
  }, [dispatch, vendorId]);

  // Map API fields to the keys vendorLedgerColumns uses
  const rows = useMemo(
    () =>
      ledger.map((r) => ({
        id: r.id,
        date: r.entry_date,
        reference: r.reference_number,
        description: r.description,
        type: r.type,
        debit: formatAmount(r.debit_amount),
        credit: formatAmount(r.credit_amount),
        balance: formatAmount(r.running_balance),
      })),
    [ledger],
  );

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return rows.slice(start, start + ROWS_PER_PAGE);
  }, [rows, currentPage]);

  // Totals across ALL filtered rows; balance is the closing balance
  const totalRow = useMemo(() => {
    const debit = ledger.reduce((s, r) => s + Number(r.debit_amount || 0), 0);
    const credit = ledger.reduce((s, r) => s + Number(r.credit_amount || 0), 0);
    const closing = ledger.length
      ? ledger[ledger.length - 1].running_balance
      : 0;
    return {
      debit: formatAmount(debit),
      credit: formatAmount(credit),
      balance: formatAmount(closing),
    };
  }, [ledger]);

  const statsCards = [
    {
      title: "Opening Balance",
      count: formatAmount(ledgerCards?.total_opening_balance),
      icon: <FiDollarSign />,
      backgroundColor: "#EEF2FF",
      iconColor: "#4F46E5",
    },
    {
      title: "Total Billed",
      count: formatAmount(ledgerCards?.total_billed),
      icon: <FiFileText />,
      backgroundColor: "#FFF7ED",
      iconColor: "#F59E0B",
    },
    {
      title: "Paid & Debit Note",
      count: formatAmount(ledgerCards?.total_paid_and_debit_note),
      icon: <FiCheckCircle />,
      backgroundColor: "#ECFDF5",
      iconColor: "#10B981",
    },
    {
      title: "Outstanding Payable",
      count: formatAmount(ledgerCards?.outstanding_payable),
      icon: <FiAlertCircle />,
      backgroundColor: "#FEF2F2",
      iconColor: "#EF4444",
    },
    {
      title: "Total Transactions",
      // a count, not money, so no decimals
      count: ledgerCards?.total_transactions ?? 0,
      icon: <AiOutlineTransaction />,
      backgroundColor: "#ecf4fd",
      iconColor: "#1045b9",
    },
  ];

  if (!vendorId) {
    return (
      <p style={{ padding: 24, color: "#B00020" }}>
        No vendor id found. Route params:{" "}
        {Object.keys(params).join(", ") || "none"}.
      </p>
    );
  }

  const errorMessage = formatError(ledgerError);

  return (
    <>
      <StatsCards cards={statsCards} />

      <ReusableFilter
        search={search}
        onSearch={setSearch}
        status={type}
        statuses={LEDGER_TYPES}
        onStatus={setType}
        showSearch
        showStatus
      />

      {errorMessage && (
        <div style={{ color: "#EF4444", padding: "8px 0" }}>{errorMessage}</div>
      )}

      {ledgerLoading ? (
        <div style={{ padding: "24px", textAlign: "center" }}>
          Loading ledger...
        </div>
      ) : (
        <ReusableTable
          columns={vendorLedgerColumns}
          data={paginatedData}
          totalRow={totalRow}
          totalRowLabel="TOTAL"
          autoLayout
        />
      )}

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={rows.length}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default VendorLedgerTab;