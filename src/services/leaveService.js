import API from './api';

export const fetchAllLeaveRequests = async ({
  page = 1,
  status,
  department_id,
  search,
  month,
  year,
}) => {
  const params = new URLSearchParams({ page });

  if (status) params.append("status", status);
  if (department_id) params.append("department_id", department_id);
  if (search) params.append("search", search);

  if (month) params.append("month", month);
  if (year) params.append("year", year);

  const response = await API.get(
    `/leave/admin/?${params.toString()}`
  );

  return response.data;
};

// Fetch leave details by ID
export const fetchLeaveDetailsById = async (id) => {
  const response = await API.get(`/leave/admin/${id}/`);
  return response.data;
};

// Update leave status
export const updateLeaveStatus = async (leaveId, status) => {
  const response = await API.patch(`/leave/admin/${leaveId}/`, { status });
  return response.data;
};

// Fetch employees on leave in a department, overlapping the given dates.
// Only departmentId is required; the other params are optional filters.
export const fetchOnLeaveEmployees = async ({
  departmentId,
  from_date,
  to_date,
  exclude_employee_id,
}) => {
  const params = {};
  if (from_date) params.from_date = from_date;
  if (to_date) params.to_date = to_date;
  if (exclude_employee_id) params.exclude_employee_id = exclude_employee_id;

  const response = await API.get(
    `/departments/${departmentId}/on-leave-employees/`,
    { params }
  );
  return response.data;
};

// leave counts
export const fetchLeaveCounts = async () => {
  const response = await API.get('/leave-counts/');
  return response.data;
};

// pending leave count for one employee (moved here from leaveSlice)
export const fetchEmployeePendingLeaves = async (employeeId) => {
  const response = await API.get(`/leaves/${employeeId}/pending-count/`);
  return response.data.count;
};

export const fetchLeaveConflicts = async (leaveId) => {
  const response = await API.get(`/leave/admin/${leaveId}/conflicts/`);
  return response.data;
};