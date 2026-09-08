import React, { useState } from "react";
import {
  Wrapper,
  HeaderRow,
  LeftHeader,
  Status,
  MailButton,
  TopSection,
  ProfileLeft,
  ProfileSection,
  Avatar,
  Info,
  Name,
  Role,
  RightCards,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel,
  IconRight,
  Tabs,
  TabButton,
  ContentSection,
  InfoGrid,
  InfoRow,
  InfoTitle,
  InfoValue,
  Title,
  DocumentsGrid,
  DocumentCard,
  DocumentPreview,
  DocumentName,
} from "./EmployeeDetails.styles";

import { PiUsersThreeLight } from "react-icons/pi";
import { CiAlarmOn } from "react-icons/ci";
import { TbReportSearch } from "react-icons/tb";
import { LuFileCheck } from "react-icons/lu";
import MailModal from "./MailModal";
import { HiUser } from "react-icons/hi2";

const EmployeeDetails = ({
  employee,
  documents = [],
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState("work");
  const [isMailOpen, setIsMailOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const formatDate = (date) => {
    if (!date) return "----";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "----";

    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", {
      month: "short",
    });
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  if (!employee) {
    return <p>Loading...</p>;
  }

  // =====================================================
  // Statistics
  // =====================================================

  const statsData = [
    {
      number: employee.pending_leave ?? "00",
      label: "Balance Leaves",
      icon: <PiUsersThreeLight size={22} />,
    },
    {
      number: employee.leave_taken ?? "00",
      label: "Leaves Taken",
      icon: <CiAlarmOn size={22} />,
    },
    {
      number: employee.projects?.ongoing_count ?? 0,
      label: "Ongoing Projects",
      icon: <TbReportSearch size={22} />,
    },
    {
      number: employee.projects?.completed_count ?? 0,
      label: "Completed Projects",
      icon: <LuFileCheck size={22} />,
    },
  ];

  // =====================================================
  // Work Information
  // =====================================================

  const workInfo = [
    {
      title: "Job Title :",
      value: employee.designation || "----",

      title2: "Username :",
      value2: employee.employee_id || "----",
    },

    {
      title: "Role :",
      value: employee.role || "----",

      title2: "Salary :",
      value2: employee.salary || "----",
    },

    {
      title: "Joining Date :",
      value: formatDate(employee.joining_date),

      title2: "Department :",
      value2: employee.department || "----",
    },

    {
      title: "Email Id :",
      value: employee.email || "----",

      title2: "",
      value2: "",
    },
  ];

  // =====================================================
  // Personal Information
  // =====================================================

  const personalInfo = [
    {
      title: "Date Of Birth :",
      value: formatDate(employee.dob),

      title2: "Contact Number :",
      value2: employee.phno || "----",
    },

    {
      title: "Aadhaar Number :",
      value: employee.aadar_number || "----",

      title2: "PAN Number :",
      value2: employee.pan_number || "----",
    },

    {
      title: "Account Number :",
      value: employee.account_number || "----",

      title2: "Passport Number :",
      value2: employee.passport_number || "----",
    },

    {
      title: "Address :",
      value: employee.address || "----",

      title2: "",
      value2: "",
    },
  ];

  // =====================================================
  // Documents Information
  // =====================================================

const documentsInfo = [
  {
    title: "Passport",
    url: documents?.passport_image1_url,
  },
  {
    title: "Passport",
    url: documents?.passport_image2_url,
  },
  {
    title: "Work Permit",
    url: documents?.work_permit_urls?.[0],
  },
  {
    title: "Contract",
    url: documents?.contract_urls?.[0],
  },
  {
    title: "Insurance",
    url: documents?.insurance_image_url,
  },
  {
    title: "Certificate",
    url: documents?.certificate_urls?.[0],
  },
];
  return (
    <Wrapper>

      {/* =====================================================
          Header
      ===================================================== */}

      <HeaderRow>
        <LeftHeader>
          <h3>Profile</h3>

          <Status>
            <span
              className="dot"
              style={{
                backgroundColor: employee.is_active
                  ? "green"
                  : "red",
              }}
            />

            {employee.is_active ? "Active" : "Inactive"}
          </Status>
        </LeftHeader>

        <MailButton
          onClick={() => setIsMailOpen(true)}
        >
          Send Mail
        </MailButton>
      </HeaderRow>

      {/* =====================================================
          Profile + Stats
      ===================================================== */}

      <TopSection>
        <ProfileLeft>
          <ProfileSection>
            <Avatar>
              {employee?.profile_pic ? (
                <img
                  src={employee.profile_pic}
                  alt={employee.name}
                />
              ) : (
                <HiUser size={55} />
              )}
            </Avatar>

            <Info>
              <Name>{employee.name}</Name>
              <Role>{employee.designation}</Role>
            </Info>
          </ProfileSection>
        </ProfileLeft>

        <RightCards>
          <StatsGrid>
            {statsData.map((item, index) => (
              <StatCard key={index}>
                <StatNumber>
                  {item.number}
                </StatNumber>

                <StatLabel>
                  {item.label}
                </StatLabel>

                <IconRight>
                  {item.icon}
                </IconRight>
              </StatCard>
            ))}
          </StatsGrid>
        </RightCards>
      </TopSection>

      {/* =====================================================
          Tabs
      ===================================================== */}

   <Tabs>

  <TabButton
    active={activeTab === "work"}
    onClick={() => handleTabChange("work")}
  >
    Work Info
  </TabButton>

  <TabButton
    active={activeTab === "personal"}
    onClick={() => handleTabChange("personal")}
  >
    Personal Details
  </TabButton>

  <TabButton
    active={activeTab === "documents"}
    onClick={() => handleTabChange("documents")}
  >
    Documents
  </TabButton>

</Tabs>

      {/* =====================================================
          Tab Content
      ===================================================== */}

      <ContentSection>

        {/* =================================================
            WORK INFO
        ================================================= */}

        {activeTab === "work" && (
          <>
            <Title>Work Info</Title>

            <InfoGrid>
              {workInfo.map((row, index) => (
                <InfoRow key={index}>

                  <InfoTitle>
                    {row.title}
                  </InfoTitle>

                  <InfoValue>
                    {row.value}
                  </InfoValue>

                  {row.title2 && (
                    <>
                      <InfoTitle>
                        {row.title2}
                      </InfoTitle>

                      <InfoValue>
                        {row.value2}
                      </InfoValue>
                    </>
                  )}

                </InfoRow>
              ))}
            </InfoGrid>
          </>
        )}

        {/* =================================================
            PERSONAL DETAILS
        ================================================= */}

        {activeTab === "personal" && (
          <>
            <Title>Personal Details</Title>

            <InfoGrid>
              {personalInfo.map((row, index) => (
                <InfoRow key={index}>

                  <InfoTitle>
                    {row.title}
                  </InfoTitle>

                  <InfoValue>
                    {row.value}
                  </InfoValue>

                  {row.title2 && (
                    <>
                      <InfoTitle>
                        {row.title2}
                      </InfoTitle>

                      <InfoValue>
                        {row.value2}
                      </InfoValue>
                    </>
                  )}

                </InfoRow>
              ))}
            </InfoGrid>
          </>
        )}

        {/* =================================================
            DOCUMENTS
        ================================================= */}
{activeTab === "documents" && (
  <>
    <Title>Documents</Title>

    <DocumentsGrid>
      {documentsInfo
        .filter((doc) => doc.url)
        .map((doc, index) => (
          <DocumentCard key={index}>
            <DocumentPreview
              src={doc.url}
              alt={doc.title}
              onClick={() => window.open(doc.url, "_blank")}
            />

            <DocumentName>
              {doc.title}
            </DocumentName>
          </DocumentCard>
        ))}
    </DocumentsGrid>

    {documentsInfo.filter((doc) => doc.url).length === 0 && (
      <p>No documents available.</p>
    )}
  </>
)}

      </ContentSection>

      {/* =====================================================
          Mail Modal
      ===================================================== */}

      <MailModal
        isOpen={isMailOpen}
        onClose={() => setIsMailOpen(false)}
        employee={employee}
      />

    </Wrapper>
  );
};

export default EmployeeDetails;