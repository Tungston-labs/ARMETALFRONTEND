import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Download,
  FileText,
  PlusCircle,
  Phone,
  Mail,
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

import { getVendorOverview } from "../../../../../Redux/finance/purchases/Vendordetailslice";

const show = (value) => value || "—";

// "50000.00" + "AED" -> "AED 50,000.00"
const formatMoney = (value, currency) => {
  if (value == null || value === "") return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  const amount = n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? `${currency} ${amount}` : amount;
};

// Turns a DRF error ({ detail } | { field: ["msg"] } | string) into text
const formatError = (error) => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error.detail) return error.detail;
  return Object.entries(error)
    .map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(", ") : m}`)
    .join(" | ");
};

const VendorOverview = () => {
  const dispatch = useDispatch();

  // Works with /:id or /:vendorId in the route
  const params = useParams();
  const id = params.id ?? params.vendorId;

  // Safe even if the reducer isn't registered yet
  const {
    vendor = null,
    overviewLoading = false,
    error = null,
  } = useSelector((state) => state.vendorDetail) || {};

  const [documents, setDocuments] = useState([]);
  const fileInputRef = useRef(null);

  // Keep every object URL we create so it can be released on unmount
  const objectUrls = useRef([]);
  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    if (id) dispatch(getVendorOverview(id));
  }, [dispatch, id]);

  // Temporary: remove once the data shows up
  // console.log({ params, id, vendor, overviewLoading, error });

  // Only show data for the vendor in the URL (numeric id or code like VEN00001),
  // so the previous vendor never flashes while the new one loads
  const current =
    vendor &&
    (String(vendor.id) === String(id) || String(vendor.vendor_id) === String(id))
      ? vendor
      : null;

  if (!id) {
    return (
      <p style={{ padding: 24, color: "#B00020" }}>
        No vendor id in the URL. Check the route param name (
        {Object.keys(params).join(", ") || "none"}).
      </p>
    );
  }

  if (overviewLoading && !current) {
    return <p style={{ padding: 24 }}>Loading vendor...</p>;
  }

  if (error && !current) {
    return (
      <p style={{ padding: 24, color: "#B00020" }}>
        {formatError(error) || "Failed to load vendor."}
      </p>
    );
  }

  if (!current) {
    return <p style={{ padding: 24 }}>No vendor data found (id: {String(id)}).</p>;
  }

  const companyAddress = [
    current.city,
    current.state,
    current.country,
    current.postal,
  ]
    .filter(Boolean)
    .join(", ");

  const contacts = [
    { icon: Phone, label: "Phone Number", value: show(current.phno) },
    { icon: Mail, label: "Admin Email", value: show(current.admin_email) },
    { icon: Mail, label: "Financial Email", value: show(current.financial_email) },
    { icon: Mail, label: "Technical Email", value: show(current.technical_email) },
  ];

  const companyInfo = [
    { label: "Vendor ID", value: show(current.vendor_id) },
    { label: "Vendor Type", value: show(current.vendor_type_display) },
    { label: "CR Number", value: show(current.cr_number) },
    { label: "VAT Number", value: show(current.vat_registration_number) },
    {
      label: "Payment Term",
      value: show(current.payment_term_display || current.payment_term),
    },
    {
      label: "Credit Limit",
      value: formatMoney(current.credit_limit, current.currency),
    },
    {
      label: "Opening Balance",
      value: formatMoney(current.opening_balance, current.currency),
    },
    { label: "Status", value: show(current.client_status_display) },
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
    e.target.value = "";
  };

  return (
    <HeaderWrapper>
      <TopSection>
        <CompanyCard>
          <CompanyDetails>
            <CompanyName>{show(current.name)}</CompanyName>
            <CompanyText>{show(current.billing_address)}</CompanyText>
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
        {companyInfo.map((item) => (
          <InfoItem key={item.label}>
            <InfoLabel>
              <BadgeCheck size={14} strokeWidth={1.5} />
              <span>{item.label}</span>
            </InfoLabel>
            <InfoValue>{item.value}</InfoValue>
          </InfoItem>
        ))}
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