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
    RequiredStar,
    ErrorText,
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

const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];

/* =====================================================
   VALIDATION
===================================================== */

const isBlank = (v) => v === null || v === undefined || String(v).trim() === "";

const validateForm = (data) => {
    const errors = {};

    // TYPE *
    if (!PRODUCT_TYPE_OPTIONS.some((o) => o.value === data.product_type)) {
        errors.product_type = "Select a type.";
    }

    // PRODUCT NAME *
    const name = data.product_name.trim();
    if (!name) errors.product_name = "Product name is required.";
    else if (name.length < 2)
        errors.product_name = "Name must be at least 2 characters.";
    else if (name.length > 150)
        errors.product_name = "Name must be 150 characters or fewer.";

    // SKU (optional)
    if (!isBlank(data.sku)) {
        if (!/^[A-Za-z0-9\-_/.]+$/.test(data.sku.trim()))
            errors.sku = "Use only letters, numbers, - _ / .";
        else if (data.sku.trim().length > 50)
            errors.sku = "SKU must be 50 characters or fewer.";
    }

    // CATEGORY *
    if (isBlank(data.category)) errors.category = "Select a category.";

    // BRAND (optional)
    if (data.brand.trim().length > 100)
        errors.brand = "Brand must be 100 characters or fewer.";

    // SUPPLIER (optional)
    if (data.supplier.trim().length > 100)
        errors.supplier = "Supplier must be 100 characters or fewer.";

    // WAREHOUSE *
    if (isBlank(data.warehouse)) errors.warehouse = "Select a warehouse.";

    // OPENING STOCK QTY *
    if (isBlank(data.opening_stock_qty))
        errors.opening_stock_qty = "Opening stock is required.";
    else if (Number.isNaN(Number(data.opening_stock_qty)))
        errors.opening_stock_qty = "Enter a valid number.";
    else if (Number(data.opening_stock_qty) < 0)
        errors.opening_stock_qty = "Opening stock cannot be negative.";

    // REORDER LEVEL *
    if (isBlank(data.reorder_level))
        errors.reorder_level = "Reorder level is required.";
    else if (!/^\d+$/.test(String(data.reorder_level).trim()))
        errors.reorder_level = "Enter a whole number (0 or more).";

    // UNIT *
    if (isBlank(data.unit)) errors.unit = "Select a unit.";

    // QUANTITY *
    if (isBlank(data.quantity)) errors.quantity = "Quantity is required.";
    else if (Number.isNaN(Number(data.quantity)))
        errors.quantity = "Enter a valid number.";
    else if (Number(data.quantity) < 0)
        errors.quantity = "Quantity cannot be negative.";

    // DESCRIPTION (optional)
    if (data.description.trim().length > 500)
        errors.description = "Description must be 500 characters or fewer.";

     // TAX TYPE *
    if (isBlank(data.tax_type)) errors.tax_type = "Tax type is required.";

    // TAX RATE (optional)

    // HSN / SAC CODE *
    if (isBlank(data.hsn_sac_code))
        errors.hsn_sac_code = "HSN / SAC code is required.";
    else if (!/^\d{4,8}$/.test(data.hsn_sac_code.trim()))
        errors.hsn_sac_code = "Enter 4 to 8 digits.";

    // PURCHASE PRICE (optional)
    if (!isBlank(data.cost_price)) {
        if (Number.isNaN(Number(data.cost_price)))
            errors.cost_price = "Enter a valid amount.";
        else if (Number(data.cost_price) < 0)
            errors.cost_price = "Purchase price cannot be negative.";
    }

    // SELLING PRICE *
    if (isBlank(data.selling_price))
        errors.selling_price = "Selling price is required.";
    else if (Number.isNaN(Number(data.selling_price)))
        errors.selling_price = "Enter a valid amount.";
    else if (Number(data.selling_price) <= 0)
        errors.selling_price = "Selling price must be greater than 0.";

    // STATUS *
    if (!STATUS_OPTIONS.some((o) => o.value === data.status))
        errors.status = "Select a status.";

    return errors;
};

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
    product_name: formData.product_name.trim(),
    sku: formData.sku.trim(),
    brand: formData.brand.trim(),
    supplier: formData.supplier.trim(),
    description: formData.description.trim(),
    hsn_sac_code: formData.hsn_sac_code.trim(),

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

// Label with a red * for required fields (styles live in AddProductModal.styles)
const FieldLabel = ({ children, required }) => (
    <Label>
        {children}
        {required && <RequiredStar>*</RequiredStar>}
    </Label>
);

const FieldError = ({ message }) =>
    message ? <ErrorText role="alert">{message}</ErrorText> : null;

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
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [fetchedWarehouses, setFetchedWarehouses] = useState([]);

    /* ---------- warehouse options: prop first, API as fallback ---------- */

    const hasWarehouseProp =
        Array.isArray(warehouses) && warehouses.length > 0;

    const warehouseOptions = useMemo(
        () => (hasWarehouseProp ? warehouses : fetchedWarehouses),
        [hasWarehouseProp, warehouses, fetchedWarehouses]
    );

    /* ---------- validation state ---------- */

    const errors = useMemo(() => validateForm(formData), [formData]);

    // show an error once the field was touched, or after a submit attempt
    const getError = (name) =>
        touched[name] || submitted ? errors[name] : undefined;

    // props shared by every control
    const fieldProps = (name) => ({
        name,
        value: formData[name],
        onChange: handleChange,
        onBlur: handleBlur,
        "aria-invalid": Boolean(getError(name)),
        $hasError: Boolean(getError(name)),
    });

    /* ---------- load categories when the modal opens ---------- */

    useEffect(() => {
        if (!isOpen) return;

        dispatch(getCategories({ page: 1, page_size: 100 }));
    }, [isOpen, dispatch]);

    /* ---------- prefill (edit) or reset (add) when the modal opens ---------- */

    useEffect(() => {
        if (!isOpen) return;

        setFormData(mapProductToFormData(initialData));
        setTouched({});
        setSubmitted(false);
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

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleBlur(e) {
        const { name } = e.target;

        setTouched((prev) => ({ ...prev, [name]: true }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);

        // block save and jump to the first invalid field
        const firstInvalid = Object.keys(errors)[0];
        if (firstInvalid) {
            e.target.elements[firstInvalid]?.focus();
            return;
        }

        onSave(buildPayload(formData));
        setFormData({ ...initialFormData });
        setTouched({});
        setSubmitted(false);
    };

    const handleClose = () => {
        if (loading) return;

        setFormData({ ...initialFormData });
        setTouched({});
        setSubmitted(false);
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

                <Form onSubmit={handleSubmit} noValidate>
                    {/* TYPE */}
                    <FormGroup>
                        <FieldLabel required>TYPE</FieldLabel>
                        <Select {...fieldProps("product_type")}>
                            {renderOptions(PRODUCT_TYPE_OPTIONS)}
                        </Select>
                        <FieldError message={getError("product_type")} />
                    </FormGroup>

                    {/* PRODUCT NAME */}
                    <FormGroup>
                        <FieldLabel required>PRODUCT NAME</FieldLabel>
                        <Input
                            {...fieldProps("product_name")}
                            placeholder="Enter name"
                            maxLength={150}
                            autoComplete="off"
                        />
                        <FieldError message={getError("product_name")} />
                    </FormGroup>

                    {/* SKU */}
                    <FormGroup>
                        <FieldLabel>SKU</FieldLabel>
                        <Input
                            {...fieldProps("sku")}
                            placeholder="1253698"
                            maxLength={50}
                            autoComplete="off"
                        />
                        <FieldError message={getError("sku")} />
                    </FormGroup>

                    {/* CATEGORY */}
                    <FormGroup>
                        <FieldLabel required>CATEGORY</FieldLabel>
                        <Select {...fieldProps("category")}>
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
                        <FieldError message={getError("category")} />
                    </FormGroup>

                    {/* BRAND */}
                    <FormGroup>
                        <FieldLabel>BRAND</FieldLabel>
                        <Input
                            {...fieldProps("brand")}
                            placeholder="Enter Brand"
                            maxLength={100}
                            autoComplete="off"
                        />
                        <FieldError message={getError("brand")} />
                    </FormGroup>

                    {/* SUPPLIER */}
                    <FormGroup>
                        <FieldLabel>SUPPLIER</FieldLabel>
                        <Input
                            {...fieldProps("supplier")}
                            placeholder="Enter Supplier"
                            maxLength={100}
                            autoComplete="off"
                        />
                        <FieldError message={getError("supplier")} />
                    </FormGroup>

                    {/* WAREHOUSE */}
                    <FormGroup>
                        <FieldLabel required>WAREHOUSE</FieldLabel>
                        <Select {...fieldProps("warehouse")}>
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
                        <FieldError message={getError("warehouse")} />
                    </FormGroup>

                    {/* OPENING STOCK */}
                    <FormGroup>
                        <FieldLabel required>OPENING STOCK QTY</FieldLabel>
                        <Input
                            {...fieldProps("opening_stock_qty")}
                            type="number"
                            min="0"
                            autoComplete="off"
                        />
                        <FieldError message={getError("opening_stock_qty")} />
                    </FormGroup>

                    {/* REORDER LEVEL */}
                    <FormGroup>
                        <FieldLabel required>REORDER LEVEL</FieldLabel>
                        <Input
                            {...fieldProps("reorder_level")}
                            type="number"
                            min="0"
                            step="1"
                            autoComplete="off"
                        />
                        <FieldError message={getError("reorder_level")} />
                    </FormGroup>

                    {/* UNIT */}
                    <FormGroup>
                        <FieldLabel required>UNIT</FieldLabel>
                        <Select {...fieldProps("unit")}>
                            <option value="">Select Unit</option>
                            {renderOptions(UNIT_OPTIONS)}
                        </Select>
                        <FieldError message={getError("unit")} />
                    </FormGroup>

                    {/* QUANTITY */}
                    <FormGroup>
                        <FieldLabel required>QUANTITY</FieldLabel>
                        <Input
                            {...fieldProps("quantity")}
                            type="number"
                            min="0"
                            autoComplete="off"
                        />
                        <FieldError message={getError("quantity")} />
                    </FormGroup>

                    {/* DESCRIPTION */}
                    <FormGroup>
                        <FieldLabel>DESCRIPTION / SPECIFICATION</FieldLabel>
                        <Input
                            {...fieldProps("description")}
                            placeholder="Enter Note..."
                            maxLength={500}
                            autoComplete="off"
                        />
                        <FieldError message={getError("description")} />
                    </FormGroup>

                    {/* TAX TYPE */}
                    <FormGroup>
                        <FieldLabel>TAX TYPE</FieldLabel>
                        <Select {...fieldProps("tax_type")}>
                            <option value="">Select</option>
                            {renderOptions(TAX_TYPE_OPTIONS)}
                        </Select>
                        <FieldError message={getError("tax_type")} />
                    </FormGroup>

                    {/* TAX RATE */}
                    <FormGroup>
                        <FieldLabel>TAX RATE (%)</FieldLabel>
                        <Select {...fieldProps("tax_rate")}>
                            <option value="">Select</option>
                            {renderOptions(TAX_RATE_OPTIONS)}
                        </Select>
                        <FieldError message={getError("tax_rate")} />
                    </FormGroup>

                    {/* HSN / SAC */}
                    <FormGroup>
                        <FieldLabel required>HSN / SAC CODE</FieldLabel>
                        <Input
                            {...fieldProps("hsn_sac_code")}
                            placeholder="Enter Code"
                            maxLength={8}
                            inputMode="numeric"
                            autoComplete="off"
                        />
                        <FieldError message={getError("hsn_sac_code")} />
                    </FormGroup>

                    {/* PURCHASE PRICE */}
                    <FormGroup>
                        <FieldLabel>PURCHASE PRICE</FieldLabel>
                        <Input
                            {...fieldProps("cost_price")}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            autoComplete="off"
                        />
                        <FieldError message={getError("cost_price")} />
                    </FormGroup>

                    {/* SELLING PRICE */}
                    <FormGroup>
                        <FieldLabel required>SELLING PRICE</FieldLabel>
                        <Input
                            {...fieldProps("selling_price")}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            autoComplete="off"
                        />
                        <FieldError message={getError("selling_price")} />
                    </FormGroup>

                    {/* STATUS */}
                    <FormGroup>
                        <FieldLabel required>STATUS</FieldLabel>
                        <Select {...fieldProps("status")}>
                            {renderOptions(STATUS_OPTIONS)}
                        </Select>
                        <FieldError message={getError("status")} />
                    </FormGroup>

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