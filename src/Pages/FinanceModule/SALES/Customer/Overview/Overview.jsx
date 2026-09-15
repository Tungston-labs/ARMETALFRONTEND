
import React from "react";
import {
  UserRound,
  Mail,
  BadgeCheck,
  Download,
  FileText,
  PlusCircle,
} from "lucide-react";

import {
  HeaderWrapper,
  TopSection,
  CompanyCard,
  CompanyDetails,
  CompanyName,
  CompanyText,
  ContactCard,
  ContactItem,
  ContactTitle,
  ContactValue,
  InfoCard,
  InfoItem,
  InfoLabel,
  InfoValue,
  DocumentsCard,
  DocumentsTitle,
  DocumentsContent,
  DocumentsList,
  DocumentItem,
  DocumentIcon,
  DocumentDetails,
  DocumentName,
  DocumentSize,
  DownloadButton,
  UploadButton,
} from "./Overview.styles";

const Overview = () => {
  /* =========================================================
     CONTACT DETAILS
  ========================================================= */

  const contacts = [
    {
      label: "Phone Number",
      value: "+966 50 123 4567",
      icon: UserRound,
    },
    {
      label: "Admin Contact",
      value: "info@riyadhtech.sa",
      icon: Mail,
    },
    {
      label: "Financial Contact",
      value: "info@riyadhtech.sa",
      icon: Mail,
    },
    {
      label: "Technical Contact",
      value: "info@riyadhtech.sa",
      icon: Mail,
    },
  ];

  /* =========================================================
     COMPANY INFORMATION
  ========================================================= */

  const companyInfo = [
    {
      label: "CR Number",
      value: "1010123456",
      icon: UserRound,
    },
    {
      label: "VAT Number",
      value: "300123456700003",
      icon: BadgeCheck,
    },
    {
      label: "Trade License Number",
      value: "2050123456",
      icon: BadgeCheck,
    },
    {
      label: "Currency",
      value: "SAR - Saudi Riyal",
      icon: BadgeCheck,
    },
    {
      label: "Credit Limit",
      value: "SAR 500,000.00",
      icon: BadgeCheck,
    },
    {
      label: "Payment Terms",
      value: "15 days",
      icon: BadgeCheck,
    },
    {
      label: "Opening Balance",
      value: "SAR 00.00",
      icon: BadgeCheck,
    },
  ];

  /* =========================================================
     DOCUMENTS
  ========================================================= */

  const documents = [
    {
      name: "CR Certificate",
      size: "245 KB",
    },
    {
      name: "VAT Certificate",
      size: "245 KB",
    },
    {
      name: "Trade License",
      size: "245 KB",
    },
    {
      name: "CR Certificate",
      size: "245 KB",
    },
    {
      name: "Company Profile",
      size: "245 KB",
    },
  ];

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <HeaderWrapper>

      {/* =====================================================
          COMPANY + CONTACT SECTION
      ===================================================== */}

      <TopSection>

        {/* ===================================================
            COMPANY
        =================================================== */}

        <CompanyCard>
          <CompanyDetails>

            <CompanyName>
              Nexora Tech Solutions
            </CompanyName>

            <CompanyText>
              Nexora Tech Solutions
            </CompanyText>

            <CompanyText>
              PO Box 12345, King Fahd Road
            </CompanyText>

            <CompanyText>
              Riyadh, Saudi Arabia
            </CompanyText>

          </CompanyDetails>

        </CompanyCard>


        {/* ===================================================
            CONTACTS
        =================================================== */}

        <ContactCard>

          {contacts.map((contact, index) => {

            const Icon = contact.icon;

            return (
              <ContactItem key={index}>

                <ContactTitle>

                  <Icon
                    size={15}
                    strokeWidth={1.5}
                  />

                  <span>
                    {contact.label}
                  </span>

                </ContactTitle>

                <ContactValue>
                  {contact.value}
                </ContactValue>

              </ContactItem>
            );
          })}

        </ContactCard>

      </TopSection>


      {/* =====================================================
          COMPANY INFORMATION
      ===================================================== */}

      <InfoCard>

        {companyInfo.map((item, index) => {

          const Icon = item.icon;

          return (
            <InfoItem key={index}>

              <InfoLabel>

                <Icon
                  size={14}
                  strokeWidth={1.5}
                />

                <span>
                  {item.label}
                </span>

              </InfoLabel>

              <InfoValue>
                {item.value}
              </InfoValue>

            </InfoItem>
          );
        })}

      </InfoCard>


      {/* =====================================================
          DOCUMENTS
      ===================================================== */}

      <DocumentsCard>

        <DocumentsTitle>
          Documents
        </DocumentsTitle>


        <DocumentsContent>

          <DocumentsList>

            {documents.map((document, index) => (

              <DocumentItem key={index}>

                <DocumentIcon>

                  <FileText size={19} />

                </DocumentIcon>


                <DocumentDetails>

                  <DocumentName>
                    {document.name}
                  </DocumentName>

                  <DocumentSize>
                    PDF · {document.size}
                  </DocumentSize>

                </DocumentDetails>


                <DownloadButton
                  type="button"
                  title="Download"
                >

                  <Download size={14} />

                </DownloadButton>

              </DocumentItem>

            ))}

          </DocumentsList>


          {/* =================================================
              UPLOAD DOCUMENT
          ================================================= */}

          <UploadButton
            type="button"
          >

            <span>
              Upload Document
            </span>

            <PlusCircle size={14} />

          </UploadButton>

        </DocumentsContent>

      </DocumentsCard>

    </HeaderWrapper>
  );
};

export default Overview;