import React, { useRef } from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
  Container,
  TopSection,
  FormSection,
  TabsRowContainer,
  TabsRow,
  TabButton,
} from "./ViewLayout.Styles";
import Header from "../../../Components/Employee/Headers/Header";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import { useNavigate } from "react-router-dom";

const ViewBasicLayout = ({
  id,
  handleTabNavigation,
  departmentList,
  handleSubmit,
  children,
  formData,
  handleChange,
  handleImageChange,
  isIndianCompany, 
}) => {
  const location = useLocation();
  const rowRef = useRef(null);
  const navigate = useNavigate();
  const tabs = [
    { path: `/ViewBasic/${id}`, label: "Basic Details" },
    { path: `/ViewBasic/${id}/bank`, label: "Bank & Payment" },
    { path: `/ViewBasic/${id}/documents`, label: "Documents" },
  ];

  return (
    <Container>
      <TopSection>

<ReusableHeader
  title="Employees"
  breadcrumbs={[ "Employees","View Employee"]}
  buttonText="SAVE"
  onButtonClick={handleSubmit}
  showBack
    onBack={() => navigate("/employee")}
/>
        <Header
          employee={formData}
          editable={true}
          onChange={handleChange}
          onImageChange={handleImageChange}
        
        />
        {/* <TabsRowContainer>
          <TabsRow ref={rowRef}>
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                style={{ textDecoration: "none" }}
              >
                <TabButton active={location.pathname === tab.path}>
                  {tab.label}
                </TabButton>
              </NavLink>
            ))}
          </TabsRow>
        </TabsRowContainer> */}
      </TopSection>

    <FormSection>{children}</FormSection>

    </Container>
  );
};

export default ViewBasicLayout;
