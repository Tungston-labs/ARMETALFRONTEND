// services/attendanceService.js
import API from "./api"; // your axios instance (adjust path if needed)

/**
 * fetchAttendanceList(params)
 * fetchAttendanceDetail(attendanceId, date)
 * fetchDepartmentsAttendance({ page, search })
 * fetchAttendanceSummary({ year, month, token })
 * updateAttendance({ employee, date, attendance_type, remark, token })
 */

export const fetchAttendanceList = async (params = {}) => {
  const response = await API.get("/admin/attendance/", { params });
  // console.log("📥 Attendance API response:", response.data);
  return response.data;
};

export const fetchAttendanceDetail = async (attendanceId, date) => {
  const url = date
    ? `/admin/attendance/${attendanceId}/?date=${encodeURIComponent(date)}`
    : `/admin/attendance/${attendanceId}/`;
  const response = await API.get(url);
  return response.data;
};

export const fetchDepartmentsAttendance = async ({ page = 1, search = "" }) => {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  const response = await API.get(`/dept-attendance/?${query.toString()}`);
  return response.data;
};

export const fetchAttendanceSummary = async ({
  year,
  month,
  token,
  page = 1,
  search = "",
}) => {
  const config = {
    params: {
      year,
      month,
      page,
      page_size: 20,
      search,
    },
  };

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await API.get(
    "/employee-attendance/summary/",
    config
  );

  return response.data;
};



// Generate monthly attendance Excel
export const generateAttendanceExcel = async ({
  year,
  month,
  token,
}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await API.post(
    "attendance-summary/excel/",
    {
      year,
      month,
    },
    config
  );

  return response.data;
};

// Update (mark) a single attendance record
export const updateAttendance = async ({
  employee,
  date,
  attendance_type,
  remark,
  token,
}) => {
  const config = {};

  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }

  const response = await API.patch(
    "/attendance/update/",
    {
      employee,
      date,
      attendance_type,
      remark,
    },
    config
  );

  return response.data;
};

export const generateEmployeeAttendanceExcel = async ({
  employee,
  year,
  month,
  token,
}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",   // <-- binary file, not JSON
  };

  const response = await API.post(
    "/attendance/employee-excel/",   // <-- single-employee endpoint
    {
      employee,
      year,
      month,
    },
    config
  );

  return response.data; // Blob (the .xlsx file itself)
};