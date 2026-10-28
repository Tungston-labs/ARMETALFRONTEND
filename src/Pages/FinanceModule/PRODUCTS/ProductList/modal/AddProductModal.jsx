import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiSave } from "react-icons/fi";

import {
    Overlay,
    Modal,
    Header,
    Title,
    Subtitle,
    Form,
    FormGroup,
    Label,
    Input,
    Select,
    ButtonRow,
    CancelButton,
    SaveButton,
} from "./AddProductModal.styles";

import { getCategories } from "../../../../../Redux/finance/Product/categorySlice";
import { getWarehouses } from "../../../../../services/warehouseService";

/* =====================================================
   CONSTANTS
===================================================== */

const initialFormData = {
    product_type: "product",
    product_name: "",
    sku: "",
    category: "",
    brand: "",
    supplier: "",
    warehouse: "",
    opening_stock_qty: "0",
    reorder_level: "10",
    unit: "",
    quantity: "0",
    description: "",
    tax_type: "",
    tax_rate: "",
    hsn_sac_code: "",
    cost_price: "",
    selling_price: "",
    status: "active",
};

const PRODUCT_TYPE_OPTIONS = [
    { value: "product", label: "Product" },
    { value: "service", label: "Service" },
];

const UNIT_OPTIONS = [
    { value: "PCS", label: "Piece (PCS)" },
    { value: "Box", label: "Box" },
    { value: "Pack", label: "Pack" },
    { value: "Month", label: "Month" },
    { value: "Project", label: "Project" },
    { value: "Set", label: "Set" },
    { value: "Kg", label: "Kilogram (Kg)" },
    { value: "Meter", label: "Meter" },
    { value: "Other", label: "Other" },
];

const TAX_TYPE_OPTIONS = [
    { value: "inclusive", label: "Inclusive" },
    { value: "exclusive", label: "Exclusive" },
];

const TAX_RATE_OPTIONS = ["0", "5", "10", "15", "18", "20"].map((rate) => ({
    value: rate,
    label: `${rate}%`,
}));

/* =====================================================
   HELPERS
===================================================== */

const getWarehouseName = (warehouse) =>
    warehouse?.warehouse_name ||
    warehouse?.name ||
    warehouse?.warehouseName ||
    "Warehouse";

// Accepts [..], { results: [..] } or { data: [..] } / { data: { results: [..] } }
const toList = (response) => {
    const list = Array.isArray(response)
        ? response
        : response?.results ||
        response?.data?.results ||
        response?.data ||
        [];

    return Array.isArray(list) ? list : [];
};

const mapProductToFormData = (product) => {
    if (!product) return { ...initialFormData };

    return {
        product_type: product.product_type || "product",
        product_name: product.product_name || "",
        sku: product.sku || "",
        category: product.category?.id ?? product.category ?? "",
        brand: product.brand || "",
        supplier: product.supplier || "",
        warehouse: product.warehouse?.id ?? product.warehouse ?? "",
        opening_stock_qty: String(
            product.opening_stock_qty ?? product.current_stock ?? "0"
        ),
        reorder_level: String(product.reorder_level ?? "10"),
        unit: product.unit || "",
        quantity: String(product.quantity ?? product.current_stock ?? "0"),
        description: product.description || "",
        tax_type: product.tax_type || "",
        tax_rate: String(product.tax_rate ?? ""),
        hsn_sac_code: product.hsn_sac_code || "",
        cost_price: String(product.cost_price ?? ""),
        selling_price: String(product.selling_price ?? ""),
        status: product.status || "active",
    };
};

const buildPayload = (formData) => ({
    ...formData,
    category: formData.category || null,
    warehouse: formData.warehouse || null,

    quantity: Number(formData.quantity) || 0,
    opening_stock_qty: Number(formData.opening_stock_qty) || 0,
    reorder_level: Number(formData.reorder_level) || 0,

    cost_price: formData.cost_price || "0",
    selling_price: formData.selling_price || "0",
    tax_rate: formData.tax_rate || "0",
});

/* =====================================================
   SMALL RENDER HELPERS
===================================================== */

const renderOptions = (options) =>
    options.map(({ value, label }) => (
        <option key={value} value={value}>
            {label}
        </option>
    ));

/* =====================================================
   COMPONENT
===================================================== */

const AddProductModal = ({
    isOpen,
    onClose,
    onSave,
    loading = false,
    warehouses = [],
    initialData = null,
    mode = "add",
}) => {
    const dispatch = useDispatch();
    const isEditMode = mode === "edit";

    const { categories = [], loading: categoryLoading } = useSelector(
        (state) => state.category
    );

    const [formData, setFormData] = useState(initialFormData);
    const [fetchedWarehouses, setFetchedWarehouses] = useState([]);

    /* ---------- warehouse options: prop first, API as fallback ---------- */

    const hasWarehouseProp =
        Array.isArray(warehouses) && warehouses.length > 0;

    const warehouseOptions = useMemo(
        () => (hasWarehouseProp ? warehouses : fetchedWarehouses),
        [hasWarehouseProp, warehouses, fetchedWarehouses]
    );

    /* ---------- load categories when the modal opens ---------- */

    useEffect(() => {
        if (!isOpen) return;

        dispatch(getCategories({ page: 1, page_size: 100 }));
    }, [isOpen, dispatch]);

    /* ---------- prefill (edit) or reset (add) when the modal opens ---------- */

    useEffect(() => {
        if (!isOpen) return;

        setFormData(mapProductToFormData(initialData));
    }, [isOpen, initialData]);

    /* ---------- load warehouses only if none were passed in ---------- */

    useEffect(() => {
        if (!isOpen || hasWarehouseProp) return;

        let cancelled = false;

        getWarehouses({ page: 1, page_size: 100 })
            .then((response) => {
                if (!cancelled) setFetchedWarehouses(toList(response));
            })
            .catch((error) => {
                console.error("Failed to load warehouse options:", error);
                if (!cancelled) setFetchedWarehouses([]);
            });

        return () => {
            cancelled = true;
        };
    }, [isOpen, hasWarehouseProp]);

    /* ---------- handlers ---------- */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave(buildPayload(formData));
        setFormData({ ...initialFormData });
    };

    const handleClose = () => {
        if (loading) return;

        setFormData({ ...initialFormData });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Overlay onClick={handleClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <Header>
                    <Title>
                        {isEditMode ? "Edit Product" : "Add New Product"}
                    </Title>

                    <Subtitle>
                        {isEditMode
                            ? "Update the details of this product or service."
                            : "Create a new product or service."}
                    </Subtitle>
                </Header>

                <Form onSubmit={handleSubmit}>
                    {/* TYPE */}
                    <FormGroup>
                        <Label>TYPE</Label>
                        <Select
                            name="product_type"
                            value={formData.product_type}
                            onChange={handleChange}
                        >
                            {renderOptions(PRODUCT_TYPE_OPTIONS)}
                        </Select>
                    </FormGroup>

                    {/* PRODUCT NAME */}
                    <FormGroup>
                        <Label>PRODUCT NAME</Label>
                        <Input
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            required
                            autoComplete="off"
                        />
                    </FormGroup>

                    {/* SKU */}
                    <FormGroup>
                        <Label>SKU</Label>
                        <Input
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            placeholder="1253698"
                            autoComplete="off"
                        />
                    </FormGroup>

                    {/* CATEGORY */}
                    <FormGroup>
                        <Label>CATEGORY</Label>
                        <Select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                {categoryLoading
                                    ? "Loading Categories..."
                                    : "Select Category"}
                            </option>

                            {!categoryLoading &&
                                categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.category_name}
                                    </option>
                                ))}
                        </Select>
                    </FormGroup>

                    {/* BRAND */}
                    <FormGroup>
                        <Label>BRAND</Label>
                        <Input
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="Enter Brand"
                            autoComplete="off"
                        />
                    </FormGroup>

                    {/* SUPPLIER */}
                    <FormGroup>
                        <Label>SUPPLIER</Label>
                        <Input
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            placeholder="Enter Supplier"
                            autoComplete="off"
                        />
                    </FormGroup>

                    {/* WAREHOUSE */}
                    <FormGroup>
                        <Label>WAREHOUSE</Label>
                        <Select
                            name="warehouse"
                            value={formData.warehouse}
                            onChange={handleChange}
                        >
                            <option value="">SELECT WAREHOUSE</option>

                            {warehouseOptions.map((warehouse) => (
                                <option
                                    key={warehouse.id}
                                    value={warehouse.id}
                                >
                                    {getWarehouseName(warehouse)}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>

                    {/* OPENING STOCK */}
                    <FormGroup>
                        <Label>OPENING STOCK QTY</Label>
                        <Input
                            type="number"
                            name="opening_stock_qty"
                            value={formData.opening_stock_qty}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </FormGroup>

                    {/* REORDER LEVEL */}
                    <FormGroup>
                        <Label>REORDER LEVEL</Label>
                        <Input
                            type="number"
                            name="reorder_level"
                            value={formData.reorder_level}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </FormGroup>

                    {/* UNIT */}
                    <FormGroup>
                        <Label>UNIT</Label>
                        <Select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Unit</option>
                            {renderOptions(UNIT_OPTIONS)}
                        </Select>
                    </FormGroup>

                    {/* QUANTITY */}
                    <FormGroup>
                        <Label>QUANTITY</Label>
                        <Input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                              autoComplete="off"
                        />
                    </FormGroup>

                    {/* DESCRIPTION */}
                    <FormGroup>
                        <Label>DESCRIPTION / SPECIFICATION</Label>
                        <Input
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter Note..."
                              autoComplete="off"
                        />
                    </FormGroup>

                    {/* TAX TYPE */}
                    <FormGroup>
                        <Label>TAX TYPE</Label>
                        <Select
                            name="tax_type"
                            value={formData.tax_type}
                            onChange={handleChange}
                        >
                            <option value="">Select</option>
                            {renderOptions(TAX_TYPE_OPTIONS)}
                        </Select>
                    </FormGroup>

                    {/* TAX RATE */}
                    <FormGroup>
                        <Label>TAX RATE (%)</Label>
                        <Select
                            name="tax_rate"
                            value={formData.tax_rate}
                            onChange={handleChange}
                        >
                            <option value="">Select</option>
                            {renderOptions(TAX_RATE_OPTIONS)}
                        </Select>
                    </FormGroup>

                    {/* HSN / SAC */}
                    <FormGroup>
                        <Label>HSN / SAC CODE</Label>
                        <Input
                            name="hsn_sac_code"
                            value={formData.hsn_sac_code}
                            onChange={handleChange}
                            placeholder="Enter Code"
                              autoComplete="off"
                        />
                    </FormGroup>

                    {/* PURCHASE PRICE */}
                    <FormGroup>
                        <Label>PURCHASE PRICE</Label>
                        <Input
                            type="number"
                            step="0.01"
                            name="cost_price"
                            value={formData.cost_price}
                            onChange={handleChange}
                            placeholder="0.00"
                              autoComplete="off"
                        />
                    </FormGroup>

                    {/* SELLING PRICE */}
                    <FormGroup>
                        <Label>SELLING PRICE</Label>
                        <Input
                            type="number"
                            step="0.01"
                            name="selling_price"
                            value={formData.selling_price}
                            onChange={handleChange}
                            placeholder="0.00"
                              autoComplete="off"
                        />
                    </FormGroup>

                    {/* keeps the button row aligned in the grid */}
                    <FormGroup />

                    <ButtonRow>
                        <CancelButton
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            CANCEL
                        </CancelButton>

                        <SaveButton type="submit" disabled={loading}>
                            <FiSave />

                            {loading
                                ? isEditMode
                                    ? "UPDATING..."
                                    : "SAVING..."
                                : isEditMode
                                    ? "UPDATE PRODUCT"
                                    : "SAVE PRODUCT"}
                        </SaveButton>
                    </ButtonRow>
                </Form>
            </Modal>
        </Overlay>
    );
};

export default AddProductModal;