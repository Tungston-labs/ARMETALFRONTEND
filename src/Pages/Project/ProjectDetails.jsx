import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    PiCalendarBlank,
    PiCheckCircle,
    PiFlag,
    PiPencilSimple,
    PiTrash,
    PiUsersThree,
} from "react-icons/pi";

import {
    HeaderButton,
} from "../../Components/ReusableTable/ReusableHeader.styles";

import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../Components/StatsCards/StatsCards";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ProjectModal from "../../Components/Project/modal/ProjectModal";
import ReusableConfirmModal from "../../Components/modals/ReusableConfirmModal";
import AddEmployeeModal from "../../Components/Project/modal/Addemployeemodal";

import {
    DetailsPage,
    DetailsContainer,
    Title,
} from "./ProjectDetails.styles";

import {
    getProjectById,
    updateProject,
    deleteProject,
    getEmployeesNotInProject,
    assignEmployees,
    removeEmployeeFromProject,
} from "../../Redux/fieldShiftSlice";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // =====================================================
    // REDUX
    // =====================================================

    const {
        project,
        employeesNotInProject = [],
        isLoading,
        isError,
        message,
    } = useSelector((state) => state.projects);

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [employees, setEmployees] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [month, setMonth] = useState("");

    // =====================================================
    // MODALS
    // =====================================================

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [showProjectModal, setShowProjectModal] =
        useState(false);

    const [showAddEmployeeModal, setShowAddEmployeeModal] =
        useState(false);

    const [isDeleting, setIsDeleting] =
        useState(false);

    const [isUpdating, setIsUpdating] =
        useState(false);

    // =====================================================
    // GET PROJECT
    // =====================================================

    useEffect(() => {
        if (id) {
            dispatch(getProjectById(id));
        }
    }, [dispatch, id]);

    // =====================================================
    // SET EMPLOYEES FROM PROJECT
    // =====================================================

    useEffect(() => {
        if (project?.employees) {
            setEmployees(project.employees);
        } else {
            setEmployees([]);
        }
    }, [project]);

    const normalizeEmployee = (employee) => {
        if (typeof employee === "object" && employee !== null) {
            return {
                id: employee.id,

                name:
                    employee.name ||
                    employee.employee_name ||
                    employee.full_name ||
                    `Employee ${employee.id}`,

                is_lead: employee.is_lead || false,

                department_name:
                    employee.department_name || "-",

                designation:
                    employee.designation || "-",

                email:
                    employee.email || "-",
            };
        }

        return {
            id: employee,
            name: `Employee ${employee}`,
            is_lead: false,
            department_name: "-",
            designation: "-",
            email: "-",
        };
    };

    const normalizedEmployees = useMemo(() => {
        return employees.map(normalizeEmployee);
    }, [employees]);

    const departmentOptions = useMemo(() => {
        const names = normalizedEmployees
            .map((employee) => employee.department_name)
            .filter((name) => name && name !== "-");

        return [...new Set(names)];
    }, [normalizedEmployees]);

    // =====================================================
    // FILTER EMPLOYEES
    // =====================================================

    const filteredEmployees = useMemo(() => {
        return normalizedEmployees.filter((employee) => {
            const matchesSearch =
                !search ||
                employee.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesDepartment =
                !department ||
                employee.department_name === department;

            return matchesSearch && matchesDepartment;
        });
    }, [
        normalizedEmployees,
        search,
        department,
    ]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const paginatedData = useMemo(() => {
        const start =
            (currentPage - 1) * rowsPerPage;

        return filteredEmployees.slice(
            start,
            start + rowsPerPage
        );
    }, [
        filteredEmployees,
        currentPage,
        rowsPerPage,
    ]);

    // =====================================================
    // OPEN ADD EMPLOYEE
    // =====================================================

    const handleOpenAddEmployee = async () => {
        if (!project) return;

        try {
            await dispatch(
                getEmployeesNotInProject(project.id)
            ).unwrap();

            setShowAddEmployeeModal(true);
        } catch (error) {
            console.error(
                "Failed to get available employees:",
                error
            );
        }
    };

    // =====================================================
    // ADD EMPLOYEES
    // =====================================================

    const handleAddEmployees = async ({
        employeeIds,
        teamLeadIds,
    }) => {
        if (!project || !employeeIds?.length) {
            return;
        }

        try {
            await dispatch(
                assignEmployees({
                    projectId: project.id,
                    employeeIds,
                    teamLeadIds,
                })
            ).unwrap();

            await dispatch(
                getProjectById(project.id)
            ).unwrap();

            setShowAddEmployeeModal(false);

        } catch (error) {
            console.error(
                "Failed to assign employees:",
                error
            );
        }
    };

    // =====================================================
    // EDIT PROJECT
    // =====================================================

    const handleOpenEditProject = () => {
        if (!project) return;

        setShowProjectModal(true);
    };

    const handleCloseProjectModal = () => {
        setShowProjectModal(false);
    };

    // =====================================================
    // UPDATE PROJECT
    // =====================================================

    const handleUpdateProject = async (
  formData,
  editData
) => {
  if (!editData?.id) return;

  try {
    setIsUpdating(true);

    const projectData = {
      name: formData.projectName,
      punch_type: formData.projectType,

      latitude: formData.latitude
        ? Number(formData.latitude)
        : null,

      longitude: formData.longitude
        ? Number(formData.longitude)
        : null,

      priority: formData.priority,
      start_date: formData.startDate || null,
      status: formData.projectStatus,

      // Employees currently selected in Edit modal
      employees: formData.employeeIds || [],

      // Employees marked as Team Lead
      team_leads: formData.teamLeadIds || [],
    };

    await dispatch(
      updateProject({
        id: editData.id,
        projectData,
      })
    ).unwrap();

    await dispatch(
      getProjectById(editData.id)
    ).unwrap();

    setShowProjectModal(false);

  } catch (error) {
    console.error(
      "Failed to update project:",
      error
    );
  } finally {
    setIsUpdating(false);
  }
};

    // =====================================================
    // DELETE PROJECT
    // =====================================================

    const handleDeleteProject = async () => {
        if (!project?.id) return;

        try {
            setIsDeleting(true);

            await dispatch(
                deleteProject(project.id)
            ).unwrap();

            setShowDeleteModal(false);

            navigate("/projects");

        } catch (error) {
            console.error(
                "Failed to delete project:",
                error
            );
        } finally {
            setIsDeleting(false);
        }
    };

    // =====================================================
    // REMOVE EMPLOYEE
    // =====================================================

    const handleDeleteEmployee = async (
        employeeId
    ) => {
        if (!project?.id) return;

        try {
            await dispatch(
                removeEmployeeFromProject({
                    projectId: project.id,
                    employeeId,
                })
            ).unwrap();

            /*
             * Reload project after removal.
             */
            await dispatch(
                getProjectById(project.id)
            ).unwrap();

        } catch (error) {
            console.error(
                "Failed to remove employee:",
                error
            );
        }
    };

    // =====================================================
    // EMPLOYEE TABLE COLUMNS
    // =====================================================

    const employeeColumns = [
        {
            accessor: "id",
            header: "Employee ID",
            sortable: true,
        },
        {
            accessor: "name",
            header: "Employee",
            sortable: true,
            render: (row) => (
                <span>
                    {row.name}
                    {row.is_lead && " (Team Lead)"}
                </span>
            ),
        },
        {
            accessor: "department_name",
            header: "Department",
            sortable: true,
        },
        {
            accessor: "designation",
            header: "Job Position",
            sortable: true,
        },
        {
            accessor: "email",
            header: "Email",
            sortable: true,
        },
        {
            accessor: "action",
            header: "Delete",
            sortable: false,

            render: (row) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();

                        handleDeleteEmployee(
                            row.id
                        );
                    }}
                    style={{
                        border: "none",
                        background:
                            "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        color: "#DB0F12",
                        padding: "5px",
                    }}
                    title="Remove Employee"
                >
                    <PiTrash size={20} />
                </button>
            ),
        },
    ];
    const formatDate = (date) => {
        if (!date) return "-";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        const day = String(parsedDate.getDate()).padStart(2, "0");
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const year = parsedDate.getFullYear();

        return `${day}/${month}/${year}`;
    };
    // =====================================================
    // PROJECT STATS
    // =====================================================

    const projectStats = project
        ? [
            {
                title: "Project Status",
                count:
                    project.status ||
                    "-",
                icon: <PiCheckCircle />,
                iconColor: "#15AA60",
                backgroundColor:
                    "#E3F7ED",
            },

            // {
            //     title: "Priority",
            //     count:
            //         project.priority ||
            //         "-",
            //     icon: <PiFlag />,
            //     iconColor: "#FF8B2C",
            //     backgroundColor:
            //         "#FFF1E5",
            // },

            {
                title: "Project Date",
                count: formatDate(
                    project.start_date || project.date
                ),
                icon: <PiCalendarBlank />,
                iconColor: "#3858C8",
                
                backgroundColor:
                    "#E8EDFF",
            },

            {
                title: "Total Members",
                count:
                    employees.length,
                icon: <PiUsersThree />,
                iconColor: "#8E44AD",
                backgroundColor:
                    "#F3E8FF",
            },
        ]
        : [];



    // =====================================================
    // ERROR / NOT FOUND
    // =====================================================

    if (!project) {
        return (
            <DetailsPage>
                <DetailsContainer>
                    <Title>
                        {isError
                            ? "Failed to load project"
                            : "Project Not Found"}
                    </Title>

                    {message && (
                        <p>{String(message)}</p>
                    )}
                </DetailsContainer>
            </DetailsPage>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <DetailsPage>

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <ReusableHeader
                title={project.name}
                breadcrumbs={[
                    "Projects",
                    project.name,
                ]}
                showBack
                onBack={() =>
                    navigate("/projects")
                }
            >

                {/* EDIT */}

                <HeaderButton
                    type="button"
                    onClick={
                        handleOpenEditProject
                    }
                >
                    <PiPencilSimple />
                    Edit
                </HeaderButton>

                {/* DELETE */}

                <HeaderButton
                    type="button"
                    $variant="danger"
                    onClick={() =>
                        setShowDeleteModal(
                            true
                        )
                    }
                >
                    <PiTrash />
                    Delete
                </HeaderButton>

            </ReusableHeader>

            {/* ================================================= */}
            {/* STATS */}
            {/* ================================================= */}

            <StatsCards
                cards={projectStats}
            />

            {/* ================================================= */}
            {/* FILTER */}
            {/* ================================================= */}

            <ReusableFilter
                search={search}
                onSearch={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
                showSearch


                rightAction={
                    <HeaderButton
                        type="button"
                        $variant="blue"
                        onClick={
                            handleOpenAddEmployee
                        }
                    >
                        + ADD EMPLOYEE
                    </HeaderButton>
                }
            />

            {/* ================================================= */}
            {/* EMPLOYEE TABLE */}
            {/* ================================================= */}

            <ReusableTable
                columns={employeeColumns}
                data={paginatedData}
                loading={isLoading}
                skeletonRows={8}
            />

            {/* ================================================= */}
            {/* DELETE PROJECT */}
            {/* ================================================= */}

            <ReusableConfirmModal
                show={showDeleteModal}
                title="Delete Project"
                message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="danger"
                cancelVariant="cancel"
                loadingText="Deleting..."
                loading={isDeleting}
                onConfirm={
                    handleDeleteProject
                }
                onClose={() => {
                    if (!isDeleting) {
                        setShowDeleteModal(
                            false
                        );
                    }
                }}
            />

            {/* ================================================= */}
            {/* EDIT PROJECT */}
            {/* ================================================= */}

            <ProjectModal
                isOpen={showProjectModal}
                onClose={
                    handleCloseProjectModal
                }
                editData={project}
                onSubmit={
                    handleUpdateProject
                }
            />

            {/* ================================================= */}
            {/* ADD EMPLOYEE */}
            {/* ================================================= */}

            <AddEmployeeModal
                isOpen={
                    showAddEmployeeModal
                }

                onClose={() =>
                    setShowAddEmployeeModal(
                        false
                    )
                }

                employees={
                    employeesNotInProject
                }

                onAdd={
                    handleAddEmployees
                }

                isLoading={
                    isLoading
                }
            />

        </DetailsPage>
    );
};

export default ProjectDetails;