import { BiUser } from "react-icons/bi";
import { CiWallet } from "react-icons/ci";
import { FaRegBuilding } from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";

export const getDashboardStats = (data = {}) => [
  {
    id: 1,
    title: "Total Employees",
    value: data.total_employees ?? 0,
    icon: <BiUser />,
    iconBg: "#EEF2FF",
    iconColor: "#4F46E5",
    // percentage: `+${data.employee_change_percentage ?? 0}%`,
    // percentageColor: "#16A34A",
    // description: "Compared to last month",
  },

  {
    id: 2,
    title: "Departments",
    value: data.total_departments ?? 0,
    icon: <FaRegBuilding />,
    iconBg: "#FFF7ED",
    iconColor: "#F97316",
    // percentage: `+${data.new_departments ?? 0}`,
    // percentageColor: "#F97316",
    // description: "New departments",
  },

  {
    id: 3,
    title: "Total Project",
    value: data.total_projects ?? 0,
    icon: <FaRegBuilding />,
    iconBg: "#FFF7ED",
    iconColor: "#F97316",
    // percentage: `+${data.new_projects ?? 0}`,
    // percentageColor: "#F97316",
    // description: "New projects",
  },

  {
    id: 4,
    title: "Leave Count",
    value: data.pending_leave_requests ?? 0,
    icon: <AiOutlineFileText />,
    iconBg: "#FEF2F2",
    iconColor: "#EF4444",
    // percentage: `${data.leave_change_percentage ?? 0}%`,
    // percentageColor: "#EF4444",
    // description: "Compared to yesterday",
  },

  {
    id: 5,
    title: "Monthly Payroll",
    value: `₹${data.monthly_payroll_amount ?? 0}`,
    icon: <CiWallet />,
    iconBg: "#ECFDF3",
    iconColor: "#10B981",
    // percentage: `+${data.payroll_change_percentage ?? 0}%`,
    // percentageColor: "#16A34A",
    // description: "Compared to last month",
  },

  {
    id: 6,
    title: "Visa Expiry",
    value: data.expiry_count ?? 0,
    icon: <AiOutlineFileText />,
    iconBg: "#FEF2F2",
    iconColor: "#EF4444",
    // percentage: `${data.expiry_change_percentage ?? 0}%`,
    // percentageColor: "#EF4444",
    // description: "Compared to yesterday",
  },
];


// ===============================
// Payroll Chart
// ===============================
export const getPayrollData = (data = {}) => {
  if (!Array.isArray(data.monthly_data)) {
    return [];
  }

  return data.monthly_data.map((item) => ({
    month: item.month_name?.slice(0, 3) || "",
    salary: item.paid_salary ?? 0,
    incentive: item.incentive ?? 0,
    deduction: item.deduction ?? 0,
  }));
};


// ===============================
// Reimbursement
// ===============================

export const getReimbursementData = (data = {}) => [
  {
    name: "Approved",
    value: data.approved_count ?? 0,
    amount: data.approved_amount ?? 0,
    color: "#4F6EF7",
  },
  {
    name: "Verification",
    value: data.verification_count ?? 0,
    amount: 0,
    color: "#10B981",
  },
  {
    name: "Rejected",
    value: data.rejected_count ?? 0,
    amount: 0,
    color: "#F43F5E",
  },
  {
    name: "Pending",
    value: data.pending_count ?? 0,
    amount: 0,
    color: "#F59E0B",
  },
];

// ===============================
// Resource Allocation
// ===============================

export const getResourceAllocationData = (data = {}) => [
  {
    name: "Onsite",
    value: data.on_site ?? 0,
  },
  {
    name: "Variant",
    value: data.variant ?? 0,
  },
  {
    name: "Bench",
    value: data.bench ?? 0,
  },
];


// ===============================
// Attendance Trend
// ===============================

export const attendanceData = [
  {
    day: "Mon",
    present: 190,
    absent: 70,
    late: 55,
  },
  {
    day: "Tue",
    present: 195,
    absent: 75,
    late: 55,
  },
  {
    day: "Wed",
    present: 170,
    absent: 90,
    late: 55,
  },
  {
    day: "Thu",
    present: 160,
    absent: 90,
    late: 60,
  },
  {
    day: "Fri",
    present: 165,
    absent: 65,
    late: 75,
  },
  {
    day: "sat",
    present: 100,
    absent: 85,
    late: 50,
  },
  {
    day: "Sun",
    present: 120,
    absent: 80,
    late: 50,
  },
];


// ===============================
// GOSI
// ===============================

export const gosiData = {
  totalEmployee: 248,
  eligibleEmployee: 226,
  contribution: "$22,450",
  companyShare: "$14,200",
  employeeShare: "$8,250",
};


// ===============================
// Employee Engagement
// ===============================

export const getEngagementData = (data = {}) => {
  const events = [];

  // ===============================
  // Upcoming Holidays
  // ===============================

  if (Array.isArray(data.upcoming_holidays)) {
    data.upcoming_holidays.forEach((holiday) => {
      events.push({
        type: "holiday",
        title: "Upcoming Holiday!",
        date: holiday.date || "",
        subtitle:
          holiday.description ||
          "Holiday",
        daysLeft: holiday.days_left,
        holidayType: holiday.holiday_type,
      });
    });
  }

  // ===============================
  // Upcoming Birthdays
  // ===============================

  if (Array.isArray(data.upcoming_birthdays)) {
    data.upcoming_birthdays.forEach((birthday) => {
      events.push({
        type: "birthday",
        title: "Upcoming Birthday!",
        date:
          birthday.birthday ||
          birthday.date_of_birth ||
          "",
        subtitle:
          birthday.employee_name ||
          "Employee Birthday",
        daysLeft: birthday.days_left,
        employeeName: birthday.employee_name,
      });
    });
  }

  return events.slice(0, 3);
};