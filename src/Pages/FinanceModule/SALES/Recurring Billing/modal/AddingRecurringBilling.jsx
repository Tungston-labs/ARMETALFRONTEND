import React, { useState } from "react";
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

const ProductServiceModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        productCode: "",
        productName: "",
        category: "",
        hsCode: "",
        vatRate: "",
        basePrice: "",
        unitType: "Monthly",
        billingType: "One Time",
        discount: "",
        finalPrice: "",
        status: "Active",
        technology: "",
        database: "",

        starterServiceId: "",
        starterUsers: "10",
        starterBillingCycle: "Monthly",
        starterDiscount: "10",
        starterPrice: "15000",

        professionalServiceId: "",
        professionalUsers: "25",
        professionalBillingCycle: "Monthly",
        professionalDiscount: "10",
        professionalPrice: "18000",

        enterpriseServiceId: "",
        enterpriseUsers: "Unlimited",
        enterpriseBillingCycle: "Monthly",
        enterpriseDiscount: "10",
        enterprisePrice: "",

        recurringType: "",
        frequency: "",
        every: "",
        startDate: "",
        endDate: "Never",
        defaultItemService: "",
        amount: "",
        recurringVat: "",
        reminderBeforeRenewal: "Before 5 Days",
        recurringBillingCycle: "Advanced",
        autoEmailTo: "",
        totalRecurrence: "24",
        recurrenceStatus: "Active",
        additionalNotes: "",
        whatsappNumber: "",
    });

    const [autoGenerateInvoice, setAutoGenerateInvoice] = useState(true);
    const [autoSendInvoice, setAutoSendInvoice] = useState(true);
    const [includeTax, setIncludeTax] = useState(true);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            autoGenerateInvoice,
            autoSendInvoice,
            includeTax,
        };

        if (onSubmit) {
            onSubmit(payload);
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
                                Create a new product/service with pricing,
                                tax and other details.
                            </SectionDescription>

                            <FormGrid>
                                <FormGroup>
                                    <Label>Product Code</Label>
                                    <Input
                                        name="productCode"
                                        placeholder="ERP-001"
                                        value={formData.productCode}
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
                                            <option value="software">
                                                Software
                                            </option>
                                            <option value="service">
                                                Service
                                            </option>
                                            <option value="subscription">
                                                Subscription
                                            </option>
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
                                    <Label>Unit Type</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="unitType"
                                            value={formData.unitType}
                                            onChange={handleChange}
                                        >
                                            <option value="Monthly">
                                                Monthly
                                            </option>
                                            <option value="Yearly">
                                                Yearly
                                            </option>
                                            <option value="Weekly">
                                                Weekly
                                            </option>
                                            <option value="Daily">
                                                Daily
                                            </option>
                                            <option value="One Time">
                                                One Time
                                            </option>
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
                                            <option value="One Time">
                                                One Time
                                            </option>
                                            <option value="Recurring">
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
                                            <option value="Active">
                                                Active
                                            </option>
                                            <option value="Inactive">
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
                                        <input type="file" />
                                        <FiUpload />
                                    </UploadBox>
                                </FormGroup>

                                <FormGroup>
                                    <Label>
                                        Product Screenshot(Optional)
                                    </Label>

                                    <UploadBox>
                                        <input type="file" />
                                        <FiUpload />
                                    </UploadBox>
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
                                Create a new product/service with pricing,
                                tax and other details.
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
                                            <option value="Monthly">
                                                Monthly
                                            </option>
                                            <option value="Yearly">
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
                                            <option value="Monthly">
                                                Monthly
                                            </option>
                                            <option value="Yearly">
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
                                            <option value="Monthly">
                                                Monthly
                                            </option>
                                            <option value="Yearly">
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
                                    <Label>RECURRING TYPE</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="recurringType"
                                            value={formData.recurringType}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Recurring Type
                                            </option>
                                            <option value="Invoice">
                                                Invoice
                                            </option>
                                            <option value="Subscription">
                                                Subscription
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
                                            <option value="">
                                                Select Frequency
                                            </option>
                                            <option value="Daily">
                                                Daily
                                            </option>
                                            <option value="Weekly">
                                                Weekly
                                            </option>
                                            <option value="Monthly">
                                                Monthly
                                            </option>
                                            <option value="Yearly">
                                                Yearly
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>EVERY</Label>

                                    <Input
                                        name="every"
                                        placeholder="00 Period(s)"
                                        value={formData.every}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>START DATE</Label>

                                    <Input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>END DATE</Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                        >
                                            <option value="Never">
                                                Never
                                            </option>
                                            <option value="Specific Date">
                                                Specific Date
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>
                                        DEFAULT ITEM/SERVICE
                                    </Label>

                                    <SelectWrapper>
                                        <StyledSelect
                                            name="defaultItemService"
                                            value={
                                                formData.defaultItemService
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Service
                                            </option>
                                            <option value="starter">
                                                Starter
                                            </option>
                                            <option value="professional">
                                                Professional
                                            </option>
                                            <option value="enterprise">
                                                Enterprise
                                            </option>
                                        </StyledSelect>

                                        <SelectIcon>
                                            <FiChevronDown />
                                        </SelectIcon>
                                    </SelectWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>AMOUNT</Label>

                                    <Input
                                        name="amount"
                                        placeholder="----"
                                        value={formData.amount}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

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
                                            <option value="Advanced">
                                                Advanced
                                            </option>
                                            <option value="Monthly">
                                                Monthly
                                            </option>
                                            <option value="Yearly">
                                                Yearly
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
                                            <option value="Active">
                                                Active
                                            </option>
                                            <option value="Inactive">
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