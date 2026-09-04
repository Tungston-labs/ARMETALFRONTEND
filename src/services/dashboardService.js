// services/dashboardService.js
import API from "./api"; // Axios instance

const BASE = "/admindashboard/";

export const fetchDashboardSummary = async () => {
  const response = await API.get('/admin/dashboard-summary/');
  return response.data;
};



export const fetchDashCounts = async () => {
  const response = await API.get(`${BASE}counts/`);
  return response.data;
};


export const fetchReimbursementMonthwise = async () => {
  const response = await API.get(`${BASE}reimbursement/monthwise/`);

  return response.data;
};

export const fetchDepartmentDashboard = async () => {
  const response = await API.get(`${BASE}department/`);
  return response.data;
};

export const fetchRecentEmployees = async () => {
  const response = await API.get(`${BASE}recentemployees/`);
  return response.data;
};

export const fetchContractExpiry = async () => {
  const response = await API.get(`${BASE}contract-expiry/30-days/`);
  return response.data;
};

export const fetchSimpleNotifications = async () => {
  const response = await API.get(`${BASE}simple-notifications/`);
  return response.data;
};

export const fetchTodayEmployeeStats = async () => {
  const response = await API.get(`${BASE}today-employee-stats/`);
  return response.data;
};

export const fetchDashboardCounts = async () => {
  const response = await API.get(`${BASE}counts/`);
  return response.data;
};

export const fetchProjectEmployeeCount = async () => {
  const response = await API.get(`${BASE}project/count/`);
  return response.data;
};

export const fetchWeeklyAttendanceStats = async () => {
  const response = await API.get(`${BASE}weekly-attendance/`);
  return response.data;
};

export const fetchReimbursementCounts = async () => {
  const response = await API.get(`${BASE}reimbursement/counts/`);

  console.log("Reimbursement Counts:", response.data);

  return response.data;
};

export const fetchUpcomingHolidaysBirthdays = async () => {
  const response = await API.get(
    `${BASE}dashboard/upcoming-holidays-birthdays/`
  );

  return response.data;
};


export const fetchHolidays = async () => {
  const response = await API.get("/holidays/");
  return response.data;
};

export const fetchMonthlyPayrollSummary = async (year) => {
  const response = await API.get(
    "/admindashboard/payroll/monthly-summary/",
    {
      params: {
        year,
      },
    }
  );

  return response.data;
};