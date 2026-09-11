import React, { useEffect, useState } from "react";

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

import { FiSave } from "react-icons/fi";

import { getWarehouses } from "../../../../../services/warehouseService";

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

/* =========================
   MAP AN EXISTING PRODUCT ROW
   INTO FORM SHAPE
========================= */

const mapProductToFormData = (product) => {
    if (!product) return initialFormData;

    return {
        product_type:
            product.product_type || "product",

        product_name:
            product.product_name || "",

        sku: product.sku || "",

        /*
         * category / warehouse may come back as
         * nested objects, ids, or names depending
         * on the serializer — normalize to id/string
         */
        category:
            product.category?.id ??
            product.category ??
            "",

        brand: product.brand || "",
        supplier: product.supplier || "",

        warehouse:
            product.warehouse?.id ??
            product.warehouse ??
            "",

        opening_stock_qty: String(
            product.opening_stock_qty ??
            product.current_stock ??
            "0"
        ),

        reorder_level: String(
            product.reorder_level ?? "10"
        ),

        unit: product.unit || "",

        quantity: String(
            product.quantity ??
            product.current_stock ??
            "0"
        ),

        description:
            product.description || "",

        tax_type: product.tax_type || "",
        tax_rate: String(
            product.tax_rate ?? ""
        ),

        hsn_sac_code:
            product.hsn_sac_code ||
            product.brand || "",

        cost_price: String(
            product.cost_price ?? ""
        ),

        selling_price: String(
            product.selling_price ?? ""
        ),

        status: product.status || "active",
    };
};

const AddProductModal = ({
    isOpen,
    onClose,
    onSave,
    loading = false,
    warehouses = [],
    initialData = null,
    mode = "add", // "add" | "edit"
}) => {
    const [formData, setFormData] =
        useState(initialFormData);
    const [modalWarehouses, setModalWarehouses] =
        useState(Array.isArray(warehouses) ? warehouses : []);

    const isEditMode = mode === "edit";

    const resolveWarehouseName = (warehouse) =>
        warehouse?.warehouse_name ||
        warehouse?.name ||
        warehouse?.warehouseName ||
        "Warehouse";

    /* =========================
       PREFILL WHEN OPENED
    ========================= */

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setFormData(
                mapProductToFormData(initialData)
            );
        } else {
            setFormData(initialFormData);
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        if (!isOpen) return;

        if (Array.isArray(warehouses) && warehouses.length > 0) {
            setModalWarehouses(warehouses);
            return;
        }

        let cancelled = false;

        const loadWarehouses = async () => {
            try {
                const response = await getWarehouses({
                    page: 1,
                    page_size: 100,
                });

                const nextWarehouses = Array.isArray(response)
                    ? response
                    : (response?.results || response?.data?.results || response?.data || []);

                const normalized = Array.isArray(nextWarehouses)
                    ? nextWarehouses.map((warehouse) => ({
                        ...warehouse,
                        warehouse_name:
                            resolveWarehouseName(warehouse),
                    }))
                    : [];

                if (!cancelled) {
                    setModalWarehouses(normalized);
                }
            } catch (error) {
                console.error("Failed to load warehouse options:", error);
                if (!cancelled) {
                    setModalWarehouses([]);
                }
            }
        };

        loadWarehouses();

        return () => {
            cancelled = true;
        };
    }, [isOpen, warehouses]);

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...formData,

            /*
             * Convert empty IDs to null
             */
            category:
                formData.category || null,

            warehouse:
                formData.warehouse || null,

            /*
             * Numeric values
             */
            quantity:
                Number(formData.quantity) || 0,

            opening_stock_qty:
                Number(
                    formData.opening_stock_qty
                ) || 0,

            reorder_level:
                Number(
                    formData.reorder_level
                ) || 0,

            /*
             * Decimal fields
             */
            cost_price:
                formData.cost_price || "0",

            selling_price:
                formData.selling_price || "0",

            tax_rate:
                formData.tax_rate || "0",
        };

        onSave(payload);

        setFormData(initialFormData);
    };

    const handleClose = () => {
        if (loading) return;

        setFormData(initialFormData);

        onClose();
    };

    if (!isOpen) return null;

    return (
        <Overlay onClick={handleClose}>
            <Modal
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                <Header>
                    <Title>
                        {isEditMode
                            ? "Edit Product"
                            : "Add New Product"}
                    </Title>

                    <Subtitle>
                        {isEditMode
                            ? "Update the details of this product or service."
                            : "Create a new product or service."}
                    </Subtitle>
                </Header>

                <Form
                    onSubmit={
                        handleSubmit
                    }
                >
                    {/* TYPE */}

                    <FormGroup>
                        <Label>
                            TYPE
                        </Label>

                        <Select
                            name="product_type"
                            value={
                                formData.product_type
                            }
                            onChange={
                                handleChange
                            }
                        >
                            <option value="product">
                                Product
                            </option>

                            <option value="service">
                                Service
                            </option>
                        </Select>
                    </FormGroup>

                    {/* PRODUCT NAME */}

                    <FormGroup>
                        <Label>
                            PRODUCT NAME
                        </Label>

                        <Input
                            name="product_name"
                            value={
                                formData.product_name
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter name"
                            required
                        />
                    </FormGroup>

                    {/* SKU */}

                    <FormGroup>
                        <Label>
                            SKU
                        </Label>

                        <Input
                            name="sku"
                            value={
                                formData.sku
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="1253698"
                        />
                    </FormGroup>

                    {/* CATEGORY */}

                    <FormGroup>
                        <Label>
                            CATEGORY
                        </Label>

                        <Select
                            name="category"
                            value={
                                formData.category
                            }
                            onChange={
                                handleChange
                            }
                        >
                            <option value="">
                                Select Category
                            </option>

                            <option value="1">
                                Electronics
                            </option>

                            <option value="2">
                                Furniture
                            </option>

                            <option value="3">
                                Stationery
                            </option>

                            <option value="4">
                                Raw Materials
                            </option>
                        </Select>
                    </FormGroup>

                    {/* BRAND */}

                    <FormGroup>
                        <Label>
                            BRAND
                        </Label>

                        <Input
                            name="brand"
                            value={
                                formData.brand
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter Brand"
                        />
                    </FormGroup>

                    {/* SUPPLIER */}

                    <FormGroup>
                        <Label>
                            SUPPLIER
                        </Label>

                        <Input
                            name="supplier"
                            value={
                                formData.supplier
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter Supplier"
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
                            <option value="">
                                SELECT WAREHOUSE
                            </option>

                            {modalWarehouses.map((warehouse) => (
                                <option
                                    key={warehouse.id}
                                    value={warehouse.id}
                                >
                                    {resolveWarehouseName(warehouse)}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>

                    {/* OPENING STOCK */}

                    <FormGroup>
                        <Label>
                            OPENING STOCK QTY
                        </Label>

                        <Input
                            type="number"
                            name="opening_stock_qty"
                            value={
                                formData.opening_stock_qty
                            }
                            onChange={
                                handleChange
                            }
                        />
                    </FormGroup>

                    {/* REORDER LEVEL */}

                    <FormGroup>
                        <Label>
                            REORDER LEVEL
                        </Label>

                        <Input
                            type="number"
                            name="reorder_level"
                            value={
                                formData.reorder_level
                            }
                            onChange={
                                handleChange
                            }
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
                            <option value="">
                                Select Unit
                            </option>

                            <option value="PCS">
                                Piece (PCS)
                            </option>

                            <option value="Box">
                                Box
                            </option>

                            <option value="Pack">
                                Pack
                            </option>

                            <option value="Month">
                                Month
                            </option>

                            <option value="Project">
                                Project
                            </option>

                            <option value="Set">
                                Set
                            </option>

                            <option value="Kg">
                                Kilogram (Kg)
                            </option>

                            <option value="Meter">
                                Meter
                            </option>

                            <option value="Other">
                                Other
                            </option>
                        </Select>
                    </FormGroup>

                    {/* QUANTITY */}

                    <FormGroup>
                        <Label>
                            QUANTITY
                        </Label>

                        <Input
                            type="number"
                            name="quantity"
                            value={
                                formData.quantity
                            }
                            onChange={
                                handleChange
                            }
                        />
                    </FormGroup>

                    {/* DESCRIPTION */}

                    <FormGroup>
                        <Label>
                            DESCRIPTION /
                            SPECIFICATION
                        </Label>

                        <Input
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter Note..."
                        />
                    </FormGroup>

                    {/* TAX TYPE */}

                    <FormGroup>
                        <Label>
                            TAX TYPE
                        </Label>

                        <Select
                            name="tax_type"
                            value={
                                formData.tax_type
                            }
                            onChange={
                                handleChange
                            }
                        >
                            <option value="">
                                Select
                            </option>

                            <option value="inclusive">
                                Inclusive
                            </option>

                            <option value="exclusive">
                                Exclusive
                            </option>
                        </Select>
                    </FormGroup>

                    {/* TAX RATE */}

                    <FormGroup>
                        <Label>
                            TAX RATE (%)
                        </Label>

                        <Select
                            name="tax_rate"
                            value={
                                formData.tax_rate
                            }
                            onChange={
                                handleChange
                            }
                        >
                            <option value="">
                                Select
                            </option>

                            <option value="0">
                                0%
                            </option>

                            <option value="5">
                                5%
                            </option>

                            <option value="10">
                                10%
                            </option>

                            <option value="15">
                                15%
                            </option>

                            <option value="18">
                                18%
                            </option>

                            <option value="20">
                                20%
                            </option>
                        </Select>
                    </FormGroup>

                    {/* HSN/SAC */}

                    <FormGroup>
                        <Label>
                            HSN / SAC CODE
                        </Label>

                        <Input
                            name="hsn_sac_code"
                            value={
                                formData.hsn_sac_code
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter Code"
                        />
                    </FormGroup>

                    {/* COST PRICE */}

                    <FormGroup>
                        <Label>
                            PURCHASE PRICE
                        </Label>

                        <Input
                            type="number"
                            step="0.01"
                            name="cost_price"
                            value={
                                formData.cost_price
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="0.00"
                        />
                    </FormGroup>

                    {/* SELLING PRICE */}

                    <FormGroup>
                        <Label>
                            SELLING PRICE
                        </Label>

                        <Input
                            type="number"
                            step="0.01"
                            name="selling_price"
                            value={
                                formData.selling_price
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="0.00"
                        />
                    </FormGroup>

                    <FormGroup />

                    {/* BUTTONS */}

                    <ButtonRow>
                        <CancelButton
                            type="button"
                            onClick={
                                handleClose
                            }
                            disabled={loading}
                        >
                            CANCEL
                        </CancelButton>

                        <SaveButton
                            type="submit"
                            disabled={loading}
                        >
                            <FiSave />

                            {loading
                                ? (isEditMode ? "UPDATING..." : "SAVING...")
                                : (isEditMode ? "UPDATE PRODUCT" : "SAVE PRODUCT")}
                        </SaveButton>
                    </ButtonRow>
                </Form>
            </Modal>
        </Overlay>
    );
};

export default AddProductModal;