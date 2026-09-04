import React from "react";
import {
  Wrapper,
  Header,
  List,
  ListItem,
  ExpiryBox,
  Info,
  NoData
} from "./EmployeeContractExpiry.styles";
import { useNavigate } from "react-router-dom";
import { Dept, IdText, Name, Title } from "./RecentlyAddedEmployees.styles";
import { IconButton } from "./ProjectChart.Styles";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

function daysLeft(dateStr) {
  const today = new Date();
  const expiry = new Date(dateStr);
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diff = expiry - today;
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

const EmployeeContractExpiry = ({ employees = [], showCount = 5 }) => {
  const navigate = useNavigate();
 const sorted = [...employees].sort(
  (a, b) =>
    new Date(a.contract_expiry_date) -
    new Date(b.contract_expiry_date)
);

  const list = sorted.slice(0, showCount);
console.log("employees:", employees);
  return (
    <Wrapper>
      <Header>
        <Title>Contract Expiry</Title>


               <IconButton onClick={() => navigate("/employee-Contract-Visa-Expiry")}>
          <BsArrowUpRightCircleFill />
        </IconButton>
      </Header>

      <List>
        {list.length === 0 && <NoData>No expiring contracts</NoData>}

        {list.map((emp, idx) => {
         const days = emp.days_left;
          const isSoon = days >= 0 && days <= 5;

          return (
            <ListItem key={idx} $highlight={isSoon}>
              
              <ExpiryBox $highlight={isSoon}>
<span className="day">
  {new Date(emp.contract_expiry_date).getDate()}
</span>                <span className="month">
{new Date(emp.contract_expiry_date).toLocaleString("en-US", {
  month: "short",
})}                </span>
              </ExpiryBox>

              <Info>
                <Name>{emp.name}</Name>
<Dept>ID: {emp.employee_id}</Dept>                <IdText>
                  {days === 0
                    ? "Expires Today"
                    : days > 0
                    ? `${days} day${days > 1 ? "s" : ""} left`
                    : `${Math.abs(days)} day${Math.abs(days) > 1 ? "s" : ""} ago`}
                </IdText>
              </Info>
            </ListItem>
          );
        })}
      </List>
    </Wrapper>
  );
};

export default EmployeeContractExpiry;
