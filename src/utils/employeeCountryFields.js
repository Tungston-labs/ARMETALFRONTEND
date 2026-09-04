export const isIndiaCompany = (country) => country === "IN";

export const isUaeCompany = (country) => country === "AE";

export const getLegalFieldConfig = (country) => {
  if (isIndiaCompany(country)) {
    return {
      identityField: "aadar_number",
      identityLabel: "Aadhaar Number",
      identityPlaceholder: "Enter Aadhaar Number",
      identityMaxLength: 12,
      requiredFields: ["aadar_number"],
    };
  }

  if (isUaeCompany(country)) {
    return {
      identityField: "iqama_number",
      identityLabel: "Emirates ID",
      identityPlaceholder: "Enter Emirates ID",
      identityMaxLength: 18,
      requiredFields: ["iqama_number", "visa_expiry_date", "insurance_number"],
    };
  }

  return {
    identityField: "passport_number",
    identityLabel: "Passport Number",
    identityPlaceholder: "Enter Passport Number",
    identityMaxLength: 20,
    requiredFields: ["passport_number", "visa_expiry_date", "insurance_number"],
  };
};

export const validateLegalIdentity = (country, values) => {
  const errors = {};
  const aadhaar = values.aadar_number?.trim();
  const emiratesId = values.iqama_number?.trim();

  if (isIndiaCompany(country) && aadhaar && !/^[0-9]{12}$/.test(aadhaar)) {
    errors.aadar_number = "Aadhaar number must be exactly 12 digits";
  }

  if (isUaeCompany(country) && emiratesId) {
    const digitsOnly = emiratesId.replace(/\D/g, "");

    if (!/^784[0-9]{12}$/.test(digitsOnly)) {
      errors.iqama_number = "Emirates ID must be 15 digits and start with 784";
    }
  }

  return errors;
};

export const getBankFieldConfig = (country) => {
  if (isIndiaCompany(country)) {
    return {
      accountLabel: "Account Number",
      accountPlaceholder: "Enter Account Number",
      bankCodeField: "ifscCode",
      bankCodeLabel: "IFSC Code",
      bankCodePlaceholder: "Enter IFSC Code",
      showUan: true,
      showIndianTax: true,
    };
  }

  if (isUaeCompany(country)) {
    return {
      accountLabel: "IBAN",
      accountPlaceholder: "Enter UAE IBAN",
      bankCodeField: "swiftCode",
      bankCodeLabel: "SWIFT / BIC Code",
      bankCodePlaceholder: "Enter SWIFT / BIC Code",
      showUan: false,
      showIndianTax: false,
    };
  }

  return {
    accountLabel: "IBAN / Account Number",
    accountPlaceholder: "Enter IBAN or Account Number",
    bankCodeField: "swiftCode",
    bankCodeLabel: "SWIFT / BIC Code",
    bankCodePlaceholder: "Enter SWIFT / BIC Code",
    showUan: false,
    showIndianTax: false,
  };
};

export const getBankSubmissionDefaults = (country) => {
  if (isIndiaCompany(country)) {
    return {};
  }

  return {
    pan_number: "N/A",
    tax_regime: "new",
    tds_deduction_amount: 0,
    declaration_80c: false,
  };
};
