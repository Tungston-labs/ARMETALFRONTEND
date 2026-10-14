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
    ExportButton,
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
} from "./Recievables.styles";

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

const Recievables = () => {
    const [search, setSearch] = useState("");
    const [customer, setCustomer] = useState("all");
    const [status, setStatus] = useState("");
    const rowsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const statsCards = [
        {
            count: "3,684",
            title: "Total Receivable",
            icon: <TbFileInvoice />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: "1,240",
            title: "Not yet Due",
            icon: <MdOutlineInventory2 />,
            backgroundColor: "#F1E8FF",
            iconColor: "#923CFF",
        },
        {
            count: "986",
            title: "Overdue",
            icon: <MdOutlineAccountBalance />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: "842",
            title: "Over 60 days late",
            icon: <TbArrowUp />,
            backgroundColor: "#FFF1E5",
            iconColor: "#FF7200",
        },
        {
            count: "616",
            title: "Customers Overdue",
            icon: <TbArrowDown />,
            backgroundColor: "#FFE8E8",
            iconColor: "#FF3131",
        },
    ];

    const totalPages = Math.ceil(
        employeeData.length / rowsPerPage
    );

    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleCustomerChange = (value) => {
        setCustomer(value);
        setCurrentPage(1);
    };

    const handleExportExcel = () => {
        console.log("Export Receivables to Excel");
    };

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;

        return employeeData.slice(
            start,
            start + rowsPerPage
        );
    }, [currentPage]);

    return (
        <div style={{ padding: 20 }}>

            <ReusableHeader
                title="Receivables"
                breadcrumbs={[
                    "Accounting",
                    "Receivables",
                ]}
            >
                <DateRangeWrapper>
                    <DatePickerContainer>
                        <DateInput
                            type="date"
                            aria-label="Start date"
                        />

                        <DateSeparator>-</DateSeparator>

                        <DateInput
                            type="date"
                            aria-label="End date"
                        />
                    </DatePickerContainer>
                </DateRangeWrapper>

                <ExportButton
                    type="button"
                    onClick={handleExportExcel}
                >
                    <FiDownload />
                    Export
                </ExportButton>
            </ReusableHeader>

            <StatsCards cards={statsCards} />

            <ReusableFilter
                search={search}
                onSearch={handleSearchChange}
                searchPlaceholder="Search Customer"
                showSearch
                status={status}
                statuses={[
                    "Present",
                    "Absent",
                    "On Leave",
                ]}
                onStatus={setStatus}
                showStatus
                filters={[
                    {
                        key: "customer",
                        value: customer,
                        onChange: handleCustomerChange,
                        options: [
                            {
                                label: "All Customers",
                                value: "all",
                            },
                            {
                                label: "ABC Trading LLC",
                                value: "abc_trading",
                            },
                            {
                                label: "Al Noor Trading",
                                value: "al_noor",
                            },
                            {
                                label: "Gulf Supplies",
                                value: "gulf_supplies",
                            },
                            {
                                label: "Saudi Industrial Co.",
                                value: "saudi_industrial",
                            },
                        ],
                        placeholder: "All Customers",
                    },
                ]}
            />

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

export default Recievables;