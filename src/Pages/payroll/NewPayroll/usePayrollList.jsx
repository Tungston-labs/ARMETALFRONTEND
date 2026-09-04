import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  getPayrollData,
  updatePayrollStatus,
  verifyEmployeePayroll,
  getPayrollCounts,
} from "../../../Redux/payrollSlice";
import { getDepartments } from "../../../Redux/departmentSlice";
import { PiMoneyWavyLight } from "react-icons/pi";
import { PiClockCountdown } from "react-icons/pi";
import { GoGift } from "react-icons/go";
import { HiArrowTrendingDown } from "react-icons/hi2";
import { formatCurrency } from "../../../utils/FormatCurrency"; // adjust path to match where you saved it

const LIMIT = 20;
const today = new Date();
const defaultMonth = today.getMonth() + 1;
const defaultYear = today.getFullYear();

export const getStatusColor = (status) => {
  switch (status) {
    case "Paid": return "#4B976D";
    case "OnHold": return "#bac8f8";
    case "Pending": return "#ffb833";
    case "Cancelled": return "#E67B7B";
    default: return "#000";
  }
};

export const formatDate = (date) => {
  if (!date) return "----";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const calculateNetPay = (emp) => {
  const salary = Number(emp.basic_salary) || 0;
  const incentive = Number(emp.incentive_amount) || 0;
  const deduction = Number(emp.deduction_amount) || 0;
  return salary + incentive - deduction;
};

export const getPayrollCards = ({
  total_payroll = 0,
  pending_payroll_count = 0,
  total_incentive_amount = 0,
  total_deduction_amount = 0,
} = {}) => [
  {
    title: "Pending Payroll",
    count: pending_payroll_count,
    icon: <PiClockCountdown />,
    iconColor: "#f78400",
    backgroundColor: "#FEEDDA",
  },

  {
    title: "Incentive Amount",
    count: formatCurrency(total_incentive_amount),
    icon: <GoGift />,
    iconColor: "#15aa60",
    backgroundColor: "#E3F7ED",
  },

  {
    title: "Deduction Amount",
    count: formatCurrency(total_deduction_amount),
    icon: <HiArrowTrendingDown />,
    iconColor: "#f3214f",
    backgroundColor: "#FFEDED",
  },
];

export function usePayrollList() {
  const dispatch = useDispatch();
  const { data, loading, totalPages } = useSelector((state) => state.payroll);
const counts = useSelector((state) => ({
  total_payroll: state.payroll.totalPayroll,
  pending_payroll_count: state.payroll.pendingPayrollCount,
  total_incentive_amount: state.payroll.totalIncentiveAmount,
  total_deduction_amount: state.payroll.totalDeductionAmount,
}));
  console.log('counts value:', counts);
  const departmentList = useSelector((state) => state.departments.list || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState({});
  const [bulkStatus, setBulkStatus] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [incentiveAddedIds, setIncentiveAddedIds] = useState([]);

  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [selectedDeductionEmployee, setSelectedDeductionEmployee] = useState(null);
  const [deductionAddedIds, setDeductionAddedIds] = useState([]);

  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const copy = [...data];
    copy.sort((a, b) =>
      (a.employee_name ?? "").toString().localeCompare(
        (b.employee_name ?? "").toString(),
        "en",
        { numeric: true }
      )
    );
    return copy;
  }, [data]);

  const departmentRows = Array.isArray(departmentList?.results)
    ? departmentList.results
    : Array.isArray(departmentList)
      ? departmentList
      : [];

  const departmentIdByName = departmentRows.reduce((acc, d) => {
    acc[d.name] = d.id;
    return acc;
  }, {});

  const refetch = () =>
    dispatch(
      getPayrollData({
        page,
        limit: LIMIT,
        search: searchTerm,
        month: selectedMonth,
        year: selectedYear,
        department: selectedDepartment ? departmentIdByName[selectedDepartment] : "",
      })
    );

  const refetchCounts = () =>
    dispatch(
      getPayrollCounts({
        month: selectedMonth,
        year: selectedYear,
        department: selectedDepartment ? departmentIdByName[selectedDepartment] : "",
      })
    );

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  useEffect(() => {
    refetch().unwrap?.().catch?.((err) =>
      console.error("Error fetching payroll data:", err)
    );
  }, [dispatch, page, searchTerm, selectedMonth, selectedYear, selectedDepartment]);

  useEffect(() => {
    refetchCounts().unwrap?.().catch?.((err) =>
      console.error("Error fetching payroll counts:", err)
    );
  }, [dispatch, selectedMonth, selectedYear, selectedDepartment]);

  useEffect(() => {
    if (sortedData?.length) {
      const initialStatus = {};
      sortedData.forEach((emp) => {
        initialStatus[emp.id] = {
          first: emp.hr1_verified_by,
          second: emp.hr2_verified_by,
        };
      });
      setVerificationStatus(initialStatus);
    }
  }, [sortedData]);

  const toggleEmployeeSelect = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedEmployees(
      selectedEmployees.length === sortedData.length
        ? []
        : sortedData.map((emp) => emp.id)
    );
  };

  const handleSingleStatusChange = async (employeeId, newStatus) => {
    const empStatus = verificationStatus[employeeId.id];
    if (!empStatus?.first || !empStatus?.second) {
      Swal.fire({
        icon: "warning",
        title: "Verification Pending",
        text: "Payroll cannot be updated until both admins verify.",
      });
      return;
    }

    try {
      await dispatch(
        updatePayrollStatus({
          employeeId: employeeId.employee,
          month: selectedMonth,
          year: selectedYear,
          status: newStatus,
        })
      ).unwrap();

      refetch();
      refetchCounts();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.message || "Something went wrong!",
      });
    }
  };

  const handleCircleClick = async (e, employee, type) => {
    e.preventDefault();

    const user =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));
    if (!user) return;

    if (verificationStatus[employee.id]?.[type]) {
      Swal.fire({ icon: "info", title: "Already Verified", text: "This was already verified." });
      return;
    }

    if (
      employee.hr1_verified_by === user.username ||
      employee.hr2_verified_by === user.username
    ) {
      Swal.fire({ icon: "warning", title: "Cannot Verify", text: "You cannot verify the same payroll twice." });
      return;
    }

    try {
      await dispatch(
        verifyEmployeePayroll({
          employeeId: employee.employee,
          month: selectedMonth,
          year: selectedYear,
        })
      ).unwrap();

      setVerificationStatus((prev) => ({
        ...prev,
        [employee.id]: { ...prev[employee.id], [type]: true },
      }));

      await refetch();
      await refetchCounts();

      Swal.fire({
        icon: "success",
        title: "Verified",
        text: "Payroll verification recorded.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Verify payroll error:", err);
      Swal.fire({
        icon: "warning",
        title: "Verification Failed",
        text: "Cannot verify payroll: Same HR cannot verify twice.",
      }).then(() => refetch());
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleCloseModal = (saved = false) => {
    setShowModal(false);
    if (saved && selectedEmployee) {
      setIncentiveAddedIds((prev) =>
        prev.includes(selectedEmployee.id) ? prev : [...prev, selectedEmployee.id]
      );
      refetch();
      refetchCounts();
    }
    setSelectedEmployee(null);
  };

  const handleCloseDeductionModal = (saved = false) => {
    setShowDeductionModal(false);
    if (saved && selectedDeductionEmployee) {
      setDeductionAddedIds((prev) =>
        prev.includes(selectedDeductionEmployee.id)
          ? prev
          : [...prev, selectedDeductionEmployee.id]
      );
      refetch();
      refetchCounts();
    }
    setSelectedDeductionEmployee(null);
  };

  return {
    sortedData,
    loading,
    totalPages,
    page,
    departmentList,
    counts,
    searchTerm, setSearchTerm,
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    selectedDepartment, setSelectedDepartment,
    selectedEmployees,
    toggleEmployeeSelect,
    handleSelectAll,
    bulkStatus, setBulkStatus,
    verificationStatus,
    handleCircleClick,
    handleSingleStatusChange,
    handlePageChange,
    showModal,
    selectedEmployee, setSelectedEmployee,
    setShowModal,
    incentiveAddedIds,
    handleCloseModal,
    showDeductionModal, setShowDeductionModal,
    selectedDeductionEmployee, setSelectedDeductionEmployee,
    deductionAddedIds,
    handleCloseDeductionModal,
  };
}