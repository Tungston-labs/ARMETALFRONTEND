import React, { useMemo, useState } from "react";
import {
    employeeColumns,
    employeeData,
} from "../../../../Components/ReusableTable/dummydata";
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
import {
    TbFileInvoice,
    TbArrowUp,
    TbArrowDown,
} from "react-icons/tb";
import {
    MdOutlineInventory2,
    MdOutlineAccountBalance,
} from "react-icons/md";
import { FiDownload } from "react-icons/fi";

const GeneralLedger = () => {
    const [search, setSearch] = useState("");
const [account, setAccount] = useState("all");
const [type, setType] = useState("all");
const [source, setSource] = useState("all");
    const rowsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);


    const statsCards = [
        {
            count: "3,684",
            title: "Total Lines Posted",
            icon: <TbFileInvoice />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: "1,240",
            title: "Asset Lines",
            icon: <MdOutlineInventory2 />,
            backgroundColor: "#F1E8FF",
            iconColor: "#923CFF",
        },
        {
            count: "986",
            title: "Liability Lines",
            icon: <MdOutlineAccountBalance />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: "842",
            title: "Income Lines",
            icon: <TbArrowUp />,
            backgroundColor: "#FFF1E5",
            iconColor: "#FF7200",
        },
        {
            count: "616",
            title: "Expense Lines",
            icon: <TbArrowDown />,
            backgroundColor: "#FFE8E8",
            iconColor: "#FF3131",
        },
    ];

    const totalPages = Math.ceil(
        employeeData.length / rowsPerPage
    );

    const handleExportExcel = () => {
        console.log("Export General Ledger to Excel");
    };

    const handleExportPDF = () => {
        console.log("Export General Ledger to PDF");
    };
    const paginatedData = useMemo(() => {

        const start =
            (currentPage - 1) * rowsPerPage;

        return employeeData.slice(
            start,
            start + rowsPerPage
        );

    }, [currentPage]);

const handleAccountChange = (value) => {
    setAccount(value);
};

const handleTypeChange = (value) => {
    setType(value);
};

const handleSourceChange = (value) => {
    setSource(value);
};
    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="General Ledger"
                breadcrumbs={[
                    "Accounting",
                    "General Ledger",]} 
                     >
                   <DateRangeWrapper>
                                    <DatePickerContainer>
                                        <DateInput
                                            type="date"
                                            // value={startDate}
                                            // onChange={handleStartDateChange}
                                            // max={endDate || undefined}
                                            aria-label="Start date"
                                        />
                
                                        <DateSeparator>-</DateSeparator>
                
                                        <DateInput
                                            type="date"
                                            // value={endDate}
                                            // onChange={handleEndDateChange}
                                            // min={startDate || undefined}
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
    // onSearch={handleSearchChange}
    searchPlaceholder="Search Account or Description"

    showSearch

    filters={[
        {
            key: "account",
            value: account,
            onChange: handleAccountChange,
            options: [
                { label: "Accounts Receivable", value: "accounts_receivable" },
                { label: "Accounts Payable", value: "accounts_payable" },
                { label: "Cash", value: "cash" },
                { label: "Bank", value: "bank" },
            ],
            placeholder: "All Accounts",
        },
        {
            key: "type",
            value: type,
            onChange: handleTypeChange,
            options: [

                { label: "Asset", value: "asset" },
                { label: "Liability", value: "liability" },
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
            ],
            placeholder: "All Types",
        },
        {
            key: "source",
            value: source,
            onChange: handleSourceChange,
            options: [
                { label: "Invoice", value: "invoice" },
                { label: "Purchase", value: "purchase" },
                { label: "Payment", value: "payment" },
                { label: "Journal", value: "journal" },
                { label: "Manual", value: "manual" },
            ],
            placeholder: "All Sources",
        },
    ]}
/>

            <BalanceBanner>

                <BalanceStatus>
                    ✓ Books are balanced
                </BalanceStatus>

                <BalanceAmount>
                    Total Debit: SAR 2,841,620.30
                    &nbsp;&nbsp;=&nbsp;&nbsp;
                    Total Credit: SAR 2,841,620.30
                </BalanceAmount>

            </BalanceBanner>

            <ReusableTable
                columns={employeeColumns}
                data={paginatedData}
            />

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

        </div>
    );
};

export default GeneralLedger;