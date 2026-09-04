import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getAttendanceList } from "../../Redux/attendanceSlice";
import { getDepartmentsMin } from "../../Redux/departmentSlice";

import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";
import { attendanceColumns } from "./Attendancedata";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";

const AttendanceList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState(""); // "" = All Departments
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const {
        attendanceList,
        pagination,
        listLoading,
        error,
    } = useSelector((state) => state.attendance);

    const {
        minList: departments,
        loading: departmentLoading,
    } = useSelector((state) => state.departments);

    useEffect(() => {
        dispatch(getDepartmentsMin());
    }, [dispatch]);

    // No more auto-defaulting to departments[0].id — "" means "All Departments"

    useEffect(() => {
        const params = {
            page: currentPage,
        };

        if (department) {
            params.department_id = department;
        }

        if (date) {
            params.date = date;
        }

        dispatch(getAttendanceList(params));
    }, [dispatch, currentPage, department, date]);

    useEffect(() => {
        setCurrentPage(1);
    }, [department, date]);

    const pageSize = 20;

    const renderError = (err) => {
        if (!err) return null;
        if (typeof err === "string") return err;
        if (typeof err === "object") {
            if (err.detail) return String(err.detail);
            if (err.message) return String(err.message);
            if (err.department_id) {
                return Array.isArray(err.department_id)
                    ? err.department_id.join(", ")
                    : String(err.department_id);
            }
            const vals = Object.values(err).flat();
            if (vals.length > 0) {
                return vals
                    .map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v)))
                    .join(", ");
            }
            return JSON.stringify(err);
        }
        return String(err);
    };

    const mappedRows = (attendanceList || []).map((item, index) => ({
        slNo: (currentPage - 1) * pageSize + index + 1,
        id: item.employee,
        name: item.employee_name,
        employeeId: item.employee_code,
        profilePic: item.profile_pic,
        date: item.date,
        firstSwipeIn: item.first_swipe_in || "--",
        lastSwipeOut: item.last_swipe_out || "--",
        totalHours: item.total_hours_formatted,
        attendanceToday: item.attendance_today,
        attendanceId: item.attendance_id,
    }));
    // Search filter
    let visibleRows = search
        ? mappedRows.filter(
            (row) =>
                row.name?.toLowerCase().includes(search.toLowerCase()) ||
                row.employeeId?.toLowerCase().includes(search.toLowerCase())
        )
        : mappedRows;

    // Status filter (client-side, based on attendanceToday)
    if (status) {
    visibleRows = visibleRows.filter((row) => {
        if (status.toLowerCase() === "present") return row.attendanceToday === true;
        if (status.toLowerCase() === "absent") return row.attendanceToday === false;
        // "On Leave" has no equivalent in attendanceToday — needs a separate field
        return true;
    });
}

    const handleRowClick = (employee) => {
        navigate(`/employee-attendance-tracking/${employee.id}`);
    };

    const departmentOptions = [
        { label: "All Departments", value: "" },
        ...(departments || []).map((item) => ({
            label: item.name,
            value: item.id,
        })),
    ];

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader title="Attendance" breadcrumbs={["Attendance"]} />

            <ReusableFilter
                search={search}
                onSearch={setSearch}

                department={department}
                departments={departmentOptions}
                onDepartment={setDepartment}

                status={status}
                statuses={["Present", "Absent", "On Leave"]}
                onStatus={setStatus}

                date={date}
                onDate={setDate}
                dateType="date"

                showSearch
                showDepartment
                showStatus
                showDate
            />

            {listLoading && <p>Loading attendance...</p>}

            {error && <p style={{ color: "red" }}>{renderError(error)}</p>}

            {!listLoading && !error && (
                <>
                    <ReusableTable
                        columns={attendanceColumns}
                        data={visibleRows}
                        onRowClick={handleRowClick}
                    />

                    <ReusablePagination
                        currentPage={pagination?.current_page || currentPage}
                        totalPages={pagination?.total_pages || 1}
                        totalRecords={pagination?.total_items ?? 0}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default AttendanceList;