import React, { useEffect, useMemo, useState } from "react";
import {
    Container,
    TruncatedText,
    TableWrapper,
} from "../leaveDetails/EmployeeList.styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees, deleteEmployeeById } from "../../Redux/employeeSlice";
import { getDepartments } from "../../Redux/departmentSlice";
import RightSideModal from "../employeDashboard/RightSideModal";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import ReusableConfirmModal from "../../Components/modals/ReusableConfirmModal";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";
import { useEmployeeColumns } from "./useEmployeeColumns.jsx";
const EmployeeList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const paginationLimit = 20;
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [search, setSearch] = useState("");

    // Single source of truth for the selected department — stores the
    // department NAME (what the dropdown displays/selects).
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");

    const { employeeList, loading, pagination } = useSelector((state) => state.employees);
    const { list: departmentList } = useSelector(
        (state) => state.departments
    );

    useEffect(() => {
        dispatch(getDepartments({ page: 1, search: "" }));
    }, [dispatch]);
    const departmentRows = Array.isArray(departmentList?.results)
        ? departmentList.results
        : Array.isArray(departmentList)
            ? departmentList
            : [];
    const departmentOptions = useMemo(
        () => departmentRows.map((d) => d.name),
        [departmentRows],
    );

    const departmentIdByName = useMemo(
        () => Object.fromEntries(departmentRows.map((d) => [d.name, d.id])),
        [departmentRows],
    );
    const selectedDepartmentId = department ? departmentIdByName[department] : "";

    useEffect(() => {
        dispatch(
            getAllEmployees({
                page,
                search: debouncedSearch,
                department_id: selectedDepartmentId,
                attendance_status: status
                    ? status.toLowerCase().replace(" ", "_")
                    : "",
            })
        );
    }, [
        dispatch,
        page,
        selectedDepartmentId,
        status,
        debouncedSearch,
    ]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(handler);
    }, [search]);

    const handleDeleteClick = (id) => {
        setSelectedEmployeeId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        await dispatch(deleteEmployeeById(selectedEmployeeId));
        dispatch(
            getAllEmployees({ page, search: "", department_id: selectedDepartmentId }),
        );
        setShowDeleteModal(false);
        setSelectedEmployeeId(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedEmployeeId(null);
    };
    const columns = useEmployeeColumns({
        page,
        paginationLimit,
        navigate,
        onDeleteClick: handleDeleteClick,
    });
    const filteredEmployees = Array.isArray(employeeList)
        ? employeeList
        : [];

    return (
        <>
            <Container>
                <ReusableHeader
                    title="Employees"
                    breadcrumbs={["Employees"]}
                    buttonText="+ ADD NEW EMPLOYEE"
                    onButtonClick={() => navigate("/basic-details")}
                />
                <ReusableFilter
                    search={search}
                    onSearch={setSearch}
                    searchPlaceholder="Search by Employee Name /Code"
                    department={department}
                    departments={departmentOptions}
                    onDepartment={setDepartment}

                    status={status}
                    statuses={[
                        "Present",
                        "Absent",
                        "On Leave",
                    ]}
                    onStatus={setStatus}
                    showSearch
                    showDepartment
                    showStatus
                />
                <TableWrapper>
    <ReusableTable
        columns={columns}
        data={filteredEmployees}
        loading={loading}
        onRowClick={(row) => {
            setSelectedEmployee(row);
            setOpenModal(true);
        }}
    />
</TableWrapper>

                {!loading && pagination?.total_pages > 1 && (
    <ReusablePagination
        currentPage={pagination?.current_page || page}
        totalPages={pagination?.total_pages || 1}
        totalRecords={pagination?.count ?? pagination?.total_items ?? 0}
        onPageChange={setPage}
    />
)}
                <ReusableConfirmModal
                    show={showDeleteModal}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    message="Are you sure you want to permanently delete this employee from the system?"
                    confirmText="Delete"
                    cancelText="Cancel"
                    confirmVariant="danger"
                    cancelVariant="cancel"
                    loadingText="Deleting..."
                />

                {openModal && (
                    <RightSideModal
                        isOpen={openModal}
                        onClose={() => setOpenModal(false)}
                        employeeId={selectedEmployee?.id}
                    />
                )}
            </Container>
        </>
    );
};

export default EmployeeList;