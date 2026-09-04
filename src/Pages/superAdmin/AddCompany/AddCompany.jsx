import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

import {
  PageWrapper,
  MainCard,
  Section,
  SectionTitle,
  SectionDescription,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  SelectWrapper,
  ContactWrapper,
  CountryCodeSelect,
  PhoneInput,
  ServicesGrid,
  ServiceCard,
  ServiceIcon,
  ServiceContent,
  ServiceTitle,
  ServiceDescription,
  ToggleWrapper,
  Toggle,
  ToggleSlider,
  FeatureBox,
  FeatureHeader,
  FeatureTitle,
  SelectAllWrapper,
  SelectAllLabel,
  FeatureGrid,
  FeatureItem,
  Checkbox,
  SalarySection,
  SalaryGrid,
  SalaryInputWrapper,
  SalaryInput,
  TotalInput,
  LogoUploadWrapper,
  LogoUploadBox,
  LogoInput,
  LogoUploadIcon,
  LogoUploadTitle,
  LogoUploadText,
  LogoPreviewWrapper,
  LogoPreview,
  RemoveLogoButton,
  LogoUploadContent,
} from "./AddCompany.Styles";

import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import { HeaderButton } from "../../../Components/ReusableTable/ReusableHeader.styles";
import Loader from "../../../Components/Loader/Loader";
import { getCompanyById, addCompany, editCompany, clearSelectedCompany } from "../../../Redux/companySlice";
import { fetchSubscriptionPlans } from "../../../services/superAdminService";
import { COUNTRY_OPTIONS, getCountryByCode } from "../../../utils/countryData";

const AddCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isEdit = !!id;

  const selectedCompany = useSelector((state) => state.company.selectedCompany);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const fileInputRef = useRef(null);

  // =====================================================
  // OPEN / CLOSE STATES
  // =====================================================
  const [hrOpen, setHrOpen] = useState(true);
  const [financeOpen, setFinanceOpen] = useState(false);

  // =====================================================
  // FORM DATA
  // =====================================================
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    email: "",
    companyLocation: "",
    country: "",
    phoneCode: "UAE (+971)",
    phoneNumber: "",
    currency: "AED",
    latitude: "",
    longitude: "",
    logo: null,
    amountPerEmployee: "",
    initialPayment: "",
    plan: "",

    // Modules
    hrModule: true,
    financeModule: false,

    // Features
    hrFeatures: [
      "DASHBOARD",
      "DEPARTMENT",
      "EMPLOYEE",
      "DAILY TASK",
      "PAYROLL",
      "HOLIDAY",
      "REIMBURSEMENT",
      "PROJECT",
      "FINANCE",
    ],
    financeFeatures: [
      "DASHBOARD",
      "SALES",
      "PURCHASES",
      "PRODUCTS",
      "ACCOUNTING",
      "REPORTS",
    ],

    // Salary
    basic: "",
    houseAllowance: "",
    transport: "",
    special: "",

    // Working Hours
    workingHoursPerDay: "",
    halfDayHours: "",
  });

  // =====================================================
  // MODULE FEATURES LISTS
  // =====================================================
  const hrFeatures = [
    "DASHBOARD",
    "DEPARTMENT",
    "EMPLOYEE",
    "DAILY TASK",
    "PAYROLL",
    "HOLIDAY",
    "REIMBURSEMENT",
    "PROJECT",
    "FINANCE",
  ];

  const financeFeatures = [
    "DASHBOARD",
    "SALES",
    "PURCHASES",
    "PRODUCTS",
    "ACCOUNTING",
    "REPORTS",
  ];

  // =====================================================
  // LOAD PLANS
  // =====================================================
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await fetchSubscriptionPlans();
        const planList = Array.isArray(response) ? response : response?.results || [];
        setPlans(planList);
      } catch (error) {
        console.error("Failed to load subscription plans:", error);
      } finally {
        setLoadingPlans(false);
      }
    };
    loadPlans();
  }, []);

  // =====================================================
  // EDIT MODE PREFILL
  // =====================================================
  useEffect(() => {
    if (id) {
      setLoadingCompany(true);
      dispatch(getCompanyById(id))
        .unwrap()
        .finally(() => setLoadingCompany(false));
    }
    return () => {
      dispatch(clearSelectedCompany());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (isEdit && selectedCompany) {
      const phone = selectedCompany.contact_number || "";
      const countryCodes = [
        "+971", "+966", "+965", "+973", "+968", "+974", "+91", "+880", "+92"
      ];
      let phoneCode = "UAE (+971)";
      let phoneNumber = phone;

      const matchedCode = countryCodes.find((code) => phone.startsWith(code));
      if (matchedCode) {
        const phoneCodeLabels = {
          "+971": "UAE (+971)",
          "+91": "India (+91)",
          "+974": "Qatar (+974)",
          "+966": "Saudi (+966)"
        };
        phoneCode = phoneCodeLabels[matchedCode] || `${matchedCode}`;
        phoneNumber = phone.slice(matchedCode.length);
      }

      const activeModules = selectedCompany.modules || {};

      const hrFeaturesList = [];
      const financeFeaturesList = [];

      Object.keys(activeModules).forEach(key => {
        if (activeModules[key]) {
          const upperKey = key.toUpperCase().replace("_", " ");
          if (["dashboard", "employee", "department", "daily_task", "payroll", "holiday", "reimbursement", "project", "finance"].includes(key)) {
            hrFeaturesList.push(upperKey);
          } else if (["sales", "purchases", "products", "accounting", "reports"].includes(key)) {
            financeFeaturesList.push(upperKey);
          }
        }
      });

      const isHrActive = hrFeaturesList.length > 0;
      const isFinanceActive = financeFeaturesList.length > 0;

      setHrOpen(isHrActive);
      setFinanceOpen(isFinanceActive);

      setFormData({
        companyName: selectedCompany.name ?? "",
        plan: selectedCompany.plan ?? "",
        address: selectedCompany.address ?? "",
        email: selectedCompany.email ?? "",
        companyLocation: selectedCompany.location ?? "",
        country: selectedCompany.country ?? "",
        phoneCode,
        phoneNumber,
        currency: selectedCompany.currency ?? "AED",
        hrModule: isHrActive,
        financeModule: isFinanceActive,
        hrFeatures: hrFeaturesList,
        financeFeatures: financeFeaturesList,
        latitude: selectedCompany.latitude ?? "",
        longitude: selectedCompany.longitude ?? "",
        logo: null,
        amountPerEmployee: selectedCompany.amount_per_employee ?? "",
        initialPayment: selectedCompany.initial_payment ?? "",
        basic: selectedCompany.basic_salary_percent ?? "",
        houseAllowance: selectedCompany.house_allowance_percent ?? "",
        transport: selectedCompany.transport_allowance_percent ?? "",
        special: selectedCompany.special_allowance_percent ?? "",
        workingHoursPerDay: selectedCompany.working_hours_per_day ?? "",
        halfDayHours: selectedCompany.half_day_hours ?? "",
      });

      setLogoPreview(selectedCompany.logo ?? null);
    }
  }, [isEdit, selectedCompany]);

  // =====================================================
  // INPUT HANDLERS
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "plan" && value) {
        return {
          ...prev,
          plan: value,
          amountPerEmployee: "",
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleCountryChange = (e) => {
    const selectedVal = e.target.value;
    const selected = getCountryByCode(selectedVal);

    setFormData((prev) => {
      const next = { ...prev, country: selectedVal };
      if (selected) {
        next.currency = selected.currencyCode;
        const phoneCodeLabels = {
          "+971": "UAE (+971)",
          "+91": "India (+91)",
          "+974": "Qatar (+974)",
          "+966": "Saudi (+966)"
        };
        next.phoneCode = phoneCodeLabels[selected.dialCode] || `+${selected.dialCode}`;
      }
      return next;
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/svg+xml", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      Swal.fire("Invalid file", "Only PNG, SVG, or JPEG allowed", "error");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire("File too large", "Logo must be under 2MB", "error");
      return;
    }

    setFormData((prev) => ({ ...prev, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
  };
const handleRemoveLogo = () => {
  setFormData((prev) => ({
    ...prev,
    logo: null,
  }));

  setLogoPreview(null);

  // Reset the file input so the same file can be selected again
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }

  // Clear logo validation error
  setFormErrors((prev) => ({
    ...prev,
    logo: undefined,
  }));
};
  const handleHrToggle = () => {
    setHrOpen((prev) => !prev);
    setFormData((prev) => ({
      ...prev,
      hrModule: !prev.hrModule,
    }));
  };

  const handleFinanceToggle = () => {
    setFinanceOpen((prev) => !prev);
    setFormData((prev) => ({
      ...prev,
      financeModule: !prev.financeModule,
    }));
  };

  const handleFeatureChange = (type, feature) => {
    setFormData((prev) => {
      const field = type === "hr" ? "hrFeatures" : "financeFeatures";
      const currentFeatures = prev[field];
      const updatedFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter((item) => item !== feature)
        : [...currentFeatures, feature];

      return {
        ...prev,
        [field]: updatedFeatures,
      };
    });
  };

  const handleSelectAll = (type, features) => {
    setFormData((prev) => {
      const field = type === "hr" ? "hrFeatures" : "financeFeatures";
      return {
        ...prev,
        [field]: prev[field].length === features.length ? [] : [...features],
      };
    });
  };

  const calculateTotal = () => {
    const basic = Number(formData.basic) || 0;
    const houseAllowance = Number(formData.houseAllowance) || 0;
    const transport = Number(formData.transport) || 0;
    const special = Number(formData.special) || 0;

    return basic + houseAllowance + transport + special;
  };

  // =====================================================
  // VALIDATION & SUBMIT
  // =====================================================
  const validate = () => {
    const errs = {};

    if (!formData.companyName?.trim()) {
      errs.companyName = "Company name is required";
    }

    if (!formData.address?.trim()) {
      errs.address = "Address is required";
    }

    if (!formData.email?.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Enter a valid email address";
    }

    if (!formData.companyLocation?.trim()) {
      errs.companyLocation = "Location is required";
    }

    if (!formData.logo && !logoPreview) {
      errs.logo = "Company logo is required";
    }

    if (!formData.phoneNumber?.trim()) {
      errs.phoneNumber = "Contact number is required";
    } else {
      const phone = formData.phoneNumber.trim();
      const code = formData.phoneCode;
      if (code.includes("+91")) {
        if (!/^[0-9]{10}$/.test(phone)) {
          errs.phoneNumber = "Enter a valid 10-digit phone number";
        }
      } else {
        if (!/^[0-9]{7,15}$/.test(phone)) {
          errs.phoneNumber = "Enter a valid phone number (7–15 digits)";
        }
      }
    }

    if (!formData.country) {
      errs.country = "Please select a country";
    }

    if (!formData.currency) {
      errs.currency = "Please select a currency";
    }

    if (formData.latitude === "" || formData.latitude === null || formData.latitude === undefined) {
      errs.latitude = "Latitude is required";
    } else {
      const lat = Number(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errs.latitude = "Latitude must be between -90 and 90";
      }
    }

    if (formData.longitude === "" || formData.longitude === null || formData.longitude === undefined) {
      errs.longitude = "Longitude is required";
    } else {
      const lng = Number(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errs.longitude = "Longitude must be between -180 and 180";
      }
    }

    if (!formData.hrModule && !formData.financeModule) {
      errs.modules = "Select at least one module (HR or Finance)";
    }

    if (formData.hrModule && formData.hrFeatures.length === 0) {
      errs.modules = "Select at least one feature for the HR Module";
    }

    if (formData.financeModule && formData.financeFeatures.length === 0) {
      errs.modules = "Select at least one feature for the Finance Module";
    }

    if (formData.plan) {
      // Plan selected: amount per employee is optional
    } else {
      if (
        formData.amountPerEmployee === "" ||
        formData.amountPerEmployee === null ||
        formData.amountPerEmployee === undefined
      ) {
        errs.amountPerEmployee = "Amount per employee is required when no plan is selected";
      } else if (
        isNaN(Number(formData.amountPerEmployee)) ||
        Number(formData.amountPerEmployee) <= 0
      ) {
        errs.amountPerEmployee = "Enter a valid amount greater than 0";
      }
    }

    const salaryFields = [
      { key: "basic", label: "Basic" },
      { key: "houseAllowance", label: "House Allowance" },
      { key: "transport", label: "Transport" },
      { key: "special", label: "Special" },
    ];

    salaryFields.forEach(({ key, label }) => {
      const val = formData[key];
      if (val === "" || val === null || val === undefined) {
        errs[key] = `${label} % is required`;
      } else if (isNaN(Number(val)) || Number(val) < 0 || Number(val) > 100) {
        errs[key] = `${label} % must be between 0 and 100`;
      }
    });

    const total = calculateTotal();
    const noSalaryFieldErrors = !errs.basic && !errs.houseAllowance && !errs.transport && !errs.special;
    if (noSalaryFieldErrors && total !== 100) {
      errs.salary = `Percentages must total 100% (currently ${total}%)`;
    }

    if (formData.workingHoursPerDay === "" || formData.workingHoursPerDay === null || formData.workingHoursPerDay === undefined) {
      errs.workingHoursPerDay = "Working hours per day is required";
    } else {
      const wh = Number(formData.workingHoursPerDay);
      if (isNaN(wh) || wh <= 0 || wh > 24) {
        errs.workingHoursPerDay = "Working hours must be between 1 and 24";
      }
    }

    if (formData.halfDayHours === "" || formData.halfDayHours === null || formData.halfDayHours === undefined) {
      errs.halfDayHours = "Half day hours is required";
    } else {
      const hd = Number(formData.halfDayHours);
      const wh = Number(formData.workingHoursPerDay);
      if (isNaN(hd) || hd <= 0) {
        errs.halfDayHours = "Half day hours must be greater than 0";
      } else if (!isNaN(wh) && wh > 0 && hd >= wh) {
        errs.halfDayHours = "Half day hours must be less than working hours per day";
      }
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const modulesPayload = {};
      if (formData.hrModule) {
        formData.hrFeatures.forEach(feature => {
          const key = feature.toLowerCase().replace(" ", "_");
          modulesPayload[key] = true;
        });
      }
      if (formData.financeModule) {
        formData.financeFeatures.forEach(feature => {
          const key = feature.toLowerCase().replace(" ", "_");
          modulesPayload[key] = true;
        });
      }

      const formPayload = new FormData();

      formPayload.append("name", formData.companyName);
      formPayload.append("location", formData.companyLocation);
      formPayload.append("address", formData.address);
      formPayload.append("country", formData.country);
      formPayload.append("currency", formData.currency);
      formPayload.append("email", formData.email);
      formPayload.append("latitude", formData.latitude);
      formPayload.append("longitude", formData.longitude);
      formPayload.append("amount_per_employee", formData.amountPerEmployee || "0");
      formPayload.append("initial_payment", formData.initialPayment || "0");
      formPayload.append("basic_salary_percent", formData.basic);
      formPayload.append("house_allowance_percent", formData.houseAllowance);
      formPayload.append("transport_allowance_percent", formData.transport);
      formPayload.append("special_allowance_percent", formData.special);
      formPayload.append("working_hours_per_day", formData.workingHoursPerDay);
      formPayload.append("half_day_hours", formData.halfDayHours);
      formPayload.append("plan", formData.plan || "");

      formPayload.append("modules", JSON.stringify(modulesPayload));

      const phoneDialCodeMap = {
        "UAE (+971)": "+971",
        "India (+91)": "+91",
        "Qatar (+974)": "+974",
        "Saudi (+966)": "+966"
      };
      const dialCode = phoneDialCodeMap[formData.phoneCode] || "+971";
      formPayload.append("contact_number", `${dialCode}${formData.phoneNumber}`);

      if (formData.logo) {
        formPayload.append("logo", formData.logo);
      }

      if (isEdit) {
        await dispatch(editCompany({ id: selectedCompany.id, data: formPayload })).unwrap();
        Swal.fire("Updated!", "Company updated successfully.", "success");
      } else {
        await dispatch(addCompany(formPayload)).unwrap();
        Swal.fire("Created!", "Company created successfully. Credentials have been sent to their email.", "success");
      }

      navigate("/company");
    } catch (err) {
      console.log("ERROR:", err);
      const data = err?.response?.data || err;
      if (data?.email) {
        setFormErrors((prev) => ({
          ...prev,
          email: "Email already exists",
        }));
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/company");
  };

  if (isEdit && !selectedCompany) {
    return <Loader />;
  }

  return (
    <PageWrapper>
      {/* =================================================
          HEADER
      ================================================= */}
      <ReusableHeader
        title={isEdit ? "Edit Company" : "Add Company"}
        breadcrumbs={["Companies"]}
        showBack
      >
        <HeaderButton
          $variant="danger"
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          CANCEL
        </HeaderButton>

        <HeaderButton
          $variant="success"
          type="submit"
          form="add-company-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ClipLoader size={12} color="#fff" />
              SAVING...
            </div>
          ) : (
            "SAVE COMPANY"
          )}
        </HeaderButton>
      </ReusableHeader>

      {/* =================================================
          MAIN CARD
      ================================================= */}
      <MainCard>
        <form id="add-company-form" onSubmit={handleSubmit}>
          {/* =================================================
              COMPANY DETAILS
          ================================================= */}
          <Section>
            <SectionTitle>Company Details</SectionTitle>
            <FormGrid>
              {/* Company Name */}
              <FormGroup>
                <Label>Company Name</Label>
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  autoComplete="off"
                />
                {formErrors.companyName && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.companyName}
                  </span>
                )}
              </FormGroup>

              {/* Company Location */}
              <FormGroup>
                <Label>Company Location</Label>
                <Input
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  placeholder="Enter location"
                  autoComplete="off"
                />
                {formErrors.companyLocation && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.companyLocation}
                  </span>
                )}
              </FormGroup>

              {/* Address */}
              <FormGroup>
                <Label>Address</Label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter company address"
                  autoComplete="off"
                />
                {formErrors.address && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.address}
                  </span>
                )}
              </FormGroup>

              {/* Country */}
              <FormGroup>
                <Label>Country</Label>
                <SelectWrapper>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleCountryChange}
                  >
                    <option value="">Select Country</option>
                    {COUNTRY_OPTIONS.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </SelectWrapper>
                {formErrors.country && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.country}
                  </span>
                )}
              </FormGroup>

              {/* Currency */}
              <FormGroup>
                <Label>Currency</Label>
                <SelectWrapper>
                  <Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="">Select Currency</option>
                    {COUNTRY_OPTIONS.map((item) => (
                      <option key={`${item.code}-${item.currencyCode}`} value={item.currencyCode}>
                        {item.currencyCode} ({item.currencySymbol})
                      </option>
                    ))}
                  </Select>
                </SelectWrapper>
                {formErrors.currency && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.currency}
                  </span>
                )}
              </FormGroup>

              {/* Contact Number */}
              <FormGroup>
                <Label>Contact Number</Label>
                <ContactWrapper>
                  <CountryCodeSelect
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleChange}
                  >
                    <option value="UAE (+971)">UAE (+971)</option>
                    <option value="India (+91)">India (+91)</option>
                    <option value="Qatar (+974)">Qatar (+974)</option>
                    <option value="Saudi (+966)">Saudi (+966)</option>
                  </CountryCodeSelect>
                  <PhoneInput
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone number"
                    autoComplete="off"
                  />
                </ContactWrapper>
                {formErrors.phoneNumber && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.phoneNumber}
                  </span>
                )}
              </FormGroup>
              <FormGroup>
  <Label>Registration Date</Label>

  <Input
    type="date"
    name="registrationDate"
    value={formData.registrationDate}
    onChange={handleChange}
  />

  {formErrors.registrationDate && (
    <span
      style={{
        color: "#ef3333",
        fontSize: "11px",
        marginTop: "4px",
        display: "block",
      }}
    >
      {formErrors.registrationDate}
    </span>
  )}
</FormGroup>

              {/* Email */}
              <FormGroup>
                <Label>Email ID</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  autoComplete="off"
                />
                {formErrors.email && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.email}
                  </span>
                )}
              </FormGroup>

              {/* Latitude */}
              <FormGroup>
                <Label>Latitude</Label>
                <Input
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Enter Latitude"
                  autoComplete="off"
                />
                {formErrors.latitude && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.latitude}
                  </span>
                )}
              </FormGroup>

              {/* Longitude */}
              <FormGroup>
                <Label>Longitude</Label>
                <Input
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Enter Longitude"
                  autoComplete="off"
                />
                {formErrors.longitude && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.longitude}
                  </span>
                )}
              </FormGroup>

              {/* Logo */}
           <FormGroup>
                <Label>
                  Company Logo
                </Label>

                <LogoUploadWrapper>
                  {!logoPreview ? (
                    <LogoUploadBox
                      htmlFor="company-logo"
                      hasError={
                        !!formErrors.logo
                      }
                    >
                      <LogoInput
                        id="company-logo"
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg"
                        ref={fileInputRef}
                        onChange={
                          handleLogoChange
                        }
                      />

                      <LogoUploadContent>
                        <LogoUploadIcon>
                          ↑
                        </LogoUploadIcon>

                        <LogoUploadTitle>
                          Upload Company Logo
                        </LogoUploadTitle>

                        <LogoUploadText>
                          Click to browse or
                          choose a logo file
                        </LogoUploadText>

                        <LogoUploadText>
                          PNG, JPG, JPEG or SVG
                          · Max 2MB
                        </LogoUploadText>
                      </LogoUploadContent>
                    </LogoUploadBox>
                  ) : (
                    <LogoPreviewWrapper>
                      <LogoPreview
                        src={logoPreview}
                        alt="Company Logo Preview"
                      />

                      <div>
                        <LogoUploadTitle>
                          Company Logo
                        </LogoUploadTitle>

                        <LogoUploadText>
                          Logo uploaded
                          successfully
                        </LogoUploadText>
                      </div>

                      <RemoveLogoButton
                        type="button"
                        onClick={
                          handleRemoveLogo
                        }
                      >
                        Remove
                      </RemoveLogoButton>
                    </LogoPreviewWrapper>
                  )}
                </LogoUploadWrapper>

                {formErrors.logo && (
                  <span
                    style={{
                      color: "#ef3333",
                      fontSize: "11px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {formErrors.logo}
                  </span>
                )}
              </FormGroup>


              {/* Subscription Plan */}
              <FormGroup className="wide-field">
                <Label>Subscription Plan</Label>
                <SelectWrapper>
                  <Select
                    name="plan"
                    value={String(formData.plan || "")}
                    onChange={handleChange}
                  >
                    <option value="">No Plan - Use Amount Per Employee</option>
                    {loadingPlans ? (
                      <option disabled>Loading plans...</option>
                    ) : (
                      plans.map((p) => (
                        <option key={p.id} value={String(p.id)}>
                          {p.name} - ₹{Number(p.base_price || 0).toFixed(2)}
                        </option>
                      ))
                    )}
                  </Select>
                </SelectWrapper>
                {formErrors.plan && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.plan}
                  </span>
                )}
              </FormGroup>

              {/* Amount Per Employee */}
              <FormGroup className="wide-field">
                <Label>Amount per Employee</Label>
                <Input
                  type="number"
                  name="amountPerEmployee"
                  value={formData.amountPerEmployee}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={!!formData.plan}
                  placeholder={formData.plan ? "Determined by Subscription Plan" : "Enter amount"}
                />
                {formErrors.amountPerEmployee && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.amountPerEmployee}
                  </span>
                )}
              </FormGroup>

              {/* Initial Payment */}
              <FormGroup className="wide-field">
                <Label>Installation Amount</Label>
                <Input
                  type="number"
                  name="initialPayment"
                  value={formData.initialPayment}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter initial advance"
                />
              </FormGroup>
            </FormGrid>
          </Section>

          {/* =================================================
              SERVICES
          ================================================= */}
          <Section>
            <SectionTitle>Select Services</SectionTitle>
            <SectionDescription>
              Choose the areas you want to enable for this company.
            </SectionDescription>
            <ServicesGrid>
              {/* HR MODULE */}
              <ServiceCard active={hrOpen}>
                <ServiceIcon hr>HR</ServiceIcon>
                <ServiceContent>
                  <ServiceTitle>HR Module</ServiceTitle>
                  <ServiceDescription>
                    Employee, department, attendance, leave, payroll and operations.
                  </ServiceDescription>
                </ServiceContent>
                <ToggleWrapper onClick={handleHrToggle}>
                  <Toggle active={hrOpen}>
                    <ToggleSlider active={hrOpen} />
                  </Toggle>
                </ToggleWrapper>
              </ServiceCard>

              {/* FINANCE MODULE */}
              <ServiceCard active={financeOpen}>
                <ServiceIcon finance>FI</ServiceIcon>
                <ServiceContent>
                  <ServiceTitle>Finance Module</ServiceTitle>
                  <ServiceDescription>
                    Sales, Purchase, Payroll, billing, expenses and reporting.
                  </ServiceDescription>
                </ServiceContent>
                <ToggleWrapper onClick={handleFinanceToggle}>
                  <Toggle active={financeOpen}>
                    <ToggleSlider active={financeOpen} />
                  </Toggle>
                </ToggleWrapper>
              </ServiceCard>
            </ServicesGrid>

            {formErrors.modules && (
              <span style={{ color: "#ef3333", fontSize: "12px", marginTop: "4px", marginBottom: "10px", display: "block", fontWeight: "500" }}>
                {formErrors.modules}
              </span>
            )}

            {/* HR FEATURES */}
            {hrOpen && (
              <FeatureBox>
                <FeatureHeader>
                  <FeatureTitle>Select HR Management Features</FeatureTitle>
                  <SelectAllWrapper>
                    <SelectAllLabel>Select All</SelectAllLabel>
                    <ToggleWrapper onClick={() => handleSelectAll("hr", hrFeatures)}>
                      <Toggle active={formData.hrFeatures.length === hrFeatures.length}>
                        <ToggleSlider active={formData.hrFeatures.length === hrFeatures.length} />
                      </Toggle>
                    </ToggleWrapper>
                  </SelectAllWrapper>
                </FeatureHeader>
                <FeatureGrid>
                  {hrFeatures.map((feature) => (
                    <FeatureItem key={feature}>
                      <Checkbox
                        type="checkbox"
                        checked={formData.hrFeatures.includes(feature)}
                        onChange={() => handleFeatureChange("hr", feature)}
                      />
                      <span>{feature}</span>
                    </FeatureItem>
                  ))}
                </FeatureGrid>
              </FeatureBox>
            )}

            {/* FINANCE FEATURES */}
            {financeOpen && (
              <FeatureBox>
                <FeatureHeader>
                  <FeatureTitle>Select Finance Management Features</FeatureTitle>
                  <SelectAllWrapper>
                    <SelectAllLabel>Select All</SelectAllLabel>
                    <ToggleWrapper onClick={() => handleSelectAll("finance", financeFeatures)}>
                      <Toggle active={formData.financeFeatures.length === financeFeatures.length}>
                        <ToggleSlider active={formData.financeFeatures.length === financeFeatures.length} />
                      </Toggle>
                    </ToggleWrapper>
                  </SelectAllWrapper>
                </FeatureHeader>
                <FeatureGrid>
                  {financeFeatures.map((feature) => (
                    <FeatureItem key={feature}>
                      <Checkbox
                        type="checkbox"
                        checked={formData.financeFeatures.includes(feature)}
                        onChange={() => handleFeatureChange("finance", feature)}
                      />
                      <span>{feature}</span>
                    </FeatureItem>
                  ))}
                </FeatureGrid>
              </FeatureBox>
            )}
          </Section>

          {/* =================================================
              SALARY STRUCTURE
          ================================================= */}
          <SalarySection>
            <SectionTitle>Salary Structure (%)</SectionTitle>
            <SalaryGrid>
              {/* Basic */}
              <SalaryInputWrapper>
                <Label>Basic (%)</Label>
                <SalaryInput
                  type="number"
                  name="basic"
                  value={formData.basic}
                  onChange={handleChange}
                  placeholder="Basic"
                  min="0"
                />
                {formErrors.basic && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.basic}
                  </span>
                )}
              </SalaryInputWrapper>

              {/* House Allowance */}
              <SalaryInputWrapper>
                <Label>House Allowance (%)</Label>
                <SalaryInput
                  type="number"
                  name="houseAllowance"
                  value={formData.houseAllowance}
                  onChange={handleChange}
                  placeholder="HRA"
                  min="0"
                />
                {formErrors.houseAllowance && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.houseAllowance}
                  </span>
                )}
              </SalaryInputWrapper>

              {/* Transport */}
              <SalaryInputWrapper>
                <Label>Transport (%)</Label>
                <SalaryInput
                  type="number"
                  name="transport"
                  value={formData.transport}
                  onChange={handleChange}
                  placeholder="Transport"
                  min="0"
                />
                {formErrors.transport && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.transport}
                  </span>
                )}
              </SalaryInputWrapper>

              {/* Special */}
              <SalaryInputWrapper>
                <Label>Special (%)</Label>
                <SalaryInput
                  type="number"
                  name="special"
                  value={formData.special}
                  onChange={handleChange}
                  placeholder="Special"
                  min="0"
                />
                {formErrors.special && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.special}
                  </span>
                )}
              </SalaryInputWrapper>

              {/* Total */}
              <SalaryInputWrapper>
                <Label>Total (%)</Label>
                <TotalInput
                  type="text"
                  value={`${calculateTotal()} %`}
                  readOnly
                  style={{
                    color: calculateTotal() === 100 ? "#4CAF50" : "#ef3333",
                    borderColor: calculateTotal() === 100 ? "#4CAF50" : "#ef3333"
                  }}
                />
                {formErrors.salary && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.salary}
                  </span>
                )}
              </SalaryInputWrapper>

              {/* Working Hours */}
              <SalaryInputWrapper>
                <Label>Working Hours Per Day</Label>
                <SalaryInput
                  type="number"
                  name="workingHoursPerDay"
                  value={formData.workingHoursPerDay}
                  onChange={handleChange}
                  placeholder="e.g. 8"
                  min="0"
                  max="24"
                  step="0.5"
                />
                {formErrors.workingHoursPerDay && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.workingHoursPerDay}
                  </span>
                )}
              </SalaryInputWrapper>

              {/* Half Day Hours */}
              <SalaryInputWrapper>
                <Label>Half Day Hours</Label>
                <SalaryInput
                  type="number"
                  name="halfDayHours"
                  value={formData.halfDayHours}
                  onChange={handleChange}
                  placeholder="e.g. 4"
                  min="0"
                  max="24"
                  step="0.5"
                />
                {formErrors.halfDayHours && (
                  <span style={{ color: "#ef3333", fontSize: "11px", marginTop: "4px", display: "block" }}>
                    {formErrors.halfDayHours}
                  </span>
                )}
              </SalaryInputWrapper>
            </SalaryGrid>
          </SalarySection>
        </form>
      </MainCard>
    </PageWrapper>
  );
};

export default AddCompany;