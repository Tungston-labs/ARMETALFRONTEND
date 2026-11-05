import React from "react";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import { useNavigate } from "react-router-dom";
import {
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
} from "./SalesInvoices.styles";
import { useSalesInvoices,
    STATUS_LABELS,
    DOCUMENT_STATUS_OPTIONS,
    DUE_DATE_OPTIONS,
} from "./UseSalesInvoices";
import ReusableConfirmModal from "../../../../Components/modals/ReusableConfirmModal";

const SalesInvoices = () => {
    const navigate = useNavigate();

    const {
        salesInvoiceColumns,
        paginatedData,
        totalRecords,
        totalPages,

        loading,
        error,
        successMessage,

        search,
        status,
        documentStatus,
        dueDate,
        startDate,
        endDate,
        currentPage,
        salesOrderStats,
        deleteModal,
        handleSearch,
        handleStatus,
        handleDocumentStatus,
        handleDueDate,
        handleStartDateChange,
        handleEndDateChange,
        setCurrentPage,
        handleDeleteCancel,
        handleDeleteConfirm,
    } = useSalesInvoices();

    return (
        <div style={{ padding: 20 }}>
            {/* HEADER */}

            <ReusableHeader
                title="Invoices"
                breadcrumbs={["Sales", "Invoices"]}
                buttonText="+ ADD NEW INVOICE"
                onButtonClick={() => navigate("/sales/invoices/add")}
            >
                <DateRangeWrapper>
                    <DatePickerContainer>
                        <DateInput
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            max={endDate || undefined}
                            aria-label="Start date"
                        />

                        <DateSeparator>-</DateSeparator>

                        <DateInput
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            min={startDate || undefined}
                            aria-label="End date"
                        />
                    </DatePickerContainer>
                </DateRangeWrapper>
            </ReusableHeader>

            {/* TRANSIENT ERROR / SUCCESS MESSAGES */}

            {error && (
                <div
                    style={{
                        background: "#FDECEC",
                        color: "#E5484D",
                        padding: "8px 14px",
                        borderRadius: 6,
                        marginBottom: 12,
                        fontSize: 13,
                    }}
                >
                    {typeof error === "string"
                        ? error
                        : error?.message ||
                          error?.detail ||
                          "Something went wrong."}
                </div>
            )}

            {successMessage && (
                <div
                    style={{
                        background: "#E8F8EF",
                        color: "#22A06B",
                        padding: "8px 14px",
                        borderRadius: 6,
                        marginBottom: 12,
                        fontSize: 13,
                    }}
                >
                    {successMessage}
                </div>
            )}

            {/* STATS */}

            <StatsCards cards={salesOrderStats} />

            {/* FILTERS */}

            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                searchPlaceholder="Search Invoice/Customer/Quote"
                showSearch

                status={status}
                statuses={STATUS_LABELS}
                onStatus={handleStatus}
                showStatus

                filters={[
                    {
                        key: "documentStatus",
                        value: documentStatus,
                        onChange: handleDocumentStatus,
                        options: DOCUMENT_STATUS_OPTIONS,
                        placeholder: "All Invoice Status",
                    },
                    {
                        key: "dueDate",
                        value: dueDate,
                        onChange: handleDueDate,
                        options: DUE_DATE_OPTIONS,
                        placeholder: "All Due Date",
                    },
                ]}
            />

            {/* TABLE */}

            {loading ? (
                <div style={{ padding: 24, textAlign: "center" }}>
                    Loading invoices…
                </div>
            ) : (
                <ReusableTable
                    columns={salesInvoiceColumns}
                    data={paginatedData}
                />
            )}

            {/* PAGINATION */}

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={totalRecords}
                onPageChange={setCurrentPage}
            />

            <ReusableConfirmModal
                show={deleteModal.isOpen}
                title="Delete Invoice"
                message={
                    deleteModal.invoice
                        ? `Are you sure you want to delete invoice ${deleteModal.invoice.invoice_number}?`
                        : "Are you sure you want to delete this invoice?"
                }
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="danger"
                loadingText="Deleting..."
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default SalesInvoices;
