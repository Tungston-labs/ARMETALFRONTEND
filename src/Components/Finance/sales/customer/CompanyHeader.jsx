import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  BadgeCheck,
  Download,
  Plus,
  FileText,
} from "lucide-react";

import {
  HeaderWrapper,
  Tabs,
  Tab,
  TopSection,
  CompanyCard,
  CompanyLogo,
  CompanyInfo,
  ContactCard,
  ContactItem,
  ContactIcon,
  ContactContent,
  ContactLabel,
  ContactValue,
  DetailsCard,
  DetailItem,
  DetailLabel,
  DetailValue,
  DocumentsCard,
  DocumentsTitle,
  DocumentsList,
  DocumentBox,
  PdfIcon,
  DocumentInfo,
  DocumentName,
  DocumentSize,
  DocumentAction,
  UploadButton,
} from "./CompanyHeader.styles";

const tabs = [
  {
    label: "Overview",
    path: "overview",
  },
  {
    label: "Quotations",
    path: "quotations",
  },
  {
    label: "Orders",
    path: "orders",
  },
  {
    label: "Invoices",
    path: "invoices",
  },
  {
    label: "Payments",
    path: "payments",
  },
  {
    label: "Ledger",
    path: "ledger",
  },
  {
    label: "Credit Notes",
    path: "credit-notes",
  },
];

const contacts = [
  {
    label: "Phone Number",
    value: "+966 50 123 4567",
    icon: <UserRound size={16} />,
  },
  {
    label: "Admin Contact",
    value: "info@riyadhtech.sa",
    icon: <Mail size={16} />,
  },
  {
    label: "Financial Contact",
    value: "info@riyadhtech.sa",
    icon: <Mail size={16} />,
  },
  {
    label: "Technical Contact",
    value: "info@riyadhtech.sa",
    icon: <Mail size={16} />,
  },
];

const companyDetails = [
  {
    label: "CR Number",
    value: "1010123456",
    icon: <UserRound size={15} />,
  },
  {
    label: "VAT Number",
    value: "300123456700003",
    icon: <BadgeCheck size={15} />,
  },
  {
    label: "Trade License Number",
    value: "2050123456",
    icon: <BadgeCheck size={15} />,
  },
  {
    label: "Currency",
    value: "SAR - Saudi Riyal",
    icon: <BadgeCheck size={15} />,
  },
  {
    label: "Credit Limit",
    value: "SAR 500,000.00",
    icon: <BadgeCheck size={15} />,
  },
  {
    label: "Payment Terms",
    value: "15 days",
    icon: <BadgeCheck size={15} />,
  },
  {
    label: "Opening Balance",
    value: "SAR 0.00",
    icon: <BadgeCheck size={15} />,
  },
];

const documents = [
  "CR Certificate",
  "VAT Certificate",
  "Trade License",
  "CR Certificate",
  "Company Profile",
];

const CompanyHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (path) => {
    navigate(path);
  };

  const isActiveTab = (path) => {
    return location.pathname.endsWith(`/${path}`);
  };

  return (
    <HeaderWrapper>

      {/* ================= TABS ================= */}

      <Tabs>
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            $active={isActiveTab(tab.path)}
            onClick={() => handleTabClick(tab.path)}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>

      {/* ================= COMPANY + CONTACT ================= */}

      {/* <TopSection>

        <CompanyCard>
          <CompanyLogo>
            <img
              src="/images/company-logo.png"
              alt="Company Logo"
            />
          </CompanyLogo>

          <CompanyInfo>
            <h3>Nexora Tech Solutions</h3>

            <p>Nexora Tech Solutions</p>

            <span>
              PO Box 12345, King Fahd Road
            </span>

            <span>
              Riyadh, Saudi Arabia
            </span>
          </CompanyInfo>
        </CompanyCard>

        <ContactCard>
          {contacts.map((contact) => (
            <ContactItem key={contact.label}>

              <ContactIcon>
                {contact.icon}
              </ContactIcon>

              <ContactContent>
                <ContactLabel>
                  {contact.label}
                </ContactLabel>

                <ContactValue>
                  {contact.value}
                </ContactValue>
              </ContactContent>

            </ContactItem>
          ))}
        </ContactCard>

      </TopSection> */}

      {/* ================= COMPANY DETAILS ================= */}

      {/* <DetailsCard>
        {companyDetails.map((detail) => (
          <DetailItem key={detail.label}>

            <DetailLabel>
              {detail.icon}

              <span>
                {detail.label}
              </span>
            </DetailLabel>

            <DetailValue>
              {detail.value}
            </DetailValue>

          </DetailItem>
        ))}
      </DetailsCard> */}

      {/* ================= DOCUMENTS ================= */}

      {/* <DocumentsCard>

        <DocumentsTitle>
          Documents
        </DocumentsTitle>

        <DocumentsList>

          {documents.map((document, index) => (
            <DocumentBox key={`${document}-${index}`}>

              <PdfIcon>
                <FileText size={19} />
                <span>PDF</span>
              </PdfIcon>

              <DocumentInfo>
                <DocumentName>
                  {document}
                </DocumentName>

                <DocumentSize>
                  PDF · 245 KB
                </DocumentSize>
              </DocumentInfo>

              <DocumentAction>
                <Download size={15} />
              </DocumentAction>

            </DocumentBox>
          ))}

          <UploadButton>
            Upload Document
            <Plus size={15} />
          </UploadButton>

        </DocumentsList>

      </DocumentsCard> */}

    </HeaderWrapper>
  );
};

export default CompanyHeader;