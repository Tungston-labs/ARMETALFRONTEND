import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalBox,
  ModalHeader,
  CloseBtn,
  Input,
  TextArea,
  SendBtn,
  Row,
  Label
} from "./MailModal.styles";
import { sendEmail } from "../../services/employeeService";
import Swal from "sweetalert2";
const MailModal = ({ isOpen, onClose, employee }) => {
  const initialFormState = {
    to: employee?.email || "",
    subject: "",
    body: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  // RESET THE MODAL EVERY TIME IT OPENS
  useEffect(() => {
    if (isOpen) {
      setForm(initialFormState);
    }
  }, [isOpen, employee]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const handleSend = async () => {
  if (!form.to || !form.subject || !form.body) {
    Swal.fire({
      icon: "warning",
      title: "Missing fields",
      text: "Please fill all fields!",
      confirmButtonColor: "#2563eb",
    });
    return;
  }

  try {
    setLoading(true);
    Swal.fire({
      title: "Sending email...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await sendEmail(form);

    Swal.fire({
      icon: "success",
      title: "Sent!",
      text: "Email sent successfully",
      confirmButtonColor: "#16a34a",
    });

    setForm(initialFormState);
    onClose();
  } catch (err) {

    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "Failed to send email!",
      confirmButtonColor: "#dc2626",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <span>New Message</span>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <Row>
          <Label>To</Label>
          <Input
            type="email"
            name="to"
            value={form.to}
            onChange={handleChange}
              autoComplete="off"
          />
        </Row>

        <Row>
          <Label>Subject</Label>
          <Input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Enter subject"
          />
        </Row>

        <Row>
          <TextArea
            name="body"
            value={form.body}
            onChange={handleChange}
              autoComplete="off"
            placeholder="Write your message......"
          />
        </Row>

        <SendBtn onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </SendBtn>
      </ModalBox>
    </ModalOverlay>
  );
};

export default MailModal;
