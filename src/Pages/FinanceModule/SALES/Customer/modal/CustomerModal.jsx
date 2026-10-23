import React, { useEffect, useMemo, useState } from "react";
import {
    FiCalendar,
    FiUpload,
    FiSave,
    FiPlus,
} from "react-icons/fi";

import {
    COUNTRY_OPTIONS,
    getCountryByCode,
    getStatesByCountry,
    getCitiesByState,
    getStateByName,
} from "../../../../../utils/countryData";
import { formatCurrency } from "../../../../../utils/FormatCurrency";

import {
    ModalOverlay,
    ModalContainer,
    Header,
    Title,
    Description,
    FormGrid,
    FormGroup,
    Label,
    Input,
    Select,
    Section,
    SectionTitle,
    SectionDescription,
    SectionDivider,
    AddressLabel,
    PlusButton,
    Actions,
    CancelButton,
    SaveButton,
    InputWithIcon,
    IconButton,
} from "./CustomerModal.styles";

const initialFormData = {
    customerId: "",
    customerName: "",
    companyType: "",
    industry: "",
    website: "",
    crNumber: "",
    currency: "",
    vatRegistrationNumber: "",
    paymentTerm: "",
    crExpiryDate: "",
    billingAddress: "",
    city: "",
    state: "",          // stores state ISO code when a dropdown is available,
    // otherwise free text (see stateOptions fallback below)
    country: "",         // stores the cca2 code, e.g. "IN"
    postalCode: "",
    phoneNumber: "",
    adminContactEmail: "",
    financialContactEmail: "",
    technicalContactEmail: "",
    clientStatus: "",
    creditLimit: "",
    financialPaymentTerms: "",
    openingBalance: "",
    notes: "",
    documents: null,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;
const WEBSITE_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

const BACKEND_FIELD_MAP = {
    customer_name: "customerName",
    company_name: "companyType",
    industry: "industry",
    website: "website",
    cr_number: "crNumber",
    currency: "currency",
    vat_number: "vatRegistrationNumber",
    payment_term: "paymentTerm",
    cr_expiry_date: "crExpiryDate",
    billing_address: "billingAddress",
    city: "city",
    state: "state",
    country: "country",
    postal: "postalCode",
    phno: "phoneNumber",
    admin_email: "adminContactEmail",
    financial_email: "financialContactEmail",
    technical_email: "technicalContactEmail",
    client_status: "clientStatus",
    credit_limit: "creditLimit",
    opening_balance: "openingBalance",
    notes: "notes",
};

const CustomerModal = ({
    isOpen,
    onClose,
    mode = "add",
    customer = null,
    onSave,
}) => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Cascading location dropdown data. Empty array means "no known
    // subdivisions for this selection" — the UI falls back to a plain
    // text input in that case instead of an empty dropdown.
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const isEdit = mode === "edit";
    const isView = mode === "view";
    const isReadOnly = isView;

    const selectedCountry = useMemo(
        () => getCountryByCode(formData.country),
        [formData.country]
    );

    // Resolves the display name for the currently selected state code.
    // Falls back to the raw value itself when state is free text (i.e.
    // the selected country has no known subdivisions).
    const selectedStateName = useMemo(() => {
        if (!formData.state) return "";
        const match = stateOptions.find((s) => s.code === formData.state);
        return match?.name || formData.state;
    }, [formData.state, stateOptions]);

    // ============================================================
    // LOAD CUSTOMER / RESET
    // ============================================================

    useEffect(() => {
        if (!isOpen) return;

        setErrors({});
        setSubmitError(null);

        if ((isEdit || isView) && customer) {
            // Backend stores country as a free-text name (e.g. "india").
            // world-countries keys off cca2 codes, so we match by name to
            // recover the code for the dropdown. Unmatched legacy data
            // just leaves the dropdown on "Select Country".
            const matchedCountry = COUNTRY_OPTIONS.find(
                (c) =>
                    c.name.toLowerCase() ===
                    (customer.country || "").toLowerCase()
            );

            // Same idea for state: backend stores a free-text name, the
            // state dropdown is keyed off ISO codes, so we resolve the
            // code from the name. If nothing matches (legacy data, or a
            // country with no subdivisions in the dataset) we just keep
            // the raw text and the field falls back to a text input.
            let resolvedStateCode = customer.state || "";
            let states = [];
            let cities = [];

            if (matchedCountry?.code) {
                states = getStatesByCountry(matchedCountry.code);

                const matchedState = getStateByName(
                    matchedCountry.code,
                    customer.state
                );

                if (matchedState) {
                    resolvedStateCode = matchedState.isoCode;
                    cities = getCitiesByState(
                        matchedCountry.code,
                        matchedState.isoCode
                    );
                }
            }

            setStateOptions(states);
            setCityOptions(cities);

            setFormData({
                customerId: customer.customer_id || "",
                customerName: customer.customer_name || "",
                companyType: customer.company_name || "",
                industry: customer.industry || "",
                website: customer.website || "",
                crNumber: customer.cr_number || "",
                currency: customer.currency || "",
                vatRegistrationNumber: customer.vat_number || "",
                paymentTerm: customer.payment_term || "",
                crExpiryDate: customer.cr_expiry_date || "",
                billingAddress: customer.billing_address || "",
                city: customer.city || "",
                state: resolvedStateCode,
                country: matchedCountry?.code || "",
                postalCode: customer.postal || "",
                phoneNumber: customer.phno || "",
                adminContactEmail: customer.admin_email || "",
                financialContactEmail: customer.financial_email || "",
                technicalContactEmail: customer.technical_email || "",
                clientStatus: customer.client_status || "",
                creditLimit: customer.credit_limit || "",
                financialPaymentTerms: customer.payment_term || "",
                openingBalance: customer.opening_balance || "",
                notes: customer.notes || "",
                documents: null,
            });

            return;
        }

        setStateOptions([]);
        setCityOptions([]);
        setFormData({ ...initialFormData });
    }, [isOpen, isEdit, isView, customer]);

    if (!isOpen) return null;

    // ============================================================
    // HANDLE CHANGE
    // ============================================================

    const clearError = (field) => {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));

        clearError(name);
    };

    const handleCountryChange = (e) => {
        const code = e.target.value;
        const country = getCountryByCode(code);
        const states = getStatesByCountry(code);

        setStateOptions(states);
        setCityOptions([]);

        setFormData((prev) => ({
            ...prev,
            country: code,
            // Only auto-fill currency if the user hasn't already typed
            // one manually for this session's add/edit — cheap heuristic:
            // fill it whenever it's currently blank.
            currency: prev.currency || country?.currencyCode || "",
            // Pre-seed the phone field with the dial code the first time
            // a country is chosen and phone is still empty, so the user
            // isn't stuck typing the prefix themselves.
            phoneNumber:
                prev.phoneNumber || (country?.dialCode ? `${country.dialCode} ` : ""),
            // State/city belonged to the previous country — reset both
            // so a stale selection can't be submitted with the new one.
            state: "",
            city: "",
        }));

        clearError("country");
        clearError("state");
        clearError("city");
    };

    const handleStateChange = (e) => {
        const code = e.target.value;
        const cities = getCitiesByState(formData.country, code);

        setCityOptions(cities);

        setFormData((prev) => ({ ...prev, state: code, city: "" }));

        clearError("state");
        clearError("city");
    };

    const handleCityChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, city: value }));
        clearError("city");
    };

    // ============================================================
    // VALIDATION
    // ============================================================

    const validate = () => {
        const nextErrors = {};

        const name = formData.customerName.trim();
        const phone = formData.phoneNumber.trim();
        const adminEmail = formData.adminContactEmail.trim();
        const financialEmail = formData.financialContactEmail.trim();
        const technicalEmail = formData.technicalContactEmail.trim();
        const website = formData.website.trim();

        if (!name) {
            nextErrors.customerName = "Customer name is required";
        } else if (name.length < 2) {
            nextErrors.customerName =
                "Customer name must be at least 2 characters";
        }

        if (!formData.industry) {
            nextErrors.industry = "Please select an industry";
        }

        if (!formData.paymentTerm) {
            nextErrors.paymentTerm = "Please select a payment term";
        }

        if (!formData.clientStatus) {
            nextErrors.clientStatus = "Please select a client status";
        }

        if (!formData.country) {
            nextErrors.country = "Please select a country";
        }

        if (!formData.state.trim()) {
            nextErrors.state = "State is required";
        }

        if (!phone) {
            nextErrors.phoneNumber = "Phone number is required";
        } else if (!PHONE_PATTERN.test(phone)) {
            nextErrors.phoneNumber = "Enter a valid phone number";
        }

        if (!adminEmail) {
            nextErrors.adminContactEmail = "Admin contact email is required";
        } else if (!EMAIL_PATTERN.test(adminEmail)) {
            nextErrors.adminContactEmail = "Enter a valid email address";
        }

        if (financialEmail && !EMAIL_PATTERN.test(financialEmail)) {
            nextErrors.financialContactEmail = "Enter a valid email address";
        }

        if (technicalEmail && !EMAIL_PATTERN.test(technicalEmail)) {
            nextErrors.technicalContactEmail = "Enter a valid email address";
        }

        if (website && !WEBSITE_PATTERN.test(website)) {
            nextErrors.website = "Enter a valid website URL";
        }

        if (formData.creditLimit !== "") {
            const value = Number(formData.creditLimit);
            if (Number.isNaN(value) || value < 0) {
                nextErrors.creditLimit = "Enter a valid non-negative amount";
            }
        }

        if (formData.openingBalance !== "") {
            const value = Number(formData.openingBalance);
            if (Number.isNaN(value)) {
                nextErrors.openingBalance = "Enter a valid amount";
            }
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    // ============================================================
    // CONVERT FORM DATA TO BACKEND FORMAT
    // ============================================================

    const prepareCustomerData = () => {
        // customer_id omitted — backend-generated, never written by client.
        return {
            customer_name: formData.customerName.trim(),
            company_name: formData.companyType.trim(),
            industry: formData.industry,
            website: formData.website.trim(),
            cr_number: formData.crNumber.trim(),
            currency: formData.currency,
            vat_number: formData.vatRegistrationNumber.trim(),
            payment_term: formData.paymentTerm,
            cr_expiry_date: formData.crExpiryDate || null,
            billing_address: formData.billingAddress.trim(),
            city: formData.city.trim(),
            // Send the display name to match the existing backend data
            // shape (e.g. "Kerala"), not the ISO code the dropdown uses
            // internally. Falls back to the raw text when the field was
            // a free-text input (country had no known subdivisions).
            state: selectedStateName.trim(),
            // Send the full country name to match your existing backend
            // data shape (e.g. "India"), not the cca2 code.
            country: selectedCountry?.name || "",
            postal: formData.postalCode.trim(),
            phno: formData.phoneNumber.trim(),
            admin_email: formData.adminContactEmail.trim(),
            financial_email: formData.financialContactEmail.trim(),
            technical_email: formData.technicalContactEmail.trim(),
            client_status: formData.clientStatus,
            credit_limit: formData.creditLimit || "0.00",
            opening_balance: formData.openingBalance || "0.00",
            notes: formData.notes,
        };
    };

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isView) {
            onClose();
            return;
        }

        if (!validate()) {
            return;
        }

        const customerData = prepareCustomerData();

        try {
            setSaving(true);
            setSubmitError(null);

            await onSave(customerData);
        } catch (err) {
            const backendFieldErrors = err?.errors;

            if (backendFieldErrors && typeof backendFieldErrors === "object") {
                setErrors((prev) => {
                    const mapped = { ...prev };

                    Object.entries(backendFieldErrors).forEach(
                        ([field, messages]) => {
                            const key = BACKEND_FIELD_MAP[field] || field;
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

    const errorStyle = { color: "#e53935", fontSize: 12 };

    return (
        <ModalOverlay>
            <ModalContainer>
                <form onSubmit={handleSubmit} noValidate>

                    <Header>
                        <Title>
                            {isView
                                ? "Customer Details"
                                : isEdit
                                    ? "Edit Customer"
                                    : "Add New Customer"}
                        </Title>

                        <Description>
                            {isView
                                ? "View customer information."
                                : isEdit
                                    ? "Update customer details for invoicing, payments, and financial operations."
                                    : "Enter customer details for invoicing, payments, and financial operations."}
                        </Description>
                    </Header>

                    <FormGrid>

                        <FormGroup>
                            <Label>CUSTOMER ID</Label>
                            <Input
                                name="customerId"
                                value={formData.customerId}
                                placeholder={
                                    !isEdit && !isView
                                        ? "Auto-generated after save"
                                        : ""
                                }
                                readOnly
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>CUSTOMER NAME</Label>
                            <Input
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                placeholder="Enter customer name"
                                disabled={isReadOnly}
                                aria-invalid={!!errors.customerName}
                            />
                            {errors.customerName && (
                                <span style={errorStyle}>{errors.customerName}</span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>COMPANY NAME</Label>
                            <Input
                                name="companyType"
                                value={formData.companyType}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                disabled={isReadOnly}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>INDUSTRY</Label>
                            <Select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                disabled={isReadOnly}
                                aria-invalid={!!errors.industry}
                            >
                                <option value="">Select Industry</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="construction">Construction</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="finance">Finance</option>
                                <option value="retail">Retail</option>
                                <option value="technology">Technology</option>
                            </Select>
                            {errors.industry && (
                                <span style={errorStyle}>{errors.industry}</span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>WEBSITE</Label>
                            <Input
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                disabled={isReadOnly}
                                aria-invalid={!!errors.website}
                            />
                            {errors.website && (
                                <span style={errorStyle}>{errors.website}</span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>CR NUMBER</Label>
                            <Input
                                name="crNumber"
                                value={formData.crNumber}
                                onChange={handleChange}
                                placeholder="Enter number"
                                disabled={isReadOnly}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>CURRENCY</Label>
                            <Select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                disabled={isReadOnly}
                            >
                                <option value="">Select currency</option>
                                {selectedCountry && (
                                    <option value={selectedCountry.currencyCode}>
                                        {selectedCountry.currencyCode} (
                                        {selectedCountry.currencySymbol})
                                    </option>
                                )}
                                {formData.currency &&
                                    formData.currency !==
                                    selectedCountry?.currencyCode && (
                                        <option value={formData.currency}>
                                            {formData.currency}
                                        </option>
                                    )}
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label>VAT REGISTRATION NUMBER</Label>
                            <Input
                                name="vatRegistrationNumber"
                                value={formData.vatRegistrationNumber}
                                onChange={handleChange}
                                placeholder="Enter number"
                                disabled={isReadOnly}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>PAYMENT TERM</Label>
                            <Select
                                name="paymentTerm"
                                value={formData.paymentTerm}
                                onChange={handleChange}
                                disabled={isReadOnly}
                                aria-invalid={!!errors.paymentTerm}
                            >
                                <option value="">Select</option>
                                <option value="immediate">Immediate</option>
                                <option value="15_days">15 Days</option>
                                <option value="30_days">30 Days</option>
                                <option value="60_days">60 Days</option>
                                <option value="90_days">90 Days</option>
                            </Select>
                            {errors.paymentTerm && (
                                <span style={errorStyle}>{errors.paymentTerm}</span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>CR EXPIRY DATE</Label>
                            <InputWithIcon>
                                <Input
                                    type="date"
                                    name="crExpiryDate"
                                    value={formData.crExpiryDate}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                />
                                <IconButton type="button">
                                    <FiCalendar size={16} />
                                </IconButton>
                            </InputWithIcon>
                        </FormGroup>

                        <FormGroup>
                            <AddressLabel>
                                BILLING ADDRESS
                                <PlusButton type="button">
                                    <FiPlus size={15} />
                                </PlusButton>
                            </AddressLabel>
                            <Input
                                name="billingAddress"
                                value={formData.billingAddress}
                                onChange={handleChange}
                                placeholder="Enter billing address"
                                disabled={isReadOnly}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>COUNTRY</Label>
                            <Select
                                name="country"
                                value={formData.country}
                                onChange={handleCountryChange}
                                disabled={isReadOnly}
                                aria-invalid={!!errors.country}
                            >
                                <option value="">Select Country</option>
                                {COUNTRY_OPTIONS.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </Select>
                            {errors.country && (
                                <span style={errorStyle}>{errors.country}</span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>STATE</Label>
                            {stateOptions.length > 0 ? (
                                <Select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleStateChange}
                                    disabled={isReadOnly || !formData.country}
                                    aria-invalid={!!errors.state}
                                >
                                    <option value="">Select State</option>
                                    {stateOptions.map((s) => (
                                        <option key={s.code} value={s.code}>
                                            {s.name}
                                        </option>
                                    ))}
                                </Select>
                            ) : (
                                <Input
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder={
                                        formData.country
                                            ? "Enter state"
                                            : "Select a country first"
                                    }
                                    disabled={isReadOnly || !formData.country}
                                    aria-invalid={!!errors.state}
                                />
                            )}
                            {errors.state && (
                                <span style={errorStyle}>{errors.state}</span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>CITY</Label>
                            {cityOptions.length > 0 ? (
                                <Select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleCityChange}
                                    disabled={isReadOnly || !formData.state}
                                    aria-invalid={!!errors.city}
                                >
                                    <option value="">Select City</option>
                                    {cityOptions.map((c) => (
                                        <option key={c.name} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}
                                </Select>
                            ) : (
                                <Input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder={
                                        formData.state
                                            ? "Enter city"
                                            : "Select a state first"
                                    }
                                    disabled={isReadOnly}
                                    aria-invalid={!!errors.city}
                                />
                            )}
                            {errors.city && (
                                <span style={errorStyle}>{errors.city}</span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>POSTAL/ZIP CODE</Label>
                            <Input
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                placeholder="Enter code"
                                disabled={isReadOnly}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>PHONE NUMBER</Label>
                            <Input
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                disabled={isReadOnly}
                                aria-invalid={!!errors.phoneNumber}
                            />
                            {errors.phoneNumber && (
                                <span style={errorStyle}>{errors.phoneNumber}</span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>ADMIN CONTACT EMAIL ID</Label>
                            <Input
                                type="email"
                                name="adminContactEmail"
                                value={formData.adminContactEmail}
                                onChange={handleChange}
                                placeholder="Enter email"
                                disabled={isReadOnly}
                                aria-invalid={!!errors.adminContactEmail}
                            />
                            {errors.adminContactEmail && (
                                <span style={errorStyle}>
                                    {errors.adminContactEmail}
                                </span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>FINANCIAL CONTACT EMAIL ID</Label>
                            <Input
                                type="email"
                                name="financialContactEmail"
                                value={formData.financialContactEmail}
                                onChange={handleChange}
                                placeholder="Enter email"
                                disabled={isReadOnly}
                                aria-invalid={!!errors.financialContactEmail}
                            />
                            {errors.financialContactEmail && (
                                <span style={errorStyle}>
                                    {errors.financialContactEmail}
                                </span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>TECHNICAL CONTACT EMAIL ID</Label>
                            <Input
                                type="email"
                                name="technicalContactEmail"
                                value={formData.technicalContactEmail}
                                onChange={handleChange}
                                placeholder="Enter email"
                                disabled={isReadOnly}
                                aria-invalid={!!errors.technicalContactEmail}
                            />
                            {errors.technicalContactEmail && (
                                <span style={errorStyle}>
                                    {errors.technicalContactEmail}
                                </span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>CLIENT STATUS</Label>
                            <Select
                                name="clientStatus"
                                value={formData.clientStatus}
                                onChange={handleChange}
                                disabled={isReadOnly}
                                aria-invalid={!!errors.clientStatus}
                            >
                                <option value="">Select status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Select>
                            {errors.clientStatus && (
                                <span style={errorStyle}>{errors.clientStatus}</span>
                            )}
                        </FormGroup>

                    </FormGrid>

                    <SectionDivider />

                    <Section>

                        <SectionTitle>Financial Information</SectionTitle>

                        <SectionDescription>
                            Enter customer details for invoicing, payments, and
                            financial operations.
                        </SectionDescription>

                        <FormGrid>

                            <FormGroup>
                                <Label>CREDIT LIMIT</Label>
                                <Input
                                    name="creditLimit"
                                    value={formData.creditLimit}
                                    onChange={handleChange}
                                    placeholder="00"
                                    disabled={isReadOnly}
                                    aria-invalid={!!errors.creditLimit}
                                />
                                {errors.creditLimit && (
                                    <span style={errorStyle}>
                                        {errors.creditLimit}
                                    </span>
                                )}
                                {isView && formData.creditLimit && (
                                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                                        {formatCurrency(
                                            formData.creditLimit,
                                            formData.currency
                                        )}
                                    </span>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <Label>PAYMENT TERMS</Label>
                                <Select
                                    name="financialPaymentTerms"
                                    value={formData.financialPaymentTerms}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                >
                                    <option value="">Select Date</option>
                                    <option value="15_days">15 Days</option>
                                    <option value="30_days">30 Days</option>
                                    <option value="45_days">45 Days</option>
                                    <option value="60_days">60 Days</option>
                                </Select>
                            </FormGroup>

                            <FormGroup>
                                <Label>OPENING BALANCE</Label>
                                <Input
                                    name="openingBalance"
                                    value={formData.openingBalance}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    disabled={isReadOnly}
                                    aria-invalid={!!errors.openingBalance}
                                />
                                {errors.openingBalance && (
                                    <span style={errorStyle}>
                                        {errors.openingBalance}
                                    </span>
                                )}
                                {isView && formData.openingBalance && (
                                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                                        {formatCurrency(
                                            formData.openingBalance,
                                            formData.currency
                                        )}
                                    </span>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <Label>NOTES</Label>
                                <Input
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Enter notes"
                                    disabled={isReadOnly}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>UPLOAD DOCUMENTS</Label>
                                <InputWithIcon>
                                    <Input
                                        readOnly
                                        value={formData.documents?.name || ""}
                                        placeholder="Upload document"
                                    />

                                    {!isReadOnly && (
                                        <>
                                            <IconButton
                                                type="button"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            "customer-document"
                                                        )
                                                        .click()
                                                }
                                            >
                                                <FiUpload size={16} />
                                            </IconButton>

                                            <input
                                                id="customer-document"
                                                type="file"
                                                name="documents"
                                                onChange={handleChange}
                                                hidden
                                            />
                                        </>
                                    )}
                                </InputWithIcon>
                            </FormGroup>

                        </FormGrid>

                    </Section>

                    {submitError && (
                        <div style={{ color: "#e53935", fontSize: 13, marginTop: 8 }}>
                            {submitError}
                        </div>
                    )}

                    <Actions>

                        <CancelButton
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                        >
                            {isView ? "CLOSE" : "CANCEL"}
                        </CancelButton>

                        {!isView && (
                            <SaveButton type="submit" disabled={saving}>
                                <FiSave size={15} />
                                {saving
                                    ? "SAVING..."
                                    : isEdit
                                        ? "UPDATE CUSTOMER"
                                        : "SAVE CUSTOMER"}
                            </SaveButton>
                        )}

                    </Actions>

                </form>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default CustomerModal;