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
} from "./Payables.styles";

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

const Payables = () => {
    const [search, setSearch] = useState("");
const [vendor, setVendor] = useState("all");
    const [status, setStatus] = useState("");
    const rowsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const statsCards = [
        {
            count: "3,684",
            title: "Total payable",
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
            title: "Overdue to vendors",
            icon: <MdOutlineAccountBalance />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: "842",
            title: "Due in next 14 days",
            icon: <TbArrowUp />,
            backgroundColor: "#FFF1E5",
            iconColor: "#FF7200",
        },
        {
            count: "616",
            title: "Vendors overdue",
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

const handleVendorChange = (value) => {
    setVendor(value);
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
                    "Payables",
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
                searchPlaceholder="Search Vendor"
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
            key: "vendor",
            value: vendor,
            onChange: handleVendorChange,
            options: [
                {
                    label: "All Vendors",
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
            placeholder: "All Vendors",
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

export default Payables;