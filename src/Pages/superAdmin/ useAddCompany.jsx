import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCompany, editCompany } from "../../Redux/superAdminSlice";
import Swal from "sweetalert2";

export const useAddCompany = ({
  isEdit,
  selectedCompany,
  onClose,
  allModules,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    plan: "",
    address: "",
    email: "",
    location: "",
    country: "",
    country_code: "+971",
    contact_number: "",
    currency: "AED", // matches default country_code (+971 = UAE) so it's never left blank
    modules: [],
    latitude: "",
    longitude: "",
    logo: null,
    amount_per_employee: "",
    initial_payment: "",
    basic_salary_percent: "",
    house_allowance_percent: "",
    transport_allowance_percent: "",
    special_allowance_percent: "",
    working_hours_per_day: "",
    half_day_hours: "",
  });

  /* =========================
     EDIT MODE PREFILL
  ========================= */

  useEffect(() => {
    if (isEdit && selectedCompany) {
      const modulesChecked =
        allModules?.filter((mod) => selectedCompany.modules?.[mod]) || [];

      const phone = selectedCompany.contact_number || "";

      const countryCodes = [
        "+971",
        "+966",
        "+965",
        "+973",
        "+968",
        "+974",
        "+91",
        "+880",
        "+92",
      ];

      let countryCode = "+971";
      let contactNumber = phone;

      const matchedCode = countryCodes.find((code) =>
        phone.startsWith(code)
      );

      if (matchedCode) {
        countryCode = matchedCode;
        contactNumber = phone.slice(matchedCode.length);
      }

      console.log(selectedCompany);
      console.log(selectedCompany);
      setFormData({
        name: selectedCompany.name ?? "",
        plan: selectedCompany.plan ?? "",
        address: selectedCompany.address ?? "",
        email: selectedCompany.email ?? "",
        location: selectedCompany.location ?? "",
        country: selectedCompany.country ?? "",
        country_code: countryCode,
        contact_number: contactNumber,
        currency: selectedCompany.currency ?? "AED",
        modules: modulesChecked,
        logo: null,
        latitude: selectedCompany.latitude ?? "",
        longitude: selectedCompany.longitude ?? "",
        amount_per_employee: selectedCompany.amount_per_employee ?? "",
        initial_payment: selectedCompany.initial_payment ?? "",
        basic_salary_percent: selectedCompany.basic_salary_percent ?? "",
        house_allowance_percent:
          selectedCompany.house_allowance_percent ?? "",
        transport_allowance_percent:
          selectedCompany.transport_allowance_percent ?? "",
        special_allowance_percent:
          selectedCompany.special_allowance_percent ?? "",
        working_hours_per_day:
          selectedCompany.working_hours_per_day ?? "",
        half_day_hours: selectedCompany.half_day_hours ?? "",
      });

      setLogoPreview(selectedCompany.logo ?? null);
    }
  }, [isEdit, selectedCompany]);

  /* =========================
     HANDLERS
  ========================= */

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    if (name === "plan" && value) {
      return {
        ...prev,
        plan: value,
        amount_per_employee: "",
      };
    }

    if (name === "plan" && !value) {
      return {
        ...prev,
        plan: "",
      };
    }

    return {
      ...prev,
      [name]: value,
    };
  });
};

  const handleModuleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(value)
        ? prev.modules.filter((m) => m !== value)
        : [...prev.modules, value],
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      Swal.fire("Invalid file", "Only PNG or SVG allowed", "error");
      return;
    }

    // ✅ Add this size check
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      Swal.fire("File too large", "Logo must be under 2MB", "error");
      return;
    }

    setFormData((prev) => ({ ...prev, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logo: null }));
    setLogoPreview(null);
  };

  /* =========================
     SALARY CALCULATION
  ========================= */

  const totalPercent =
    Number(formData.basic_salary_percent || 0) +
    Number(formData.house_allowance_percent || 0) +
    Number(formData.transport_allowance_percent || 0) +
    Number(formData.special_allowance_percent || 0);

  /* =========================
     LIVE VALIDATION (EXCEED 100)
  ========================= */

  useEffect(() => {
    if (totalPercent > 100) {
      setFormErrors((prev) => ({
        ...prev,
        salary: "Total percentage cannot exceed 100%",
      }));
    } else {
      setFormErrors((prev) => ({
        ...prev,
        salary: "",
      }));
    }
  }, [totalPercent]);

  /* =========================
     FINAL VALIDATION ON SUBMIT
  ========================= */

  const validate = () => {
    const errs = {};

    // ── Company Name ──────────────────────────────────────────
    if (!formData.name?.trim()) {
      errs.name = "Company name is required";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Company name must be at least 2 characters";
    }
// ── Subscription Plan / Amount per Employee ───────────────
if (formData.plan) {
  // Plan selected:
  // amount_per_employee is NOT required and should NOT be validated.
  // This also allows existing companies with amount_per_employee = "0.00".
} else {
  // No plan selected:
  // amount_per_employee is required.
  if (
    formData.amount_per_employee === "" ||
    formData.amount_per_employee === null ||
    formData.amount_per_employee === undefined
  ) {
    errs.amount_per_employee =
      "Amount per employee is required when no plan is selected";
  } else if (
    isNaN(Number(formData.amount_per_employee)) ||
    Number(formData.amount_per_employee) <= 0
  ) {
    errs.amount_per_employee =
      "Enter a valid amount greater than 0";
  }
}

    // ── Address ───────────────────────────────────────────────
    if (!formData.address?.trim()) {
      errs.address = "Address is required";
    }

    // ── Email ─────────────────────────────────────────────────
    if (!formData.email?.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Enter a valid email address";
    }

    // ── Location ──────────────────────────────────────────────
    if (!formData.location?.trim()) {
      errs.location = "Location is required";
    }

 



    // ── Logo (now required) ───────────────────────────────────
    if (!formData.logo && !logoPreview) {
      errs.logo = "Company logo is required";
    }

    // ── Contact Number ────────────────────────────────────────
    if (!formData.contact_number?.trim()) {
      errs.contact_number = "Contact number is required";
    } else {
      const phone = formData.contact_number.trim();
      if (formData.country_code === "+91") {
        if (!/^[0-9]{10}$/.test(phone)) {
          errs.contact_number = "Enter a valid 10-digit phone number";
        }
      } else {
        if (!/^[0-9]{7,15}$/.test(phone)) {
          errs.contact_number = "Enter a valid phone number (7–15 digits)";
        }
      }
    }

    // ── Country ───────────────────────────────────────────────
    if (!formData.country) {
      errs.country = "Please select a country";
    }

    // ── Currency ──────────────────────────────────────────────
    if (!formData.currency) {
      errs.currency = "Please select a currency";
    }

    // ── Latitude (now required) ───────────────────────────────
    if (formData.latitude === "" || formData.latitude === null || formData.latitude === undefined) {
      errs.latitude = "Latitude is required";
    } else {
      const lat = Number(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errs.latitude = "Latitude must be between -90 and 90";
      }
    }

    // ── Longitude (now required) ──────────────────────────────
    if (formData.longitude === "" || formData.longitude === null || formData.longitude === undefined) {
      errs.longitude = "Longitude is required";
    } else {
      const lng = Number(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errs.longitude = "Longitude must be between -180 and 180";
      }
    }

    // ── Modules ───────────────────────────────────────────────
    if (!formData.modules || formData.modules.length === 0) {
      errs.modules = "Select at least one module";
    }

    // ── Salary Structure ──────────────────────────────────────
    const salaryFields = [
      { key: "basic_salary_percent", label: "Basic" },
      { key: "house_allowance_percent", label: "House Allowance" },
      { key: "transport_allowance_percent", label: "Transport" },
      { key: "special_allowance_percent", label: "Special" },
    ];

    salaryFields.forEach(({ key, label }) => {
      const val = formData[key];
      if (val === "" || val === null || val === undefined) {
        errs[key] = `${label} % is required`;
      } else if (isNaN(Number(val)) || Number(val) < 0 || Number(val) > 100) {
        errs[key] = `${label} % must be between 0 and 100`;
      }
    });

    const noSalaryFieldErrors = !errs.basic_salary_percent &&
      !errs.house_allowance_percent &&
      !errs.transport_allowance_percent &&
      !errs.special_allowance_percent;

    if (noSalaryFieldErrors && totalPercent !== 100) {
      errs.salary = `Percentages must total 100% (currently ${totalPercent}%)`;
    }

    // ── Working Hours ─────────────────────────────────────────
    if (formData.working_hours_per_day === "" || formData.working_hours_per_day === null || formData.working_hours_per_day === undefined) {
      errs.working_hours_per_day = "Working hours per day is required";
    } else {
      const wh = Number(formData.working_hours_per_day);
      if (isNaN(wh) || wh <= 0 || wh > 24) {
        errs.working_hours_per_day = "Working hours must be between 1 and 24";
      }
    }

    // ── Half Day Hours ────────────────────────────────────────
    if (formData.half_day_hours === "" || formData.half_day_hours === null || formData.half_day_hours === undefined) {
      errs.half_day_hours = "Half day hours is required";
    } else {
      const hd = Number(formData.half_day_hours);
      const wh = Number(formData.working_hours_per_day);
      if (isNaN(hd) || hd <= 0) {
        errs.half_day_hours = "Half day hours must be greater than 0";
      } else if (!isNaN(wh) && wh > 0 && hd >= wh) {
        errs.half_day_hours = "Half day hours must be less than working hours per day";
      }
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const formattedModules = {};
      formData.modules.forEach((m) => (formattedModules[m] = true));

      const formPayload = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "modules" || key === "contact_number") return;
        if (key === "logo" && !formData.logo) return;

        if (formData[key] !== "" && formData[key] !== null) {
          formPayload.append(key, formData[key]);
        }
      });

      formPayload.append("modules", JSON.stringify(formattedModules));

      formPayload.append(
        "contact_number",
        `${formData.country_code}${formData.contact_number}`
      );

      if (isEdit) {
        await dispatch(
          editCompany({ id: selectedCompany.id, data: formPayload })
        ).unwrap();
        Swal.fire("Updated!", "Company updated successfully.", "success");
      } else {
        await dispatch(addCompany(formPayload)).unwrap();
        Swal.fire("Created!", "Company created successfully.", "success");
      }

      onClose?.();
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

  return {
    formData,
    formErrors,
    fileInputRef,
    logoPreview,
    isSubmitting,
    handleChange,
    handleModuleChange,
    handleLogoChange,
    removeLogo,
    handleSubmit,
    totalPercent,
  };
};