import React, { useMemo, useState } from "react";
import {
    FiShoppingCart,
    FiDollarSign,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiDownload,
} from "react-icons/fi";

import {
    employeeColumns,
    employeeData,
} from "../../../../Components/ReusableTable/dummydata";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import ProductServiceModal from "./modal/AddingRecurringBilling";

import {
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
    ExportButton,
} from "./RecurringBilling.styles";


const getCurrentMonthRange = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    return {
        start: formatDate(firstDay),
        end: formatDate(lastDay),
    };
};


const RecurringBilling = () => {
    const currentMonth = getCurrentMonthRange();

    /* ===============================
       FILTER STATES
    =============================== */

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [billingCycle, setBillingCycle] = useState("");
    const [service, setService] = useState("");
    const [type, setType] = useState("");
    const [renewalDate, setRenewalDate] = useState("");

    const [startDate, setStartDate] = useState(
        currentMonth.start
    );

    const [endDate, setEndDate] = useState(
        currentMonth.end
    );

    /* ===============================
       PAGINATION
    =============================== */

    const rowsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);

    /* ===============================
       MODAL STATE
    =============================== */

    const [showProductServiceModal, setShowProductServiceModal] =
        useState(false);

    /* ===============================
       STATS
    =============================== */

    const salesOrderStats = [
        {
            title: "Total Orders",
            count: employeeData.length,
            icon: <FiShoppingCart />,
            backgroundColor: "#E8F1FF",
            iconColor: "#3478F6",
        },
        {
            title: "Total Amount",
            count: "SAR 0.00",
            icon: <FiDollarSign />,
            backgroundColor: "#FFF4E5",
            iconColor: "#F59E0B",
        },
        {
            title: "Completed Orders",
            count: 0,
            icon: <FiCheckCircle />,
            backgroundColor: "#E8F8EF",
            iconColor: "#22A06B",
        },
        {
            title: "Pending Orders",
            count: 0,
            icon: <FiClock />,
            backgroundColor: "#FFF4E5",
            iconColor: "#F59E0B",
        },
        {
            title: "Cancelled Orders",
            count: 0,
            icon: <FiXCircle />,
            backgroundColor: "#FDECEC",
            iconColor: "#E5484D",
        },
    ];

    /* ===============================
       PAGINATION
    =============================== */

    const totalPages = Math.ceil(
        employeeData.length / rowsPerPage
    );

    const paginatedData = useMemo(() => {
        const start =
            (currentPage - 1) * rowsPerPage;

        return employeeData.slice(
            start,
            start + rowsPerPage
        );
    }, [currentPage]);

    /* ===============================
       DATE HANDLERS
    =============================== */

    const handleStartDateChange = (e) => {
        const value = e.target.value;

        if (!value) {
            setStartDate("");
            return;
        }

        setStartDate(value);
        setCurrentPage(1);

        if (endDate && value > endDate) {
            setEndDate(value);
        }
    };

    const handleEndDateChange = (e) => {
        const value = e.target.value;

        if (!value) {
            setEndDate("");
            return;
        }

        if (startDate && value < startDate) {
            return;
        }

        setEndDate(value);
        setCurrentPage(1);
    };

    /* ===============================
       EXPORT
    =============================== */

    const handleExport = () => {
        console.log("Export Recurring Billing", {
            startDate,
            endDate,
            search,
            status,
            customer,
            billingCycle,
            service,
            renewalDate,
        });

        // Add Excel/PDF export logic here
    };

    /* ===============================
       SAVE PRODUCT / SERVICE
    =============================== */

    const handleSaveProductService = (data) => {
        console.log(
            "Recurring Billing Data:",
            data
        );

        /*
         * API / Redux integration goes here.
         *
         * Example:
         *
         * dispatch(addRecurringBilling(data))
         *     .unwrap()
         *     .then(() => {
         *         setShowProductServiceModal(false);
         *     });
         */

        setShowProductServiceModal(false);
    };

    return (
        <>
            <div style={{ padding: 20 }}>

                {/* =====================================
                    HEADER
                ===================================== */}

                <ReusableHeader
                    title="Recurring Billing"
                    breadcrumbs={[
                        "Sales",
                        "Recurring Billing",
                    ]}
                    buttonText="+ ADD NEW RECURRING BILLING"
                    onButtonClick={() =>
                        setShowProductServiceModal(true)
                    }
                >
                    {/* EXPORT */}

                    <ExportButton
                        type="button"
                        onClick={handleExport}
                    >
                        <FiDownload />
                        <span>Export</span>
                    </ExportButton>

                    {/* DATE RANGE */}

                    <DateRangeWrapper>
                        <DatePickerContainer>
                            <DateInput
                                type="date"
                                value={startDate}
                                onChange={
                                    handleStartDateChange
                                }
                                max={
                                    endDate ||
                                    undefined
                                }
                                aria-label="Start date"
                            />

                            <DateSeparator>
                                -
                            </DateSeparator>

                            <DateInput
                                type="date"
                                value={endDate}
                                onChange={
                                    handleEndDateChange
                                }
                                min={
                                    startDate ||
                                    undefined
                                }
                                aria-label="End date"
                            />
                        </DatePickerContainer>
                    </DateRangeWrapper>
                </ReusableHeader>


                {/* =====================================
                    STATS
                ===================================== */}

                <StatsCards
                    cards={salesOrderStats}
                />


                {/* =====================================
                    FILTERS
                ===================================== */}

                <ReusableFilter
                    search={search}
                    onSearch={(value) => {
                        setSearch(value);
                        setCurrentPage(1);
                    }}
                    searchPlaceholder="Search Order"
                    showSearch

                    status={status}
                    statuses={[
                        "Completed",
                        "Pending",
                        "Cancelled",
                    ]}
                    onStatus={(value) => {
                        setStatus(value);
                        setCurrentPage(1);
                    }}
                    showStatus

                    filters={[
                        {
                            key: "customer",
                            value: customer,
                            onChange: (value) => {
                                setCustomer(value);
                                setCurrentPage(1);
                            },
                            options: [
                                {
                                    label: "ABC Trading",
                                    value: "ABC Trading",
                                },
                                {
                                    label: "Riyadh Tech",
                                    value: "Riyadh Tech",
                                },
                                {
                                    label: "Al Noor Company",
                                    value: "Al Noor Company",
                                },
                                {
                                    label: "Saudi Solutions",
                                    value: "Saudi Solutions",
                                },
                            ],
                            placeholder: "All Customer",
                        },

                        {
                            key: "billingCycle",
                            value: billingCycle,
                            onChange: (value) => {
                                setBillingCycle(value);
                                setCurrentPage(1);
                            },
                            options: [
                                {
                                    label: "Monthly",
                                    value: "monthly",
                                },
                                {
                                    label: "Quarterly",
                                    value: "quarterly",
                                },
                                {
                                    label: "Half Yearly",
                                    value: "half_yearly",
                                },
                                {
                                    label: "Yearly",
                                    value: "yearly",
                                },
                            ],
                            placeholder:
                                "All Billing Cycle",
                        },

                        {
                            key: "service",
                            value: service,
                            onChange: (value) => {
                                setService(value);
                                setCurrentPage(1);
                            },
                            options: [
                                {
                                    label: "Web Development",
                                    value: "web_development",
                                },
                                {
                                    label: "App Development",
                                    value: "app_development",
                                },
                                {
                                    label: "UI/UX Design",
                                    value: "ui_ux_design",
                                },
                                {
                                    label: "Cloud Services",
                                    value: "cloud_services",
                                },
                            ],
                            placeholder:
                                "All Services",
                        },

                        {
                            key: "renewalDate",
                            value: renewalDate,
                            onChange: (value) => {
                                setRenewalDate(value);
                                setCurrentPage(1);
                            },
                            options: [
                                {
                                    label: "Renewing Today",
                                    value: "today",
                                },
                                {
                                    label: "Next 7 Days",
                                    value: "next_7_days",
                                },
                                {
                                    label: "Next 30 Days",
                                    value: "next_30_days",
                                },
                                {
                                    label: "Renewed",
                                    value: "renewed",
                                },
                            ],
                            placeholder:
                                "All Renewal Date",
                        },
                    ]}
                />


                {/* =====================================
                    TABLE
                ===================================== */}

                <ReusableTable
                    columns={employeeColumns}
                    data={paginatedData}
                />


                {/* =====================================
                    PAGINATION
                ===================================== */}

                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>


            {/* =========================================
                PRODUCT / SERVICE MODAL
            ========================================= */}

            <ProductServiceModal
                isOpen={showProductServiceModal}
                onClose={() =>
                    setShowProductServiceModal(false)
                }
                onSubmit={
                    handleSaveProductService
                }
            />
        </>
    );
};

export default RecurringBilling;