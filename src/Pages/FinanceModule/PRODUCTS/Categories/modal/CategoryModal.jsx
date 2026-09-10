import React, { useEffect, useRef, useState } from "react";

import {
    ModalOverlay,
    ModalContainer,
    ModalHeader,
    ModalTitle,
    ModalSubtitle,
    FormRow,
    FormGroup,
    Label,
    Input,
    SelectWrapper,
    Select,
    ButtonRow,
    CancelButton,
    SaveButton,
    ComboBoxWrapper,
    ComboBoxInput,
    ComboBoxDropdown,
    ComboBoxOption,
    NoCategory,
} from "./CategoryModal.styles";

import {
    FiSave,
    FiChevronDown,
} from "react-icons/fi";

const CODE_PATTERN = /^[A-Za-z0-9#-]{2,20}$/;

// Maps backend serializer field names -> frontend form state keys,
// so a 400 response like { errors: { category_name: [...] } } lands
// on the right input instead of only showing a generic banner.
const BACKEND_FIELD_MAP = {
    code: "code",
    category_name: "categoryName",
    parent_category: "parentCategory",
    category_type: "categoryType",
    status: "status",
};

const CategoryModal = ({
    isOpen,
    onClose,
    onSave,
    categories = [],
    parentCategories = [],
}) => {

    const [formData, setFormData] = useState({
        code: "",
        categoryName: "",
        parentCategory: "",
        categoryType: "",
        status: "",
    });

    const [errors, setErrors] = useState({});

    const [parentSearch, setParentSearch] =
        useState("");

    const [showParentDropdown, setShowParentDropdown] =
        useState(false);

    const [saving, setSaving] = useState(false);

    // Surfaces a rejected onSave (e.g. network/server error) to the user
    // instead of letting it fail silently as an unhandled promise rejection.
    const [submitError, setSubmitError] = useState(null);

    const comboBoxRef = useRef(null);

    /*
     * Reset form whenever modal opens
     */
    useEffect(() => {
        if (isOpen) {
            setFormData({
                code: "",
                categoryName: "",
                parentCategory: "",
                categoryType: "",
                status: "",
            });

            setErrors({});
            setParentSearch("");
            setShowParentDropdown(false);
            setSubmitError(null);
        }
    }, [isOpen]);

    /*
     * Close dropdown when clicking outside
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                comboBoxRef.current &&
                !comboBoxRef.current.contains(
                    event.target
                )
            ) {
                setShowParentDropdown(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    /*
     * Clear a single field's error as the user edits it
     */
    const clearError = (field) => {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    /*
     * Normal input change
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        clearError(name);
    };

    /*
     * Parent category search
     */
    const handleParentSearch = (e) => {
        const value = e.target.value;

        setParentSearch(value);

        /*
         * While typing, clear selected parent ID
         */
        setFormData((prev) => ({
            ...prev,
            parentCategory: "",
        }));

        clearError("parentCategory");
        setShowParentDropdown(true);
    };

    /*
     * Select existing parent
     */
    const handleSelectParent = (category) => {
        setParentSearch(
            category.category_name
        );

        setFormData((prev) => ({
            ...prev,

            /*
             * Send category ID
             */
            parentCategory: category.id,
        }));

        clearError("parentCategory");
        setShowParentDropdown(false);
    };

    /*
     * Filter categories
     */
    const filteredCategories = parentCategories.filter(
        (category) =>
            category.category_name
                ?.toLowerCase()
                .includes(
                    parentSearch.toLowerCase()
                )
    );

    /*
     * Check exact match
     */
    const exactMatch = parentCategories.some(
        (category) =>
            category.category_name
                ?.toLowerCase() ===
            parentSearch
                .trim()
                .toLowerCase()
    );

    /*
     * VALIDATION
     * Note: the code/name "already in use" checks below only look at
     * `categories`, which is whatever page is currently loaded in the
     * table — not the full company-wide dataset. This is a soft,
     * best-effort UX hint only. The backend's unique constraint on
     * (company, code) is the actual source of truth, and a real
     * duplicate will still come back as a field error from the server
     * (handled in handleSubmit's catch block below) even if this
     * client-side check misses it.
     */
    const validate = () => {
        const nextErrors = {};

        const code = formData.code.trim();
        const name = formData.categoryName.trim();

        // --- CODE ---
        if (!code) {
            nextErrors.code = "Category code is required";
        } else if (!CODE_PATTERN.test(code)) {
            nextErrors.code =
                "Code must be 2–20 characters (letters, numbers, # or - only)";
        } else if (
            categories.some(
                (c) => c.code?.toLowerCase() === code.toLowerCase()
            )
        ) {
            nextErrors.code = "This code is already in use";
        }

        // --- NAME ---
        if (!name) {
            nextErrors.categoryName = "Category name is required";
        } else if (name.length < 2) {
            nextErrors.categoryName =
                "Category name must be at least 2 characters";
        } else if (
            categories.some(
                (c) =>
                    c.category_name?.toLowerCase() ===
                    name.toLowerCase()
            )
        ) {
            nextErrors.categoryName =
                "A category with this name already exists";
        }

        // --- PARENT CATEGORY ---
        // If the user typed something but never picked a real option,
        // don't silently submit with no parent.
        if (parentSearch.trim() && !formData.parentCategory) {
            nextErrors.parentCategory = exactMatch
                ? "Please select the matching category from the list"
                : "No matching category — clear this field or pick one from the list";
        }

        // --- CATEGORY TYPE ---
        if (!formData.categoryType) {
            nextErrors.categoryType = "Please select a category type";
        }

        // --- STATUS ---
        if (!formData.status) {
            nextErrors.status = "Please select a status";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    /*
     * Submit
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        /*
         * Convert frontend field names
         * to backend API field names.
         */
        const categoryData = {
            code: formData.code.trim(),

            category_name:
                formData.categoryName.trim(),

            /*
             * Send selected category ID, or null when no parent
             * is selected. The backend field is a nullable FK
             * (PrimaryKeyRelatedField(allow_null=True)) — sending
             * an empty string instead of null fails validation,
             * since "" is not a valid primary key.
             */
            parent_category:
                formData.parentCategory || null,

            category_type:
                formData.categoryType,

            status:
                formData.status,
        };

        try {
            setSaving(true);
            setSubmitError(null);

            if (onSave) {
                await onSave(categoryData);
            }

        } catch (err) {
            // Rejected thunk payload shape (from rejectWithValue) mirrors
            // the backend's error response: { message, errors: {...} }.
            // Map any field-level errors onto the matching input so the
            // user sees exactly what's wrong, not just a generic banner.
            const backendFieldErrors = err?.errors;

            if (
                backendFieldErrors &&
                typeof backendFieldErrors === "object"
            ) {
                setErrors((prev) => {
                    const mapped = { ...prev };

                    Object.entries(backendFieldErrors).forEach(
                        ([field, messages]) => {
                            const key =
                                BACKEND_FIELD_MAP[field] || field;

                            mapped[key] = Array.isArray(messages)
                                ? messages[0]
                                : messages;
                        }
                    );

                    return mapped;
                });
            }

            setSubmitError(
                err?.message ||
                    "Something went wrong while saving. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay>

            <ModalContainer>

                <ModalHeader>

                    <ModalTitle>
                        Add New Category
                    </ModalTitle>

                    <ModalSubtitle>
                        Create a new product or services category
                    </ModalSubtitle>

                </ModalHeader>

                <form onSubmit={handleSubmit} noValidate>

                    <FormRow>

                        {/* CODE */}

                        <FormGroup>

                            <Label>
                                CODE
                            </Label>

                            <Input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="1253698"
                                aria-invalid={!!errors.code}
                            />

                            {errors.code && (
                                <span style={{ color: "#e53935", fontSize: 12 }}>
                                    {errors.code}
                                </span>
                            )}

                        </FormGroup>

                        {/* CATEGORY NAME */}

                        <FormGroup>

                            <Label>
                                CATEGORY NAME
                            </Label>

                            <Input
                                type="text"
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={handleChange}
                                placeholder="Enter name"
                                aria-invalid={!!errors.categoryName}
                            />

                            {errors.categoryName && (
                                <span style={{ color: "#e53935", fontSize: 12 }}>
                                    {errors.categoryName}
                                </span>
                            )}

                        </FormGroup>

                        {/* PARENT CATEGORY */}

                        <FormGroup ref={comboBoxRef}>

                            <Label>
                                PARENT CATEGORY
                            </Label>

                            <ComboBoxWrapper>

                                <ComboBoxInput
                                    type="text"
                                    value={parentSearch}
                                    onChange={
                                        handleParentSearch
                                    }
                                    onFocus={() =>
                                        setShowParentDropdown(
                                            true
                                        )
                                    }
                                    placeholder="Select Parent Category"
                                    aria-invalid={!!errors.parentCategory}
                                />

                                <FiChevronDown
                                    onClick={() =>
                                        setShowParentDropdown(
                                            (prev) =>
                                                !prev
                                        )
                                    }
                                />

                                {showParentDropdown && (
                                    <ComboBoxDropdown>

                                        {filteredCategories.map(
                                            (category) => (
                                                <ComboBoxOption
                                                    key={
                                                        category.id
                                                    }
                                                    onClick={() =>
                                                        handleSelectParent(
                                                            category
                                                        )
                                                    }
                                                >
                                                    {
                                                        category.category_name
                                                    }
                                                </ComboBoxOption>
                                            )
                                        )}

                                        {filteredCategories.length ===
                                            0 &&
                                            parentSearch.trim() && (
                                                <NoCategory>
                                                    No existing category found
                                                </NoCategory>
                                            )}

                                    </ComboBoxDropdown>
                                )}

                            </ComboBoxWrapper>

                            {errors.parentCategory && (
                                <span style={{ color: "#e53935", fontSize: 12 }}>
                                    {errors.parentCategory}
                                </span>
                            )}

                        </FormGroup>

                        {/* CATEGORY TYPE */}

                        <FormGroup>

                            <Label>
                                CATEGORY TYPE
                            </Label>

                            <SelectWrapper>

                                <Select
                                    name="categoryType"
                                    value={
                                        formData.categoryType
                                    }
                                    onChange={handleChange}
                                    aria-invalid={!!errors.categoryType}
                                >

                                    <option value="">
                                        Product/Service
                                    </option>

                                    <option value="product">
                                        Product
                                    </option>

                                    <option value="service">
                                        Service
                                    </option>

                                </Select>

                                <FiChevronDown />

                            </SelectWrapper>

                            {errors.categoryType && (
                                <span style={{ color: "#e53935", fontSize: 12 }}>
                                    {errors.categoryType}
                                </span>
                            )}

                        </FormGroup>

                        {/* STATUS */}

                        <FormGroup>

                            <Label>
                                STATUS
                            </Label>

                            <SelectWrapper>

                                <Select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={handleChange}
                                    aria-invalid={!!errors.status}
                                >

                                    <option value="">
                                        Active/Inactive
                                    </option>

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>

                                </Select>

                                <FiChevronDown />

                            </SelectWrapper>

                            {errors.status && (
                                <span style={{ color: "#e53935", fontSize: 12 }}>
                                    {errors.status}
                                </span>
                            )}

                        </FormGroup>

                    </FormRow>

                    {submitError && (
                        <div style={{ color: "#e53935", fontSize: 13, marginTop: 8 }}>
                            {submitError}
                        </div>
                    )}

                    {/* BUTTONS */}

                    <ButtonRow>

                        <CancelButton
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                        >
                            CANCEL
                        </CancelButton>

                        <SaveButton
                            type="submit"
                            disabled={saving}
                        >
                            <FiSave />

                            {saving
                                ? "SAVING..."
                                : "SAVE CATEGORY"}
                        </SaveButton>

                    </ButtonRow>

                </form>

            </ModalContainer>

        </ModalOverlay>
    );
};

export default CategoryModal;