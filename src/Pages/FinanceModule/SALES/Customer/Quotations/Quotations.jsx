import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  FiCheckCircle,
  FiDollarSign,
  FiFileText,
  FiPlusCircle,
  FiRefreshCw,
  FiXCircle,
} from "react-icons/fi";

import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";
import ReusableConfirmModal from "../../../../../Components/modals/ReusableConfirmModal";
import QuotationInvoice from "../../../../../Components/QuotationInvoice/QuotationInvoice";
import AddQuotation from "../../Quotations/modal/AddQuotation";

import { quotationColumns } from "./quotationColumns";
import { getCustomerQuotations } from "../../../../../Redux/finance/Sales/CustomerSlice";
import {
  createQuotation,
  deleteQuotation,
  fetchQuotationDetails,
  patchQuotation,
  updateQuotation,
} from "../../../../../Redux/quotationThunks";
import {
  CompactCustomerTableWrapper,
  GenerateCustomerQuoteButton,
} from "./Quotations.styles";

const formatCurrency = (value, currency = "SAR") => {
  const num = Number(value ?? 0);
  const safe = Number.isFinite(num) ? num : 0;
  return `${currency || "SAR"} ${safe.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatTwoDigits = (value) => {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num) || num < 0) return "00";
  return num < 10 ? `0${Math.trunc(num)}` : String(Math.trunc(num));
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
        particular:
          item.service_name || item.product_name || item.description || "-",
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

const Quotations = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editorState, setEditorState] = useState({
    open: false,
    initialData: null,
  });
  const [previewQuotation, setPreviewQuotation] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const {
    quotations,
    quotationsKpiCards,
    quotationsTotalPages,
    quotationsLoading,
  } = useSelector((state) => state.customer || {});

  const saving = useSelector((state) => Boolean(state.quotation?.saving));

  const reloadQuotations = useCallback(() => {
    if (!customerId) return;
    dispatch(
      getCustomerQuotations({
        id: customerId,
        params: {
          page: currentPage,
          search: search || undefined,
          ...(status ? { status: status.toLowerCase() } : {}),
        },
      }),
    );
  }, [dispatch, customerId, currentPage, search, status]);

  useEffect(() => {
    reloadQuotations();
  }, [reloadQuotations]);

  const currency = quotationsKpiCards?.currency || "SAR";

  const quotationStats = useMemo(
    () => [
      {
        title: "Total Quotations",
        count: formatTwoDigits(quotationsKpiCards?.total_quotations),
        icon: <FiFileText />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
      },
      {
        title: "Total Amount",
        count: formatCurrency(quotationsKpiCards?.total_amount ?? 0, currency),
        icon: <FiDollarSign />,
        backgroundColor: "#F3E8FF",
        iconColor: "#9333EA",
      },
      {
        title: "Negotiation Amount",
        count: formatCurrency(
          quotationsKpiCards?.negotiation_amount ?? 0,
          currency,
        ),
        icon: <FiRefreshCw />,
        backgroundColor: "#FFF4E5",
        iconColor: "#F59E0B",
      },
      {
        title: "Approved Quotations",
        count: formatTwoDigits(quotationsKpiCards?.approved_quotations),
        icon: <FiCheckCircle />,
        backgroundColor: "#E8F8EF",
        iconColor: "#22A06B",
      },
      {
        title: "Rejected Quotations",
        count: formatTwoDigits(quotationsKpiCards?.rejected_quotations),
        icon: <FiXCircle />,
        backgroundColor: "#FDECEC",
        iconColor: "#E5484D",
      },
    ],
    [quotationsKpiCards, currency],
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
        await reloadQuotations();
      }
    } catch (err) {
      setSubmitError(
        typeof err === "string"
          ? err
          : err?.detail || "Failed to save quotation.",
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteQuotation(deleteTarget.id)).unwrap();
      setDeleteTarget(null);
      reloadQuotations();
    } catch {
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = useCallback(
    (row, nextStatus) => {
      if (!row?.id || !nextStatus) return;
      dispatch(patchQuotation({ id: row.id, data: { status: nextStatus } }))
        .unwrap()
        .then(() => reloadQuotations())
        .catch(() => undefined);
    },
    [dispatch, reloadQuotations],
  );

  const columns = useMemo(() => {
    if (typeof quotationColumns?.build === "function") {
      return quotationColumns.build({
        currency,
        onView: handleView,
        onEdit: handleEdit,
        onDelete: (row) => setDeleteTarget(row),
        onStatusChange: handleStatusChange,
      });
    }
    return quotationColumns;
  }, [currency, handleView, handleEdit, handleStatusChange]);

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
        defaultCustomerId={customerId}
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
    <>
      <StatsCards cards={quotationStats} />

      <ReusableFilter
        search={search}
        searchPlaceholder="Search"
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        status={status}
        statuses={["Approved", "Pending", "Rejected", "Draft", "Sent", "Converted"]}
        onStatus={(value) => {
          setStatus(value);
          setCurrentPage(1);
        }}
        showSearch
        showStatus
        showDepartment={false}
        showDate={false}
        rightButton={
          <GenerateCustomerQuoteButton
            type="button"
            onClick={() => {
              setSubmitError("");
              setEditorState({ open: true, initialData: null });
            }}
          >
            Generate Quote <FiPlusCircle size={14} />
          </GenerateCustomerQuoteButton>
        }
      />

      <CompactCustomerTableWrapper>
        <ReusableTable
          columns={columns}
          data={quotations || []}
          loading={quotationsLoading}
          autoLayout
        />
      </CompactCustomerTableWrapper>

      <ReusablePagination
        currentPage={currentPage}
        totalPages={quotationsTotalPages || 1}
        onPageChange={setCurrentPage}
      />

      <ReusableConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Quotation"
        message={`Are you sure you want to delete "${deleteTarget?.quote_number || "this quotation"}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loadingText="Deleting..."
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default Quotations;
