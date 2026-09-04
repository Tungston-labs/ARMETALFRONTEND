import React from "react";
import {
  Wrapper,
  Header,
  Title,
  List,
  ListItem,
  Avatar,
  Info,
  Name,
  Dept,
  IdText,
  DateBox,
  NoData,
  IconButton,
  AvatarFallback
} from "./RecentlyAddedEmployees.styles";
import { useNavigate } from "react-router-dom";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { RiUserFill } from "react-icons/ri";
const RecentlyAddedEmployees = ({ employees = [], showCount = 5 }) => {
  const navigate = useNavigate();

  const sorted = [...employees].sort(
    (a, b) => new Date(b.joiningDate) - new Date(a.joiningDate)
  );

  const list = sorted.slice(0, showCount);
const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
  return (
    <Wrapper>
      <Header>
        <Title>Recently Added Employees  </Title>
          <IconButton onClick={() => navigate("/employee")}>
            <BsArrowUpRightCircleFill />
          </IconButton>
      
      </Header>

      <List>
        {list.length === 0 && <NoData>No employees found</NoData>}

        {list.map((emp, idx) => (
          <ListItem key={idx}>
         {emp.avatar ? (
  <Avatar
    src={emp.avatar}
    alt={emp.name || "Employee"}
  />
) : (
  <AvatarFallback>
    <RiUserFill size={20} />
  </AvatarFallback>
)}
            <Info>
              <Name>{emp.name}</Name>
              <Dept>{emp.department}</Dept>
              <IdText>ID: {emp.empId}</IdText>
            </Info>
           <DateBox>{formatDate(emp.joiningDate)}</DateBox>
          </ListItem>
        ))}
      </List>
    </Wrapper>
  );
};

export default RecentlyAddedEmployees;
