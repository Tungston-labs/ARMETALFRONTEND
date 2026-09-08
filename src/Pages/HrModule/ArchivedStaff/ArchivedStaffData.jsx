export const employeeColumns = (
  currentPage = 1,
  rowsPerPage = 10,
  onRestore
) => [
  {
    header: "Sl No",
    accessor: "slNo",
    sortable: false,
    render: (_row, index) =>
      index + 1 + (currentPage - 1) * rowsPerPage,
  },

  {
    header: "Employee name",
    accessor: "name",
  },

  {
    header: "Employee ID",
    accessor: "employee_code",
  },

  {
    header: "Email",
    accessor: "email",
  },

  {
    header: "Department",
    accessor: "department_name",
  },

  {
    header: "Exit Date",
    accessor: "exit_date",
    render: (row) => {
      if (!row.exit_date) return "-";

      const date = new Date(row.exit_date);

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
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
          e.preventDefault();
          e.stopPropagation();

          console.log("RESTORE BUTTON CLICKED");
          console.log("Employee ID:", row.id);

          if (!row.id) {
            console.error("No numeric id found on row:", row);
            return;
          }

          if (typeof onRestore === "function") {
            onRestore(row.id);
          } else {
            console.error("onRestore function is missing");
          }
        }}
        style={{
          border: "none",
          background: "#E8F5E9",
          color: "#2E7D32",
          padding: "7px 14px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: 600,
          position: "relative",
          zIndex: 100,

          // Small click effect
          transition: "transform 0.12s ease, background 0.2s ease",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.94)";
          e.currentTarget.style.background = "#C8E6C9";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = "#E8F5E9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = "#E8F5E9";
        }}
      >
        Restore
      </button>
    ),
  },
];