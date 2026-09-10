import ProductActions from "./actions/ProductActions";

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
        accessor: "category",
        header: "Category",
    },
    {
        accessor: "supplier",
        header: "Supplier",
    },
    {
        accessor: "unit",
        header: "UNIT",
    },
    // {
    //     accessor: "brand",
    //     header: "HSN/SAC",
    // },
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