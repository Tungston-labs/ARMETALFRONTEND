import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiCalendar, FiCheckCircle, FiClock, FiDownload, FiEye, FiFileText, FiXCircle } from "react-icons/fi";
import GenerateQuotationModal from "../../../Components/GenerateQuotationModal/GenerateQuotationModal";
import QuotationInvoice from "../../../Components/QuotationInvoice/QuotationInvoice";
import { createQuotation, fetchQuotationDetails, fetchQuotationKpi, fetchQuotationList } from "../../../Redux/quotationThunks";
import { ActionButtons, CalendarIcon, DateInput, DateRangeWrapper, FilterSection, HeaderActions, IconButton, PageContainer, QuotationNumber, StatusBadge } from "./QuotationsList.styles";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const number = Number(value);
  return Number.isNaN(number) ? value : `SAR ${number.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const normalizeQuotationData = (quotation = {}) => ({
  quotationNumber: quotation.quotationNumber || quotation.quotation_number || quotation.quote_number || "",
  quotationDate: quotation.quotationDate || quotation.quotation_date || quotation.issue_date || "",
  dueDate: quotation.dueDate || quotation.due_date || quotation.valid_till || "",
  paymentStatus: quotation.paymentStatus || quotation.payment_status || "Draft",
  from: quotation.from || quotation.company_name || "TUNGSTON LABS",
  companyAddress: quotation.companyAddress || quotation.company_address || "",
  phoneNumber: quotation.phoneNumber || quotation.phone || "",
  email: quotation.email || "",
  billTo: quotation.billTo || quotation.client_name || quotation.bill_to || "",
  clientAddress: quotation.clientAddress || quotation.client_address || "",
  clientPhone: quotation.clientPhone || quotation.client_phone || "",
  clientEmail: quotation.clientEmail || quotation.client_email || "",
  discount: quotation.discount ?? 0,
  notes: quotation.notes || "",
  totals: {
    subtotal: quotation.totals?.subtotal ?? quotation.subtotal ?? 0,
    vat: quotation.totals?.vat ?? quotation.vat ?? 0,
    discount: quotation.totals?.discount ?? quotation.discount ?? 0,
    total: quotation.totals?.total ?? quotation.total_amount ?? quotation.total ?? 0,
  },
  items: (quotation.items || []).map((item) => ({
    id: item.id,
    service: item.service || item.particular || "",
    description: item.description || "",
    quantity: item.quantity ?? item.qty ?? "",
    hsCode: item.hsCode || item.hs_code || item.hsn || "",
    rate: item.rate ?? 0,
    vatRate: item.vatRate ?? item.vat_rate ?? item.gst_percent ?? 0,
  })),
});

const toInvoiceData = (data) => ({
  quoteNumber: data.quotationNumber,
  invoiceNumber: data.quotationNumber,
  issueDate: data.quotationDate,
  dueDate: data.dueDate,
  paymentStatus: data.paymentStatus || "Draft",
  companyName: data.from,
  companyAddress: data.companyAddress,
  phone: data.phoneNumber,
  email: data.email,
  billToName: data.billTo || "Company/Client Name",
  billToAddress: data.clientAddress || "",
  subTotal: formatCurrency(data.totals.subtotal),
  gstTotal: formatCurrency(data.totals.vat),
  discount: formatCurrency(data.totals.discount),
  roundOff: formatCurrency(0),
  grandTotal: formatCurrency(data.totals.total),
  website: "https://tungstonlabs.com/",
  items: data.items.map((item, index) => {
    const amount = Number(item.quantity) * Number(item.rate) || 0;
    const vatAmount = (amount * Number(item.vatRate || 0)) / 100;
    return { id: item.id, slNo: String(index + 1).padStart(2, "0"), particular: item.service || item.description || "-", qty: item.quantity || "0", hsn: item.hsCode || "-", rate: formatCurrency(item.rate), gstPercent: `${item.vatRate || 0}%`, gstAmount: formatCurrency(vatAmount), amount: formatCurrency(amount) };
  }),
});

const toApiPayload = (data) => ({
  quotation_number: data.quotationNumber,
  quotation_date: data.quotationDate,
  due_date: data.dueDate,
  payment_status: data.paymentStatus || "pending",
  client_name: data.billTo,
  client_address: data.clientAddress,
  client_phone: data.clientPhone,
  client_email: data.clientEmail,
  items: data.items
    .filter((item) => item.service || item.description || Number(item.quantity) || Number(item.rate))
    .map((item) => ({ service: item.service || item.description, description: item.description || item.service, quantity: Number(item.quantity) || 1, hs_code: item.hsCode || "", rate: Number(item.rate) || 0, vat_rate: Number(item.vatRate) || 0 })),
  discount: Number(data.discount) || 0,
  notes: data.notes,
  subtotal: data.totals.subtotal,
  vat: data.totals.vat,
  total_amount: data.totals.total,
});

const QuotationsList = () => {
  const dispatch = useDispatch();
  const { list, pagination, kpi, loading, saving, error } = useSelector((state) => state.quotation);
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [invoiceQuotation, setInvoiceQuotation] = useState(null);
  const [sendError, setSendError] = useState(null);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchQuotationList({ page: currentPage, page_size: rowsPerPage }));
    dispatch(fetchQuotationKpi());
  }, [currentPage, dispatch]);

  const quotationData = useMemo(() => list.map((quotation) => ({ ...quotation, quoteNumber: quotation.quoteNumber || quotation.quotation_number || quotation.quote_number || "-", customer: quotation.customer || quotation.client_name || quotation.bill_to || "-", issueDate: quotation.issueDate || quotation.quotation_date || quotation.issue_date || "-", validTill: quotation.validTill || quotation.due_date || quotation.valid_till || "-", quoteAmount: quotation.quoteAmount ?? quotation.total_amount ?? quotation.total, negotiationAmount: quotation.negotiationAmount ?? quotation.negotiation_amount, status: quotation.status || quotation.payment_status || "Pending" })), [list]);
  const customerOptions = useMemo(() => [...new Set(quotationData.map((quotation) => quotation.customer).filter(Boolean))], [quotationData]);
  const filteredData = useMemo(() => {
    const value = search.trim().toLowerCase();
    return quotationData.filter((quotation) => (!value || String(quotation.quoteNumber).toLowerCase().includes(value) || String(quotation.customer).toLowerCase().includes(value)) && (!customer || quotation.customer === customer) && (!status || quotation.status === status));
  }, [customer, quotationData, search, status]);
  const totalPages = Math.max(1, pagination.totalPages || Math.ceil(filteredData.length / rowsPerPage));
  const paginatedData = pagination.totalPages ? filteredData : filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const quotationCards = useMemo(() => [
    { count: String(kpi.total ?? kpi.total_quotations ?? pagination.totalItems ?? quotationData.length).padStart(2, "0"), title: "Total Quotations", icon: <FiFileText size={20} /> },
    { count: String(kpi.approved ?? kpi.approved_quotes ?? quotationData.filter((item) => item.status === "Approved").length).padStart(2, "0"), title: "Approved", icon: <FiCheckCircle size={20} /> },
    { count: String(kpi.pending ?? kpi.pending_quotes ?? quotationData.filter((item) => item.status === "Pending").length).padStart(2, "0"), title: "Pending", icon: <FiClock size={20} /> },
    { count: String(kpi.rejected ?? kpi.rejected_quotes ?? quotationData.filter((item) => item.status === "Rejected").length).padStart(2, "0"), title: "Rejected", icon: <FiXCircle size={20} /> },
  ], [kpi, pagination.totalItems, quotationData]);

  const showQuotation = (quotation) => {
    const data = normalizeQuotationData(quotation);
    setInvoiceQuotation({ formData: data, invoice: toInvoiceData(data) });
  };

  const columns = useMemo(() => [
    { header: "Quote Number", accessor: "quoteNumber", cell: (row) => <QuotationNumber>{row.quoteNumber}</QuotationNumber> },
    { header: "Customer", accessor: "customer" },
    { header: "Issue Date", accessor: "issueDate" },
    { header: "Valid Till", accessor: "validTill" },
    { header: "Quote Amount", accessor: "quoteAmount", cell: (row) => formatCurrency(row.quoteAmount) },
    { header: "Negotiation Amount", accessor: "negotiationAmount", cell: (row) => formatCurrency(row.negotiationAmount) },
    { header: "Status", accessor: "status", cell: (row) => <StatusBadge $status={row.status}>{row.status}</StatusBadge> },
    { header: "Action", accessor: "action", cell: (row) => <ActionButtons><IconButton type="button" title="View quotation" onClick={() => dispatch(fetchQuotationDetails(row.id)).unwrap().then(showQuotation).catch(() => undefined)}><FiEye /></IconButton></ActionButtons> },
  ], [dispatch]);

  const handleSendQuotation = () => {
    if (!invoiceQuotation?.formData || saving) return;
    const { formData } = invoiceQuotation;
    const validItems = formData.items.filter(
      (item) => item.service || item.description || Number(item.quantity) || Number(item.rate),
    );

    if (!formData.quotationNumber.trim() || !formData.billTo.trim() || validItems.length === 0) {
      setSendError("Quotation number, customer, and at least one quotation item are required.");
      return;
    }

    setSendError(null);
    dispatch(createQuotation(toApiPayload(formData))).unwrap().then(() => {
      setInvoiceQuotation(null);
      dispatch(fetchQuotationList({ page: currentPage, page_size: rowsPerPage }));
      dispatch(fetchQuotationKpi());
    }).catch((requestError) => setSendError(requestError));
  };

  const handleExport = () => {
    const rows = [["Quote Number", "Customer", "Issue Date", "Valid Till", "Quote Amount", "Status"], ...filteredData.map((row) => [row.quoteNumber, row.customer, row.issueDate, row.validTill, row.quoteAmount, row.status])];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (invoiceQuotation) return <QuotationInvoice quotation={invoiceQuotation.invoice} items={invoiceQuotation.invoice.items} onCancel={() => { setSendError(null); setInvoiceQuotation(null); }} onSend={handleSendQuotation} error={sendError} />;

  return (
    <PageContainer>
      <ReusableHeader title="Quotations" breadcrumbs={["Finance", "Quotations"]}>
        <HeaderActions>
          <HeaderButton $variant="excel" onClick={handleExport}><FiDownload /> EXPORT EXCEL</HeaderButton>
          <DateRangeWrapper><DateInput type="text" value="01 Apr 2026 - 30 Apr 2026" readOnly aria-label="Quotation date range" /><CalendarIcon><FiCalendar /></CalendarIcon></DateRangeWrapper>
          <HeaderButton $variant="orange" onClick={() => setIsQuotationModalOpen(true)}>+ GENERATE QUOTE</HeaderButton>
        </HeaderActions>
      </ReusableHeader>
      <StatsCards cards={quotationCards} loading={loading} />
      {error && <div role="alert">Unable to load quotations. Please try again.</div>}
      <FilterSection><ReusableFilter search={search} onSearch={(value) => { setSearch(value); setCurrentPage(1); }} department={customer} departments={customerOptions} onDepartment={(value) => { setCustomer(value); setCurrentPage(1); }} status={status} statuses={["Approved", "Pending", "Rejected"]} onStatus={(value) => { setStatus(value); setCurrentPage(1); }} showSearch showDepartment showStatus rightButton={<HeaderButton $variant="orange" onClick={() => setCurrentPage(1)}>Apply Filters</HeaderButton>} /></FilterSection>
      <ReusableTable columns={columns} data={paginatedData} loading={loading} />
      <ReusablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalRecords={pagination.totalItems} />
      <GenerateQuotationModal isOpen={isQuotationModalOpen} onClose={() => setIsQuotationModalOpen(false)} onPreview={(data) => { const normalized = normalizeQuotationData(data); setInvoiceQuotation({ formData: normalized, invoice: toInvoiceData(normalized) }); setIsQuotationModalOpen(false); }} isSaving={saving} />
    </PageContainer>
  );
};

export default QuotationsList;
