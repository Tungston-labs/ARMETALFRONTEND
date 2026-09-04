import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitEmployee,
  setEmployeeId,
  setBasicFormData,
} from "../../../Redux/employeeSlice";
import { getDepartments } from "../../../Redux/departmentSlice";
import { useNavigate } from "react-router-dom";
import UnsavedChangesGuard from "../../../Components/UnsavedChangesGuard";
import {
  Container,
} from "./BasicLevel.Styles";

import JobDetails from "../../../Components/Employee/AddForm/JobDetails";
import Loader from "../../../Components/Loader/Loader";
// import Navbar from "../../Components/Navbar";
import EmployeeHeader from "../../../Components/Employee/Headers/EmployeeHeader";
import { ButtonWrapper, NextButton } from "../../../Components/Employee/AddForm/JobDetails.Styles";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import {
  getLegalFieldConfig,
  validateLegalIdentity,
} from "../../../utils/employeeCountryFields";
import FormStepper from "../AddEmployee/Formstepper";
import { getDesignations } from "../../../services/employeeService";

export default function AddEmployeeForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formData: reduxFormData } = useSelector((state) => state.employee);
  const departmentList = useSelector((state) => state.departments.list);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep] = useState(0);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const jobref = useRef();
  const stepTitles = ["Basic Info", "Job Details", "Legal Info"];
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user"),
  );
  const country = user?.company?.country || "IN";
  const [designations, setDesignations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phno: "",
    address: "",
    dob: "",
    gender: "",

    // ADD THESE
    country: "",
    blood_group: "",

    designation: "",
    joining_date: "",
    department_id: "",
    employment_type: "",

    passport_number: "",
    visa_expiry_date: "",
    iqama_number: "",
    aadar_number: "",
    insurance_number: "",

    profile_pic: null,

    total_leave: "",
    casual_leave: "",
    sick_leave: "",
    earned_leave: "",
    maternity_leave: "",
    other_leave: "",

    role: "",
    contract_expiry_date: "",
    idcard: null,

    employee_id: "",
    employee_code: "",
  });
  useEffect(() => {
    if (departmentList.length === 0) {
      dispatch(getDepartments({ page: 1, search: "" }));
    }
  }, [dispatch, departmentList.length]);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const data = await getDesignations();

        setDesignations(
          Array.isArray(data?.designations)
            ? data.designations
            : []
        );
      } catch (error) {
        console.error("Failed to fetch designations:", error);
        setDesignations([]);
      }
    };

    fetchDesignations();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // Handle file change separately (like profile_pic)
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files?.[0] || null }));
      dispatch(setBasicFormData({ ...formData, [name]: files?.[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      dispatch(setBasicFormData({ ...formData, [name]: value }));
    }
    setIsFormDirty(true);
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, profile_pic: file }));
    setIsFormDirty(true);
    // You should also update Redux state here if needed
    dispatch(setBasicFormData({ ...formData, profile_pic: file }));
  };

  const validateForm = () => {
    const newErrors = {};
    const now = new Date().toISOString().split("T")[0];

    const requiredFields = [
      "name", "address", "email", "dob", "phno",
      "gender", "designation", "joining_date",
      "department_id", "employment_type", "total_leave", "role", "employee_code", "blood_group", "country"
    ];

    requiredFields.push(...getLegalFieldConfig(country).requiredFields);

    const fieldNames = {
      name: "employee's full name",
      address: "full address",
      email: "email address",
      dob: "date of birth",
      phno: "contact number",
      gender: "gender",
      designation: "designation",
      joining_date: "joining date",
      department_id: "department",
      employment_type: "employment type",
      total_leave: "total leave",
      role: "role",
      employee_code: "employee ID",
      blood_group: "blood group",
      country: "country"
    };

    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        const friendlyName = fieldNames[field];
        newErrors[field] = friendlyName ? `Please provide the ${friendlyName}.` : "This field is required.";
      }
    });

    // ✅ Add these date checks:
    if (formData.dob && formData.dob >= now) {
      newErrors.dob = "Date of birth must be a past date.";
    }
    if (formData.joining_date && formData.joining_date > now) {
      newErrors.joining_date = "Joining date cannot be a future date.";
    }
    Object.assign(newErrors, validateLegalIdentity(country, formData));

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {


    const isBasicValid = validateForm(); // this triggers setErrors


    const jobComp = jobref.current;


    const isJobValid = jobComp?.validate?.();

    setErrors((prev) => ({ ...prev }));

    if (!isBasicValid || !isJobValid) {

      return;
    }

    setLoading(true);
    try {
      const jobData = jobref.current?.getData?.();

      const finalData = {
        ...formData,
        ...jobData,
      };

      console.log("FINAL DATA", finalData);

      dispatch(setBasicFormData(finalData));

      const res = await dispatch(
        submitEmployee({
          basic: finalData,
        })
      );

      if (res.meta.requestStatus === "fulfilled") {
        const id = res.payload?.employee?.id || res.payload?.id;
        if (id) {
          dispatch(setEmployeeId(id));
          setIsFormDirty(false);
          navigate("/bank-payment");
        }
      }
      else if (res.meta.requestStatus === "rejected") {
        if (res.payload) {
          const formattedErrors = {};

          Object.keys(res.payload).forEach((key) => {
            formattedErrors[key] = Array.isArray(res.payload[key])
              ? res.payload[key][0]
              : res.payload[key];
          });

          // Optional clean message
          if (formattedErrors.email) {
            formattedErrors.email = "This email is already registered";
          }

          setErrors(formattedErrors);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      {loading && <Loader />}
      <Container>
        <UnsavedChangesGuard isDirty={isFormDirty} />
        <ReusableHeader
          title="Employees"
          breadcrumbs={["Employees", "Add Form"]}
          showBack
          onBack={() => navigate("/employee")}
        />

        <FormStepper
          profileImageSrc={
            formData.profile_pic
              ? typeof formData.profile_pic === "string"
                ? formData.profile_pic
                : URL.createObjectURL(formData.profile_pic)
              : null
          }
          onProfileImageChange={(file) => handleFileChange(file)}
        />
        <EmployeeHeader
          formData={formData}
          setFormData={setFormData}
          setIsFormDirty={setIsFormDirty}
          onFileChange={handleFileChange}
          errors={errors}
          setErrors={setErrors}
        />
        <JobDetails
          country={country}
          departments={departmentList}
          designations={designations}
          initialValues={formData}
          onFormChange={handleChange}
          errors={errors}
          ref={jobref}
        />

        <ButtonWrapper>
          <NextButton
            type="button"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </NextButton>
        </ButtonWrapper>
      </Container>
    </>
  );
}