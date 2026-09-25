import React, { useState, useEffect } from "react";
import { FiX, FiUpload, FiChevronDown, FiSave } from "react-icons/fi";

import {
    Overlay,
    Modal,
    ModalHeader,
    ModalTitleWrapper,
    ModalTitle,
    ModalSubtitle,
    CloseButton,
    ModalBody,
    Section,
    SectionTitle,
    SectionDescription,
    FormGrid,
    FormGroup,
    Label,
    Input,
    SelectWrapper,
    StyledSelect,
    SelectIcon,
    UploadBox,
    PricingRow,
    ToggleContainer,
    ToggleItem,
    ToggleSwitch,
    ToggleContent,
    ToggleLabel,
    ToggleDescription,
    ModalFooter,
    CancelButton,
    SaveButton,
} from "./AddingRecurringBilling.styles";

// Pull a human-friendly count out of "Before 5 Days" -> 5
const parseReminderDays = (label) => {
    const match = /\d+/.exec(label || "");
    return match ? Number(match[0]) : 0;
};

const initialFormData = {
    // ---- service ----
    product: "",
    productCode: "",
    productName: "",
    category: "",
    hsCode: "",
    vatRate: "",
    basePrice: "",
    unitType: "Month",
    billingType: "recurring",
    discount: "",
    finalPrice: "",
    status: "active",
    technology: "",
    database: "",

    // ---- pricing plans ----
    starterServiceId: "",
    starterUsers: "10",
    starterBillingCycle: "monthly",
    starterDiscount: "10",
    starterPrice: "",

    professionalServiceId: "",
    professionalUsers: "25",
    professionalBillingCycle: "monthly",
    professionalDiscount: "10",
    professionalPrice: "",

    enterpriseServiceId: "",
    enterpriseUsers: "",
    enterpriseBillingCycle: "monthly",
    enterpriseDiscount: "10",
    enterprisePrice: "",

    // ---- billing / contract ----
    customer: "",
    recurringType: "invoice",
    frequency: "monthly",
    startDate: "",
    endDateOption: "never",
    endDateValue: "",
    recurringVat: "",
    reminderBeforeRenewal: "Before 5 Days",
    recurringBillingCycle: "advance",
    autoEmailTo: "",
    totalRecurrence: "24",
    recurrenceStatus: "active",
    additionalNotes: "",
    whatsappNumber: "",
};

const ProductServiceModal = ({
    isOpen,
    onClose,
    onSubmit,
    customers = [],
    categories = [],
    products = [],
}) => {
    // "new" -> user types everything in fresh.
    // "existing" -> pick a product.Product row and prefill from it.
    const [productMode, setProductMode] = useState("new");

    const [formData, setFormData] = useState(initialFormData);

    const [files, setFiles] = useState({
        product_icon: null,
        screenshot: null,
    });

    const [autoGenerateInvoice, setAutoGenerateInvoice] = useState(true);
    const [autoSendInvoice, setAutoSendInvoice] = useState(true);
    const [includeTax, setIncludeTax] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setProductMode("new");
            setFormData(initialFormData);
            setFiles({ product_icon: null, screenshot: null });
            setAutoGenerateInvoice(true);
            setAutoSendInvoice(true);
            setIncludeTax(true);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (field) => (e) => {
        const file = e.target.files?.[0] || null;
        setFiles((prev) => ({ ...prev, [field]: file }));
    };

    // Switching between "new" and "existing" product
    const handleProductModeChange = (e) => {
        const mode = e.target.value;
        setProductMode(mode);

        if (mode === "new") {
            // Starting fresh - clear anything an existing product filled in
            setFormData((prev) => ({
                ...prev,
                product: "",
                productCode: "",
                productName: "",
                category: "",
                hsCode: "",
                vatRate: "",
                basePrice: "",
                unitType: "Month",
                status: "active",
                finalPrice: "",
            }));
        }
    };

    // Fill the service fields from a selected product.Product row.
    // Everything stays editable afterwards - this only sets the
    // starting values, it doesn't lock the fields.
    const handleExistingProductSelect = (e) => {
        const productId = e.target.value;

        if (!productId) {
            setFormData((prev) => ({ ...prev, product: "" }));
            return;
        }

        const product = products.find(
            (p) => String(p.id) === String(productId)
        );

        if (!product) {
            setFormData((prev) => ({ ...prev, product: productId }));
            return;
        }

        setFormData((prev) => {
            const basePrice =
                product.selling_price !== undefined &&
                product.selling_price !== null
                    ? product.selling_price
                    : prev.basePrice;

            const vatRate =
                product.tax_rate !== undefined && product.tax_rate !== null
                    ? product.tax_rate
                    : prev.vatRate;

            const discount = prev.discount || "0";

            const updated = {
                ...prev,
                product: product.id,
                productCode: product.code || "",
                productName: product.product_name || "",
                category: product.category || "",
                hsCode: product.hsn_sac_code || "",
                basePrice,
                unitType: product.unit || prev.unitType,
                vatRate,
                status: product.status || prev.status,
                discount,
            };

            updated.finalPrice = calculateFinalPrice(
                basePrice,
                discount,
                vatRate
            );

            return updated;
        });
    };

    const handleProductSelection = (e) => {
        const val = e.target.value;
        if (val === "new") {
             handleProductModeChange({ target: { value: "new" } });
        } else {
             handleProductModeChange({ target: { value: "existing" } });
             handleExistingProductSelect(e);
        }
    };

    const calculateFinalPrice = (base, discount, vat) => {
        const basePrice = Number(base) || 0;
        const discountValue = Number(discount) || 0;
        const vatValue = Number(vat) || 0;

        const discountedPrice =
            basePrice - (basePrice * discountValue) / 100;

        const final =
            discountedPrice +
            (discountedPrice * vatValue) / 100;

        return final.toFixed(2);
    };

    const handlePriceCalculation = (name, value) => {
        setFormData((prev) => {
            const updated = {
                ...prev,
                [name]: value,
            };

            if (
                name === "basePrice" ||
                name === "discount" ||
                name === "vatRate"
            ) {
                updated.finalPrice = calculateFinalPrice(
                    name === "basePrice"
                        ? value
                        : prev.basePrice,
                    name === "discount"
                        ? value
                        : prev.discount,
                    name === "vatRate"
                        ? value
                        : prev.vatRate
                );
            }

            return updated;
        });
    };

    // Only include a pricing tier if the user actually priced it
    const buildPricingPlans = () => {
        const plans = [];

        if (formData.starterPrice) {
            plans.push({
                plan_type: "starter",
                service_id: formData.starterServiceId,
                users: formData.starterUsers
                    ? Number(formData.starterUsers)
                    : null,
                billing_cycle: formData.starterBillingCycle,
                discount_percent: formData.starterDiscount || 0,
                price: formData.starterPrice,
            });
        }

        if (formData.professionalPrice) {
            plans.push({
                plan_type: "professional",
                service_id: formData.professionalServiceId,
                users: formData.professionalUsers
                    ? Number(formData.professionalUsers)
                    : null,
                billing_cycle: formData.professionalBillingCycle,
                discount_percent: formData.professionalDiscount || 0,
                price: formData.professionalPrice,
            });
        }

        if (formData.enterprisePrice) {
            plans.push({
                plan_type: "enterprise",
                service_id: formData.enterpriseServiceId,
                users: formData.enterpriseUsers
                    ? Number(formData.enterpriseUsers)
                    : null,
                billing_cycle: formData.enterpriseBillingCycle,
                discount_percent: formData.enterpriseDiscount || 0,
                price: formData.enterprisePrice,
            });
        }

        return plans;
    };

    const buildPayload = () => {
        const service = {
            product_code: formData.productCode,
            product:
                productMode === "existing" && formData.product
                    ? formData.product
                    : null,
            product_service_name: formData.productName,
            category: formData.category || null,
            hs_code: formData.hsCode,
            vat_rate: formData.vatRate || 0,
            base_price: formData.basePrice || 0,
            unit_price: formData.basePrice || 0,
            unit: formData.unitType,
            billing_type: formData.billingType,
            discount: formData.discount || 0,
            final_price: formData.finalPrice || 0,
            technology: formData.technology,
            database: formData.database,
            status: formData.status,
        };

        const pricing_plans = buildPricingPlans();

        const billing = {
            customer: formData.customer,
            recurring_type: formData.recurringType,
            start_date: formData.startDate,
            end_date:
                formData.endDateOption === "specific"
                    ? formData.endDateValue || null
                    : null,
            frequency: formData.frequency,
            total_recurrence:
                formData.totalRecurrence === "Unlimited"
                    ? null
                    : Number(formData.totalRecurrence),
            unlimited_recurrence:
                formData.totalRecurrence === "Unlimited",
            billing_cycle: formData.recurringBillingCycle,
            auto_email_to: formData.autoEmailTo,
            whatsapp_number: formData.whatsappNumber,
            auto_generate_invoice: autoGenerateInvoice,
            auto_send: autoSendInvoice,
            include_tax: includeTax,
            recurrence_status: formData.recurrenceStatus,
            additional_notes: formData.additionalNotes,
            reminder_before_renewal_days: parseReminderDays(
                formData.reminderBeforeRenewal
            ),
        };

        return { service, pricing_plans, billing };
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.customer) {
            // Customer is a required FK on RecurringBilling
            alert("Please select a customer before saving.");
            return;
        }

        const payload = buildPayload();

        if (onSubmit) {
            // Images go up separately as a follow-up multipart PATCH,
            // since the create endpoint accepts JSON for the nested
            // service/pricing_plans/billing payload.
            onSubmit(payload, files);
        }
    };

    return (
        <Overlay>
            <Modal>
                {/* ================= HEADER ================= */}

                <ModalHeader>
                    <ModalTitleWrapper>
                        <ModalTitle>
                            Add Product / Service
                        </ModalTitle>

                        <ModalSubtitle>
                            Create a new product or service with pricing,
                            tax and recurring billing details.
                        </ModalSubtitle>
                    </ModalTitleWrapper>

                    <CloseButton
                        type="button"
                        onClick={onClose}
                    >
                        <FiX />
                    </CloseButton>
                </ModalHeader>

                {/* ================= BODY ================= */}

                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        {/* ================= PRODUCT INFORMATION ================= */}

                        <Section>
                            <SectionTitle>
                                Product/Service Information
                            </SectionTitle>

                            <SectionDescription>
                                Pick an existing product to reuse its
                                details, or start a brand new one.
                            </SectionDescription>

                            <FormGrid>
                                <FormGroup>
                                    <Label>Select Product</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="productSelection"
                                            value={productMode === "new" ? "new" : formData.product}
                                            onChange={handleProductSelection}
                                        >
                                            <option value="new">
                                                + Add New Product
                                            </option>
                                            <option disabled>
                                                ───────────────
                                            </option>
                                            {products.map((p) => (
                                                <option
                                                    key={p.id}
                                                    value={p.id}
                                                >
                                                    {p.product_name}
                                                </option>
                                            ))}
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Product Code</Label>
                                    <Input
                                        name="productCode"
                                        placeholder="Enter Product Code"
                                        value={formData.productCode || ""}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>
                                        Product or Service Name
                                    </Label>

                                    <Input
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Category</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Category
                                            </option>
                                            {categories.map((cat) => (
                                                <option
                                                    key={cat.id}
                                                    value={cat.id}
                                                >
                                                    {cat.name || cat.category_name}
                                                </option>
                                            ))}
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>HS Code</Label>

                                    <Input
                                        name="hsCode"
                                        value={formData.hsCode}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>VAT Rate(%)</Label>

                                    <Input
                                        type="number"
                                        name="vatRate"
                                        placeholder="00"
                                        value={formData.vatRate}
                                        onChange={(e) =>
                                            handlePriceCalculation(
                                                "vatRate",
                                                e.target.value
                                            )
                                        }
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Base Price</Label>

                                    <Input
                                        type="number"
                                        name="basePrice"
                                        placeholder="0000"
                                        value={formData.basePrice}
                                        onChange={(e) =>
                                            handlePriceCalculation(
                                                "basePrice",
                                                e.target.value
                                            )
                                        }
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Unit</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="unitType"
                                            value={formData.unitType}
                                            onChange={handleChange}
                                        >
                                            <option value="PCS">Piece (PCS)</option>
                                            <option value="Box">Box</option>
                                            <option value="Pack">Pack</option>
                                            <option value="Month">Month</option>
                                            <option value="Project">Project</option>
                                            <option value="Set">Set</option>
                                            <option value="Kg">Kilogram (Kg)</option>
                                            <option value="Meter">Meter</option>
                                            <option value="Other">Other</option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Billing Type</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="billingType"
                                            value={formData.billingType}
                                            onChange={handleChange}
                                        >
                                            <option value="one_time">
                                                One Time
                                            </option>
                                            <option value="recurring">
                                                Recurring
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Discount (%)</Label>

                                    <Input
                                        type="number"
                                        name="discount"
                                        placeholder="00%"
                                        value={formData.discount}
                                        onChange={(e) =>
                                            handlePriceCalculation(
                                                "discount",
                                                e.target.value
                                            )
                                        }
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Final Price</Label>

                                    <Input
                                        name="finalPrice"
                                        placeholder="0000"
                                        value={formData.finalPrice}
                                        readOnly
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Status</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>
                                        Product Icon/Image
                                    </Label>

                                    <UploadBox>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange("product_icon")}
                                        />
                                        <FiUpload />
                                    </UploadBox>
                                    {files.product_icon && (
                                        <small>{files.product_icon.name}</small>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label>
                                        Product Screenshot(Optional)
                                    </Label>

                                    <UploadBox>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange("screenshot")}
                                        />
                                        <FiUpload />
                                    </UploadBox>
                                    {files.screenshot && (
                                        <small>{files.screenshot.name}</small>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <Label>Technology</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="technology"
                                            value={formData.technology}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select
                                            </option>
                                            <option value="React">
                                                React
                                            </option>
                                            <option value="Django">
                                                Django
                                            </option>
                                            <option value="Node">
                                                Node.js
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Database</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="database"
                                            value={formData.database}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select
                                            </option>
                                            <option value="PostgreSQL">
                                                PostgreSQL
                                            </option>
                                            <option value="MySQL">
                                                MySQL
                                            </option>
                                            <option value="MongoDB">
                                                MongoDB
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>
                            </FormGrid>
                        </Section>

                        {/* ================= PRICING PLANS ================= */}

                        <Section>
                            <SectionTitle>
                                Pricing Plans
                            </SectionTitle>

                            <SectionDescription>
                                Only tiers with a price filled in will be
                                saved as pricing plans.
                            </SectionDescription>

                            <PricingRow>
                                <FormGroup>
                                    <Label>Starter</Label>
                                    <Input
                                        name="starterServiceId"
                                        placeholder="Service ID"
                                        value={formData.starterServiceId}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Users</Label>
                                    <SelectWrapper>
                                        <StyledSelect
                                            name="starterUsers"
                                            value={formData.starterUsers}
                                            onChange={handleChange}
                                        >
                                            <option value="10">
                                                10
                                            </option>
                                            <option value="25">
                                                25
                                            </option>
                                            <option value="50">
                                                50
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Billing Cycle</Label>
                                    <SelectWrapper>
                                        <StyledSelect
                                            name="starterBillingCycle"
                                            value={
                                                formData.starterBillingCycle
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="monthly">
                                                Monthly
                                            </option>
                                            <option value="yearly">
                                                Yearly
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Discount</Label>
                                    <SelectWrapper>
                                        <StyledSelect
                                            name="starterDiscount"
                                            value={formData.starterDiscount}
                                            onChange={handleChange}
                                        >
                                            <option value="10">
                                                10 (%)
                                            </option>
                                            <option value="15">
                                                15 (%)
                                            </option>
                                            <option value="20">
                                                20 (%)
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Price</Label>
                                    <Input
                                        name="starterPrice"
                                        placeholder="SAR 15,000"
                                        value={formData.starterPrice}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </PricingRow>

                            <PricingRow>
                                <FormGroup>
                                    <Label>Professional</Label>
                                    <Input
                                        name="professionalServiceId"
                                        placeholder="Service ID"
                                        value={
                                            formData.professionalServiceId
                                        }
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Users</Label>
                                    <SelectWrapper>
                                        <StyledSelect
                                            name="professionalUsers"
                                            value={
                                                formData.professionalUsers
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="25">
                                                25
                                            </option>
                                            <option value="50">
                                                50
                                            </option>
                                            <option value="100">
                                                100
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Billing Cycle</Label>
                                    <SelectWrapper>
                                        <StyledSelect
                                            name="professionalBillingCycle"
                                            value={
                                                formData.professionalBillingCycle
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="monthly">
                                                Monthly
                                            </option>
                                            <option value="yearly">
                                                Yearly
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Discount(%)</Label>
                                    <SelectWrapper>
                                        <StyledSelect
                                            name="professionalDiscount"
                                            value={
                                                formData.professionalDiscount
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="10">
                                                10 (%)
                                            </option>
                                            <option value="15">
                                                15 (%)
                                            </option>
                                            <option value="20">
                                                20 (%)
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Price</Label>
                                    <Input
                                        name="professionalPrice"
                                        placeholder="SAR 18,000"
                                        value={
                                            formData.professionalPrice
                                        }
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </PricingRow>

                            <PricingRow>
                                <FormGroup>
                                    <Label>Enterprise</Label>
                                    <Input
                                        name="enterpriseServiceId"
                                        placeholder="Service ID"
                                        value={
                                            formData.enterpriseServiceId
                                        }
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Users</Label>
                                    <Input
                                        name="enterpriseUsers"
                                        placeholder="Leave blank for unlimited"
                                        value={formData.enterpriseUsers}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Billing Cycle</Label>
                                    <SelectWrapper>
                                        <StyledSelect
                                            name="enterpriseBillingCycle"
                                            value={
                                                formData.enterpriseBillingCycle
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="monthly">
                                                Monthly
                                            </option>
                                            <option value="yearly">
                                                Yearly
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Discount(%)</Label>
                                    <SelectWrapper>
                                        <StyledSelect
                                            name="enterpriseDiscount"
                                            value={
                                                formData.enterpriseDiscount
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="10">
                                                10 (%)
                                            </option>
                                            <option value="15">
                                                15 (%)
                                            </option>
                                            <option value="20">
                                                20 (%)
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Price</Label>
                                    <Input
                                        name="enterprisePrice"
                                        placeholder="SAR 0000"
                                        value={formData.enterprisePrice}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </PricingRow>
                        </Section>

                        {/* ================= RECURRING BILL ================= */}

                        <Section>
                            <SectionTitle>
                                Recurring Bill Information
                            </SectionTitle>

                            <SectionDescription>
                                Enable recurring option if this client
                                will have recurring invoices.
                            </SectionDescription>

                            <FormGrid>
                                <FormGroup>
                                    <Label>CUSTOMER</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="customer"
                                            value={formData.customer}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Select Customer
                                            </option>
                                            {customers.map((cust) => (
                                                <option
                                                    key={cust.id}
                                                    value={cust.id}
                                                >
                                                    {cust.customer_name || cust.name}
                                                </option>
                                            ))}
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>RECURRING TYPE</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="recurringType"
                                            value={formData.recurringType}
                                            onChange={handleChange}
                                        >
                                            <option value="invoice">
                                                Invoice
                                            </option>
                                            <option value="bill">
                                                Bill
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>FREQUENCY</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="frequency"
                                            value={formData.frequency}
                                            onChange={handleChange}
                                        >
                                            <option value="weekly">
                                                Weekly
                                            </option>
                                            <option value="monthly">
                                                Monthly
                                            </option>
                                            <option value="quarterly">
                                                Quarterly
                                            </option>
                                            <option value="half_yearly">
                                                Half Yearly
                                            </option>
                                            <option value="yearly">
                                                Yearly
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>START DATE</Label>

                                    <Input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>END DATE</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="endDateOption"
                                            value={formData.endDateOption}
                                            onChange={handleChange}
                                        >
                                            <option value="never">
                                                Never
                                            </option>
                                            <option value="specific">
                                                Specific Date
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                {formData.endDateOption === "specific" && (
                                    <FormGroup>
                                        <Label>END DATE VALUE</Label>

                                        <Input
                                            type="date"
                                            name="endDateValue"
                                            value={formData.endDateValue}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                )}

                                <FormGroup>
                                    <Label>VAT (%)</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="recurringVat"
                                            value={formData.recurringVat}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select VAT
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
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>
                                        REMINDER BEFORE RENEWAL
                                    </Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="reminderBeforeRenewal"
                                            value={
                                                formData.reminderBeforeRenewal
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="Before 5 Days">
                                                Before 5 Days
                                            </option>
                                            <option value="Before 7 Days">
                                                Before 7 Days
                                            </option>
                                            <option value="Before 10 Days">
                                                Before 10 Days
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>BILLING CYCLE</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="recurringBillingCycle"
                                            value={
                                                formData.recurringBillingCycle
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="advance">
                                                Advance
                                            </option>
                                            <option value="arrears">
                                                Arrears
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>AUTO EMAIL TO</Label>

                                    <Input
                                        type="email"
                                        name="autoEmailTo"
                                        placeholder="Enter Email ID"
                                        value={formData.autoEmailTo}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>TOTAL RECURRENCE</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="totalRecurrence"
                                            value={
                                                formData.totalRecurrence
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="12">
                                                12
                                            </option>
                                            <option value="24">
                                                24
                                            </option>
                                            <option value="36">
                                                36
                                            </option>
                                            <option value="Unlimited">
                                                Unlimited
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>RECURRENCE STATUS</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="recurrenceStatus"
                                            value={
                                                formData.recurrenceStatus
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>ADDITIONAL NOTES</Label>

                                    <Input
                                        name="additionalNotes"
                                        placeholder="Add Notes"
                                        value={
                                            formData.additionalNotes
                                        }
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>WHATSAPP NUMBER</Label>

                                    <Input
                                        name="whatsappNumber"
                                        placeholder="0000000000"
                                        value={
                                            formData.whatsappNumber
                                        }
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </FormGrid>

                            {/* ================= TOGGLES ================= */}

                            <ToggleContainer>
                                <ToggleItem>
                                    <ToggleSwitch
                                        type="button"
                                        active={autoGenerateInvoice}
                                        onClick={() =>
                                            setAutoGenerateInvoice(
                                                (prev) => !prev
                                            )
                                        }
                                    >
                                        <span />
                                    </ToggleSwitch>

                                    <ToggleContent>
                                        <ToggleLabel>
                                            Auto Generate Invoice
                                        </ToggleLabel>

                                        <ToggleDescription>
                                            System will create invoices
                                            automatically
                                        </ToggleDescription>
                                    </ToggleContent>
                                </ToggleItem>

                                <ToggleItem>
                                    <ToggleSwitch
                                        type="button"
                                        active={autoSendInvoice}
                                        onClick={() =>
                                            setAutoSendInvoice(
                                                (prev) => !prev
                                            )
                                        }
                                    >
                                        <span />
                                    </ToggleSwitch>

                                    <ToggleContent>
                                        <ToggleLabel>
                                            Auto Send Invoice
                                        </ToggleLabel>

                                        <ToggleDescription>
                                            Invoices will be emailed
                                            automatically
                                        </ToggleDescription>
                                    </ToggleContent>
                                </ToggleItem>

                                <ToggleItem>
                                    <ToggleSwitch
                                        type="button"
                                        active={includeTax}
                                        onClick={() =>
                                            setIncludeTax(
                                                (prev) => !prev
                                            )
                                        }
                                    >
                                        <span />
                                    </ToggleSwitch>

                                    <ToggleContent>
                                        <ToggleLabel>
                                            Include Tax
                                        </ToggleLabel>

                                        <ToggleDescription>
                                            Tax will be added to invoices
                                        </ToggleDescription>
                                    </ToggleContent>
                                </ToggleItem>
                            </ToggleContainer>
                        </Section>
                    </form>
                </ModalBody>

                {/* ================= FOOTER ================= */}

                <ModalFooter>
                    <CancelButton
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </CancelButton>

                    <SaveButton
                        type="submit"
                        onClick={handleSubmit}
                    >
                                 <FiSave /> 
                        Save Product / Service
                    </SaveButton>
                </ModalFooter>
            </Modal>
        </Overlay>
    );
};

export default ProductServiceModal;