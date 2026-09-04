import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getLeaveRequests,
  patchLeaveStatus,
  getLeaveCounts,
} from "../../../Redux/leaveSlice";

import {
  getDepartments,
} from "../../../Redux/departmentSlice";

import {
  Container,
} from "./leaveColumns.style";

import ReusableTable from "../../../Components/ReusableTable/ReusableTable";

import NoEmployeeFound from "../../../Components/No found/Noemployeefound";

import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";

import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";

import ReusableConfirmModal from "../../../Components/modals/ReusableConfirmModal";

import {
  getLeaveColumns,
  getPayrollCards,
} from "./leaveColumns";

import StatsCards from "../../../Components/StatsCards/StatsCards";


export default function LeaveRequestList() {

  const dispatch = useDispatch();


  // ======================================================
  // REDUX
  // ======================================================

  const {
  leaves,
  loading,
  pagination,
  error,
  leaveCounts,
} = useSelector((state) => state.leave);


  const {
    list: departmentList,
  } = useSelector(
    (state) => state.departments
  );


  // ======================================================
  // SEARCH
  // ======================================================

  const [search, setSearch] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");


  // ======================================================
  // PAGINATION
  // ======================================================

  const [page, setPage] =
    useState(1);


  // ======================================================
  // FILTERS
  // ======================================================

  const [departmentFilter, setDepartmentFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");


const today = new Date();

const [selectedMonth, setSelectedMonth] = useState(
  String(today.getMonth() + 1).padStart(2, "0")
);

const [selectedYear, setSelectedYear] = useState(
  String(today.getFullYear())
);

  // ======================================================
  // CONFIRM MODAL
  // ======================================================

  const [showModal, setShowModal] =
    useState(false);

  const [actionType, setActionType] =
    useState("");

  const [selectedLeaveId, setSelectedLeaveId] =
    useState(null);


  // ======================================================
  // DEPARTMENT OPTIONS
  // ======================================================

  const departmentOptions = useMemo(
    () =>
      Array.isArray(departmentList)
        ? departmentList.map(
          (department) =>
            department.name
        )
        : [],

    [departmentList]
  );


  // ======================================================
  // DEPARTMENT NAME -> ID
  // ======================================================

  const departmentIdByName = useMemo(
    () =>
      Object.fromEntries(
        (departmentList || []).map(
          (department) => [
            department.name,
            department.id,
          ]
        )
      ),

    [departmentList]
  );


  // ======================================================
  // SELECTED DEPARTMENT ID
  // ======================================================

  const selectedDepartmentId =
    departmentFilter
      ? departmentIdByName[
      departmentFilter
      ]
      : "";


  // ======================================================
  // GET DEPARTMENTS
  // ======================================================

  useEffect(() => {

    dispatch(
      getDepartments({
        page: 1,
        search: "",
      })
    );

  }, [dispatch]);


  // ======================================================
// GET LEAVE COUNTS
// ======================================================

useEffect(() => {
  dispatch(getLeaveCounts());
}, [dispatch]);

  // ======================================================
  // SEARCH DEBOUNCE
  // ======================================================

  useEffect(() => {

    const handler =
      setTimeout(() => {

        setDebouncedSearch(
          search.trim()
        );

      }, 300);


    return () =>
      clearTimeout(handler);

  }, [search]);


  // ======================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ======================================================

  useEffect(() => {

    setPage(1);

  }, [
    selectedDepartmentId,
    statusFilter,
    selectedMonth,
    selectedYear,
    debouncedSearch,
  ]);


  // ======================================================
  // GET LEAVE REQUESTS
  // ======================================================

  useEffect(() => {
    dispatch(
      getLeaveRequests({
        page,

        department_id:
          selectedDepartmentId || undefined,

        status:
          statusFilter
            ? statusFilter.toLowerCase()
            : undefined,

        search:
          debouncedSearch || undefined,

        month:
          selectedMonth || undefined,

        year:
          selectedYear || undefined,
      })
    );
  }, [
    dispatch,
    page,
    selectedDepartmentId,
    statusFilter,
    debouncedSearch,
    selectedMonth,
    selectedYear,
  ]);

  // ======================================================
  // LEAVE DATA
  // ======================================================

  const leaveData =
    Array.isArray(leaves)
      ? leaves
      : [];


  // ======================================================
  // DATE FORMAT
  // ======================================================

  const formatDate = (dateStr) => {

    if (!dateStr) {
      return "N/A";
    }

    const d =
      new Date(dateStr);

    const day =
      d.getDate()
        .toString()
        .padStart(2, "0");

    const month =
      d.toLocaleString(
        "en-GB",
        {
          month: "short",
        }
      );

    return `${day}/${month}`;
  };


  // ======================================================
  // APPROVE MODAL
  // ======================================================

  const openApproveModal = (id) => {

    setSelectedLeaveId(id);

    setActionType("approve");

    setShowModal(true);
  };


  // ======================================================
  // REJECT MODAL
  // ======================================================

  const openRejectModal = (id) => {

    setSelectedLeaveId(id);

    setActionType("reject");

    setShowModal(true);
  };


  // ======================================================
  // UPDATE STATUS
  // ======================================================

  const handleStatusUpdate = async () => {

    if (
      !selectedLeaveId ||
      !actionType
    ) {
      return;
    }


    const status =
      actionType === "approve"
        ? "approved"
        : "rejected";


    try {

      // ==============================================
      // UPDATE STATUS API
      // ==============================================

      await dispatch(
        patchLeaveStatus({
          leaveId:
            selectedLeaveId,

          status,
        })
      ).unwrap();


      // ==============================================
      // REFRESH CURRENT LIST
      // ==============================================

      await dispatch(
        getLeaveRequests({

          page,

          department_id:
            selectedDepartmentId ||
            undefined,

          status:
            statusFilter
              ? statusFilter.toLowerCase()
              : undefined,

          search:
            debouncedSearch ||
            undefined,

          month:
            selectedMonth,

          year:
            selectedYear,
        })
      );


      // ==============================================
      // REFRESH COUNTS (Pending/Approved/Rejected cards)
      // ==============================================

      dispatch(getLeaveCounts());


    } catch (error) {

      console.error(
        "Leave status update failed:",
        error
      );

    } finally {

      setShowModal(false);

      setActionType("");

      setSelectedLeaveId(null);
    }
  };


  // ======================================================
  // PAGE CHANGE
  // ======================================================

  const handlePageChange = (
    newPage
  ) => {

    if (
      newPage < 1 ||
      newPage >
      pagination.total_pages
    ) {
      return;
    }

    setPage(newPage);
  };


  // ======================================================
  // COLUMNS
  // ======================================================

  const columns =
    getLeaveColumns({

      page,

      formatDate,

      openApproveModal,

      openRejectModal,
    });


  // ======================================================
  // CARDS
  // ======================================================

  const payrollCards = getPayrollCards(leaveCounts);

  // ======================================================
  // UI
  // ======================================================

  return (

    <Container>

      {/* ==========================================
          HEADER
      ========================================== */}

      <ReusableHeader
        title="Leave Requests"

        breadcrumbs={[
          "Employees",
          "LeaveRequest",
        ]}
      />


      {/* ==========================================
          STATS
      ========================================== */}

      <StatsCards
        cards={payrollCards}
      />


      {/* ==========================================
          FILTERS
      ========================================== */}

      <ReusableFilter

        search={search}

        onSearch={(value) => {
          setSearch(value);
        }}

        searchPlaceholder={
          "Search by Employee Name / Code"
        }


        department={
          departmentFilter
        }

        departments={
          departmentOptions
        }

        onDepartment={(
          value
        ) => {

          setDepartmentFilter(
            value
          );

        }}


        status={
          statusFilter
        }

        statuses={[
          "Pending",
          "Approved",
          "Rejected",
        ]}

        onStatus={(
          value
        ) => {

          setStatusFilter(
            value
          );

        }}


        date={
          selectedYear && selectedMonth
            ? `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`
            : ""
        }

        onDate={(value) => {
          if (!value) {
            setSelectedMonth("");
            setSelectedYear("");
            return;
          }

          const [year, month] = value.split("-");

          setSelectedYear(year);
          setSelectedMonth(month);
        }}


        showSearch

        showDepartment

        showStatus

        showDate
      />


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "10px",
          }}
        >
          {typeof error === "string"
            ? error
            : "Failed to load leave requests"}
        </div>
      )}


      {/* ==========================================
          TABLE
      ========================================== */}

      <ReusableTable

        columns={columns}

        data={leaveData}

        loading={loading}

        loadingComponent={null}

        emptyComponent={

          <NoEmployeeFound
            searchTerm={
              debouncedSearch
            }
          />

        }
      />


      {/* ==========================================
          PAGINATION
      ========================================== */}

      {pagination.total_pages > 1 && (

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >

          <button
            type="button"

            disabled={
              !pagination.previous ||
              page === 1
            }

            onClick={() =>
              handlePageChange(
                page - 1
              )
            }
          >
            Previous
          </button>


          <span>
            Page {pagination.current_page}
            {" "}
            of{" "}
            {pagination.total_pages}
          </span>


          <button
            type="button"

            disabled={
              !pagination.next ||
              page ===
              pagination.total_pages
            }

            onClick={() =>
              handlePageChange(
                page + 1
              )
            }
          >
            Next
          </button>

        </div>

      )}


      {/* ==========================================
          APPROVE / REJECT MODAL
      ========================================== */}

      <ReusableConfirmModal

        show={
          showModal
        }

        title={

          actionType === "approve"

            ? "Approve Leave"

            : "Reject Leave"

        }


        message={

          actionType === "approve"

            ? "Are you sure you want to approve this leave request?"

            : "Are you sure you want to reject this leave request?"

        }


        confirmText={

          actionType === "approve"

            ? "Approve"

            : "Reject"

        }


        cancelText="Cancel"


        confirmVariant={

          actionType === "approve"

            ? "success"

            : "danger"

        }


        onConfirm={
          handleStatusUpdate
        }


        onClose={() => {

          setShowModal(false);

          setActionType("");

          setSelectedLeaveId(null);

        }}

      />

    </Container>
  );
}