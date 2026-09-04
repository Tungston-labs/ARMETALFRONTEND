import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {
  getDepartments,
  getEmployeesByDepartment,
  updateDepartmentById,
} from "../../Redux/departmentSlice.js";
import { deleteEmployeeById } from "../../Redux/employeeSlice.js";
import { fetchDepartmentById } from "../../services/departmentServices.js";

export const PAGE_SIZE = 10;

const EMPTY_ENTRY = {
  employees: [],
  details: {},
  form: { name: "", department_code: "", department_head_id: "" },
  page: 1,
  isEditing: false,
  loaded: false,
};

const confirmDelete = (employeeName) =>
  Swal.fire({
    title: "Are you sure?",
    text: `Employee "${employeeName}" will be permanently deleted.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete!",
  });

const showError = (message) => Swal.fire("Error", message, "error");

/**
 * Encapsulates all per-department state: expand/collapse, employee list,
 * department details, edit form, pagination, and mutations (update dept,
 * delete employee). Keyed internally by department id so the component
 * never has to juggle five parallel state objects.
 */
export function useDepartmentDetails() {
  const dispatch = useDispatch();

  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [byId, setById] = useState({}); // { [deptId]: entry }
  const [loadingDept, setLoadingDept] = useState(false);
  const [savingDept, setSavingDept] = useState(false);

  const getEntry = (deptId) => byId[deptId] || EMPTY_ENTRY;

  const patchEntry = (deptId, patch) =>
    setById((prev) => ({
      ...prev,
      [deptId]: { ...getEntry(deptId), ...prev[deptId], ...patch },
    }));

  const patchForm = (deptId, formPatch) =>
    setById((prev) => {
      const entry = prev[deptId] || EMPTY_ENTRY;
      return {
        ...prev,
        [deptId]: { ...entry, form: { ...entry.form, ...formPatch } },
      };
    });

  const loadDepartment = async (deptId, fallbackList) => {
    setLoadingDept(true);
    try {
      const employees = await dispatch(getEmployeesByDepartment(deptId)).unwrap();

      let details;
      try {
        details = await fetchDepartmentById(deptId);
      } catch {
        details = fallbackList.find((d) => d.id === deptId) || {};
      }

      patchEntry(deptId, {
        employees: employees || [],
        details,
        form: {
          name: details.name || "",
          department_code: details.department_code || "",
          department_head_id: details.department_head?.id || "",
        },
        loaded: true,
      });
    } catch {
      showError("Failed to load department data.");
    } finally {
      setLoadingDept(false);
    }
  };

  const toggleDepartment = (deptId, fallbackList) => {
    if (selectedDeptId === deptId) {
      setSelectedDeptId(null);
      patchEntry(deptId, { isEditing: false });
      return;
    }

    setSelectedDeptId(deptId);
    patchEntry(deptId, { isEditing: false, page: 1 });

    const entry = getEntry(deptId);
    if (!entry.loaded) {
      loadDepartment(deptId, fallbackList);
    }
  };

  const toggleEdit = (deptId) => {
    const entry = getEntry(deptId);
    patchEntry(deptId, { isEditing: !entry.isEditing });
  };

  const updateFormField = (deptId, e) => {
    const { name, value } = e.target;
    patchForm(deptId, { [name]: value });
  };

  const setPage = (deptId, page) => patchEntry(deptId, { page });

  const saveDepartment = async (deptId) => {
    const { form } = getEntry(deptId);
    const payload = {
      name: form.name,
      department_code: form.department_code,
      department_head_id: form.department_head_id
        ? parseInt(form.department_head_id, 10)
        : null,
    };

    if (!payload.department_head_id) {
      Swal.fire({
        icon: "warning",
        title: "Missing Department Head",
        text: "Please select a department head before saving.",
        confirmButtonColor: "#3352BA",
      });
      return;
    }

    try {
      await dispatch(updateDepartmentById({ id: deptId, data: payload })).unwrap();
      const updated = await fetchDepartmentById(deptId);

      patchEntry(deptId, {
        details: updated,
        form: {
          name: updated.name || "",
          department_code: updated.department_code || "",
          department_head_id: updated.department_head?.id || "",
        },
        isEditing: false,
      });

      dispatch(getDepartments({ page: 1, search: "" }));
      Swal.fire("Updated!", "Department updated successfully.", "success");
    } catch {
      showError("Something went wrong while updating department.");
    }
  };

  const deleteEmployee = (employeeId, employeeName, deptId) => {
    confirmDelete(employeeName).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await dispatch(deleteEmployeeById(employeeId)).unwrap();

        try {
          const updated = await dispatch(getEmployeesByDepartment(deptId)).unwrap();
          patchEntry(deptId, { employees: updated || [] });
          Swal.fire("Deleted!", `Employee "${employeeName}" has been deleted.`, "success");
        } catch {
          // Department has no employees left — API 404s on an empty department.
          patchEntry(deptId, { employees: [] });
          setSelectedDeptId(null);
          dispatch(getDepartments({ page: 1, search: "" }));
          Swal.fire(
            "Deleted!",
            `Employee "${employeeName}" has been deleted. The department has been removed as it has no employees.`,
            "success",
          );
        }
      } catch {
        showError("Failed to delete employee.");
      }
    });
  };

  return {
    selectedDeptId,
    loadingDept,
    savingDept,
    getEntry,
    toggleDepartment,
    toggleEdit,
    updateFormField,
    setPage,
    saveDepartment,
    deleteEmployee,
  };
}