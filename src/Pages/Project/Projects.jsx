import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProjectCard from "../../Components/Project/ProjectCard";

import {
    ProjectsPage,
    ProjectsContainer,
    ProjectsGrid,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateText,
} from "./Projects.styles";

import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import StatsCards from "../../Components/StatsCards/StatsCards";

import ProjectModal from "../../Components/Project/modal/ProjectModal";
import AddEmployeeModal from "../../Components/Project/modal/Addemployeemodal";


import {
    getProjects,
    createProject,
    updateProject,
    getEmployeesNotInProject,
    assignEmployees,
    getProjectCount,
} from "../../Redux/fieldShiftSlice";

import { getProjectCards } from "../../utils/projectCards";
import SkeletonCard from "../../Components/Skeleton/ SkeletonCard";
import { FiInbox } from "react-icons/fi";

const Projects = () => {
    const dispatch = useDispatch();

    // =========================
    // REDUX STATE
    // =========================

    const {
        projects = [],
        employeesNotInProject = [],
        projectCount = {
            total: 0,
            completed: 0,
            in_progress: 0,
            pending: 0,
            high_priority: 0,
        },
        isLoading,
        isError,
        message,
    } = useSelector((state) => state.projects);

    // =========================
    // LOCAL STATE
    // =========================

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");
    const [page, setPage] = useState(1);

    // Project modal
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Employee modal
    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [selectedEmployeeProject, setSelectedEmployeeProject] =
        useState(null);
    const [isAssigning, setIsAssigning] = useState(false);

    // =========================
    // GET PROJECTS
    // =========================

    useEffect(() => {
        dispatch(
            getProjects({
                search,
                page,
                status,
                date: month,
            })
        );
    }, [dispatch, search, page, status, month]);

    // =========================
    // GET PROJECT COUNTS
    // =========================

    useEffect(() => {
        dispatch(getProjectCount());
    }, [dispatch]);

    // =========================
    // ADD PROJECT
    // =========================

    const handleAddProject = () => {
        setSelectedProject(null);
        setShowProjectModal(true);
    };

    // =========================
    // CLOSE PROJECT MODAL
    // =========================

    const handleCloseProjectModal = () => {
        setShowProjectModal(false);
        setSelectedProject(null);
    };

    // =========================
    // PROJECT PAYLOAD
    // =========================

    const toProjectPayload = (formData) => ({
        name: formData.projectName.trim(),

        punch_type: formData.projectType,

        latitude:
            formData.latitude !== ""
                ? Number(formData.latitude)
                : null,

        longitude:
            formData.longitude !== ""
                ? Number(formData.longitude)
                : null,

        priority: formData.priority,

        start_date: formData.startDate || null,

        status: formData.projectStatus,
    });

    // =========================
    // CREATE / UPDATE PROJECT
    // =========================

    const handleProjectSubmit = async (formData, editData) => {
        try {
            const projectData = toProjectPayload(formData);

            console.log("PROJECT PAYLOAD:", projectData);

            if (editData) {
                await dispatch(
                    updateProject({
                        id: editData.id,
                        projectData,
                    })
                ).unwrap();
            } else {
                await dispatch(
                    createProject(projectData)
                ).unwrap();
            }

            // Refresh project list
            dispatch(
                getProjects({
                    search,
                    page,
                    status,
                    date: month,
                })
            );

            // Refresh stats
            dispatch(getProjectCount());

            handleCloseProjectModal();
        } catch (error) {
            console.error(
                "Project operation failed:",
                error
            );
        }
    };

    // =========================
    // ADD EMPLOYEE
    // =========================

    const handleAddEmployee = async (project) => {
        if (!project?.id) return;

        setSelectedEmployeeProject(project);

        try {
            await dispatch(
                getEmployeesNotInProject(project.id)
            ).unwrap();

            setShowAddEmployee(true);
        } catch (error) {
            console.error(
                "Failed to get available employees:",
                error
            );
        }
    };

    // =========================
    // CLOSE EMPLOYEE MODAL
    // =========================

    const handleCloseAddEmployee = () => {
        setShowAddEmployee(false);
        setSelectedEmployeeProject(null);
    };

    // =========================
    // ASSIGN EMPLOYEES
    // =========================

    const handleAssignEmployees = async (employeeIds) => {
        if (
            !selectedEmployeeProject?.id ||
            !employeeIds?.length
        ) {
            return;
        }

        try {
            setIsAssigning(true);

            await dispatch(
                assignEmployees({
                    projectId: selectedEmployeeProject.id,
                    employeeIds,
                })
            ).unwrap();

            // Refresh project list
            dispatch(
                getProjects({
                    search,
                    page,
                    status,
                    date: month,
                })
            );

            handleCloseAddEmployee();
        } catch (error) {
            console.error(
                "Failed to assign employees:",
                error
            );
        } finally {
            setIsAssigning(false);
        }
    };

    // =========================
    // PROJECT STAT CARDS
    // =========================

    const projectCards = getProjectCards(projectCount);

    // =========================
    // RENDER
    // =========================

    return (
        <ProjectsPage>

            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <ReusableHeader
                title="Projects"
                breadcrumbs={["Projects"]}
                buttonText="+ ADD NEW PROJECT"
                onButtonClick={handleAddProject}
            />

            {/* ========================= */}
            {/* STATS */}
            {/* ========================= */}

            {isLoading ? (
                <StatsCards
                    cards={Array.from({ length: 4 }).map(() => ({}))}
                    loading
                />
            ) : (
                <StatsCards cards={projectCards} />
            )}

            {/* ========================= */}
            {/* FILTERS */}
            {/* ========================= */}

            <ReusableFilter
                search={search}
                onSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                searchPlaceholder="Search by Project Name"

                status={status}
                statuses={[
                    "In Progress",
                    "Completed",
                    "On Hold",
                    "Cancelled",
                ]}
                onStatus={(value) => {
                    const statusMap = {
                        "In Progress": "in_progress",
                        "Completed": "completed",
                        "On Hold": "on_hold",
                        "Cancelled": "cancelled",
                    };

                    setStatus(
                        statusMap[value] || ""
                    );

                    setPage(1);
                }}

                date={month}
                onDate={(value) => {
                    setMonth(value);
                    setPage(1);
                }}

                showSearch
                showStatus
            // showDate
            />

            {/* ========================= */}
            {/* ERROR */}
            {/* ========================= */}

            {isError && (
                <div>
                    {message ||
                        "Failed to load projects."}
                </div>
            )}

            {/* ========================= */}
            {/* PROJECT CARDS */}
            {/* ========================= */}

            <ProjectsContainer>
                <ProjectsGrid>

                    {isLoading ? (

                        // Skeleton cards
                        Array.from({ length: 8 }).map(
                            (_, index) => (
                                <SkeletonCard
                                    key={index}
                                />
                            )
                        )

                    ) : projects.length > 0 ? (

                        // Actual project cards
                        projects.map((project) => (
                            <ProjectCard
                                key={project.id}

                                id={project.id}

                                project={project}

                                category={
                                    project.punch_type
                                }

                                title={
                                    project.name
                                }

                                date={
                                    project.start_date ||
                                    project.date ||
                                    ""
                                }

                                status={
                                    project.status
                                }

                                priority={
                                    project.priority ||
                                    ""
                                }

                                members={
                                    project.employees ||
                                    []
                                }

                                memberCount={
                                    project.employees
                                        ?.length || 0
                                }

                                onAddMember={
                                    handleAddEmployee
                                }
                            />
                        ))

                    ) : (

                        <EmptyState>
                            <EmptyStateIcon>
                                <FiInbox />
                            </EmptyStateIcon>

                            <EmptyStateTitle>
                                No Projects Found
                            </EmptyStateTitle>

                            <EmptyStateText>
                                There are no projects matching your
                                current search or filter selection.
                            </EmptyStateText>
                        </EmptyState>

                    )}
                </ProjectsGrid>
            </ProjectsContainer>

            {/* ========================= */}
            {/* ADD / EDIT PROJECT MODAL */}
            {/* ========================= */}

            <ProjectModal
                isOpen={showProjectModal}
                onClose={
                    handleCloseProjectModal
                }
                editData={selectedProject}
                onSubmit={
                    handleProjectSubmit
                }
            />

            {/* ========================= */}
            {/* ADD EMPLOYEE MODAL */}
            {/* ========================= */}

            <AddEmployeeModal
                isOpen={showAddEmployee}
                onClose={
                    handleCloseAddEmployee
                }
                employees={
                    employeesNotInProject
                }
                onAdd={
                    handleAssignEmployees
                }
                isLoading={
                    isAssigning
                }
            />

        </ProjectsPage>
    );
};

export default Projects;