import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProjectCard from "../../../Components/Hrmodule/Project/ProjectCard";

import {
    ProjectsPage,
    ProjectsContainer,
    ProjectsGrid,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateText,
} from "./Projects.styles";

import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";
import StatsCards from "../../../Components/StatsCards/StatsCards";

import ProjectModal from "../../../Components/Hrmodule/Project/modal/ProjectModal";
import AddEmployeeModal from "../../../Components/Hrmodule/Project/modal/Addemployeemodal";

import {
    getProjects,
    createProject,
    updateProject,
    getEmployeesNotInProject,
    assignEmployees,
    getProjectCount,
} from "../../../Redux/fieldShiftSlice";

import { getProjectCards } from "../../../utils/projectCards";
import SkeletonCard from "../../../Components/Skeleton/ SkeletonCard";
import { FiInbox } from "react-icons/fi";

const STATUS_MAP = {
    "In Progress": "in_progress",
    Completed: "completed",
    "On Hold": "on_hold",
    Cancelled: "cancelled",
};

const Projects = () => {
    const dispatch = useDispatch();

    // =========================
    // REDUX STATE
    // (errors are shown by the global error handler)
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
    } = useSelector((state) => state.projects);

    // =========================
    // LOCAL STATE
    // =========================

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
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
    // SEARCH DEBOUNCE (also resets to page 1)
    // =========================

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);

    // =========================
    // GET PROJECTS
    // =========================

    const loadProjects = () =>
        dispatch(
            getProjects({
                search: debouncedSearch,
                page,
                status,
                date: month,
            })
        );

    useEffect(() => {
        loadProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, debouncedSearch, page, status, month]);

    // =========================
    // GET PROJECT COUNTS
    // =========================

    useEffect(() => {
        dispatch(getProjectCount());
    }, [dispatch]);

    // =========================
    // FILTER HANDLERS
    // =========================

    const handleStatusChange = (value) => {
        setStatus(STATUS_MAP[value] || "");
        setPage(1);
    };

    const handleMonthChange = (value) => {
        setMonth(value);
        setPage(1);
    };

    // =========================
    // PROJECT MODAL
    // =========================

    const handleAddProject = () => {
        setSelectedProject(null);
        setShowProjectModal(true);
    };

    const handleCloseProjectModal = () => {
        setShowProjectModal(false);
        setSelectedProject(null);
    };

    const toProjectPayload = (formData) => ({
        name: formData.projectName.trim(),
        punch_type: formData.projectType,
        latitude:
            formData.latitude !== "" ? Number(formData.latitude) : null,
        longitude:
            formData.longitude !== "" ? Number(formData.longitude) : null,
        priority: formData.priority,
        start_date: formData.startDate || null,
        status: formData.projectStatus,
    });

    const handleProjectSubmit = async (formData, editData) => {
        try {
            const projectData = toProjectPayload(formData);

            if (editData) {
                await dispatch(
                    updateProject({ id: editData.id, projectData })
                ).unwrap();
            } else {
                await dispatch(createProject(projectData)).unwrap();
            }

            loadProjects();
            dispatch(getProjectCount());
            handleCloseProjectModal();
        } catch (error) {
            console.error("Project operation failed:", error);
        }
    };

    // =========================
    // EMPLOYEE MODAL
    // =========================

    const handleAddEmployee = async (project) => {
        if (!project?.id) return;

        setSelectedEmployeeProject(project);

        try {
            await dispatch(getEmployeesNotInProject(project.id)).unwrap();
            setShowAddEmployee(true);
        } catch (error) {
            console.error("Failed to get available employees:", error);
        }
    };

    const handleCloseAddEmployee = () => {
        setShowAddEmployee(false);
        setSelectedEmployeeProject(null);
    };

    const handleAssignEmployees = async (employeeIds) => {
        if (!selectedEmployeeProject?.id || !employeeIds?.length) return;

        try {
            setIsAssigning(true);

            await dispatch(
                assignEmployees({
                    projectId: selectedEmployeeProject.id,
                    employeeIds,
                })
            ).unwrap();

            loadProjects();
            handleCloseAddEmployee();
        } catch (error) {
            console.error("Failed to assign employees:", error);
        } finally {
            setIsAssigning(false);
        }
    };

    // =========================
    // PROJECT STAT CARDS
    // =========================

    const projectCards = getProjectCards(projectCount);

    // Skeleton only on the very first load, so the stats don't
    // flash every time a filter or page changes.
    const showStatsSkeleton = isLoading && projectCount.total === 0;

    // =========================
    // RENDER
    // =========================

    return (
        <ProjectsPage>
            <ReusableHeader
                title="Projects"
                breadcrumbs={["Projects"]}
                buttonText="+ ADD NEW PROJECT"
                onButtonClick={handleAddProject}
            />

            {showStatsSkeleton ? (
                <StatsCards
                    cards={Array.from({ length: 4 }).map(() => ({}))}
                    loading
                />
            ) : (
                <StatsCards cards={projectCards} />
            )}

            <ReusableFilter
                search={search}
                onSearch={setSearch}
                searchPlaceholder="Search by Project Name"
                status={
                    Object.keys(STATUS_MAP).find(
                        (label) => STATUS_MAP[label] === status
                    ) || ""
                }
                statuses={Object.keys(STATUS_MAP)}
                onStatus={handleStatusChange}
                date={month}
                onDate={handleMonthChange}
                showSearch
                showStatus
                // showDate
            />

            <ProjectsContainer>
                <ProjectsGrid>
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))
                    ) : projects.length > 0 ? (
                        projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                id={project.id}
                                project={project}
                                category={project.punch_type}
                                title={project.name}
                                date={
                                    project.start_date || project.date || ""
                                }
                                status={project.status}
                                priority={project.priority || ""}
                                members={project.employees || []}
                                memberCount={project.employees?.length || 0}
                                onAddMember={handleAddEmployee}
                            />
                        ))
                    ) : !isError ? (
                        // Hidden when the load failed - the global handler shows that
                        <EmptyState>
                            <EmptyStateIcon>
                                <FiInbox />
                            </EmptyStateIcon>

                            <EmptyStateTitle>No Projects Found</EmptyStateTitle>

                            <EmptyStateText>
                                There are no projects matching your current
                                search or filter selection.
                            </EmptyStateText>
                        </EmptyState>
                    ) : null}
                </ProjectsGrid>
            </ProjectsContainer>

            <ProjectModal
                isOpen={showProjectModal}
                onClose={handleCloseProjectModal}
                editData={selectedProject}
                onSubmit={handleProjectSubmit}
            />

            <AddEmployeeModal
                isOpen={showAddEmployee}
                onClose={handleCloseAddEmployee}
                employees={employeesNotInProject}
                onAdd={handleAssignEmployees}
                isLoading={isAssigning}
            />
        </ProjectsPage>
    );
};

export default Projects;