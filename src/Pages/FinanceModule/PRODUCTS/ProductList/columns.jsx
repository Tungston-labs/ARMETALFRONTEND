import styled from "styled-components";
import ProductActions from "./actions/ProductActions";

/* ---------- badge (same look as the Stock Status in the table) ---------- */

const TONES = {
    success: { bg: "#E1F6EB", color: "#127923" }, // In Stock, Active
    warning: { bg: "#FFF4E5", color: "#050505" }, // Low Stock
    danger: { bg: "#FDE8EA", color: "#000000" },  // Out of Stock
    neutral: { bg: "#F3F4F6", color: "#6B7280" }, // Inactive / unknown
};

const TONE_BY_VALUE = {
    "in stock": "success",
    active: "success",
    "low stock": "warning",
    "out of stock": "danger",
    inactive: "neutral",
};

const Badge = styled.span`
    display: inline-block;
    width: 110px;
    padding: 5px 0;
    box-sizing: border-box;
    text-align: center;
    border-radius: 6px;
    background: ${({ $tone }) => TONES[$tone].bg};
    color: ${({ $tone }) => TONES[$tone].color};
    font-family: "Poppins", sans-serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.2;
    white-space: nowrap;
`;

const renderBadge = (value) => {
    if (value === null || value === undefined || value === "") return "-";

    const text = String(value).replace(/_/g, " ");
    const tone = TONE_BY_VALUE[text.toLowerCase()] || "neutral";
    const label = text.replace(/\b\w/g, (c) => c.toUpperCase());

    return <Badge $tone={tone}>{label}</Badge>;
};

/* ---------- columns ---------- */

export const getProductColumns = ({ onEdit, onDelete }) => [
    {
        accessor: "code",
        header: "Code",
    },
    {
        accessor: "product_name",
        header: "Product ",
    },
    {
        accessor: "product_type",
        header: "Type",
    },
    {
        accessor: "category_name",
        header: "Category",
    },
    {
        accessor: "supplier",
        header: "Supplier",
    },
    {
        accessor: "unit",
        header: "Unit",
    },
    {
        accessor: "hsn_sac_code",
        header: "HSN/SAC",
    },
    {
        accessor: "warehouse_name",
        header: "Warehouse",
    },
    {
        accessor: "cost_price",
        header: "Cost Price",
    },
    {
        accessor: "selling_price",
        header: "Selling Price",
    },
    {
        accessor: "current_stock",
        header: "Current Stock",
    },
    {
        accessor: "stock_status",
        header: "Stock Status",
        render: (row) => renderBadge(row.stock_status),
    },
    
    {
        accessor: "actions",
        header: "Actions",
        sortable: false,
        render: (row) => (
            <ProductActions
                row={row}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ),
    },
];