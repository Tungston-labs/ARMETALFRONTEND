// src/services/projectService.js
import API from "./api";

// Create a new project
const createProject = async (projectData) => {
  const response = await API.post("/project/", projectData);
  return response.data;
};

// Get all projects
const getProjects = async (
  search = "",
  page = 1,
  status = "",
  date = ""
) => {
  const response = await API.get("/project/", {
    params: {
      search,
      page,
      status,
      date,
    },
  });

  return response.data;
};


// Get a single project by ID
const getProjectById = async (id) => {
  const response = await API.get(`/project/${id}/`);
  return response.data;
};

// Update a project
const updateProject = async ({ id, projectData }) => {
  const response = await API.put(`/project/${id}/`, projectData);
  return response.data;
};
// Assign employees to a project
const assignEmployees = async (
  projectId,
  employeeIds,
  teamLeadIds
) => {
  const response = await API.patch(
    `/project/${projectId}/`,
    {
      employees: employeeIds,
      team_leads: teamLeadIds,
    }
  );

  return response.data;
};

// Delete a project
const deleteProject = async (id) => {
  const response = await API.delete(`/project/${id}/`);
  return response.data;
};

// Get employees not in a specific project
const getEmployeesNotInProject = async (projectId) => {
  const response = await API.get(`/project/${projectId}/employees-not-in-project/`);
  return response.data;
};
// Remove an employee from a specific project
const removeEmployeeFromProject = async (projectId, employeeId) => {
  const response = await API.delete(`/project/${projectId}/remove-employee/${employeeId}/`);
  return response.data;
};
// Field Info service
export const fieldInfoService = async (employeeId, date) => {
  const response = await API.get(`/project/employee/${employeeId}/attendance/?date=${date}`);
  return response.data;
};

export const fetchProjectCount = async () => {
  const response = await API.get("/project/count/");
  return response.data;
};

const projectService = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getEmployeesNotInProject,
  removeEmployeeFromProject,assignEmployees,fetchProjectCount
};

export default projectService;
