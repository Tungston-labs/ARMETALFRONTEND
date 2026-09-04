import API from "./api";

// =====================================================
// GET: List all departments
// =====================================================
export const fetchDepartments = async ({
  page = 1,
  search = "",
}) => {
  const queryParams = new URLSearchParams();

  if (search) {
    queryParams.append("search", search);
  }

  if (page) {
    queryParams.append("page", page);
  }

  const response = await API.get(
    `/departments/?${queryParams.toString()}`
  );

  return response.data;
};

// =====================================================
// GET: Minimal departments
// =====================================================
export const fetchDepartmentMin = async () => {
  const response = await API.get("/deptlist/");

  console.log("Department Min API:", response.data);

  return response.data;
};

// =====================================================
// POST: Create department
// =====================================================
export const createDepartment = async (data) => {
  const response = await API.post(
    "/departments/",
    data
  );

  return response.data;
};

// =====================================================
// GET: Department detail
// =====================================================
export const fetchDepartmentById = async (id) => {
  console.log(
    "Getting department details:",
    id
  );

  const response = await API.get(
    `/departments/${id}/`
  );

  console.log(
    "Department details response:",
    response.data
  );

  return response.data;
};

// =====================================================
// GET: Employees by department
// IMPORTANT:
// Backend endpoint is /employees/dep/{id}/
// =====================================================
export const fetchEmployeesByDepartment = async (departmentId) => {
  const response = await API.get(
    `/employees/department/${departmentId}/`
  );

  console.log(
    "Employees by department response:",
    response.data
  );

  return response.data;
};
// =====================================================
// PATCH: Update department
// =====================================================
export const updateDepartment = async (
  id,
  data
) => {
  const response = await API.patch(
    `/departments/${id}/`,
    data
  );

  return response.data;
};

// =====================================================
// DELETE: Department
// =====================================================
export const deleteDepartment = async (id) => {
  const response = await API.delete(
    `/departments/${id}/`
  );

  return response.data;
};

// =====================================================
// GET: Employees by department MINI
// id + name + profile_pic
// =====================================================
export const fetchEmployeesByDepartmentMini = async (
  departmentId
) => {
  const response = await API.get(
    `/employees/dep/${departmentId}/`
  );

  return response.data;
};

