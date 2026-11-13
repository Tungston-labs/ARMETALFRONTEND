import CategoryActions from "./actions/CategoryActions";
import { StatusBadge } from "./CategoriesList.styles";

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];


const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (isNaN(date.getTime())) return "-";

    const day = String(date.getDate()).padStart(2, "0");
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const getCategoryColumns = ({ onView, onEdit, onDelete }) => [
    { accessor: "code", header: "Code" },
    { accessor: "category_name", header: "Category Name " },
    { accessor: "parent_category_name", header: "Parent Category" },
    { accessor: "category_type", header: "Category Type" },
    { accessor: "category_type", header: "Items Count" },
    { accessor: "category_type", header: "Inventory Value" },
 {
    accessor: "status",
    header: "Status",
    render: (row) => {
      const status = String(row?.status || "").toLowerCase();

      return status ? (
        <StatusBadge $status={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </StatusBadge>
      ) : (
        "-"
      );
    },
  },
    
    {
        accessor: "actions",
        header: "Actions",
        render: (row) => (
            <CategoryActions
                row={row}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ),
    },
];