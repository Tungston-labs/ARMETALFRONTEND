// GeneralLedger.jsx  -> ONLY UI (all logic comes from the hook)

import React, { useMemo } from "react";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import {
    BalanceBanner,
    BalanceStatus,
    BalanceAmount,
    ExportButton,
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
} from "./GeneralLedger.styles";
import { TbFileInvoice, TbArrowUp, TbArrowDown } from "react-icons/tb";
import { MdOutlineInventory2, MdOutlineAccountBalance } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import useGeneralLedger from "./Usegeneralledger";

const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const ledgerColumns = [
    { accessor: "transaction_date", header: "Date", width: "110px" },
    { accessor: "customer_name", header: "Customer" },
    { accessor: "transaction_type_display", header: "Type" },
    { accessor: "reference_number", header: "Reference" },
    { accessor: "description", header: "Description" },
    { accessor: "debit", header: "Debit", sortable: false },
    { accessor: "credit", header: "Credit", sortable: false },
    { accessor: "balance", header: "Balance", sortable: false },
];

const typeOptions = [
    { label: "Opening Balance", value: "opening_balance" },
    { label: "Invoice", value: "invoice" },
    { label: "Payment", value: "payment" },
    { label: "Credit Note", value: "credit_note" },
    { label: "Adjustment", value: "adjustment" },
];

const sourceOptions = [
    { label: "Invoice", value: "invoice" },
    { label: "Payment", value: "payment" },
    { label: "Opening Balance", value: "opening_balance" },
    { label: "Manual", value: "manual" },
];

const GeneralLedger = () => {
    const {
        ledgerEntries,
        dashboardSummary,
        accountOptions,
        totalPages,
        isInitialLoading,
        errorMessage,
        search,
        account,
        type,
        source,
        startDate,
        endDate,
        currentPage,
        handleSearchChange,
        handleAccountChange,
        handleTypeChange,
        handleSourceChange,
        handleStartDateChange,
        handleEndDateChange,
        handleExportExcel,
        handleExportPDF,
        setCurrentPage,
    } = useGeneralLedger();

    const statsCards = [
        {
            count: formatAmount(dashboardSummary?.total_receivable),
            title: "Total Receivable",
            icon: <MdOutlineAccountBalance />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: formatAmount(dashboardSummary?.total_invoice),
            title: "Total Invoice",
            icon: <TbFileInvoice />,
            backgroundColor: "#F1E8FF",
            iconColor: "#923CFF",
        },
        {
            count: formatAmount(dashboardSummary?.total_collection),
            title: "Total Collection",
            icon: <TbArrowDown />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: formatAmount(dashboardSummary?.total_credit),
            title: "Total Credit",
            icon: <MdOutlineInventory2 />,
            backgroundColor: "#FFF1E5",
            iconColor: "#FF7200",
        },
        {
            count: formatAmount(dashboardSummary?.overdue_amount),
            title: "Overdue Amount",
            icon: <TbArrowUp />,
            backgroundColor: "#FFE8E8",
            iconColor: "#FF3131",
        },
    ];

    const tableData = useMemo(
        () =>
            ledgerEntries.map((row) => ({
                ...row,
                debit: formatAmount(row.debit),
                credit: formatAmount(row.credit),
                balance: formatAmount(row.balance),
            })),
        [ledgerEntries]
    );

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="General Ledger"
                breadcrumbs={["Accounting", "General Ledger"]}
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

                <ExportButton type="button" onClick={handleExportExcel}>
                    <FiDownload />
                    Export Excel
                </ExportButton>

                <ExportButton type="button" onClick={handleExportPDF}>
                    <FiDownload />
                    Export PDF
                </ExportButton>
            </ReusableHeader>

            <StatsCards cards={statsCards} />

            <ReusableFilter
                search={search}
                onSearch={handleSearchChange}
                searchPlaceholder="Search customer, reference or description"
                showSearch
                filters={[
                    {
                        key: "account",
                        value: account,
                        onChange: handleAccountChange,
                        options: accountOptions,
                        placeholder: "All Accounts",
                    },
                    {
                        key: "type",
                        value: type,
                        onChange: handleTypeChange,
                        options: typeOptions,
                        placeholder: "All Types",
                    },
                    {
                        key: "source",
                        value: source,
                        onChange: handleSourceChange,
                        options: sourceOptions,
                        placeholder: "All Sources",
                    },
                ]}
            />

            <BalanceBanner>
                <BalanceStatus> ✓ Books are balanced</BalanceStatus>

                <BalanceAmount>
                    Total Invoice: SAR {formatAmount(dashboardSummary?.total_invoice)}
                    &nbsp;&nbsp;-&nbsp;&nbsp;
                    Collection: SAR {formatAmount(dashboardSummary?.total_collection)}
                    &nbsp;&nbsp;=&nbsp;&nbsp;
                    Receivable: SAR {formatAmount(dashboardSummary?.total_receivable)}
                </BalanceAmount>
            </BalanceBanner>

            {errorMessage && (
                <div style={{ color: "#FF3131", margin: "10px 0" }}>{errorMessage}</div>
            )}

            {isInitialLoading ? (
                <div style={{ padding: 20 }}>Loading...</div>
            ) : (
                <ReusableTable columns={ledgerColumns} data={tableData} />
            )}

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default GeneralLedger;