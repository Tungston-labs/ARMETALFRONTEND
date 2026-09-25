import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UserRound, Mail, BadgeCheck } from "lucide-react";

import {
  getCustomerById,
  uploadCustomerDocumentThunk,
} from "../../../../../Redux/finance/Sales/CustomerSlice";

const FILE_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const resolveDocumentUrl = (path) => {
  if (!path) return "#";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${FILE_BASE_URL}${path}`;
};

/**
 * All data-fetching, derived data and event handlers for the customer
 * Overview screen live here. The component that consumes this hook is
 * responsible only for rendering.
 */
export const useCustomerOverview = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const { selectedCustomer, detailLoading, uploadLoading, error } = useSelector(
    (state) => state.customer
  );

  useEffect(() => {
    if (id) {
      dispatch(getCustomerById(id));
    }
  }, [dispatch, id]);

  const customer = selectedCustomer || {};
  const documents = customer.documents || [];

  /* =========================================================
     CONTACT DETAILS
  ========================================================= */
  const contacts = [
    { label: "Phone Number", value: customer.phno || "—", icon: UserRound },
    { label: "Admin Contact", value: customer.admin_email || "—", icon: Mail },
    { label: "Financial Contact", value: customer.financial_email || "—", icon: Mail },
    { label: "Technical Contact", value: customer.technical_email || "—", icon: Mail },
  ];

  /* =========================================================
     COMPANY INFORMATION
  ========================================================= */
  const companyInfo = [
    { label: "CR Number", value: customer.cr_number || "—", icon: UserRound },
    { label: "VAT Number", value: customer.vat_number || "—", icon: BadgeCheck },
    {
      label: "Trade License Number",
      value: customer.trade_license_number || "—",
      icon: BadgeCheck,
    },
    {
      label: "Currency",
      value: customer.currency_name || customer.currency || "—",
      icon: BadgeCheck,
    },
    {
      label: "Credit Limit",
      value:
        customer.credit_limit != null
          ? `${customer.currency || ""} ${Number(customer.credit_limit).toLocaleString(
              undefined,
              { minimumFractionDigits: 2 }
            )}`
          : "—",
      icon: BadgeCheck,
    },
    { label: "Payment Terms", value: customer.payment_term_name || "—", icon: BadgeCheck },
    {
      label: "Opening Balance",
      value:
        customer.opening_balance != null
          ? `${customer.currency || ""} ${Number(customer.opening_balance).toLocaleString(
              undefined,
              { minimumFractionDigits: 2 }
            )}`
          : "—",
      icon: BadgeCheck,
    },
  ];

  const companyAddress = [customer.city, customer.state, customer.country, customer.postal]
    .filter(Boolean)
    .join(", ");

  /* =========================================================
     DOCUMENT UPLOAD HANDLERS
  ========================================================= */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    const customerId = id || customer?.id;

    if (!file || !customerId) {
      e.target.value = "";
      return;
    }

    dispatch(
      uploadCustomerDocumentThunk({
        id: customerId,
        documentName: file.name,
        file,
      })
    );

    e.target.value = "";
  };

  return {
    // status
    detailLoading,
    uploadLoading,
    error,

    // data
    customer,
    documents,
    contacts,
    companyInfo,
    companyAddress,

    // refs
    fileInputRef,

    // handlers
    handleUploadClick,
    handleFileChange,
    resolveDocumentUrl,
  };
};