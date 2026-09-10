
const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Formats an ISO timestamp (e.g. "2026-09-08T07:55:09.180195Z")
// as "08/Sep/2026".
const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (isNaN(date.getTime())) return "-";

    const day = String(date.getDate()).padStart(2, "0");
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const categoryColumns = [
       { accessor: "code", header: "Code" },
    { accessor: "category_name", header: "Category Name " },
    { accessor: "parent_category_name", header: "Parent Category" },
    { accessor: "category_type", header: "Category Type" },
        { accessor: "category_type", header: "Items Count" },
           { accessor: "category_type", header: "Inventory Value" },
    { accessor: "status", header: "Status" },


    {
        accessor: "created_at",
        header: "Created On",
        render: (row) => formatDate(row.created_at),
    },
];