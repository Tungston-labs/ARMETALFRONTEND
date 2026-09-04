import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Header,
  TitleSection,
  Title,
  Subtitle,
  SearchInput,
  Table,
  Th,
  Td,
  Select,
  BulkActionBar,
  EmployeeImage,
  LeftGroup,
  Selection,
  TableWrapper,
  Tr,
  AddButton
} from "./PayrollTablestyes";
import { Link } from "react-router-dom";
import { GoInfo } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import {
  getPayrollData,
  submitPayrollRecords,
  updatePayrollStatus,
  verifyEmployeePayroll,
} from "../../Redux/payrollSlice";
import { getDepartments } from "../../Redux/departmentSlice";
import Loader from "../../Components/Loader/Loader";
import Swal from "sweetalert2";
import VerificationCircles from "../../Components/payroll/VerificationCircle";
import HolidayIcon from "../../assets/payroll.svg";
import Pagination from "../../Components/Pagination/Pagination";
import NoEmployeeFound from "../../Components/No found/Noemployeefound";
import IncentiveModal from "../../Components/payroll/IncentiveModal/IncentiveModal";
import DeductionModal from "../../Components/payroll/DeductionModal/DeductionModal";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const today = new Date();
const defaultMonth = today.getMonth() + 1;
const defaultYear = today.getFullYear();
const years = Array.from(
  { length: 3 },
  (_, i) => defaultYear - 2 + i
);

const PayrollTable = () => {
  const dispatch = useDispatch();
  const { data, loading, error, totalPages } = useSelector((state) => state.payroll);
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
  const [incentiveAddedIds, setIncentiveAddedIds] = useState([]); // ✅ local tracking
  const [deductionAddedIds, setDeductionAddedIds] = useState([]);
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [selectedDeductionEmployee, setSelectedDeductionEmployee] = useState(null);
  const LIMIT = 20;

  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const copy = [...data];
    copy.sort((a, b) => {
      const aName = (a.employee_name ?? "").toString();
      const bName = (b.employee_name ?? "").toString();
      return aName.localeCompare(bName, "en", { numeric: true });
    });
    return copy;
  }, [data]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "#4B976D";
      case "OnHold": return "#bac8f8";
      case "Pending": return "#ffb833";
      case "Cancelled": return "#E67B7B";
      default: return "#000";
    }
  };

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getPayrollData({
        page,
        limit: LIMIT,
        search: searchTerm,
        month: selectedMonth,
        year: selectedYear,
        department: selectedDepartment,
      })
    ).unwrap().catch((err) => console.error("Error fetching payroll data:", err));
  }, [dispatch, page, searchTerm, selectedMonth, selectedYear, selectedDepartment]);

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
    setIncentiveAddedIds([]); // ✅ reset on month change
    setDeductionAddedIds([]);
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
    setPage(1);
    setIncentiveAddedIds([]); // ✅ reset on year change
    setDeductionAddedIds([]);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setPage(1);
    setIncentiveAddedIds([]); // ✅ reset on department change
    setDeductionAddedIds([]);
  };

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

      dispatch(
        getPayrollData({
          page,
          search: searchTerm,
          month: selectedMonth,
          year: selectedYear,
          department: selectedDepartment,
        })
      );
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.message || "Something went wrong!",
      });
    }
  };

  const handleBulkStatusChange = async (e) => {
    const newStatus = e.target.value;
    setBulkStatus(newStatus);

    if (!newStatus || selectedEmployees.length === 0) return;

    const unverified = sortedData.filter(
      (emp) =>
        selectedEmployees.includes(emp.id) &&
        (!verificationStatus[emp.id]?.first || !verificationStatus[emp.id]?.second)
    );

    if (unverified.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Verification Pending",
        text: "Some selected employees are not verified by both admins.",
      });
      setBulkStatus("");
      return;
    }

    const employee_ids = selectedEmployees
      .map((id) => sortedData.find((e) => e.id === id))
      .filter(Boolean)
      .map((e) => e.employee);

    try {
      await dispatch(
        submitPayrollRecords({
          month: selectedMonth,
          year: selectedYear,
          employee_ids,
          status: newStatus,
        })
      ).unwrap();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Payroll status updated for selected employees.",
        timer: 1500,
        showConfirmButton: false,
      });

      setBulkStatus("");
      setSelectedEmployees([]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Bulk Update Failed",
        text: err?.message || "Something went wrong!",
      });
      setBulkStatus("");
    }
  };

  const handleOpenDeductionModal = (emp) => {
    if (emp.deduction_amount > 0 || deductionAddedIds.includes(emp.id))
      return;

    setSelectedDeductionEmployee(emp);
    setShowDeductionModal(true);
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

      await dispatch(
        getPayrollData({
          page,
          search: searchTerm,
          month: selectedMonth,
          year: selectedYear,
          department: selectedDepartment,
        })
      );

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
      }).then(() => {
        dispatch(
          getPayrollData({
            page,
            search: searchTerm,
            month: selectedMonth,
            year: selectedYear,
            department: selectedDepartment,
          })
        );
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };


  const handleCloseDeductionModal = (saved = false) => {
    setShowDeductionModal(false);

    if (saved && selectedDeductionEmployee) {
      setDeductionAddedIds((prev) =>
        prev.includes(selectedDeductionEmployee.id)
          ? prev
          : [...prev, selectedDeductionEmployee.id]
      );

      dispatch(
        getPayrollData({
          page,
          search: searchTerm,
          month: selectedMonth,
          year: selectedYear,
          department: selectedDepartment,
        })
      );
    }

    setSelectedDeductionEmployee(null);
  };
  const formatDate = (date) => {
    if (!date) return "----";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleOpenModal = (emp) => {
    if (emp.incentive_added || incentiveAddedIds.includes(emp.id)) return; // ✅ block if already added
    setSelectedEmployee(emp);
    setShowModal(true);
  };

  const handleCloseModal = (saved = false) => {
    setShowModal(false);

    if (saved && selectedEmployee) {
      setIncentiveAddedIds((prev) =>
        prev.includes(selectedEmployee.id)
          ? prev
          : [...prev, selectedEmployee.id]
      );

      dispatch(
        getPayrollData({
          page,
          search: searchTerm,
          month: selectedMonth,
          year: selectedYear,
          department: selectedDepartment,
        })
      );
    }

    setSelectedEmployee(null);
  };

  return (
    <>
      <Container>
        <Header>
          <TitleSection>
            <LeftGroup>
              <EmployeeImage src={HolidayIcon} alt="employeeIcon" />
              <div>
                <Title>Payroll</Title>
                <Subtitle>Unifying Teams. Simplifying Operations</Subtitle>
              </div>
            </LeftGroup>
            <Selection value={selectedDepartment} onChange={handleDepartmentChange}>
              <option value="">Select Department</option>
              {departmentList.map((dept) => (
                <option key={dept.id} value={String(dept.id).split(":")[0]}>
                  {dept.name}
                </option>
              ))}
            </Selection>
          </TitleSection>
        </Header>

        <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SearchInput
            placeholder=" Search by employee ID"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <Select value={selectedMonth} onChange={handleMonthChange}>
              {months
                .filter((_, index) => {
                  // ✅ Hide future months for current year
                  if (selectedYear === defaultYear) {
                    return index + 1 <= defaultMonth;
                  }
                  return true;
                })
                .map((month, index) => {
                  // ✅ Correct month value after filtering
                  const monthValue = months.indexOf(month) + 1;

                  return (
                    <option key={month} value={monthValue}>
                      {month}
                    </option>
                  );
                })}
            </Select>
            <Select value={selectedYear} onChange={handleYearChange}>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </div>
        </Header>

        <BulkActionBar>
          <div>
            <input
              type="checkbox"
              checked={selectedEmployees.length === sortedData.length && sortedData.length > 0}
              onChange={handleSelectAll}
            />
            <strong>Selected {selectedEmployees.length} Employees</strong>
          </div>
          <select value={bulkStatus} onChange={handleBulkStatusChange}>
            <option value="">Select</option>
            <option value="OnHold">OnHold</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </BulkActionBar>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === sortedData.length && sortedData.length > 0}
                    onChange={handleSelectAll}
                  />
                </Th>
                <Th>Sl No</Th>
                <Th>Name</Th>
                <Th>Employee ID</Th>
                <Th>Joining Date</Th>
                <Th>Salary</Th>
                <Th>Incentive</Th>
                <Th>Deduction</Th>
                <Th>Info</Th>
                <Th>Verification</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "2rem" }}>
                    <Loader size="large" tip="Loading..." />
                  </td>
                </tr>
              ) : sortedData?.length > 0 ? (
                sortedData.map((emp, index) => (
                  <tr key={emp.id}>
                    <Td>
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => toggleEmployeeSelect(emp.id)}
                      />
                    </Td>
                    <Td>{(page - 1) * LIMIT + index + 1}</Td>
                    <Td>{emp.employee_name}</Td>
                    <Td>{emp.employee_id}</Td>
                    <Td>{formatDate(emp.joining_date)}</Td>
                    <Td>{emp.basic_salary ?? "N/A"}</Td>
                    <Td>
                      <AddButton
                        onClick={() => handleOpenModal(emp)}
                        disabled={emp.incentive_amount > 0 || incentiveAddedIds.includes(emp.id)}
                      >
                        {emp.incentive_amount > 0 || incentiveAddedIds.includes(emp.id)
                          ? "Added"
                          : "+ Add"}
                      </AddButton>
                    </Td>
                    <Td>
                      <AddButton
                        onClick={() => handleOpenDeductionModal(emp)}
                        disabled={
                          emp.deduction_amount > 0 ||
                          deductionAddedIds.includes(emp.id)
                        }
                      >
                        {emp.deduction_amount > 0 ||
                          deductionAddedIds.includes(emp.id)
                          ? "Added"
                          : "+ Add"}
                      </AddButton>
                    </Td>
                    <Td>
                      <Link to={`/payrolldetails/${emp.id}`}>
                        <GoInfo style={{ cursor: "pointer", color: "black" }} />
                      </Link>
                    </Td>
                    <Td>
                      <VerificationCircles
                        emp={emp}
                        verificationStatus={verificationStatus}
                        handleCircleClick={handleCircleClick}
                      />
                    </Td>
                    <Td>
                      <Select
                        value={emp.status || ""}
                        onChange={(e) => handleSingleStatusChange(emp, e.target.value)}
                        $bg={emp.status ? getStatusColor(emp.status) : "white"}
                        $color={emp.status === "Pending" || !emp.status ? "black" : "white"}
                      >
                        <option value="OnHold">On Hold</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </Select>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: "20px" }}>
                    <NoEmployeeFound
                      searchTerm={searchTerm}
                      label="No Payroll Records Found"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalRecords={data.length}
          onPageChange={handlePageChange}
        />

        {showModal && selectedEmployee && (
          <IncentiveModal
            employee={selectedEmployee}
            month={selectedMonth}
            year={selectedYear}
            onClose={handleCloseModal}
          />
        )}
              {showDeductionModal && selectedDeductionEmployee && (
  <DeductionModal
    employee={selectedDeductionEmployee}
    month={selectedMonth}
    year={selectedYear}
    onClose={handleCloseDeductionModal}
  />
)}
      </Container>
    </>
  );
};

export default PayrollTable;