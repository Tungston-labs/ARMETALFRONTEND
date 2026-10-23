import React, { useEffect, useState } from "react";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Row,
  Label,
  Input,
  TextArea,
  Footer,
  SendButton,
} from "./EmailCompose.styles";
import { IoClose } from "react-icons/io5";

const EmailCompose = ({ company, onClose }) => {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
  if (company) {
    setEmailData({
      to: company.email || "",
      subject: "Your Rekory HR Subscription is Expiring Soon",
      message: `Dear ${company.name},

This is a friendly reminder that your Rekory HR subscription is approaching its expiration date.

Subscription Details
----------------------------
Company Name : ${company.name}
Expiry Date   : ${company.expiry_date}
----------------------------

To ensure uninterrupted access to your Rekory HR services, we kindly request that you renew your subscription before the expiry date.

If you have already completed your renewal, please disregard this email.

Should you require any assistance with the renewal process, please feel free to contact our support team.

Thank you for choosing Rekory HR.`,
    });
  }
}, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSend = () => {
    const payload = {
      email: emailData.to,
      subject: emailData.subject,
      message: emailData.message,
    };

    console.log("Email Payload:", payload);

    // Example:
    // dispatch(sendCompanyEmail(payload));
    // or await sendEmail(payload);

    alert("Email sent successfully!");

    onClose();
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>New Message</Title>

          <CloseButton onClick={onClose}>
            <IoClose />
          </CloseButton>
        </Header>

        <Row>
          <Label>To</Label>

          <Input
            type="email"
            name="to"
            value={emailData.to}
            onChange={handleChange}
            placeholder="Recipient Email"
          />
        </Row>

        <Row>
          <Label>Subject</Label>

          <Input
            type="text"
            name="subject"
            value={emailData.subject}
            onChange={handleChange}
            placeholder="Enter Subject"
          />
        </Row>

        <TextArea
          name="message"
          value={emailData.message}
          onChange={handleChange}
          placeholder="Write your message..."
        />

        <Footer>
          <SendButton onClick={handleSend}>
            Send
          </SendButton>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default EmailCompose;