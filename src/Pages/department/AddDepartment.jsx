import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewDepartment, getDepartments } from "../../Redux/departmentSlice.js";
import {
  Overlay, Modal, Header, HeaderLeft, Title, Subtitle,
  CloseBtn, Body, EmployeeCard, Avatar, EmpInfo, EmpName,
  EmpSub, Row, Field, Label, Input, TextArea, Footer,
  CancelBtn, SaveBtn,
} from "../department/AddDepartment.Styles.js";

const AddDepartment = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", department_code: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const validate = () => {
    if (!form.name?.trim()) { setError("Please provide a department name."); return false; }
    if (!form.department_code?.trim()) { setError("Please provide a department code."); return false; }
    if (form.department_code.length > 10) { setError("Department code cannot exceed 10 characters."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setError(""); setSaving(true);
    try {
      await dispatch(createNewDepartment(form)).unwrap();
      dispatch(getDepartments({ page: 1, search: "" }));
      onClose();
    } catch (err) {
      const message = err?.payload?.detail || err?.payload?.message
        || err?.message || "Something went wrong. Please try again later.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const initials = form.name.trim().substring(0, 2).toUpperCase() || "HR";

  return (
    <Overlay>
      <Modal>

        <Header>
          <HeaderLeft>
            <Title>Add department</Title>
            <Subtitle>Fill in the details below to create a new department</Subtitle>
          </HeaderLeft>
          <CloseBtn onClick={onClose} aria-label="Close">✕ </CloseBtn>
        </Header>

        <Body>
          <EmployeeCard>
            <Avatar>{initials}</Avatar>
            <EmpInfo>
              <EmpName>{form.name.trim() || "New Department"}</EmpName>
              <EmpSub>Will be visible to all employees once saved</EmpSub>
            </EmpInfo>
          </EmployeeCard>

          <form onSubmit={handleSubmit}>
            <Row>
              <Field>
                <Label>Department name <span style={{ color: "#e24b4a" }}>*</span></Label>
                <Input
                  type="text" name="name" value={form.name}
                  onChange={handleChange} placeholder="e.g. Development"
                  autoComplete="off" 
                />
              </Field>
              <Field>
                <Label>Department code <span style={{ color: "#e24b4a" }}>*</span></Label>
                <Input
                  type="text" name="department_code" value={form.department_code}
                  onChange={handleChange} placeholder="e.g. DEV_00"
                  autoComplete="off" maxLength={10} 
                />
              </Field>
            </Row>

            {error && (
              <p style={{ fontSize: 12, color: "#dc2626", background: "#fef2f2",
                border: "0.5px solid #fca5a5", borderRadius: 6,
                padding: "8px 12px", marginBottom: 14 }}>
                {error}
              </p>
            )}

            <Footer>
              <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
              <SaveBtn type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </SaveBtn>
            </Footer>
          </form>
        </Body>

      </Modal>
    </Overlay>
  );
};

export default AddDepartment;