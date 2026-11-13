import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiPlus,
  FiUpload,
  FiXCircle,
} from "react-icons/fi";

import QuotationInvoice from "../../../../Components/QuotationInvoice/QuotationInvoice";
import ReusableConfirmModal from "../../../../Components/modals/ReusableConfirmModal";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import AddQuotation from "./modal/AddQuotation";
import { quotationColumns } from "./quotationColumns";
import { exportQuotationsService } from "../../../../services/finance/Sales/quotationService";
import {
  convertQuotation,
  createQuotation,
  deleteQuotation,
  fetchQuotationDetails,
  fetchQuotationKpi,
  fetchQuotationList,
  patchQuotation,
  updateQuotation,
} from "../../../../Redux/finance/Sales/quotationThunks";
import {
  CompactStatsWrapper,
  CompactTableWrapper,
  DateRangeGroup,
  ExportOutlineButton,
  GenerateQuoteButton,
  HeaderActionsRow,
  PageContainer,
} from "./QuotationsList.styles";

const ROWS_PER_PAGE = 20;

const formatCurrency = (value, currency = "SAR") => {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `${currency || "SAR"} ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatTwoDigits = (value) => {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num) || num < 0) return "00";
  return num < 10 ? `0${Math.trunc(num)}` : String(Math.trunc(num));
};

const formatApiError = (err) => {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err.detail) return err.detail;
  if (err.errors && typeof err.errors === "object") {
    return Object.entries(err.errors)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join(" | ");
  }
  return Object.entries(err)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join(" | ");
};

const toInvoicePreviewData = (q = {}) => {
  const currency = q.currency || "SAR";
  return {
    quoteNumber: q.quote_number || "",
    invoiceNumber: q.quote_number || "",
    issueDate: q.issue_date || "",
    dueDate: q.valid_till || "",
    paymentStatus: q.status
      ? String(q.status).charAt(0).toUpperCase() + String(q.status).slice(1)
      : "Pending",
    companyName: q.from_company_name || "Tungston Labs",
    companyAddress: q.from_address || "",
    phone: q.from_phone_number || "",
    email: q.from_email || "",
    billToName: q.bill_to_name || q.customer_name || "",
    billToAddress: q.bill_to_address || "",
    subTotal: formatCurrency(q.sub_total ?? 0, currency),
    gstTotal: formatCurrency(q.total_vat ?? 0, currency),
    discount: formatCurrency(q.discount ?? 0, currency),
    roundOff: formatCurrency(q.round_off ?? 0, currency),
    grandTotal: formatCurrency(q.quote_amount ?? 0, currency),
    website: "https://tungstonlabs.com/",
    items: (q.items || []).map((item, idx) => {
      const lineBase = Number(item.quantity ?? 0) * Number(item.rate ?? 0);
      return {
        id: item.id || idx,
        slNo: String(idx + 1).padStart(2, "0"),
        particular: item.service_name || item.product_name || item.description || "-",
        qty: item.quantity ?? 0,
        hsn: item.hs_code || "-",
        rate: formatCurrency(item.rate ?? 0, currency),
        gstPercent: `${item.vat_percentage ?? 0}%`,
        gstAmount: formatCurrency(item.vat_amount ?? 0, currency),
        amount: formatCurrency(lineBase, currency),
      };
    }),
  };
};

const QuotationsList = () => {
  const dispatch = useDispatch();

  const { list,   pagination = { totalPages: 1, totalItems: 0 }, kpi, loading, saving, error } = useSelector(
    (state) => state.quotation,
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editorState, setEditorState] = useState({ open: false, initialData: null });
  const [previewQuotation, setPreviewQuotation] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, fromDate, toDate]);

  const queryParams = useMemo(() => {
    const params = { page: currentPage, page_size: ROWS_PER_PAGE };
    if (debouncedSearch) params.search = debouncedSearch;
    if (status) params.status = status.toLowerCase();
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    return params;
  }, [currentPage, debouncedSearch, status, fromDate, toDate]);

  const reloadData = useCallback(() => {
    const kpiParams = {};
    if (fromDate) kpiParams.from_date = fromDate;
    if (toDate) kpiParams.to_date = toDate;
    return Promise.all([
      dispatch(fetchQuotationList(queryParams)),
      dispatch(fetchQuotationKpi(kpiParams)),
    ]);
  }, [dispatch, queryParams, fromDate, toDate]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const currency = kpi?.currency || "SAR";

  const rows = useMemo(
    () =>
      (list || []).map((q) => ({
        ...q,
        quoteNumber: q.quote_number || q.quoteNumber || "-",
        customerName: q.customer_name || q.bill_to_name || "-",
        issueDate: q.issue_date || "",
        validTill: q.valid_till || "",
        oldQuoteAmount: q.old_quote_amount,
        negotiationAmount: q.negotiation_amount,
        quoteAmount: q.quote_amount,
        status: q.status || "pending",
      })),
    [list],
  );

  const quotationCards = useMemo(
    () => [
      {
        count: formatCurrency(kpi?.totalQuotationValue ?? 0, currency),
        title: "Total quotation value",
        icon: <FiFileText size={20} />,
        backgroundColor: "#e7f5ec",
        iconColor: "#1bb36f",
      },
      {
        count: formatCurrency(kpi?.negotiationAmount ?? 0, currency),
        title: "Negotiation amount",
        icon: <FiFileText size={20} />,
        backgroundColor: "#f3e8ff",
        iconColor: "#9333ea",
      },
      {
        count: formatTwoDigits(kpi?.approvedQuotes),
        title: "Approved Quotations",
        icon: <FiCheckCircle size={20} />,
        backgroundColor: "#e7f5ec",
        iconColor: "#1bb36f",
        onClick: () => setStatus("Approved"),
      },
      {
        count: formatTwoDigits(kpi?.pendingQuotes),
        title: "Pending quotes",
        icon: <FiClock size={20} />,
        backgroundColor: "#fff7ed",
        iconColor: "#ea580c",
        onClick: () => setStatus("Pending"),
      },
      {
        count: formatTwoDigits(kpi?.rejectedQuotes),
        title: "Rejected Quotations",
        icon: <FiXCircle size={20} />,
        backgroundColor: "#fdeaea",
        iconColor: "#d9544f",
        onClick: () => setStatus("Rejected"),
      },
    ],
    [kpi, currency],
  );

  const handleView = useCallback(
    (row) => {
      dispatch(fetchQuotationDetails(row.id))
        .unwrap()
        .then((detail) => setPreviewQuotation(toInvoicePreviewData(detail)))
        .catch(() => setPreviewQuotation(toInvoicePreviewData(row)));
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (row) => {
      setSubmitError("");
      dispatch(fetchQuotationDetails(row.id))
        .unwrap()
        .then((detail) =>
          setEditorState({ open: true, initialData: detail || row }),
        )
        .catch(() => setEditorState({ open: true, initialData: row }));
    },
    [dispatch],
  );

  const handleConvertSO = useCallback(
    (row) => {
      dispatch(convertQuotation(row.id))
        .unwrap()
        .then(() => reloadData())
        .catch(() => undefined);
    },
    [dispatch, reloadData],
  );

  const handleStatusChange = useCallback(
    (row, nextStatus) => {
      if (!row?.id || !nextStatus) return;
      dispatch(patchQuotation({ id: row.id, data: { status: nextStatus } }))
        .unwrap()
        .then(() => reloadData())
        .catch(() => undefined);
    },
    [dispatch, reloadData],
  );

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await exportQuotationsService({
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(status ? { status: status.toLowerCase() } : {}),
        ...(fromDate ? { from_date: fromDate } : {}),
        ...(toDate ? { to_date: toDate } : {}),
        export: "csv",
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "quotations.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export quotations:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadRow = useCallback(
    (row) => {
      dispatch(fetchQuotationDetails(row.id))
        .unwrap()
        .then((detail) => {
          setPreviewQuotation(toInvoicePreviewData(detail));
        })
        .catch(() => setPreviewQuotation(toInvoicePreviewData(row)));
    },
    [dispatch],
  );

  const handleSaveEditor = async (payload) => {
    setSubmitError("");
    try {
      const isEditing = Boolean(editorState.initialData?.id);
      if (isEditing) {
        await dispatch(
          updateQuotation({
            id: editorState.initialData.id,
            data: payload,
            partial: true,
          }),
        ).unwrap();
      } else {
        await dispatch(createQuotation(payload)).unwrap();
      }
      setEditorState({ open: false, initialData: null });
      if (!isEditing && currentPage !== 1) {
        setCurrentPage(1);
      } else {
        await reloadData();
      }
    } catch (err) {
      setSubmitError(formatApiError(err) || "Failed to save quotation.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteQuotation(deleteTarget.id)).unwrap();
      setDeleteTarget(null);
      reloadData();
    } catch {
      setDeleteTarget(null);
    }
  };

  const columns = useMemo(
    () =>
      quotationColumns({
        onConvertSO: handleConvertSO,
        onView: handleView,
        onDownload: handleDownloadRow,
        onEdit: handleEdit,
        onDelete: (row) => setDeleteTarget(row),
        onStatusChange: handleStatusChange,
        formatCurrency,
        currency,
      }),
    [handleConvertSO, handleView, handleDownloadRow, handleEdit, handleStatusChange, currency],
  );

  if (previewQuotation) {
    return (
      <QuotationInvoice
        quotation={previewQuotation}
        items={previewQuotation.items}
        onCancel={() => setPreviewQuotation(null)}
        onDownload={() => window.print()}
      />
    );
  }

  if (editorState.open) {
    return (
      <AddQuotation
        isOpen
        initialData={editorState.initialData}
        submitting={saving}
        error={submitError}
        onCancel={() => {
          setSubmitError("");
          setEditorState({ open: false, initialData: null });
        }}
        onSave={handleSaveEditor}
      />
    );
  }

  return (
    <PageContainer>
      <ReusableHeader
        title="Quotations"
        breadcrumbs={["Sales", "Quotations"]}
      >
        <HeaderActionsRow>
          <ExportOutlineButton
            type="button"
            onClick={handleExport}
            disabled={exporting}
          >
            <FiUpload size={14} />
            {exporting ? "Exporting..." : "Export"}
          </ExportOutlineButton>

          <DateRangeGroup title="Filter by Issue Date range">
            <input
              type="date"
              aria-label="From date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span>–</span>
            <input
              type="date"
              aria-label="To date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </DateRangeGroup>

          <GenerateQuoteButton
            type="button"
            onClick={() => {
              setSubmitError("");
              setEditorState({ open: true, initialData: null });
            }}
          >
            <FiPlus size={15} />
            Generate Quote
          </GenerateQuoteButton>
        </HeaderActionsRow>
      </ReusableHeader>

      <CompactStatsWrapper>
        <StatsCards cards={quotationCards} loading={loading} />
      </CompactStatsWrapper>

      {error && (
        <div role="alert" style={{ margin: "12px 0", color: "#b42318", fontSize: 13 }}>
          {formatApiError(error) || "Unable to load quotations."}
        </div>
      )}

      <ReusableFilter
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search Quote no/customer"
        status={status}
        statuses={["Approved", "Pending", "Rejected", "Draft", "Sent", "Converted"]}
        onStatus={setStatus}
        showSearch
        showStatus
        showDepartment={false}
        showDate={false}
      />

      <CompactTableWrapper>
        <ReusableTable
          columns={columns}
          data={rows}
          loading={loading}
          emptyMessage="No quotations found"
          autoLayout
        />
      </CompactTableWrapper>

      <ReusablePagination
        currentPage={currentPage}
        totalPages={Math.max(1, pagination.totalPages || 1)}
        onPageChange={setCurrentPage}
        totalRecords={pagination?.totalItems ?? 0}
      />

      <ReusableConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Quotation"
        message={`Are you sure you want to delete "${deleteTarget?.quoteNumber || "this quotation"}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loadingText="Deleting..."
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
};

export default QuotationsList;
