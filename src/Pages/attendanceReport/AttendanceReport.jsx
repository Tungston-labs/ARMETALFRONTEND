import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Container,
  PageWrapper,
} from "./AttendanceReportStyles";

import {
  getAttendanceSummary,
  generateAttendanceExcelReport,
} from "../../Redux/attendanceSlice";

import Pagination from "../../Components/Pagination/Pagination";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";

import { getDepartments } from "../../Redux/departmentSlice";
import Swal from "sweetalert2";

const AttendanceReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth || {});
  const token =
    auth?.accessToken ||
    auth?.token ||
    "";

  const attendanceState = useSelector(
    (state) => state.attendance || {}
  );

  const attendanceSummary =
    attendanceState.attendanceSummary?.results || [];

  const summaryLoading =
    attendanceState.summaryLoading || false;

  const excelLoading =
    attendanceState.attendanceExcelLoading || false;

  const summaryData =
    attendanceState.attendanceSummary;

  const currentPage =
    summaryData?.current_page || 1;

  const totalPages =
    summaryData?.total_pages || 1;

  const [department, setDepartment] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 7)
    );

  const [searchTerm, setSearchTerm] =
    useState("");

  const { list: departmentList } =
    useSelector(
      (state) => state.departments || {}
    );

  // =========================================================
  // DEPARTMENT DATA
  // =========================================================

  const departmentRows =
    Array.isArray(departmentList?.results)
      ? departmentList.results
      : Array.isArray(departmentList)
        ? departmentList
        : [];

  const departments = useMemo(
    () =>
      departmentRows.map(
        (d) => d.name
      ),
    [departmentRows]
  );

  // =========================================================
  // FETCH DEPARTMENTS
  // =========================================================

  useEffect(() => {
    dispatch(
      getDepartments({
        page: 1,
        search: "",
      })
    );
  }, [dispatch]);

  // =========================================================
  // MONTH NAME
  // =========================================================

  const getMonthNameFromYYYYMM = (
    yyyyMM
  ) => {
    if (!yyyyMM) return "";

    const d = new Date(
      `${yyyyMM}-01T00:00:00`
    );

    if (isNaN(d.getTime())) {
      return "";
    }

    return d.toLocaleString(
      "default",
      {
        month: "long",
      }
    );
  };

  const selectedMonthName = useMemo(
    () =>
      getMonthNameFromYYYYMM(
        selectedMonth
      ),
    [selectedMonth]
  );

  // =========================================================
  // FETCH ATTENDANCE SUMMARY
  // =========================================================

  useEffect(() => {
    if (!selectedMonth || !token) {
      return;
    }

    const [year, month] =
      selectedMonth.split("-");

    dispatch(
  getAttendanceSummary({
    year: Number(year),
    month: Number(month),
    page: 1,
    search: searchTerm,
    token,
  })
);
  }, [
    selectedMonth,
    searchTerm,
    dispatch,
    token,
  ]);

  // =========================================================
  // FILTER / SEARCH DATA
  // =========================================================

const visibleRows = useMemo(() => {
  if (!Array.isArray(attendanceSummary)) {
    return [];
  }

  const q = searchTerm.trim().toLowerCase();

  return attendanceSummary
    .filter((emp) => {
      const employeeName =
        emp.employee_name || "";

      const employeeCode =
        emp.employee_id || "";

      const matchSearch =
        employeeName
          .toLowerCase()
          .includes(q) ||
        employeeCode
          .toLowerCase()
          .includes(q);

      const matchDepartment =
        department === "" ||
        emp.department === department;

      return (
        matchSearch &&
        matchDepartment
      );
    })
    .sort((a, b) =>
      (a.employee_name || "").localeCompare(
        b.employee_name || ""
      )
    )
    .map((emp) => ({
      ...emp,
      id: emp.employee_id,
    }));
}, [
  attendanceSummary,
  searchTerm,
  department,
]);
  // =========================================================
  // OPEN EMPLOYEE ATTENDANCE SUMMARY PAGE
  // =========================================================

  const handleRowClick = (
    employee
  ) => {
    navigate(
      "/employee-attendance-summary",
      {
        state: {
          employee,
          employeeId:
            employee?.employee_id,
          employeeName:
            employee?.employee_name,
          department:
            employee?.department,
          selectedMonth,
          monthName:
            selectedMonthName,
        },
      }
    );
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const handlePageChange = (
    page
  ) => {
    if (!selectedMonth || !token) {
      return;
    }

    const [year, month] =
      selectedMonth.split("-");

    dispatch(
  getAttendanceSummary({
    year: Number(year),
    month: Number(month),
    page,
    search: searchTerm,
    token,
  })
);
  };

  // =========================================================
  // DOWNLOAD EXCEL
  // =========================================================

  const handleDownloadExcel =
    async () => {
      if (
        excelLoading ||
        !selectedMonth ||
        !token
      ) {
        return;
      }

      const [year, month] =
        selectedMonth.split("-");

      try {
        const result =
          await dispatch(
            generateAttendanceExcelReport(
              {
                year: Number(year),
                month: Number(month),
                token,
              }
            )
          ).unwrap();

        console.log(
          "Attendance Excel response:",
          result
        );

        if (
          result?.download_url
        ) {
          window.open(
            result.download_url,
            "_blank"
          );
        }
      } catch (error) {
        console.error(
          "Excel generation failed:",
          error
        );

        Swal.fire({
          icon: "warning",
          title:
            "Cannot Generate Report",
          text:
            error?.detail ||
            "Failed to generate attendance report.",
          confirmButtonText: "OK",
        });
      }
    };

  // =========================================================
  // LOP
  // =========================================================

  const getLop = (row) =>
    row.lop_days ??
    row.lop ??
    0;

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  const columns = [
    {
      header: "Sl No.",
      accessor: "slNo",
      sortable: false,

      render: (
        row,
        index
      ) =>
        index +
        1 +
        (currentPage - 1) *
          20,
    },

    {
      header: "Employee name",
      accessor:
        "employee_name",
    },

    {
      header: "Department",
      accessor:
        "department",
    },

    {
      header: "Month",
      accessor: "month",
      sortable: false,

      render: () =>
        selectedMonthName,
    },

    {
      header:
        "Total Working Days",
      accessor:
        "working_days",

      render: (row) =>
        row.working_days ??
        row.workingDays ??
        "-",
    },

    {
      header: "Present",
      accessor:
        "present_days",

      render: (row) =>
        row.present_days ??
        row.present ??
        "-",
    },

    {
      header: "Absent",
      accessor:
        "absent_days",

      render: (row) =>
        row.absent_days ??
        row.absent ??
        "-",
    },

    {
      header: "Loss of Pay",
      accessor: "lop",

      render: (row) => {
        const lop =
          getLop(row);

        return (
          <span
            style={{
              color:
                lop > 0
                  ? "#e53935"
                  : "inherit",

              fontWeight:
                lop > 0
                  ? 600
                  : 400,
            }}
          >
            {lop}
          </span>
        );
      },
    },
  ];

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <Container>

      {/* HEADER */}
      <ReusableHeader
        title="Employees Attendance Report"
        breadcrumbs={[
          "Employees",
          "Employees Attendance Report",
        ]}
        buttonText={
          excelLoading
            ? "Generating Excel..."
            : "📊 Monthly Report (Excel)"
        }
        onButtonClick={
          handleDownloadExcel
        }
      />

      {/* FILTER */}
     <ReusableFilter
  search={searchTerm}
  onSearch={setSearchTerm}
  searchPlaceholder="Search Employee Name or Code"

  department={department}
  departments={departments}
  onDepartment={setDepartment}

  date={selectedMonth}
  onDate={setSelectedMonth}

  showSearch
  showDepartment
  showDate
/>

      {/* TABLE */}
      <PageWrapper>

        <ReusableTable
          columns={columns}
          data={visibleRows}
          loading={summaryLoading}
          onRowClick={
            handleRowClick
          }
        />

        {/* PAGINATION */}
        <Pagination
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          totalRecords={summaryData?.total_items ?? attendanceSummary.length}
          onPageChange={
            handlePageChange
          }
        />

      </PageWrapper>

    </Container>
  );
};

export default AttendanceReport;