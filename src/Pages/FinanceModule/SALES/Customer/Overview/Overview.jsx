import React from "react";
import { Download, FileText, PlusCircle } from "lucide-react";
import { useCustomerOverview } from "./Usecustomeroverview";
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
  const {
    detailLoading,
    uploadLoading,
    error,
    customer,
    documents,
    contacts,
    companyInfo,
    companyAddress,
    fileInputRef,
    handleUploadClick,
    handleFileChange,
    resolveDocumentUrl,
  } = useCustomerOverview();


  if (detailLoading) {
    return <HeaderWrapper>Loading customer overview...</HeaderWrapper>;
  }

  if (error) {
    return <HeaderWrapper>Failed to load customer overview.</HeaderWrapper>;
  }

  return (
    <HeaderWrapper>
      <TopSection>
        <CompanyCard>
          <CompanyDetails>
            <CompanyName>
              {customer.company_name || customer.customer_name || "—"}
            </CompanyName>

            <CompanyText>{customer.customer_name || "—"}</CompanyText>

            <CompanyText>{customer.billing_address || "—"}</CompanyText>

            <CompanyText>{companyAddress}</CompanyText>
          </CompanyDetails>
        </CompanyCard>

        <ContactCard>
          {contacts.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <ContactItem key={index}>
                <ContactTitle>
                  <Icon size={15} strokeWidth={1.5} />
                  <span>{contact.label}</span>
                </ContactTitle>
                <ContactValue>{contact.value}</ContactValue>
              </ContactItem>
            );
          })}
        </ContactCard>
      </TopSection>

      <InfoCard>
        {companyInfo.map((item, index) => {
          const Icon = item.icon;
          return (
            <InfoItem key={index}>
              <InfoLabel>
                <Icon size={14} strokeWidth={1.5} />
                <span>{item.label}</span>
              </InfoLabel>
              <InfoValue>{item.value}</InfoValue>
            </InfoItem>
          );
        })}
      </InfoCard>

      <DocumentsCard>
        <DocumentsTitle>Documents</DocumentsTitle>

        <DocumentsContent>
          <DocumentsList>
            {documents.length === 0 ? (
              <DocumentItem>
                <DocumentDetails>
                  <DocumentName>No documents uploaded</DocumentName>
                </DocumentDetails>
              </DocumentItem>
            ) : (
              documents.map((document) => (
                <DocumentItem key={document.id}>
                  <DocumentIcon>
                    <FileText size={19} />
                  </DocumentIcon>
                  <DocumentDetails>
                    <DocumentName>{document.document_name}</DocumentName>
                    <DocumentSize>
                      {document.created_at
                        ? new Date(document.created_at).toLocaleDateString()
                        : ""}
                    </DocumentSize>
                  </DocumentDetails>
                  <DownloadButton
                    type="button"
                    title="Download"
                    onClick={() =>
                      window.open(resolveDocumentUrl(document.document), "_blank")
                    }
                  >
                    <Download size={14} />
                  </DownloadButton>
                </DocumentItem>
              ))
            )}
          </DocumentsList>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />

          <UploadButton
            type="button"
            onClick={handleUploadClick}
            disabled={uploadLoading}
          >
            <span>{uploadLoading ? "Uploading..." : "Upload Document"}</span>
            <PlusCircle size={14} />
          </UploadButton>
        </DocumentsContent>
      </DocumentsCard>
    </HeaderWrapper>
  );
};

export default Overview;