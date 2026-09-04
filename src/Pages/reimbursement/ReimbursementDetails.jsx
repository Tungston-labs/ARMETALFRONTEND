import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../Redux/departmentSlice";

import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../Components/StatsCards/StatsCards";

import {
    fetchReimbursementsByDepartment,
    updateReimbursementStatus,
    fetchReimbursementDetail,
} from "../../services/reimbursement";

import {
    FiFileText,
    FiCheckCircle,
    FiClock,
    FiXCircle,
} from "react-icons/fi";

const ROWS_PER_PAGE = 20;

const mapRow = (item) => {
    const expenseDateVal = item.date || item.expense_date || item.expenseDate || item.date_of_expense || "";
    const submittedDateVal = item.created_at || item.submitted_date || item.submittedDate || item.date || "";

    return {
        id: item.id,
        employeeName:
            item.employee_name || item.employee?.name || item.employee || "—",
        reimbursementType:
            item.expense_category || item.reimbursement_type || item.type || item.category || "—",
        amount: item.amount ?? item.total_amount ?? 0,
        date: expenseDateVal || submittedDateVal,
        expenseDate: expenseDateVal,
        submittedDate: submittedDateVal,
        description: item.note || item.description || "",
        status: item.status || "Pending",
        images: item.images || [],
    };
};

/* =================================================
   Reimbursement Detail Modal Component
================================================= */
const ReimbursementDetailModal = ({ id, onClose }) => {
    const [reimbursement, setReimbursement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNote, setShowNote] = useState(false);

    useEffect(() => {
        const loadDetail = async () => {
            setLoading(true);
            try {
                const data = await fetchReimbursementDetail(id);
                setReimbursement(data);
            } catch (e) {
                console.error(e);
                setError("Failed to fetch reimbursement details.");
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            loadDetail();
        }
    }, [id]);

    const formatDate = (date) => {
        if (!date) return "—";
        const d = new Date(date);
        if (isNaN(d.getTime())) return date;
        const day = d.getDate();
        const month = d.toLocaleString("en-US", { month: "long" });
        const year = d.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    width: "90%",
                    maxWidth: "600px",
                    maxHeight: "85vh",
                    overflowY: "auto",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    animation: "fadeIn 0.3s ease-out",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #eef0f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#1e1e1e", fontFamily: "Poppins, sans-serif" }}>
                        Reimbursement Details
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#999",
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: "20px", flex: 1 }}>
                    {loading && <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>Loading details...</p>}
                    
                    {!loading && error && (
                        <p style={{ color: "red", fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>{error}</p>
                    )}

                    {!loading && !error && reimbursement && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: "Poppins, sans-serif" }}>
                            {/* Employee Info */}
                            <div style={{ background: "#f8f9fa", padding: "16px", borderRadius: "8px" }}>
                                <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#333" }}>
                                    Employee Information
                                </h4>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <img
                                        src={
                                            reimbursement.profile_pic ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                reimbursement.employee_name || ""
                                            )}&background=random`
                                        }
                                        alt="profile"
                                        style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                                    />
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <div style={{ fontSize: "13px", color: "#444" }}>
                                            <span style={{ fontWeight: "500", color: "#666" }}>Name: </span>
                                            {reimbursement.employee_name || "—"}
                                        </div>
                                        <div style={{ fontSize: "13px", color: "#444" }}>
                                            <span style={{ fontWeight: "500", color: "#666" }}>ID: </span>
                                            {reimbursement.employee_id || "—"}
                                        </div>
                                        <div style={{ fontSize: "13px", color: "#444" }}>
                                            <span style={{ fontWeight: "500", color: "#666" }}>Department: </span>
                                            {reimbursement.department?.name || "—"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Info */}
                            <div>
                                <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#333" }}>
                                    Expense Information
                                </h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    <div style={{ fontSize: "13px", color: "#444" }}>
                                        <span style={{ fontWeight: "500", color: "#666" }}>Category: </span>
                                        <span style={{ textTransform: "uppercase" }}>{reimbursement.expense_category || "—"}</span>
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#444" }}>
                                        <span style={{ fontWeight: "500", color: "#666" }}>Amount: </span>
                                        <span style={{ fontWeight: "600", color: "#2878FF" }}>
                                            ₹{Number(reimbursement.amount || 0).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#444" }}>
                                        <span style={{ fontWeight: "500", color: "#666" }}>Expense Date: </span>
                                        {formatDate(reimbursement.date)}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#444" }}>
                                        <span style={{ fontWeight: "500", color: "#666" }}>Submitted Date: </span>
                                        {formatDate(reimbursement.created_at)}
                                    </div>
                                </div>
                            </div>

                            {/* Description Note */}
                            <div style={{ borderTop: "1px solid #eef0f5", paddingTop: "16px" }}>
                                <div
                                    onClick={() => setShowNote(!showNote)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        color: "#333",
                                    }}
                                >
                                    <span style={{ flex: 1 }}>Description / Note</span>
                                    <span>{showNote ? "▲" : "▼"}</span>
                                </div>
                                {showNote && (
                                    <div
                                        style={{
                                            marginTop: "8px",
                                            background: "#fdfdfd",
                                            border: "1px solid #eef0f5",
                                            borderRadius: "6px",
                                            padding: "10px 12px",
                                            fontSize: "12px",
                                            color: "#555",
                                            lineHeight: "1.5",
                                        }}
                                    >
                                        {reimbursement.note || "No notes provided."}
                                    </div>
                                )}
                            </div>

                            {/* Bills Uploaded */}
                            <div style={{ borderTop: "1px solid #eef0f5", paddingTop: "16px" }}>
                                <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#333" }}>
                                    Bills / Receipts Uploaded
                                </h4>
                                {reimbursement.images && reimbursement.images.length > 0 ? (
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px" }}>
                                        {reimbursement.images.map((bill) => (
                                            <a
                                                key={bill.id}
                                                href={bill.image}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    border: "1px solid #eef0f5",
                                                    borderRadius: "6px",
                                                    overflow: "hidden",
                                                    display: "block",
                                                    height: "100px",
                                                }}
                                            >
                                                <img
                                                    src={bill.image}
                                                    alt="bill"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>No bills uploaded.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: "12px 20px",
                        borderTop: "1px solid #eef0f5",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            background: "#2878FF",
                            color: "#fff",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "500",
                            cursor: "pointer",
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReimbursementDetails = () => {
    const { id: departmentId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReimbursementId, setSelectedReimbursementId] = useState(null);

    const { list: departmentList = [] } = useSelector((state) => state.departments);

    const departmentName = useMemo(() => {
        const dept = departmentList.find((d) => String(d.id) === String(departmentId));
        return dept ? dept.name : "Department Details";
    }, [departmentList, departmentId]);

    // Fetch department list if empty
    useEffect(() => {
        if (departmentList.length === 0) {
            dispatch(getDepartments({ page: 1, search: "" }));
        }
    }, [dispatch, departmentList]);

    const loadData = useCallback(async () => {
        if (!departmentId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetchReimbursementsByDepartment(
                departmentId,
                currentPage,
                ROWS_PER_PAGE
            );

            const results = response?.results || response || [];
            const count = response?.count ?? results.length;

            let mappedItems = results.map(mapRow);

            // If list response items lack date fields (e.g. production list API omitting date/created_at),
            // fetch single detail in parallel for items missing dates (single detail API contains date & created_at)
            const missingDateItems = results.filter(
                (item) => !item.date && !item.created_at && !item.expense_date && !item.submitted_date
            );

            if (missingDateItems.length > 0) {
                const detailPromises = missingDateItems.map((item) =>
                    fetchReimbursementDetail(item.id).catch(() => null)
                );

                const details = await Promise.all(detailPromises);

                const detailMap = new Map();
                details.forEach((detail) => {
                    if (detail && detail.id) {
                        detailMap.set(detail.id, detail);
                    }
                });

                mappedItems = results.map((item) => {
                    const detail = detailMap.get(item.id);
                    const mergedItem = detail ? { ...item, ...detail } : item;
                    return mapRow(mergedItem);
                });
            }

            setTableData(mappedItems);
            setTotalPages(Math.max(1, Math.ceil(count / ROWS_PER_PAGE)));
        } catch (err) {
            console.error("Failed to load reimbursement details:", err);
            setError(
                err?.message ||
                    "Something went wrong while loading reimbursement details."
            );
        } finally {
            setLoading(false);
        }
    }, [departmentId, currentPage]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const [selectedMonth, setSelectedMonth] = useState("");

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const str = String(dateString).trim();
        if (!str) return "—";
        const normalized = str.includes(" ") && !str.includes("T") ? str.replace(" ", "T") : str;
        const d = new Date(normalized);
        if (isNaN(d.getTime())) return dateString;
        const day = String(d.getDate()).padStart(2, "0");
        const month = d.toLocaleString("en-US", { month: "short" });
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Client-side status, month, and search filter
    const filteredData = useMemo(() => {
        let result = tableData;

        // Apply Status Filter
        if (statusFilter !== "all") {
            result = result.filter(
                (r) => r.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        // Apply Month Filter
        if (selectedMonth) {
            result = result.filter((r) => {
                const dateStr = r.submittedDate || r.created_at || r.expenseDate || r.date;
                if (!dateStr) return true;
                const str = String(dateStr).trim();
                if (!str) return true;
                if (/^\d{4}-\d{2}/.test(str)) {
                    return str.slice(0, 7) === selectedMonth;
                }
                const normalized = str.includes(" ") && !str.includes("T") ? str.replace(" ", "T") : str;
                const d = new Date(normalized);
                if (!isNaN(d.getTime())) {
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    return `${year}-${month}` === selectedMonth;
                }
                return true;
            });
        }

        // Apply Search Text Filter
        if (search.trim()) {
            const searchValue = search.toLowerCase();
            result = result.filter((r) =>
                r.employeeName.toLowerCase().includes(searchValue) ||
                r.reimbursementType.toLowerCase().includes(searchValue)
            );
        }

        return result;
    }, [search, statusFilter, selectedMonth, tableData]);

    // Statistics Cards Calculations (6 cards)
    const reimbursementCards = useMemo(() => {
        const totalRequests = filteredData.length;

        const approvedRequests = filteredData.filter(
            (r) =>
                r.status?.toLowerCase() === "approve" ||
                r.status?.toLowerCase() === "approved"
        ).length;

        const pendingRequests = filteredData.filter(
            (r) =>
                r.status?.toLowerCase() === "pending" ||
                r.status?.toLowerCase() === "on hold" ||
                r.status?.toLowerCase() === "in verification"
        ).length;

        const rejectedRequests = filteredData.filter(
            (r) =>
                r.status?.toLowerCase() === "reject" ||
                r.status?.toLowerCase() === "rejected"
        ).length;

        const approvedAmount = filteredData
            .filter(
                (r) =>
                    r.status?.toLowerCase() === "approve" ||
                    r.status?.toLowerCase() === "approved"
            )
            .reduce((sum, r) => sum + Number(r.amount || 0), 0);

        const totalAmount = filteredData.reduce(
            (sum, r) => sum + Number(r.amount || 0),
            0
        );

        return [

            {
                title: "Total Request",
                count: String(totalRequests).padStart(2, "0"),
                icon: <FiFileText />,

                backgroundColor: "#E8F1FF",

                iconColor: "#2878FF",
            },

            {
                title: "Approved",
                count: String(approvedRequests).padStart(2, "0"),
                icon: <FiCheckCircle />,

                backgroundColor: "#E9F9EF",

                iconColor: "#16A34A",
            },

            {
                title: "Pending",
                count: String(pendingRequests).padStart(2, "0"),
                icon: <FiClock />,

                backgroundColor: "#FFF6E5",

                iconColor: "#F59E0B",
            },

            {
                title: "Rejected",
                count: String(rejectedRequests).padStart(2, "0"),
                icon: <FiXCircle />,

                backgroundColor: "#FFF0F0",

                iconColor: "#EF4444",
            },
            {
                title: "Approved",
                count: `₹ ${approvedAmount.toLocaleString("en-IN")}`,
                icon: <FiCheckCircle />,
                backgroundColor: "#E9F9EF",
                iconColor: "#16A34A",
            },
            {
                title: "Total Amount",
                count: `₹ ${totalAmount.toLocaleString("en-IN")}`,
                icon: <FiFileText />,
                backgroundColor: "#E8F1FF",
                iconColor: "#2878FF",
            },
        ];

    }, [filteredData]);

    const handleSearch = (value) => {

        setSearch(value);

        setCurrentPage(1);
    };

    const handleStatusChange = async (reimbursementId, status) => {
        try {
            await updateReimbursementStatus(reimbursementId, status);
            loadData();
        } catch (err) {
            console.error("Failed to update status:", err);
            setError(
                err?.message || "Failed to update reimbursement status."
            );
        }
    };

    // Columns configuration to match mock layouts
    const reimbursementColumns = [
        {
            header: "SI No.",
            accessor: "slNo",
            sortable: false,
            width: "60px",
            render: (_row, index) => String(index + 1).padStart(2, "0"),
        },
        {
            header: "Employee Name",
            accessor: "employeeName",
        },
        {
            header: "Category",
            accessor: "reimbursementType",
            render: (row) => (row.reimbursementType || "—").toUpperCase(),
        },
        {
            header: "Description",
            accessor: "description",
        },
        {
            header: "Expense Date",
            accessor: "expenseDate",
            render: (row) => formatDate(row.expenseDate),
        },
        {
            header: "Submitted Date",
            accessor: "submittedDate",
            render: (row) => formatDate(row.submittedDate),
        },
        {
            header: "Amount",
            accessor: "amount",
            render: (row) => `₹${Number(row.amount).toLocaleString("en-IN")}`,
        },
        {
            header: "Receipt",
            accessor: "receipt",
            sortable: false,
            render: (row) => {
                return (
                    <button
                        type="button"
                        onClick={() => setSelectedReimbursementId(row.id)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#3154d8",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontWeight: "600",
                            fontSize: "13px",
                            fontFamily: "Poppins, sans-serif",
                            padding: "4px 0",
                        }}
                    >
                        <FiFileText style={{ fontSize: "16px" }} />
                        View
                    </button>
                );
            },
        },
        {
            header: "Action",
            accessor: "action",
            sortable: false,
            render: (row) => {
                return (
                    <div
                        style={{ display: "flex", gap: "10px", alignItems: "center" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => handleStatusChange(row.id, "Reject")}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "4px",
                            }}
                            title="Reject"
                        >
                            ❌
                        </button>

                        <button
                            type="button"
                            onClick={() => handleStatusChange(row.id, "Approve")}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "4px",
                            }}
                            title="Approve"
                        >
                            ✅
                        </button>
                    </div>
                );
            },
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => {
                const status = row.status || "Pending";
                let color = "#F59E0B";
                if (status === "Approve" || status === "Approved") {
                    color = "#10B981";
                } else if (status === "Reject" || status === "Rejected") {
                    color = "#EF4444";
                }
                return (
                    <span
                        style={{
                            color,
                            fontWeight: "600",
                            textTransform: "capitalize",
                        }}
                    >
                        {status === "Approve" ? "Approved" : status === "Reject" ? "Rejected" : status}
                    </span>
                );
            },
        },
    ];

    return (
        <div
            style={{
                padding: 20,
                width: "100%",
                boxSizing: "border-box",
                background: "#f5f6fa",
                minHeight: "100vh",
            }}
        >
            {/* HEADER */}
            <ReusableHeader
                title={`Reimbursement - ${departmentName} Department`}
                breadcrumbs={["Dashboard", "Reimbursement"]}
                showBack
            />

            {/* STATS */}
            <StatsCards cards={reimbursementCards} />

            {/* FILTERS PANEL */}
            <div style={{ margin: "20px 0" }}>
                <ReusableFilter
                    search={search}
                    onSearch={handleSearch}
                    searchPlaceholder="Search Employee Name / Category"
                    showSearch
                    status={statusFilter === "all" ? "" : statusFilter}
                    statuses={[
                        { label: "Pending", value: "pending" },
                        { label: "On Hold", value: "on hold" },
                        { label: "In Verification", value: "in verification" },
                        { label: "Approved", value: "approve" },
                        { label: "Rejected", value: "reject" },
                    ]}
                    onStatus={(val) => setStatusFilter(val || "all")}
                    showStatus
                    date={selectedMonth}
                    onDate={setSelectedMonth}
                    showDate
                    dateType="month"
                />
            </div>

            {/* LOADING / ERROR STATES */}
            {loading && <p>Loading reimbursement details...</p>}

            {!loading && error && (
                <p style={{ color: "red" }}>
                    {error}{" "}
                    <button type="button" onClick={loadData}>
                        Retry
                    </button>
                </p>
            )}

            {!loading && !error && filteredData.length === 0 && (
                <p>No reimbursement records found.</p>
            )}

            {/* TABLE */}
            {!loading && !error && filteredData.length > 0 && (
                <ReusableTable
                    columns={reimbursementColumns}
                    data={filteredData}
                />
            )}

            {/* PAGINATION */}
            {!loading && !error && totalPages > 0 && (
                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={filteredData.length}
                    onPageChange={
                        setCurrentPage
                    }
                />
            )}

            {/* DETAIL MODAL OVERLAY */}
            {selectedReimbursementId && (
                <ReimbursementDetailModal
                    id={selectedReimbursementId}
                    onClose={() => setSelectedReimbursementId(null)}
                />
            )}
        </div>
    );
};

export default ReimbursementDetails;