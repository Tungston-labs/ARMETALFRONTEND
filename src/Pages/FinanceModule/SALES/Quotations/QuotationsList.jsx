import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiDownload,
    FiFileText,
    FiXCircle,
} from "react-icons/fi";

import QuotationInvoice from "../../../../Components/QuotationInvoice/QuotationInvoice";

import {
    createQuotation,
    fetchQuotationDetails,
    fetchQuotationKpi,
    fetchQuotationList,
    convertQuotation,
} from "../../../../Redux/quotationThunks";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import { quotationColumns } from "./quotationColumns";


const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "-";

    const number = Number(value);

    return Number.isNaN(number)
        ? value
        : `SAR ${number.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
};


const normalizeQuotationData = (quotation = {}) => {
    const company =
        quotation.from && typeof quotation.from === "object"
            ? quotation.from
            : {
                name:
                    quotation.from ||
                    quotation.company_name ||
                    "TUNGSTON LABS",
            };

    const client =
        quotation.billTo && typeof quotation.billTo === "object"
            ? quotation.billTo
            : {
                client:
                    quotation.billTo ||
                    quotation.client_name ||
                    quotation.bill_to ||
                    "",
            };

    return {
        quotationNumber:
            quotation.quotationNumber ||
            quotation.quotation_number ||
            quotation.quote_number ||
            "",

        quotationDate:
            quotation.quotationDate ||
            quotation.quotation_date ||
            quotation.issue_date ||
            "",

        dueDate:
            quotation.dueDate ||
            quotation.due_date ||
            quotation.valid_till ||
            "",

        paymentStatus:
            quotation.paymentStatus ||
            quotation.payment_status ||
            "Draft",

        from: company.name || "TUNGSTON LABS",

        companyAddress:
            company.address ||
            quotation.companyAddress ||
            quotation.company_address ||
            "",

        phoneNumber:
            company.phone ||
            quotation.phoneNumber ||
            quotation.phone ||
            "",

        email:
            company.email ||
            quotation.email ||
            "",

        billTo:
            client.client ||
            client.name ||
            quotation.billTo ||
            quotation.client_name ||
            quotation.bill_to ||
            "",

        clientAddress:
            client.address ||
            quotation.clientAddress ||
            quotation.client_address ||
            "",

        clientPhone:
            client.phone ||
            quotation.clientPhone ||
            quotation.client_phone ||
            "",

        clientEmail:
            client.email ||
            quotation.clientEmail ||
            quotation.client_email ||
            "",

        discount: quotation.discount ?? 0,

        notes: quotation.notes || "",

        totals: {
            subtotal:
                quotation.totals?.subtotal ??
                quotation.subtotal ??
                0,

            vat:
                quotation.totals?.vat ??
                quotation.vat ??
                0,

            discount:
                quotation.totals?.discount ??
                quotation.discount ??
                0,

            total:
                quotation.totals?.total ??
                quotation.total_amount ??
                quotation.total ??
                0,
        },

        items: (quotation.items || []).map((item) => ({
            id: item.id,
            service: item.service || item.particular || "",
            description: item.description || "",
            quantity: item.quantity ?? item.qty ?? "",
            hsCode: item.hsCode || item.hs_code || item.hsn || "",
            rate: item.rate ?? 0,
            vatRate:
                item.vatRate ??
                item.vat_rate ??
                item.gst_percent ??
                0,
        })),
    };
};


const toInvoiceData = (data) => ({
    quoteNumber: data.quotationNumber,
    invoiceNumber: data.quotationNumber,
    issueDate: data.quotationDate,
    dueDate: data.dueDate,
    paymentStatus: data.paymentStatus || "Draft",

    companyName: String(data.from || "Tungston Labs"),
    companyAddress: String(data.companyAddress || ""),
    phone: String(data.phoneNumber || ""),
    email: String(data.email || ""),

    billToName: String(data.billTo || "Company/Client Name"),
    billToAddress: String(data.clientAddress || ""),

    subTotal: formatCurrency(data.totals.subtotal),
    gstTotal: formatCurrency(data.totals.vat),
    discount: formatCurrency(data.totals.discount),
    roundOff: formatCurrency(0),
    grandTotal: formatCurrency(data.totals.total),

    website: "https://tungstonlabs.com/",

    items: data.items.map((item, index) => {
        const amount =
            Number(item.quantity) * Number(item.rate) || 0;

        const vatAmount =
            (amount * Number(item.vatRate || 0)) / 100;

        return {
            id: item.id,
            slNo: String(index + 1).padStart(2, "0"),
            particular:
                item.service ||
                item.description ||
                "-",

            qty: item.quantity || "0",
            hsn: item.hsCode || "-",
            rate: formatCurrency(item.rate),
            gstPercent: `${item.vatRate || 0}%`,
            gstAmount: formatCurrency(vatAmount),
            amount: formatCurrency(amount),
        };
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
        .filter(
            (item) =>
                item.service ||
                item.description ||
                Number(item.quantity) ||
                Number(item.rate)
        )
        .map((item) => ({
            service: item.service || item.description,
            description:
                item.description || item.service,
            quantity: Number(item.quantity) || 1,
            hs_code: item.hsCode || "",
            rate: Number(item.rate) || 0,
            vat_rate: Number(item.vatRate) || 0,
        })),

    discount: Number(data.discount) || 0,
    notes: data.notes,

    subtotal: data.totals.subtotal,
    vat: data.totals.vat,
    total_amount: data.totals.total,
});


const QuotationsList = () => {
    const dispatch = useDispatch();

    const {
        list,
        pagination,
        kpi,
        loading,
        saving,
        error,
    } = useSelector((state) => state.quotation);

    const [search, setSearch] = useState("");
    const [customer, setCustomer] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isQuotationModalOpen, setIsQuotationModalOpen] =
        useState(false);

    const [invoiceQuotation, setInvoiceQuotation] =
        useState(null);

    const [sendError, setSendError] = useState(null);

    const rowsPerPage = 10;


    useEffect(() => {
        dispatch(
            fetchQuotationList({
                page: currentPage,
                page_size: rowsPerPage,
            })
        );

        dispatch(fetchQuotationKpi());
    }, [currentPage, dispatch]);


    const quotationData = useMemo(
        () =>
            list.map((quotation) => ({
                ...quotation,

                quoteNumber:
                    quotation.quoteNumber ||
                    quotation.quotation_number ||
                    quotation.quote_number ||
                    "-",

                customer:
                    quotation.customer ||
                    quotation.client_name ||
                    quotation.bill_to ||
                    "-",

                issueDate:
                    quotation.issueDate ||
                    quotation.quotation_date ||
                    quotation.issue_date ||
                    "-",

                validTill:
                    quotation.validTill ||
                    quotation.due_date ||
                    quotation.valid_till ||
                    "-",

                quoteAmount:
                    quotation.quoteAmount ??
                    quotation.total_amount ??
                    quotation.total,

                negotiationAmount:
                    quotation.negotiationAmount ??
                    quotation.negotiation_amount,

                status:
                    quotation.status ||
                    quotation.payment_status ||
                    "Pending",
            })),
        [list]
    );


    const customerOptions = useMemo(
        () => [
            ...new Set(
                quotationData
                    .map((quotation) => quotation.customer)
                    .filter(Boolean)
            ),
        ],
        [quotationData]
    );


    const filteredData = useMemo(() => {
        const value = search.trim().toLowerCase();

        return quotationData.filter(
            (quotation) =>
                (!value ||
                    String(quotation.quoteNumber)
                        .toLowerCase()
                        .includes(value) ||
                    String(quotation.customer)
                        .toLowerCase()
                        .includes(value)) &&
                (!customer ||
                    quotation.customer === customer) &&
                (!status ||
                    quotation.status === status)
        );
    }, [
        customer,
        quotationData,
        search,
        status,
    ]);


    const totalPages = Math.max(
        1,
        pagination.totalPages ||
        Math.ceil(
            filteredData.length / rowsPerPage
        )
    );


    const paginatedData = pagination.totalPages
        ? filteredData
        : filteredData.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
        );


    const quotationCards = useMemo(
        () => [
            {
                count: formatCurrency(
                    kpi.totalValue ??
                    kpi.total_quotation_value ??
                    quotationData.reduce(
                        (sum, item) =>
                            sum +
                            Number(item.quoteAmount || 0),
                        0
                    )
                ),

                title: "Total Quotation Value",
                icon: <FiFileText size={20} />,
                backgroundColor: "#e7f5ec",
                iconColor: "#1bb36f",
            },

            {
                count: formatCurrency(
                    kpi.negotiation ??
                    kpi.negotiation_amount ??
                    quotationData.reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.negotiationAmount || 0
                            ),
                        0
                    )
                ),

                title: "Negotiation Amount",
                icon: <FiCheckCircle size={20} />,
                backgroundColor: "#e8efff",
                iconColor: "#4267d6",
            },

            {
                count: String(
                    kpi.approved ??
                    kpi.approved_quotes ??
                    quotationData.filter(
                        (item) =>
                            item.status === "Approved"
                    ).length
                ).padStart(2, "0"),

                title: "Approved Quotes",
                icon: <FiCheckCircle size={20} />,
                backgroundColor: "#e7f5ec",
                iconColor: "#1bb36f",
            },

            {
                count: String(
                    kpi.rejected ??
                    kpi.rejected_quotes ??
                    quotationData.filter(
                        (item) =>
                            item.status === "Rejected"
                    ).length
                ).padStart(2, "0"),

                title: "Rejected Quotes",
                icon: <FiXCircle size={20} />,
                backgroundColor: "#fdeaea",
                iconColor: "#d9544f",
            },

            {
                count: String(
                    kpi.pending ??
                    kpi.pending_quotes ??
                    quotationData.filter(
                        (item) =>
                            item.status === "Pending"
                    ).length
                ).padStart(2, "0"),

                title: "Pending Quotes",
                icon: <FiClock size={20} />,
                backgroundColor: "#fef1eb",
                iconColor: "#e58842",
            },
        ],
        [kpi, quotationData]
    );


    const showQuotation = (quotation) => {
        const data = normalizeQuotationData(quotation);

        setInvoiceQuotation({
            formData: data,
            invoice: toInvoiceData(data),
        });
    };


    const columns = useMemo(
        () =>
            quotationColumns({
                dispatch,
                currentPage,
                rowsPerPage,
                convertQuotation,
                fetchQuotationList,
                fetchQuotationKpi,
                fetchQuotationDetails,
                showQuotation,
                formatCurrency,
            }),
        [dispatch, currentPage, rowsPerPage]
    );


    const submitQuotation = (statusOverride = null) => {
        if (!invoiceQuotation?.formData || saving) return;

        const { formData } = invoiceQuotation;

        const validItems = (formData.items || []).filter(
            (item) =>
                item.service ||
                item.description ||
                Number(item.quantity) ||
                Number(item.rate)
        );

        if (
            !String(
                formData.quotationNumber || ""
            ).trim() ||
            !String(formData.billTo || "").trim() ||
            validItems.length === 0
        ) {
            setSendError(
                "Quotation number, customer, and at least one quotation item are required."
            );

            return;
        }

        const payload = toApiPayload(formData);

        const normalizedStatus =
            statusOverride ||
            formData.paymentStatus ||
            payload.payment_status ||
            "pending";

        const finalPayload = {
            ...payload,

            payment_status: normalizedStatus,
            status: normalizedStatus,

            quotation_number:
                formData.quotationNumber,

            quotation_date:
                formData.quotationDate,

            due_date:
                formData.dueDate,

            client_name:
                formData.billTo,

            client_address:
                formData.clientAddress,

            client_phone:
                formData.clientPhone,

            client_email:
                formData.clientEmail,

            notes:
                formData.notes,

            discount:
                Number(
                    formData.discount ??
                    payload.discount ??
                    0
                ),

            subtotal:
                Number(
                    formData.totals?.subtotal ??
                    payload.subtotal ??
                    0
                ),

            vat:
                Number(
                    formData.totals?.vat ??
                    payload.vat ??
                    0
                ),

            total_amount:
                Number(
                    formData.totals?.total ??
                    payload.total_amount ??
                    0
                ),
        };

        setSendError(null);

        dispatch(createQuotation(finalPayload))
            .unwrap()
            .then(() => {
                setInvoiceQuotation(null);

                dispatch(
                    fetchQuotationList({
                        page: currentPage,
                        page_size: rowsPerPage,
                    })
                );

                dispatch(fetchQuotationKpi());
            })
            .catch((requestError) =>
                setSendError(requestError)
            );
    };


    const handleSaveDraft = () =>
        submitQuotation("Draft");

    const handleSendQuotation = () =>
        submitQuotation("Pending");


    const handleExport = () => {
        const rows = [
            [
                "Quote Number",
                "Customer",
                "Issue Date",
                "Valid Till",
                "Quote Amount",
                "Status",
            ],

            ...filteredData.map((row) => [
                row.quoteNumber,
                row.customer,
                row.issueDate,
                row.validTill,
                row.quoteAmount,
                row.status,
            ]),
        ];

        const csv = rows
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value ?? "").replace(
                                /"/g,
                                '""'
                            )}"`
                    )
                    .join(",")
            )
            .join("\n");

        const url = URL.createObjectURL(
            new Blob([csv], {
                type: "text/csv;charset=utf-8;",
            })
        );

        const link = document.createElement("a");

        link.href = url;
        link.download = "quotations.csv";
        link.click();

        URL.revokeObjectURL(url);
    };


    if (invoiceQuotation) {
        return (
            <QuotationInvoice
                quotation={invoiceQuotation.invoice}
                items={invoiceQuotation.invoice.items}
                onCancel={() => {
                    setSendError(null);
                    setInvoiceQuotation(null);
                }}
                onDownload={handleExport}
                onSaveDraft={handleSaveDraft}
                onSend={handleSendQuotation}
                error={sendError}
            />
        );
    }


    if (isQuotationModalOpen) {
        return (
            <GenerateQuotationModal
                isOpen={isQuotationModalOpen}
                onClose={() =>
                    setIsQuotationModalOpen(false)
                }
                onPreview={(data) => {
                    const normalized =
                        normalizeQuotationData(data);

                    setInvoiceQuotation({
                        formData: normalized,
                        invoice: toInvoiceData(normalized),
                    });

                    setIsQuotationModalOpen(false);
                }}
            />
        );
    }


    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                background: "#f5f6fa",
                padding: "24px",
            }}
        >
            <ReusableHeader
                title="Quotations"
                breadcrumbs={[
                    "Dashboard",
                    "Sales",
                    "Quotations",
                ]}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                    }}
                >
                    <HeaderButton
                        $variant="excel"
                        onClick={handleExport}
                    >
                        <FiDownload /> EXPORT
                    </HeaderButton>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            background: "#fff",
                            border: "1px solid #dfe3ea",
                            borderRadius: 6,
                            height: 40,
                            padding: "0 12px 0 14px",
                            minWidth: 190,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 12,
                                color: "#333",
                                whiteSpace: "nowrap",
                            }}
                        >
                            01 Apr 2026 - 30 Apr 2026
                        </span>

                        <span
                            style={{
                                marginLeft: 10,
                                fontSize: 14,
                                color: "#5b6478",
                            }}
                        >
                            <FiCalendar />
                        </span>
                    </div>

                    <HeaderButton
                        $variant="orange"
                        onClick={() =>
                            setIsQuotationModalOpen(true)
                        }
                    >
                        <FiFileText /> GENERATE QUOTE
                    </HeaderButton>
                </div>
            </ReusableHeader>


            <div style={{ marginTop: 12 }}>
                <StatsCards
                    cards={quotationCards}
                    loading={loading}
                />
            </div>


            {error && (
                <div
                    role="alert"
                    style={{
                        margin: "16px 0",
                        color: "#b42318",
                    }}
                >
                    Unable to load quotations. Please try again.
                </div>
            )}


            <div
                style={{
                    marginTop: 18,
                    marginBottom: 12,
                }}
            >
                <ReusableFilter
                    search={search}
                    onSearch={(value) => {
                        setSearch(value);
                        setCurrentPage(1);
                    }}
                    department={customer}
                    departments={customerOptions}
                    onDepartment={(value) => {
                        setCustomer(value);
                        setCurrentPage(1);
                    }}
                    status={status}
                    statuses={[
                        "Approved",
                        "Pending",
                        "Rejected",
                    ]}
                    onStatus={(value) => {
                        setStatus(value);
                        setCurrentPage(1);
                    }}
                    showSearch
                    showDepartment
                    showStatus
                    rightButton={
                        <HeaderButton
                            $variant="orange"
                            onClick={() =>
                                setCurrentPage(1)
                            }
                        >
                            Filter
                        </HeaderButton>
                    }
                />
            </div>


            <ReusableTable
                columns={columns}
                data={paginatedData}
                loading={loading}
            />


            <div style={{ marginTop: 18 }}>
                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalRecords={pagination.totalItems}
                />
            </div>
        </div>
    );
};


export default QuotationsList;