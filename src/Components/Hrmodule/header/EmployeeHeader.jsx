import React, { useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { GoArrowLeft } from "react-icons/go";
import { PiUserCirclePlusThin } from "react-icons/pi";
import {
  ProfileContainer,
  ProfileCard,
  ProfileImageWrapper,
  ProfileImage,
  PlusIconWrapper,
  ContentArea,
  LeftColumn,
  RightColumn,
  InputBox,
  BioBox,
  InfoRow,
  BackArrowWrapper,
  UserIconWrapper,
} from "./EmployeeHeader.Styles";

const EmployeeHeader = ({ employee = {}, editable = false, onChange, onImageChange, onBack }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };
const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
  return (
    <ProfileContainer>
      <ProfileCard>
        {onBack && (
          <BackArrowWrapper onClick={onBack}>
            <GoArrowLeft size={24} color="#1034ad" />
          </BackArrowWrapper>
        )}
        <ContentArea>
          <LeftColumn>
            <InputBox
              type="text"
              name="name"
              placeholder="Full Name"
              value={employee.name || ""}
              readOnly={!editable}
              onChange={onChange}
              autoComplete="off"
            />
            <InputBox
              type="text"
              name="employee_id"
              placeholder="Employee ID"
              value={employee.employee_id || ""}
              readOnly={!editable}
              onChange={onChange}
              autoComplete="off"
            />
            <InputBox
              type="email"
              name="email"
              placeholder="Email"
              value={employee.email || ""}
              readOnly={!editable}
              onChange={onChange}
              autoComplete="off"
            />
          </LeftColumn>

          <RightColumn>
            <BioBox
              name="address"
              placeholder="Address"
              value={employee.address || ""}
              readOnly={!editable}
              onChange={onChange}
              autoComplete="off"
            />
            <InfoRow>
              <InputBox
                type="text"
                name="dob"
                placeholder="Date of Birth"
                value={formatDate (employee.dob || "")}
                readOnly={!editable}
                onChange={onChange}
                autoComplete="off"
              />
              <InputBox
                type="text"
                name="gender"
                placeholder="Gender"
                value={employee.gender || ""}
                readOnly={!editable}
                onChange={onChange}
                autoComplete="off"
              />
            </InfoRow>
          </RightColumn>
        </ContentArea>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default EmployeeHeader;
