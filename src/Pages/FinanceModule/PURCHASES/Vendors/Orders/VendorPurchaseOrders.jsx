import React, { useMemo, useState } from "react";
import {
    FiFileText,
    FiClock,
    FiCheckCircle,
    FiXCircle,
} from "react-icons/fi";

import {
    employeeColumns,
    employeeData,
} from "../../../../../Components/ReusableTable/dummydata";

import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";


const VendorPurchaseOrders = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const rowsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(
        employeeData.length / rowsPerPage
    );

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;

        return employeeData.slice(
            start,
            start + rowsPerPage
        );
    }, [currentPage]);

    // Stats Cards
    const statsCards = [
        {
            title: "Total Purchase Orders",
            count: employeeData.length,
            icon: <FiFileText />,
            backgroundColor: "#EEF2FF",
            iconColor: "#4F46E5",
        },
        {
            title: "Pending Orders",
            count: 0,
            icon: <FiClock />,
            backgroundColor: "#FFF7ED",
            iconColor: "#F59E0B",
        },
        {
            title: "Approved Orders",
            count: 0,
            icon: <FiCheckCircle />,
            backgroundColor: "#ECFDF5",
            iconColor: "#10B981",
        },
        {
            title: "Rejected Orders",
            count: 0,
            icon: <FiXCircle />,
            backgroundColor: "#FEF2F2",
            iconColor: "#EF4444",
        },
    ];

    return (
        <>
            <StatsCards cards={statsCards} />

            <ReusableFilter
                search={search}
                onSearch={setSearch}
                status={status}
                statuses={[
                    "Present",
                    "Absent",
                    "On Leave",
                ]}
                onStatus={setStatus}
                showSearch
                showStatus
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
        </>
    );
};

export default VendorPurchaseOrders;