import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getLeaveRequests,
  patchLeaveStatus,
  getLeaveCounts,
} from "../../../Redux/leaveSlice";
import { getDepartments } from "../../../Redux/departmentSlice";
import { getLeaveColumns, getPayrollCards } from "./leaveColumns";

// ======================================================
// HELPERS
// ======================================================
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";

  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "short" });

  return `${day}/${month}`;
};

export default function useLeaveRequests() {
  const dispatch = useDispatch();

  // ======================================================
  // REDUX  (errors are shown by the global error banner)
  // ======================================================
  const { leaves, loading, pagination, leaveCounts } = useSelector(
    (state) => state.leave
  );
  const { list: departmentList } = useSelector((state) => state.departments);

  // ======================================================
  // STATE
  // ======================================================
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    String(today.getMonth() + 1).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  // ======================================================
  // DEPARTMENTS
  // ======================================================
  const departmentOptions = useMemo(
    () =>
      Array.isArray(departmentList)
        ? departmentList.map((department) => department.name)
        : [],
    [departmentList]
  );

  const departmentIdByName = useMemo(
    () =>
      Object.fromEntries(
        (departmentList || []).map((department) => [
          department.name,
          department.id,
        ])
      ),
    [departmentList]
  );

  const selectedDepartmentId = departmentFilter
    ? departmentIdByName[departmentFilter]
    : "";

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  // ======================================================
  // LEAVE COUNTS
  // ======================================================
  useEffect(() => {
    dispatch(getLeaveCounts());
  }, [dispatch]);

  // ======================================================
  // SEARCH DEBOUNCE (also resets to page 1)
  // ======================================================
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // ======================================================
  // FETCH LEAVE REQUESTS
  // ======================================================
  const buildFilters = () => ({
    page,
    department_id: selectedDepartmentId || undefined,
    status: statusFilter ? statusFilter.toLowerCase() : undefined,
    search: debouncedSearch || undefined,
    month: selectedMonth || undefined,
    year: selectedYear || undefined,
  });

  useEffect(() => {
    dispatch(getLeaveRequests(buildFilters()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    page,
    selectedDepartmentId,
    statusFilter,
    debouncedSearch,
    selectedMonth,
    selectedYear,
  ]);

  const leaveData = Array.isArray(leaves) ? leaves : [];

  // ======================================================
  // FILTER HANDLERS
  // ======================================================
  const handleDepartmentChange = (value) => {
    setDepartmentFilter(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleDateChange = (value) => {
    if (!value) {
      setSelectedMonth("");
      setSelectedYear("");
    } else {
      const [year, month] = value.split("-");
      setSelectedYear(year);
      setSelectedMonth(month);
    }
    setPage(1);
  };

  const dateValue =
    selectedYear && selectedMonth
      ? `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`
      : "";

  // ======================================================
  // MODALS
  // ======================================================
  const openApproveModal = (id) => {
    setSelectedLeaveId(id);
    setActionType("approve");
    setShowModal(true);
  };

  const openRejectModal = (id) => {
    setSelectedLeaveId(id);
    setActionType("reject");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActionType("");
    setSelectedLeaveId(null);
  };

  // ======================================================
  // UPDATE STATUS
  // ======================================================
  const handleStatusUpdate = async () => {
    if (!selectedLeaveId || !actionType) return;

    const status = actionType === "approve" ? "approved" : "rejected";

    try {
      await dispatch(
        patchLeaveStatus({ leaveId: selectedLeaveId, status })
      ).unwrap();

      // If that was the last row on this page, go back a page
      // (the page change triggers the fetch). Otherwise refetch this page.
      if (leaveData.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await dispatch(getLeaveRequests(buildFilters()));
      }

      dispatch(getLeaveCounts());
    } catch (error) {
      console.error("Leave status update failed:", error);
    } finally {
      closeModal();
    }
  };

  // ======================================================
  // PAGE CHANGE
  // ======================================================
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (pagination?.total_pages || 1)) return;
    setPage(newPage);
  };

  // ======================================================
  // COLUMNS + CARDS
  // ======================================================
  const columns = getLeaveColumns({
    page,
    formatDate,
    openApproveModal,
    openRejectModal,
  });

  const payrollCards = getPayrollCards(leaveCounts);

  // ======================================================
  // PUBLIC API
  // ======================================================
  return {
    // table
    columns,
    leaveData,
    loading,
    payrollCards,

    // pagination
    page,
    pagination,
    handlePageChange,

    // filters
    search,
    setSearch,
    departmentFilter,
    departmentOptions,
    handleDepartmentChange,
    statusFilter,
    handleStatusChange,
    dateValue,
    handleDateChange,

    // modal
    showModal,
    actionType,
    closeModal,
    handleStatusUpdate,
  };
}