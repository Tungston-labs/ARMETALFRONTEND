import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  CompaniesSection,
  SectionHeader,
  SectionTitle,
  ViewAll,
  CompaniesGrid,
  CompanyCard,
  CompanyLogo,
  CompanyInfo,
  CompanyName,
  CompanyUsername,
} from "./RecentCompanies.Styles";

const RecentlyAddedCompanies = () => {
  const navigate = useNavigate();
  const { overview } = useSelector(
    (state) => state.superAdmin
  );

  const companies = (overview?.companies || []).slice(0, 5);

  return (
    <CompaniesSection>
      <SectionHeader>
        <SectionTitle>Recently Added Company Details</SectionTitle>

        <ViewAll onClick={() => navigate("/company")} style={{ cursor: "pointer" }}>
          View All Companies
        </ViewAll>
      </SectionHeader>

      <CompaniesGrid>
        {companies.length === 0 ? (
          <p>No companies found.</p>
        ) : (
          companies.map((company) => (
            <CompanyCard
              key={company.id}
              onClick={() => navigate(`/superadmin/view/${company.id}`)}
              style={{ cursor: "pointer" }}
            >
              <CompanyLogo
                src={company.logo_url || "/default-logo.png"}
                alt={`${company.name} logo`}
              />

              <CompanyInfo>
                <CompanyName>{company.name}</CompanyName>
                <CompanyUsername>{company.company_id}</CompanyUsername>
              </CompanyInfo>
            </CompanyCard>
          ))
        )}
      </CompaniesGrid>
    </CompaniesSection>
  );
};

export default RecentlyAddedCompanies;
