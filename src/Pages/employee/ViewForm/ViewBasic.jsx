import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeById, submitEmployee } from "../../../Redux/employeeSlice";
import { getDepartments } from "../../../Redux/departmentSlice";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../../Components/Loader/Loader";

import ViewBasicLayout from "../../employee/layout/ViewLayout";
import {
  Section,
  Card,
  CardHeader,
  CardContent,
  Input,
  Select,
  Rowes,
  Column,
  FullPageLoaderWrapper,
  FieldGroup,
  Label,
  PreviewBox,
  PreviewImage,
  UploadButton,
  HiddenInput,
} from "./ViewBasic.Style";
import {
  getLegalFieldConfig,
  isIndiaCompany,
  validateLegalIdentity,
} from "../../../utils/employeeCountryFields";

const ViewBasic = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { employeeDetail, loading } = useSelector((state) => state.employees);
  const departmentList = useSelector((state) => state.departments.list);

  const [formData, setFormData] = useState({});
  const [isEdited, setIsEdited] = useState(false);

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const calculatedTotal =
    Number(formData.casual_leave || 0) +
    Number(formData.sick_leave || 0) +
    Number(formData.earned_leave || 0) +
    Number(formData.maternity_leave || 0) +
    Number(formData.other_leave || 0);
  const country = formData?.company?.country || user?.company?.country || "IN";
  const legalConfig = getLegalFieldConfig(country);

  useEffect(() => {
    if (departmentList.length === 0) {
      dispatch(getDepartments({ page: 1, search: "" }));
    }
  }, [dispatch, departmentList.length]);

  useEffect(() => {
    if (id) {
      setFormData({});
      dispatch(getEmployeeById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!employeeDetail || Object.keys(employeeDetail).length === 0) return;

    let deptId = "";
    if (typeof employeeDetail.department === "string") {
      const match = departmentList.find(
        (d) => d.name === employeeDetail.department,
      );
      deptId = match ? match.id : "";
    } else if (typeof employeeDetail.department === "number") {
      deptId = employeeDetail.department;
    }

    const company =
      employeeDetail.company && typeof employeeDetail.company === "object"
        ? employeeDetail.company
        : user?.company || { country: "" };

    const updatedFormData = {
      ...employeeDetail,

      employee_id: employeeDetail.employee_id || "", // ✅ ADDED HERE

      department: deptId,
      total_leave: employeeDetail.total_leave || "",
      paid_leave: employeeDetail.paid_leave || "",
      contract_expiry_date: employeeDetail.contract_expiry_date || "",
      role: employeeDetail.role || "",
      idcard: employeeDetail.idcard || "",
      company,
      aadar_number:
        employeeDetail.aadar_number || employeeDetail.aadhaar_number || "",
    };

    if (!formData.id || formData.id !== employeeDetail.id) {
      setFormData(updatedFormData);
      setIsEdited(false);
    }
  }, [employeeDetail, departmentList, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsEdited(true);
  };
  const formatDate = (date) => {
    if (!date) return "----";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const handleImageChange = (file) => {
    setFormData((prev) => ({ ...prev, profile_pic: file }));
    setIsEdited(true);
  };

  const handleSubmit = async () => {
    let payload = { ...formData };
    Object.keys(payload).forEach((key) => {
      if (
        payload[key] === "" ||
        payload[key] === null ||
        payload[key] === undefined
      )
        delete payload[key];
    });
    delete payload.company;

    const legalErrors = validateLegalIdentity(country, payload);

    if (isIndiaCompany(country)) {
      delete payload.iqama_number;
      delete payload.insurance_number;
      delete payload.visa_expiry_date;

      if (!payload.aadar_number?.trim())
        return alert("Aadhaar number is required for India");
      if (legalErrors.aadar_number)
        return alert(legalErrors.aadar_number);
    } else {
      delete payload.aadar_number;
      if (!payload[legalConfig.identityField]?.trim())
        return alert(`${legalConfig.identityLabel} is required`);
      if (legalErrors[legalConfig.identityField])
        return alert(legalErrors[legalConfig.identityField]);
      if (!payload.visa_expiry_date)
        return alert("Visa expiry date is required");
      if (!payload.insurance_number?.trim())
        return alert("Insurance number is required");
    }

    const oldDept = employeeDetail.department;
    const newDept = payload.department;
    if (employeeDetail.is_head && oldDept !== newDept) {
      const confirmResult = await Swal.fire({
        title: "Warning",
        text: "This employee is the head of their department. Changing their department will remove them as head from the previous department. Do you want to continue?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, continue",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });
      if (!confirmResult.isConfirmed) return;
    }

    await dispatch(submitEmployee(payload));
    await dispatch(getEmployeeById(id));

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Employee details updated successfully.",
      confirmButtonColor: "#304EB0",
    });
    setIsEdited(false);
  };

  const handleTabNavigation = (path) => {
    if (isEdited) {
      Swal.fire({
        title: "Unsaved Changes",
        text: "You have unsaved changes. Do you want to leave without saving?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Leave",
        cancelButtonText: "Stay",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) navigate(path);
      });
    } else {
      navigate(path);
    }
  };


  if (loading || !formData || Object.keys(formData).length === 0) {
    return (
      <FullPageLoaderWrapper>
        <Loader size="large" tip="Loading..." />
      </FullPageLoaderWrapper>
    );
  }

  return (
    <ViewBasicLayout
      id={id}
      handleTabNavigation={handleTabNavigation}
      departmentList={departmentList}
      handleSubmit={handleSubmit}
      formData={formData}
      handleChange={handleChange}
      handleImageChange={handleImageChange}
    >
      <Section>
        <Card>
          <CardHeader>Job Details</CardHeader>
          <CardContent>
            <Rowes>
              <FieldGroup>
                <Label> Username</Label>

                <Input
                  name="employee_id"
                  value={formData.employee_id || ""}
                  onChange={handleChange}
                  placeholder="Enter employee username"
                       autoComplete="off"
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Designation</Label>
                <Input
                  name="designation"
                  value={formData.designation || ""}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Joining Date</Label>
                <Input
                  type="date"
                  name="joining_date"
                  value={
                    formData.joining_date
                      ? formData.joining_date.split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                />
              </FieldGroup>
              <FieldGroup>
  <Label>Employment Type</Label>
  <Select
    name="employment_type"
    value={formData.employment_type || ""}
    onChange={handleChange}
  >
    <option value="">Select Type</option>
    <option value="Full-time">Full-time</option>
    <option value="Part-time">Part-time</option>
    <option value="Contract">Contract</option>
  </Select>
</FieldGroup>
              <FieldGroup>
                <Label>Department</Label>
                <Select
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departmentList.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Select>
              </FieldGroup>
            </Rowes>
            <FieldGroup>
              <Label>Total Leave</Label>
              <Input
                type="number"
                value={calculatedTotal}
                readOnly
              />
            </FieldGroup>
            <Rowes>
              <FieldGroup>
                <Label>Casual Leave</Label>
                <Input
                  type="number"
                  name="casual_leave"
                  value={formData.casual_leave || ""}
                  onChange={handleChange}
                  min="0"
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Sick Leave</Label>
                <Input
                  type="number"
                  name="sick_leave"
                  value={formData.sick_leave || ""}
                  onChange={handleChange}
                  min="0"
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Earned Leave</Label>
                <Input
                  type="number"
                  name="earned_leave"
                  value={formData.earned_leave || ""}
                  onChange={handleChange}
                  min="0"
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Maternity Leave</Label>
                <Input
                  type="number"
                  name="maternity_leave"
                  value={formData.maternity_leave || ""}
                  onChange={handleChange}
                  min="0"
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Other Leave</Label>
                <Input
                  type="number"
                  name="other_leave"
                  value={formData.other_leave || ""}
                  onChange={handleChange}
                  min="0"
                />
              </FieldGroup>

            </Rowes>


          </CardContent>
        </Card>
        <Card>
          <CardHeader>Employee Legal & ID Information</CardHeader>
          <CardContent>
            <Column>
              <Rowes>
               
                {!isIndiaCompany(country) && legalConfig.identityField !== "passport_number" && (
                  <FieldGroup>
                    <Label>Passport Number</Label>
                    <Input
                      name="passport_number"
                      value={formData.passport_number || ""}
                      onChange={handleChange}
                    />
                  </FieldGroup>
                )}
                <FieldGroup>
                  <Label>Role</Label>
                  <Select
                    name="role"
                    value={formData.role || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Role</option>
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                    <option value="manager">Manager</option>
                  </Select>
                </FieldGroup>
              </Rowes>
              <Rowes>
                {isIndiaCompany(country) ? (
                  <>
                    <FieldGroup>
                      <Label>Contract Expiry Date</Label>
                      <Input
                        type="date"
                        name="contract_expiry_date"
                        value={formData.contract_expiry_date || ""}
                        onChange={handleChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <Label>{legalConfig.identityLabel}</Label>
                      <Input
                        name={legalConfig.identityField}
                        value={formData[legalConfig.identityField] || ""}
                        onChange={handleChange}
                      />
                    </FieldGroup>
                  </>
                ) : (
                  <>
                    <FieldGroup>
                      <Label>Visa Expiry Date</Label>
                      <Input
                        type="date"
                        name="visa_expiry_date"
                        value={formData.visa_expiry_date || ""}
                        onChange={handleChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <Label>{legalConfig.identityLabel}</Label>
                      <Input
                        name={legalConfig.identityField}
                        value={formData[legalConfig.identityField] || ""}
                        onChange={handleChange}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <Label>Insurance Number</Label>
                      <Input
                        name="insurance_number"
                        value={formData.insurance_number || ""}
                        onChange={handleChange}
                      />
                    </FieldGroup>
                  </>
                )}
              </Rowes>

              <FieldGroup>
                <Label>ID Card</Label>
                {formData.idcard && (
                  <PreviewBox>
                    <PreviewImage
                      src={
                        formData.idcard instanceof File
                          ? URL.createObjectURL(formData.idcard)
                          : formData.idcard
                      }
                      alt="ID Card"
                    />
                  </PreviewBox>
                )}

                <UploadButton>
                  Upload ID Card
                  <HiddenInput
                    type="file"
                    accept="image/*"
                    name="idcard"
                    onChange={(e) =>
                      setFormData({ ...formData, idcard: e.target.files[0] })
                    }
                  />
                </UploadButton>
              </FieldGroup>
            </Column>
          </CardContent>
        </Card>
      </Section>
    </ViewBasicLayout>
  );
};

export default ViewBasic;
