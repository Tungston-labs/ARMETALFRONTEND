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
    Required,
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
    state: "",
    country: "",
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
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const isEdit = mode === "edit";
    const isView = mode === "view";
    const isReadOnly = isView;

    const selectedCountry = useMemo(
        () => getCountryByCode(formData.country),
        [formData.country]
    );
    const selectedStateName = useMemo(() => {
        if (!formData.state) return "";
        const match = stateOptions.find((s) => s.code === formData.state);
        return match?.name || formData.state;
    }, [formData.state, stateOptions]);


    useEffect(() => {
        if (!isOpen) return;

        setErrors({});
        setSubmitError(null);

        if ((isEdit || isView) && customer) {

            const matchedCountry = COUNTRY_OPTIONS.find(
                (c) =>
                    c.name.toLowerCase() ===
                    (customer.country || "").toLowerCase()
            );

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
            currency: prev.currency || country?.currencyCode || "",
            phoneNumber:
                prev.phoneNumber || (country?.dialCode ? `${country.dialCode} ` : ""),
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
        const creditLimit = String(formData.creditLimit ?? "").trim();
        if (!name) {
            nextErrors.customerName = "Company name is required";
        } else if (name.length < 2) {
            nextErrors.customerName =
                "Company name must be at least 2 characters";
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

        if (!financialEmail) {
            nextErrors.financialContactEmail = "Financial contact email is required";
        } else if (!EMAIL_PATTERN.test(financialEmail)) {
            nextErrors.financialContactEmail = "Enter a valid email address";
        }

        if (technicalEmail && !EMAIL_PATTERN.test(technicalEmail)) {
            nextErrors.technicalContactEmail = "Enter a valid email address";
        }

        if (website && !WEBSITE_PATTERN.test(website)) {
            nextErrors.website = "Enter a valid website URL";
        }

        if (creditLimit === "") {
            nextErrors.creditLimit = "Credit limit is required";
        } else {
            const value = Number(creditLimit);
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
            state: selectedStateName.trim(),
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

            await onSave(customerData, formData.documents);
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
                            <Label>COMPANY NAME
                                <Required>*</Required></Label>
                            <Input
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                disabled={isReadOnly}
                            />
                            {errors.customerName && (
                                <span style={errorStyle}>{errors.customerName}</span>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>CUSTOMER TYPE</Label>
                            <Select
                                name="customer_type"
                                value={formData.customer_type}
                                onChange={handleChange}
                                disabled={isReadOnly}
                                aria-invalid={!!errors.customer_type}
                            >
                                <option value="">Select Category</option>
                                <option value="manufacturing">Company</option>
                                <option value="construction">Individual</option>
                                <option value="healthcare">Individual</option>
                                <option value="finance">Government</option>
                            </Select>

                        </FormGroup>
                        <FormGroup>
                            <Label>CUSTOMER CATEGORY</Label>
                            <Select
                                name="customer_category"
                                value={formData.customer_category}
                                onChange={handleChange}
                                disabled={isReadOnly}
                                aria-invalid={!!errors.customer_category}
                            >
                                <option value="">Select Category</option>
                                <option value="manufacturing">Corporate</option>
                                <option value="construction">SME</option>
                                <option value="healthcare">Individual</option>
                                <option value="finance">Government</option>
                            </Select>

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
                                <option value="manufacturing">IT & Software</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="construction">Construction & Real Estate</option>
                                <option value="healthcare">Trading</option>
                                <option value="healthcare">Wholesale & Distribution</option>
                                <option value="finance">Banking & Financial Services</option>
                                <option value="retail">Retail</option>
                                <option value="technology">Others</option>
                            </Select>
                            {errors.industry && (
                                <span style={errorStyle}>{errors.industry}</span>
                            )}
                        </FormGroup>



                        <FormGroup>
                            <Label>COMMERCIAL REGISTRATION NUMBER
                                <Required>*</Required>
                            </Label>
                            <Input
                                name="crNumber"
                                value={formData.crNumber}
                                onChange={handleChange}
                                placeholder="Enter number"
                                disabled={isReadOnly}
                            />
                        </FormGroup>

                        {/* <FormGroup>
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
                        </FormGroup> */}

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
                            <Label>VAT REGISTRATION EFFECTIVE DATE</Label>
                            <InputWithIcon>
                                <Input
                                    type="date"
                                    name="crExpiryDate"
                                    value={formData.crExpiryDate}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                />

                            </InputWithIcon>
                        </FormGroup>

                        <FormGroup>
                            <Label>PAYMENT TERM
                                <Required>*</Required>
                            </Label>
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
                        <FormGroup>
                            <AddressLabel>
                                BILLING ADDRESS
                                <Required>*</Required>
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
                            <Label>COUNTRY
                                <Required>*</Required>
                            </Label>
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
                            <Label>STATE
                                <Required>*</Required>
                            </Label>
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
                            <Label>CITY
                                <Required>*</Required></Label>
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
                            <Label>POSTAL/ZIP CODE
                                <Required>*</Required></Label>
                            <Input
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                placeholder="Enter code"
                                disabled={isReadOnly}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>PHONE NUMBER
                                <Required>*</Required></Label>
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
                            <Label>FINANCIAL CONTACT EMAIL ID
                                <Required>*</Required></Label>
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
                                <Label>CREDIT LIMIT
                                    <Required>*</Required></Label>
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
                                <Label>PAYMENT METHODS</Label>
                                <Select
                                    name="financialPaymentTerms"
                                    value={formData.financialPaymentTerms}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                >
                                    <option value="">Select </option>
                                    <option value="15_days">Bank Transfer</option>
                                    <option value="30_days">Cash</option>
                                    <option value="45_days">Card</option>
                                    <option value="60_days">Cheque</option>
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
                                        onClick={() =>
                                            !isReadOnly && document.getElementById("customer-document").click()
                                        }
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