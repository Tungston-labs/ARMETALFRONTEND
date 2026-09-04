// src/features/projects/projectSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import projectService, {
  fieldInfoService,
  fetchProjectCount,
} from "../services/fieldShiftService";

// ============================================================
// GET PROJECTS
// ============================================================

export const getProjects = createAsyncThunk(
  "projects/getAll",
  async (
    {
      search = "",
      page = 1,
      status = "",
      date = "",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      return await projectService.getProjects(
        search,
        page,
        status,
        date
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ============================================================
// CREATE PROJECT
// ============================================================

export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData, { rejectWithValue }) => {
    try {
      return await projectService.createProject(projectData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ============================================================
// GET PROJECT BY ID
// ============================================================

export const getProjectById = createAsyncThunk(
  "projects/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await projectService.getProjectById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ============================================================
// UPDATE PROJECT
// ============================================================

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      return await projectService.updateProject({
        id,
        projectData,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ============================================================
// DELETE PROJECT
// ============================================================

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ============================================================
// GET EMPLOYEES NOT IN PROJECT
// ============================================================

export const getEmployeesNotInProject = createAsyncThunk(
  "projects/getEmployeesNotInProject",
  async (projectId, { rejectWithValue }) => {
    try {
      return await projectService.getEmployeesNotInProject(
        projectId
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ============================================================
// ASSIGN EMPLOYEES
// ============================================================

export const assignEmployees = createAsyncThunk(
  "projects/assignEmployees",
  async (
    {
      projectId,
      employeeIds,
      teamLeadIds,
    },
    { rejectWithValue }
  ) => {
    try {
      return await projectService.assignEmployees(
        projectId,
        employeeIds,
        teamLeadIds
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ============================================================
// REMOVE EMPLOYEE FROM PROJECT
// ============================================================

export const removeEmployeeFromProject = createAsyncThunk(
  "projects/removeEmployeeFromProject",
  async (
    { projectId, employeeId },
    { rejectWithValue }
  ) => {
    try {
      return await projectService.removeEmployeeFromProject(
        projectId,
        employeeId
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ============================================================
// FIELD INFO
// ============================================================

export const getFieldInfo = createAsyncThunk(
  "projects/getFieldInfo",
  async (
    { employeeId, date },
    { rejectWithValue }
  ) => {
    try {
      return await fieldInfoService(
        employeeId,
        date
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ============================================================
// GET PROJECT COUNTS
// ============================================================

export const getProjectCount = createAsyncThunk(
  "projects/getProjectCount",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProjectCount();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ============================================================
// INITIAL STATE
// ============================================================

const projectSlice = createSlice({
  name: "projects",

  initialState: {
    projects: [],

    total_pages: 0,
    current_page: 1,
    total_items: 0,

    project: null,

    employeesNotInProject: [],

    fieldInfo: null,

    // Project dashboard counts
    projectCount: {
      total_projects: 0,
      completed: 0,
      in_progress: 0,
      pending: 0,
      high_priority: 0,
    },

    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },

  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.project = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================================
      // GET PROJECTS
      // ======================================================

      .addCase(getProjects.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

      .addCase(getProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;

        state.projects =
          action.payload.results || [];

        state.total_pages =
          action.payload.total_pages || 0;

        state.current_page =
          action.payload.current_page || 1;

        state.total_items =
          action.payload.total_items || 0;
      })

      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ======================================================
      // CREATE PROJECT
      // ======================================================

      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.projects.unshift(action.payload);

        state.total_items += 1;
      })

      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ======================================================
      // GET PROJECT BY ID
      // ======================================================

      .addCase(getProjectById.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.project = action.payload;
      })

      .addCase(getProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ======================================================
      // UPDATE PROJECT
      // ======================================================

      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.projects = state.projects.map(
          (proj) =>
            proj.id === action.payload.id
              ? action.payload
              : proj
        );
      })

      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ======================================================
      // DELETE PROJECT
      // ======================================================

      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.projects =
          state.projects.filter(
            (proj) => proj.id !== action.payload
          );

        state.total_items -= 1;
      })

      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ======================================================
      // GET EMPLOYEES NOT IN PROJECT
      // ======================================================

      .addCase(
        getEmployeesNotInProject.pending,
        (state) => {
          state.isLoading = true;
        }
      )

      .addCase(
        getEmployeesNotInProject.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;

          state.employeesNotInProject =
            action.payload;
        }
      )

      .addCase(
        getEmployeesNotInProject.rejected,
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      )

      // ======================================================
      // REMOVE EMPLOYEE
      // ======================================================

      .addCase(
        removeEmployeeFromProject.pending,
        (state) => {
          state.isLoading = true;
        }
      )

      .addCase(
        removeEmployeeFromProject.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;

          const {
            projectId,
            employeeId,
          } = action.meta.arg;

          const project =
            state.projects.find(
              (p) => p.id === projectId
            );

          if (
            project &&
            project.employees
          ) {
            project.employees =
              project.employees.filter(
                (emp) =>
                  emp.id !== employeeId
              );
          }
        }
      )

      .addCase(
        removeEmployeeFromProject.rejected,
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      )

      // ======================================================
      // ASSIGN EMPLOYEES
      // ======================================================

      .addCase(
        assignEmployees.pending,
        (state) => {
          state.isLoading = true;
        }
      )

      .addCase(
        assignEmployees.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;

          state.project =
            action.payload;

          const updatedProject =
            action.payload;

          state.projects =
            state.projects.map(
              (p) =>
                p.id === updatedProject.id
                  ? updatedProject
                  : p
            );
        }
      )

      .addCase(
        assignEmployees.rejected,
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      )

      // ======================================================
      // FIELD INFO
      // ======================================================

      .addCase(
        getFieldInfo.pending,
        (state) => {
          state.isLoading = true;
        }
      )

      .addCase(
        getFieldInfo.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;

          state.fieldInfo =
            action.payload;
        }
      )

      .addCase(
        getFieldInfo.rejected,
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      )

      // ======================================================
      // PROJECT COUNT
      // ======================================================

      .addCase(
        getProjectCount.pending,
        (state) => {
          state.isLoading = true;
          state.isError = false;
        }
      )

      .addCase(
        getProjectCount.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;

          state.projectCount = {
            total_projects:
              action.payload.total_projects || 0,

            completed:
              action.payload.completed || 0,

            in_progress:
              action.payload.in_progress || 0,

            pending:
              action.payload.pending || 0,

            high_priority:
              action.payload.high_priority || 0,
          };
        }
      )

      .addCase(
        getProjectCount.rejected,
        (state, action) => {
          state.isLoading = false;
          state.isError = true;

          state.message =
            action.payload;
        }
      );
  },
});

export const { reset } =
  projectSlice.actions;

export default projectSlice.reducer;