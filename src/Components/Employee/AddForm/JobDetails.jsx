import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import {
  FormContainer,
  SectionTitle,
  FormRow,
  FormGroup,
  FullWidthGroup,
  Label,
  Input,
  Select,
  FileInputLabel,
  FileInput,
  ErrorText,
  TotalLeaveBox,
  LeaveGrid,
  LeaveItem,
  LeaveLabel,
  LeaveInput,
} from "./JobDetails.Styles";
import {
  getLegalFieldConfig,
  isIndiaCompany,
  validateLegalIdentity,
} from "../../../utils/employeeCountryFields";
import { Divider } from "antd";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const JobDetails = forwardRef(
  ({
    country: propCountry,
    departments = [],
    designations = [],
    initialValues = {},
    onFormChange,
    errors: parentErrors
  }, ref) => {
    const savedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
    const defaultCountry = propCountry || savedUser?.company?.country || "IN";
    const deptFromStore = useSelector(s => s.departments?.list || []);
    const departmentList = departments?.length ? departments : deptFromStore;

    const [formData, setFormData] = useState({
      designation: "",
      joining_date: "",
      department_id: "",
      employment_type: "",
      total_leave: 0,
      casual_leave: "",
      sick_leave: "",
      earned_leave: "",
      maternity_leave: "",
      other_leave: "",
      role: "",
      phno: "",
      iqama_number: "",
      passport_number: "",
      employeeContract: "",
      workPermit: "",
      insurance_number: "",
      visa_expiry_date: "",
      contract_expiry_date: "",
      aadar_number: "",
      idcard: null,
      email: "",
      dob: "",
      ...initialValues,
    });

    const [errors, setErrors] = useState({});
    const [country] = useState(defaultCountry);
    const legalConfig = getLegalFieldConfig(country);

    useEffect(() => {
      if (initialValues && Object.keys(initialValues).length) setFormData(prev => ({ ...prev, ...initialValues }));
    }, [initialValues]);

    useEffect(() => {
      const total =
        (Number(formData.casual_leave) || 0) +
        (Number(formData.sick_leave) || 0) +
        (Number(formData.earned_leave) || 0) +
        (Number(formData.maternity_leave) || 0) +
        (Number(formData.other_leave) || 0);

      setFormData(prev => ({
        ...prev,
        total_leave: total
      }));

      if (onFormChange) {
        onFormChange({
          target: {
            name: "total_leave",
            value: total
          }
        });
      }

    }, [
      formData.casual_leave,
      formData.sick_leave,
      formData.earned_leave,
      formData.maternity_leave,
      formData.other_leave
    ]);

    const handleChange = (e) => {
      const { name, value, files, type } = e.target;

      if (type === "file") {
        const file = files?.[0];

        if (!file) {
          setFormData((prev) => ({ ...prev, [name]: null }));
          if (onFormChange) onFormChange(e);
          return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            [name]: "Only JPG, JPEG, PNG and WEBP images are allowed.",
          }));
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          setErrors((prev) => ({
            ...prev,
            [name]: "Image size must be less than 5 MB.",
          }));
          return;
        }

        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));

        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));

        if (onFormChange) {
          onFormChange({
            target: {
              name,
              value: file,
              files: [file],
              type: "file",
            },
          });
        }

        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (onFormChange) onFormChange(e);
    };

    const validateForm = () => {
      const newErrors = {};
      const now = new Date().toISOString().split("T")[0];
      const baseRequired = ["designation", "joining_date", "department_id", "employment_type", "total_leave", "phno", "email", "dob", "role",];
      const totalLeave =
        (Number(formData.casual_leave) || 0) +
        (Number(formData.sick_leave) || 0) +
        (Number(formData.earned_leave) || 0) +
        (Number(formData.maternity_leave) || 0) +
        (Number(formData.other_leave) || 0);

      if (totalLeave === 0) {
        newErrors.leave = "Please allocate at least one leave day.";
      }
      baseRequired.push(...legalConfig.requiredFields);

      const fieldNames = {
        designation: "designation",
        joining_date: "joining date",
        department_id: "department",
        employment_type: "employment type",
        phno: "contact number",
        email: "email address",
        dob: "date of birth",
        role: "role",
        ...(legalConfig.identityField ? { [legalConfig.identityField]: `valid ${legalConfig.identityLabel?.toLowerCase() || "ID"}` } : {})
      };

      baseRequired.forEach(field => {
        if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) {
          const friendlyName = fieldNames[field];
          newErrors[field] = friendlyName ? `Please provide the ${friendlyName}.` : "This field is required.";
        }
      });
      Object.assign(newErrors, validateLegalIdentity(country, formData));

      if (formData.phno) {
        const phone = formData.phno.trim();
        if (isIndiaCompany(country) && !/^[0-9]{10}$/.test(phone)) newErrors.phno = "Please enter a valid 10-digit phone number.";
        else if (!isIndiaCompany(country) && !/^\+?[1-9]\d{7,14}$/.test(phone)) newErrors.phno = "Please enter a valid international phone number.";
      }

      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address.";
      if (formData.dob && formData.dob >= now) newErrors.dob = "Date of birth must be a past date.";
      if (formData.joining_date && formData.joining_date > now) newErrors.joining_date = "Joining date cannot be a future date.";
      if (formData.contract_expiry_date && formData.contract_expiry_date <= now) newErrors.contract_expiry_date = "Contract expiry date must be a future date.";
      if (formData.visa_expiry_date && formData.visa_expiry_date <= now) newErrors.visa_expiry_date = "Visa expiry date must be a future date.";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
      validate: () => validateForm(),
      getData: () => formData,
    }));

    const renderError = (field) => <>{errors[field] && <ErrorText>{errors[field]}</ErrorText>}</>;

    return (
      <FormContainer noValidate>
        <Divider />
        <SectionTitle>Job Details</SectionTitle>

        <FormRow $columns={5}>
          <FormGroup>
  <Label $required>Designation</Label>

  <div style={{ position: "relative" }}>
    <Input
      name="designation"
      value={formData.designation}
      onChange={handleChange}
      placeholder="Select or enter Designation"
      autoComplete="off"
      list="designation-options"
    />

    <datalist id="designation-options">
      {designations.map((designation, index) => (
        <option key={index} value={designation} />
      ))}
    </datalist>
  </div>

  {renderError("designation")}
</FormGroup>

          <FormGroup>
            <Label $required>Joining Date</Label>
            <Input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} autoComplete="off" />
            {renderError("joining_date")}
          </FormGroup>

          <FormGroup>
            <Label $required>Department</Label>
            <Select name="department_id" value={formData.department_id} onChange={handleChange}>
              <option value="">Select Department</option>
              {departmentList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            {renderError("department_id")}
          </FormGroup>

          <FormGroup>
            <Label $required>Employment Type</Label>
            <Select name="employment_type" value={formData.employment_type} onChange={handleChange}>
              <option value="">Select Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </Select>
            {renderError("employment_type")}
          </FormGroup>

          <FormGroup>
            <Label $required>Roles</Label>
            <Select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="manager">Manager</option>
            </Select>
            {renderError("role")}
          </FormGroup>
        </FormRow>

        <FormRow $columns={5}>
          <FullWidthGroup>
            <Label $required>Leave Allocation</Label>

            <TotalLeaveBox>
              Total Leave : {formData.total_leave}
            </TotalLeaveBox>

            {errors.leave && <ErrorText>{errors.leave}</ErrorText>}

            <LeaveGrid>
              <LeaveItem>
                <LeaveLabel>Casual Leave</LeaveLabel>
                <LeaveInput
                  type="number"
                  name="casual_leave"
                  value={formData.casual_leave}
                  onChange={handleChange}
                />
              </LeaveItem>

              <LeaveItem>
                <LeaveLabel>Sick Leave</LeaveLabel>
                <LeaveInput
                  type="number"
                  name="sick_leave"
                  value={formData.sick_leave}
                  onChange={handleChange}
                />
              </LeaveItem>

              <LeaveItem>
                <LeaveLabel>Earned Leave</LeaveLabel>
                <LeaveInput
                  type="number"
                  name="earned_leave"
                  value={formData.earned_leave}
                  onChange={handleChange}
                />
              </LeaveItem>

              <LeaveItem>
                <LeaveLabel>Maternity Leave</LeaveLabel>
                <LeaveInput
                  type="number"
                  name="maternity_leave"
                  value={formData.maternity_leave}
                  onChange={handleChange}
                />
              </LeaveItem>

              <LeaveItem>
                <LeaveLabel>Other Leave</LeaveLabel>
                <LeaveInput
                  type="number"
                  name="other_leave"
                  value={formData.other_leave}
                  onChange={handleChange}
                />
              </LeaveItem>
            </LeaveGrid>
          </FullWidthGroup>
        </FormRow>
        <Divider />
        <SectionTitle>Employee Legal & ID Information</SectionTitle>

        <FormRow $columns={3}>
          {/* <FormGroup>
          <Label>Phone Number</Label>
          <Input name="phno" value={formData.phno} onChange={handleChange} placeholder="Enter Phone number" autoComplete="off" />
          {renderError("phno")}
        </FormGroup> */}

          {!isIndiaCompany(country) && legalConfig.identityField !== "passport_number" && (
            <FormGroup>
              <Label>Passport Number</Label>
              <Input name="passport_number" value={formData.passport_number} onChange={handleChange} placeholder="Enter Passport Number" autoComplete="off" />
              {renderError("passport_number")}
            </FormGroup>
          )}

          <FormGroup>
            <Label>Employee Contract</Label>
            <Input name="employeeContract" value={formData.employeeContract} onChange={handleChange} placeholder="Enter Contract Name" autoComplete="off" />
          </FormGroup>

          <FormGroup>
            <Label>Work Permit</Label>
            <Input name="workPermit" value={formData.workPermit} onChange={handleChange} placeholder="Enter Work Permit" autoComplete="off" />
          </FormGroup>

          <FormGroup>
            <Label>Insurance Number</Label>
            <Input name="insurance_number" value={formData.insurance_number} onChange={handleChange} placeholder="Enter Insurance Number" autoComplete="off" />
            {renderError("insurance_number")}
          </FormGroup>
        </FormRow>

        <FormRow $columns={3}>
          <FormGroup>
            <Label>ID Card Photo</Label>
            <FileInputLabel htmlFor="idcard">{formData.idcard?.name || "Upload ID Card +"}</FileInputLabel>
            <FileInput id="idcard" name="idcard" type="file" onChange={handleChange} />
            {errors.idcard && <ErrorText>{errors.idcard}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label $required>{legalConfig.identityLabel}</Label>
            <Input
              name={legalConfig.identityField}
              value={formData[legalConfig.identityField]}
              onChange={handleChange}
              placeholder={legalConfig.identityPlaceholder}
              autoComplete="off"
              maxLength={legalConfig.identityMaxLength}
              onKeyPress={(e) => {
                if (isIndiaCompany(country) && !/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
            {renderError(legalConfig.identityField)}
          </FormGroup>

          <FormGroup>
            <Label>{isIndiaCompany(country) ? "Contract Expiry Date" : "Visa Expiry Date"}</Label>
            <Input
              type="date"
              name={isIndiaCompany(country) ? "contract_expiry_date" : "visa_expiry_date"}
              value={isIndiaCompany(country) ? formData.contract_expiry_date : formData.visa_expiry_date}
              onChange={handleChange}
              autoComplete="off"
            />
            {renderError(isIndiaCompany(country) ? "contract_expiry_date" : "visa_expiry_date")}
          </FormGroup>
        </FormRow>
      </FormContainer>
    );
  });

export default JobDetails;