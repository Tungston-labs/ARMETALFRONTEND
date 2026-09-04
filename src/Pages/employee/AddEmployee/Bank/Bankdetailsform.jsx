import React, { useState } from "react";
import { PageContainer, FormCard } from "../EmployeeForm.styles";

import FormStepper from "../Formstepper";
import BankDetailsSection from "./Bankdetailssection";

// Same country-rules helper used across the employee form.
// Adjust the relative path below to match where this file actually lives.
import {
  getBankFieldConfig,
  isIndiaCompany,
  getBankSubmissionDefaults,
} from "../../../../utils/employeeCountryFields";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";

const BankDetailsForm = () => {
  const savedUser = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
  );
  const companyCountry = savedUser?.company?.country || "IN";
  const bankConfig = getBankFieldConfig(companyCountry);
  const isIndia = isIndiaCompany(companyCountry);

  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    swiftCode: "",
    basicSalary: "",
    uanNumber: "",
    panNumber: "",
    taxRegime: "",
    tdsDeductionAmount: "",
    declaration80c: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = ["bankName", "accountNumber", "basicSalary", bankConfig.bankCodeField];

    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (bankConfig.showIndianTax) {
      if (!formData.panNumber || !formData.panNumber.toString().trim()) {
        newErrors.panNumber = "This field is required";
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber.trim().toUpperCase())) {
        newErrors.panNumber = "Enter a valid PAN (e.g. ABCDE1234F)";
      }

      if (!formData.taxRegime) {
        newErrors.taxRegime = "This field is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Call this on submit — merges in country-specific defaults (N/A / 0 /
  // false) for the tax fields that non-India companies never show.
  const buildSubmissionPayload = () => ({
    ...formData,
    ...getBankSubmissionDefaults(companyCountry),
  });

  return (
    <PageContainer>
        <ReusableHeader
                    title="Add Employee Form"
                    breadcrumbs={[ "Employees","Add Form"]}
                   showBack
                />
      <FormCard>
        
        {/* =========================
            STEPPER
        ========================= */}
        <FormStepper steps={["Basic Details", "Bank Details", "Documents"]} activeStep={1} />

        {/* =========================
            FORM SECTION
        ========================= */}
        <BankDetailsSection
          companyCountry={companyCountry}
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
      </FormCard>
    </PageContainer>
  );
};

export default BankDetailsForm;