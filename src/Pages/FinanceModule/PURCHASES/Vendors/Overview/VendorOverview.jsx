import React, { useEffect, useRef, useState } from "react";
import {
  Download,
  FileText,
  PlusCircle,
  Phone,
  Mail,
  Hash,
  Landmark,
  Receipt,
  Clock,
  Wallet,
  BadgeCheck,
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
} from "./VendorOverview.styles";

// Static sample data. Replace the values (or pass them in as props) as needed.
const CUSTOMER = {
  customer_id: "CUST-0001",
  company_name: "ABC Trading LLC",
  customer_name: "Ahmed Al Farsi",
  billing_address: "Building 12, King Fahd Road",
  city: "Riyadh",
  state: "Riyadh Province",
  country: "Saudi Arabia",
  postal: "12211",
  phone: "+966 50 123 4567",
  admin_email: "admin@abctrading.com",
  financial_email: "finance@abctrading.com",
  technical_email: "tech@abctrading.com",
  cr_number: "1010123456",
  vat_number: "300123456700003",
  payment_term: "30 Days",
  credit_limit: "SAR 50,000.00",
  status: "Active",
};

const show = (value) => value || "—";

const VendorOverview = () => {
  const [documents, setDocuments] = useState([]);
  const fileInputRef = useRef(null);

  // Keep every object URL we create so it can be released on unmount
  const objectUrls = useRef([]);
  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const customer = CUSTOMER;

  const companyAddress = [
    customer.city,
    customer.state,
    customer.country,
    customer.postal,
  ]
    .filter(Boolean)
    .join(", ");

  const contacts = [
    { icon: Phone, label: "Phone Number", value: show(customer.phone) },
    { icon: Mail, label: "Admin Email", value: show(customer.admin_email) },
    { icon: Mail, label: "Financial Email", value: show(customer.financial_email) },
    { icon: Mail, label: "Technical Email", value: show(customer.technical_email) },
  ];

  const companyInfo = [
    { icon: BadgeCheck, label: "Customer ID", value: show(customer.customer_id) },
    { icon: BadgeCheck, label: "CR Number", value: show(customer.cr_number) },
    { icon: BadgeCheck, label: "VAT Number", value: show(customer.vat_number) },
    { icon: BadgeCheck, label: "Payment Term", value: show(customer.payment_term) },
    { icon: BadgeCheck, label: "Credit Limit", value: show(customer.credit_limit) },
    { icon: BadgeCheck, label: "Status", value: show(customer.status) },
  ];

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const added = files.map((file, i) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);

      return {
        id: `${Date.now()}-${i}`,
        document_name: file.name,
        created_at: new Date().toISOString(),
        url,
      };
    });

    setDocuments((prev) => [...prev, ...added]);

    // Allow picking the same file again
    e.target.value = "";
  };

  return (
    <HeaderWrapper>
      <TopSection>
        <CompanyCard>
          <CompanyDetails>
            <CompanyName>
              {customer.company_name || customer.customer_name || "—"}
            </CompanyName>

            <CompanyText>{show(customer.customer_name)}</CompanyText>
            <CompanyText>{show(customer.billing_address)}</CompanyText>
            <CompanyText>{show(companyAddress)}</CompanyText>
          </CompanyDetails>
        </CompanyCard>

        <ContactCard>
          {contacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <ContactItem key={contact.label}>
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
        {companyInfo.map((item) => {
          const Icon = item.icon;
          return (
            <InfoItem key={item.label}>
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
              documents.map((doc) => (
                <DocumentItem key={doc.id}>
                  <DocumentIcon>
                    <FileText size={19} />
                  </DocumentIcon>

                  <DocumentDetails>
                    <DocumentName>{doc.document_name}</DocumentName>
                    <DocumentSize>
                      {new Date(doc.created_at).toLocaleDateString()}
                    </DocumentSize>
                  </DocumentDetails>

                  <DownloadButton
                    type="button"
                    title="Download"
                    onClick={() => window.open(doc.url, "_blank")}
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
            multiple
          />

          <UploadButton type="button" onClick={handleUploadClick}>
            <span>Upload Document</span>
            <PlusCircle size={14} />
          </UploadButton>
        </DocumentsContent>
      </DocumentsCard>
    </HeaderWrapper>
  );
};

export default VendorOverview;