import React from "react";
import { Link } from "react-router-dom";
import { GoInfo } from "react-icons/go";
import { Select } from "../PayrollTablestyes";
import VerificationCircles from "../../../Components/payroll/VerificationCircle";
import { formatCurrency } from "../../../utils/FormatCurrency"; // adjust path to match where you saved it

export const getPayrollColumns = ({
  page,
  limit,
  totalRows,
  selectedEmployees,
  handleSelectAll,
  toggleEmployeeSelect,
  formatDate,
  calculateNetPay,
  verificationStatus,
  handleCircleClick,
  handleSingleStatusChange,
  getStatusColor,
  currencyCode, // company's active currency, e.g. "INR", "AED", "USD"
}) => [
  {
    header: (
      <input
        type="checkbox"
        checked={selectedEmployees.length > 0 && selectedEmployees.length === totalRows}
        onChange={handleSelectAll}
      />
    ),
    accessor: "select",
    sortable: false,
    render: (emp) => (
      <input
        type="checkbox"
        checked={selectedEmployees.includes(emp.id)}
        onChange={() => toggleEmployeeSelect(emp.id)}
      />
    ),
  },
  {
    header: "Sl No",
    accessor: "slNo",
    sortable: false,
    render: (emp, index) => (page - 1) * limit + index + 1,
  },
  {
    header: "Employee Name",
    accessor: "employee_name",
  },
  {
    header: "Employee ID",
    accessor: "employee_code",
    render: (emp) => emp.employee_code,
  },
  {
    header: "Department",
    accessor: "department",
    render: (emp) => emp.department_name || emp.department || "N/A",
  },
  {
    header: "Joining Date",
    accessor: "joining_date",
    render: (emp) => formatDate(emp.joining_date),
  },
  {
    header: "Salary",
    accessor: "basic_salary",
    render: (emp) =>
      emp.basic_salary != null
        ? formatCurrency(emp.basic_salary, currencyCode)
        : "N/A",
  },
  {
    header: "Net Pay",
    accessor: "net_pay",
    sortable: false,
    render: (emp) => (
      <span style={{ color: "#16a34a", fontWeight: 600 }}>
        {formatCurrency(calculateNetPay(emp), currencyCode)}
      </span>
    ),
  },
  {
    header: "Incentive",
    accessor: "incentive_amount",
    sortable: false,
    render: (row) => (
      <span>{formatCurrency(row.incentive_amount || 0, currencyCode)}</span>
    ),
  },
  {
    header: "Deduction",
    accessor: "deduction_amount",
    sortable: false,
    render: (row) => (
      <span>{formatCurrency(row.deduction_amount || 0, currencyCode)}</span>
    ),
  },
  {
    header: "Info",
    accessor: "info",
    sortable: false,
    render: (emp) => (
      <Link to={`/payrolldetails/${emp.id}`}>
        <GoInfo style={{ cursor: "pointer", color: "black" }} />
      </Link>
    ),
  },
  {
    header: "Verification",
    accessor: "verification",
    sortable: false,
    render: (emp) => (
      <VerificationCircles
        emp={emp}
        verificationStatus={verificationStatus}
        handleCircleClick={handleCircleClick}
      />
    ),
  },
  {
    header: "Status",
    accessor: "status",
    sortable: false,
    render: (emp) => (
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
    ),
  },
];