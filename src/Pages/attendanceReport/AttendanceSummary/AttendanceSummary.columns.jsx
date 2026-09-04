import { formatDisplayDate } from "./AttendanceSummary.utils";
import { FiCalendar, FiCheckCircle, FiXCircle, FiMinusCircle } from "react-icons/fi";
export const getAttendanceColumns = (handleEdit) => [
    {
        header: "Date",
        accessor: "date",
        sortable: false,
        render: (row) => formatDisplayDate(row.date),
    },
    {
        header: "Status",
        accessor: "status",
        sortable: false,
        render: (row) => {
            const status = row.status || "-";
            const color =
                status === "present"
                    ? "#16a34a"
                    : status === "absent"
                    ? "#dc2626"
                    : "#f59e0b";

            return (
                <span style={{ fontWeight: 600, color }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            );
        },
    },
    {
        header: "Attendance Type",
        accessor: "attendance_type",
        sortable: false,
        render: (row) => {
            const type = row.attendance_type || "-";
            const color =
                type === "paid"
                    ? "#16a34a"
                    : type === "unpaid"
                    ? "#dc2626"
                    : "#6b7280";

            return (
                <span style={{ fontWeight: 600, color }}>
                    {type !== "-" ? type.charAt(0).toUpperCase() + type.slice(1) : type}
                </span>
            );
        },
    },
    {
        header: "Punch In",
        accessor: "first_punch_in",
        sortable: false,
        render: (row) => row.first_punch_in || "-",
    },
    {
        header: "Punch Out",
        accessor: "last_punch_out",
        sortable: false,
        render: (row) => row.last_punch_out || "-",
    },
    {
        header: "Total Hours",
        accessor: "total_hours",
        sortable: false,
        render: (row) => row.total_hours ?? "0",
    },
    {
        header: "Note",
        accessor: "remark",
        render: (row) => row.remark || "-",
    },
     {
        header: "Updated By",
        accessor: "updated_by",
        sortable: false,
        render: (row) => {
            if (!row.updated_by) return "-";

            return (
                <div style={{ lineHeight: 1.4 }}>
                    <div style={{ fontWeight: 600 }}>
                        {row.updated_by_role ? (
                            <span
                                style={{
                                    fontWeight: 400,
                                    color: "#070707",
                                    fontSize: "12px",
                                }}
                            >
                                {" "}
                                ({row.updated_by_role})
                            </span>
                        ) : null}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {row.updated_at || "-"}
                    </div>
                </div>
            );
        },
    },
    {
        header: "Action",
        accessor: "action",
        sortable: false,
        render: (row) => (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(row);
                }}
                style={{
                    padding: "7px 16px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#1976d2",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500",
                }}
            >
                Edit
            </button>
        ),
    },
];

export const getAttendanceStatsCards = (dailyRecords = []) => {
    const total = dailyRecords.length;
    const present = dailyRecords.filter((r) => r.status === "present").length;
    const absent = dailyRecords.filter((r) => r.status === "absent").length;
    const lop = dailyRecords.filter((r) => r.attendance_type === "unpaid").length;

    return [
        {
            title: "Total Working Days",
            count: total,
            icon: <FiCalendar size={20} />,
            backgroundColor: "#e0edff",
            iconColor: "#1976d2",
        },
        {
            title: "Present",
            count: present,
            icon: <FiCheckCircle size={20} />,
            backgroundColor: "#e2f7e9",
            iconColor: "#16a34a",
        },
        {
            title: "Absent",
            count: absent,
            icon: <FiXCircle size={20} />,
            backgroundColor: "#fde8e8",
            iconColor: "#dc2626",
        },
        {
            title: "LOP",
            count: lop,
            icon: <FiMinusCircle size={20} />,
            backgroundColor: "#fff4e0",
            iconColor: "#f59e0b",
        },
    ];
};