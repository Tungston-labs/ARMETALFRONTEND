import React from "react";
import {
  CardContainer,
  LeftIcon,
  TitleRow,
  CardTitle,
  Count,
  EmployeeList,
  EmployeeRow,
  Avatar,
  EmpName,
  EmpId,
  EmpDept,
  ArrowIcon,
  ContentWrapper,
  Divider
} from "./TopCard.Styles";

const TopCard = ({ icon, title, count, employees, onClick }) => {
  return (
    <CardContainer onClick={onClick}>
      <ContentWrapper>
        <LeftIcon>{icon}</LeftIcon>

        <div style={{ flex: 1 }}>
          <TitleRow>
            <CardTitle>{title}</CardTitle>
            <Count>{count}</Count>
          </TitleRow>

          <Divider />

          <EmployeeList>
            {employees?.slice(0, 4).map((emp, index) => (
              <EmployeeRow key={index}>
                <Avatar src={emp.avatar || "/default-avatar.png"} />
                <EmpName>{emp.name}</EmpName>
                <EmpId>{emp.empId}</EmpId>
                <EmpDept>{emp.department}</EmpDept>
              </EmployeeRow>
            ))}
          </EmployeeList>
        </div>

        <ArrowIcon>↗</ArrowIcon>
      </ContentWrapper>
    </CardContainer>
  );
};

export default TopCard;
