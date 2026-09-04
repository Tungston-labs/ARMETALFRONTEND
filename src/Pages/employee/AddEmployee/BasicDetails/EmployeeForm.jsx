import React, { useState } from "react";
import {
  PageContainer,
  FormCard,
} from "../EmployeeForm.styles";

import BasicDetailsSection from "./Basicdetailssection";
import JobDetailsSection from "./jobdetailssection";
import LegalInfoSection from "./Legalinfosection";
import {
  getLegalFieldConfig,
  isIndiaCompany,
  validateLegalIdentity,
} from "../../../../utils/employeeCountryFields";
import FormStepper from "../Formstepper";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";

const EmployeeForm = () => {
  const savedUser = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
  );
  const companyCountry = savedUser?.company?.country || "IN";
  const legalConfig = getLegalFieldConfig(companyCountry);
  const isIndia = isIndiaCompany(companyCountry);

  const identityFieldKeyMap = {
    aadar_number: "aadhaarNumber",
    iqama_number: "iqamaNumber",
    passport_number: "passportNumber",
  };
  const identityStateKey =
    identityFieldKeyMap[legalConfig.identityField] || "passportNumber";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    employeeId: "",
    gender: "",

    countryCode: "+971",
    contactNumber: "",
    address: "",
    country: "",
    postalCode: "",
    bloodGroup: "",

    designation: "",
    joiningDate: "",
    department: "",
    employmentType: "",
    roles: "",
    totalLeave: "",

    casualLeave: "00",
    sickLeave: "00",
    earnedLeave: "00",
    maternityLeave: "00",
    otherLeave: "00",
    passportNumber: "",
    iqamaNumber: "",
    aadhaarNumber: "",
    employeeContract: "",
    workPermit: "",
    insuranceNumber: "",
    contractExpiryDate: "",
    visaExpiryDate: "",
    idCardPhoto: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const isLegalFieldRequired = (fieldKey) =>
    legalConfig.requiredFields.includes(fieldKey);

  const validateForm = () => {
    const newErrors = {};
    const now = new Date().toISOString().split("T")[0];

    const requiredFields = [
      "name",
      "email",
      "dateOfBirth",
      "employeeId",
      "gender",
      "contactNumber",
      "address",
      "country",
      "postalCode",
      "designation",
      "joiningDate",
      "department",
      "employmentType",
      "roles",
      "totalLeave",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = "This field is required";
      }
    });

    // Identity field — always required (it's the anchor identity document
    // for every country: Aadhaar / Emirates ID / Passport).
    if (!formData[identityStateKey] || !formData[identityStateKey].toString().trim()) {
      newErrors[identityStateKey] = "This field is required";
    }

    // Extra Passport Number field (UAE) is optional — not in UAE's
    // requiredFields — so it's only validated if the user fills it in.
    // (For "other foreign" companies, passport IS the identity field
    // above, so this block never applies to them.)

    // Insurance Number — required only when legalConfig says so
    // (UAE + other foreign; not required for India).
    if (isLegalFieldRequired("insurance_number")) {
      if (!formData.insuranceNumber || !formData.insuranceNumber.toString().trim()) {
        newErrors.insuranceNumber = "This field is required";
      }
    }

    // Visa Expiry Date (UAE / other foreign) — required per legalConfig.
    if (!isIndia && isLegalFieldRequired("visa_expiry_date")) {
      if (!formData.visaExpiryDate) {
        newErrors.visaExpiryDate = "This field is required";
      }
    }
    if (!isIndia && formData.visaExpiryDate && formData.visaExpiryDate <= now) {
      newErrors.visaExpiryDate = "Visa expiry must be in the future";
    }

    // Contract Expiry Date (India) — not in legalConfig.requiredFields,
    // so only validated (future date) if the user fills it in.
    if (isIndia && formData.contractExpiryDate && formData.contractExpiryDate <= now) {
      newErrors.contractExpiryDate = "Contract expiry must be in the future";
    }

    // Delegate exact identity-number format checks (Aadhaar digit count,
    // Emirates ID format, etc.) to the shared util so every form in the
    // app validates identity numbers identically.
    Object.assign(
      newErrors,
      validateLegalIdentity(companyCountry, {
        ...formData,
        [legalConfig.identityField]: formData[identityStateKey],
      })
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

         <FormStepper steps={["Basic Details", "Bank Details", "Documents"]} activeStep={0} />
       
        {/* =========================
            FORM SECTIONS
        ========================= */}
        <BasicDetailsSection formData={formData} errors={errors} handleChange={handleChange} />

        <JobDetailsSection formData={formData} errors={errors} handleChange={handleChange} />

        <LegalInfoSection
          companyCountry={companyCountry}
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
      </FormCard>
    </PageContainer>
  );
};

export default EmployeeForm;