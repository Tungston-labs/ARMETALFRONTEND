import React from "react";
import {
  Wrapper,
  SectionTitle,
  GridBox,
  CountCard,
  CountNumber,
  CountLabel,
  LatestCard,
  LatestHeader,
  LatestItem,
  DeptInfo,
  DeptName,
  DeptDate,
  NoData,
  Container
} from "./DepartmentSummary.Styles";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { Header, IconButton, Title } from "./RecentlyAddedEmployees.styles";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
const DepartmentSummary = ({ departments = [] }) => {
  const navigate = useNavigate();
  const totalDepartments = departments.length;
  const latestDepartments = [...departments]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 1);

    
  return (
    <Wrapper>
         <Header>
      <Title>Department Overview</Title>
 <IconButton onClick={() => navigate("/department")}>
            <BsArrowUpRightCircleFill />
          </IconButton>


</Header>
      <Container>
        <GridBox>
          <CountCard>
            <CountNumber>{totalDepartments}</CountNumber>
            <CountLabel>Total Active Departments</CountLabel>
          </CountCard>

          <LatestCard>
            <LatestHeader>Recently Added</LatestHeader>

            {latestDepartments.length > 0 ? (
              latestDepartments.map((dept, idx) => (
                <LatestItem key={idx}>
                  <DeptInfo>
                    <DeptName>{dept.name}</DeptName>

                    <DeptDate>
                      {new Date(dept.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </DeptDate>
                  </DeptInfo>

                  <div className="right-icon">
                    <FiChevronRight />
                  </div>
                </LatestItem>
              ))
            ) : (
              <NoData>No recent departments found</NoData>
            )}
          </LatestCard>
        </GridBox>
      </Container>
    </Wrapper>
  );
};

export default DepartmentSummary;
