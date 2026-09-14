import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

import { getCategories } from "../../../../../Redux/finance/categorySlice";


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


/* =====================================================
   MAP EXISTING PRODUCT INTO FORM DATA
===================================================== */

const mapProductToFormData = (product) => {
    if (!product) {
        return {
            ...initialFormData,
        };
    }

    return {
        product_type:
            product.product_type || "product",

        product_name:
            product.product_name || "",

        sku:
            product.sku || "",

        /*
         * Category may come as:
         *
         * category: 1
         *
         * OR
         *
         * category: {
         *     id: 1,
         *     category_name: "Electronics"
         * }
         */
        category:
            product.category?.id ??
            product.category ??
            "",

        brand:
            product.brand || "",

        supplier:
            product.supplier || "",

        /*
         * Warehouse may come as:
         *
         * warehouse: 1
         *
         * OR
         *
         * warehouse: {
         *     id: 1,
         *     warehouse_name: "Main Warehouse"
         * }
         */
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

        unit:
            product.unit || "",

        quantity: String(
            product.quantity ??
            product.current_stock ??
            "0"
        ),

        description:
            product.description || "",

        tax_type:
            product.tax_type || "",

        tax_rate: String(
            product.tax_rate ?? ""
        ),

        hsn_sac_code:
            product.hsn_sac_code || "",

        cost_price: String(
            product.cost_price ?? ""
        ),

        selling_price: String(
            product.selling_price ?? ""
        ),

        status:
            product.status || "active",
    };
};


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


    /* =====================================================
       GET CATEGORIES FROM REDUX
    ===================================================== */

    const {
        categories = [],
        loading: categoryLoading,
    } = useSelector(
        (state) => state.category
    );


    const [formData, setFormData] =
        useState(initialFormData);


    const isEditMode =
        mode === "edit";


    /* =====================================================
       FETCH CATEGORIES WHEN MODAL OPENS
    ===================================================== */

    useEffect(() => {

        if (!isOpen) return;

        dispatch(
            getCategories({
                page: 1,
                page_size: 100,
            })
        );

    }, [isOpen, dispatch]);


    /* =====================================================
       PREFILL FORM WHEN MODAL OPENS
    ===================================================== */

    useEffect(() => {

        if (!isOpen) return;

        if (initialData) {

            setFormData(
                mapProductToFormData(
                    initialData
                )
            );

        } else {

            setFormData({
                ...initialFormData,
            });

        }

    }, [
        isOpen,
        initialData,
    ]);


    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

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


    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = (e) => {

        e.preventDefault();


        const payload = {

            ...formData,


            /* =========================
               CATEGORY
            ========================= */

            category:
                formData.category || null,


            /* =========================
               WAREHOUSE
            ========================= */

            warehouse:
                formData.warehouse || null,


            /* =========================
               NUMERIC VALUES
            ========================= */

            quantity:
                Number(
                    formData.quantity
                ) || 0,

            opening_stock_qty:
                Number(
                    formData.opening_stock_qty
                ) || 0,

            reorder_level:
                Number(
                    formData.reorder_level
                ) || 0,


            /* =========================
               DECIMAL VALUES
            ========================= */

            cost_price:
                formData.cost_price || "0",

            selling_price:
                formData.selling_price || "0",

            tax_rate:
                formData.tax_rate || "0",
        };


        onSave(payload);


        setFormData({
            ...initialFormData,
        });
    };


    /* =====================================================
       HANDLE CLOSE
    ===================================================== */

    const handleClose = () => {

        if (loading) return;

        setFormData({
            ...initialFormData,
        });

        onClose();
    };


    /* =====================================================
       DON'T RENDER WHEN CLOSED
    ===================================================== */

    if (!isOpen) {
        return null;
    }


    return (
        <Overlay
            onClick={handleClose}
        >

            <Modal
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* =================================================
                    HEADER
                ================================================= */}

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


                {/* =================================================
                    FORM
                ================================================= */}

                <Form
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                        PRODUCT TYPE
                    ================================================= */}

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


                    {/* =================================================
                        PRODUCT NAME
                    ================================================= */}

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


                    {/* =================================================
                        SKU
                    ================================================= */}

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


                    {/* =================================================
                        CATEGORY - DYNAMIC FROM API
                    ================================================= */}

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
                            required
                        >

                            <option value="">
                                {categoryLoading
                                    ? "Loading Categories..."
                                    : "Select Category"}
                            </option>


                            {!categoryLoading &&
                                categories.map(
                                    (category) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.category_name
                                            }
                                        </option>
                                    )
                                )}

                        </Select>

                    </FormGroup>


                    {/* =================================================
                        BRAND
                    ================================================= */}

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


                    {/* =================================================
                        SUPPLIER
                    ================================================= */}

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


                    {/* =================================================
                        WAREHOUSE
                    ================================================= */}

                    <FormGroup>

                        <Label>
                            WAREHOUSE
                        </Label>

                        <Select
                            name="warehouse"
                            value={
                                formData.warehouse
                            }
                            onChange={
                                handleChange
                            }
                        >

                            <option value="">
                                SELECT WAREHOUSE
                            </option>


                            {warehouses.map(
                                (warehouse) => (

                                    <option
                                        key={
                                            warehouse.id
                                        }
                                        value={
                                            warehouse.id
                                        }
                                    >
                                        {
                                            warehouse.warehouse_name
                                        }
                                    </option>

                                )
                            )}

                        </Select>

                    </FormGroup>


                    {/* =================================================
                        OPENING STOCK
                    ================================================= */}

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


                    {/* =================================================
                        REORDER LEVEL
                    ================================================= */}

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


                    {/* =================================================
                        UNIT
                    ================================================= */}

                    <FormGroup>

                        <Label>
                            UNIT
                        </Label>

                        <Select
                            name="unit"
                            value={
                                formData.unit
                            }
                            onChange={
                                handleChange
                            }
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


                    {/* =================================================
                        QUANTITY
                    ================================================= */}

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


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

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


                    {/* =================================================
                        TAX TYPE
                    ================================================= */}

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


                    {/* =================================================
                        TAX RATE
                    ================================================= */}

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


                    {/* =================================================
                        HSN / SAC
                    ================================================= */}

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


                    {/* =================================================
                        PURCHASE PRICE
                    ================================================= */}

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


                    {/* =================================================
                        SELLING PRICE
                    ================================================= */}

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


                    {/* =================================================
                        EMPTY FORM GROUP
                    ================================================= */}

                    <FormGroup />


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

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
                                ? (
                                    isEditMode
                                        ? "UPDATING..."
                                        : "SAVING..."
                                )
                                : (
                                    isEditMode
                                        ? "UPDATE PRODUCT"
                                        : "SAVE PRODUCT"
                                )}

                        </SaveButton>

                    </ButtonRow>

                </Form>

            </Modal>

        </Overlay>
    );
};


export default AddProductModal;