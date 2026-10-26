import React from "react";
import { FiDownload, FiSend, FiSave, FiX } from "react-icons/fi";

import {
  InvoicePage,
  InvoiceContainer,
  InvoiceHeader,
  CompanySection,
  CompanyDetails,
  CompanyName,
  CompanyAddress,
  LogoSection,
  LogoIcon,
  LogoText,
  LogoMainText,
  LogoSubText,
  QuoteSection,
  QuoteLabel,
  QuoteNumber,
  Divider,
  InformationSection,
  InfoColumn,
  InfoLabel,
  InfoValue,
  PaymentStatus,
  TableWrapper,
  InvoiceTable,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  SummaryWrapper,
  SummarySection,
  SummaryRow,
  SummaryLabel,
  SummaryValue,
  DiscountValue,
  GrandTotalRow,
  GrandTotalLabel,
  GrandTotalValue,
  TermsSection,
  TermsTitle,
  TermsText,
  TermsNote,
  FooterSection,
  Website,
  ActionSection,
  ActionButton,
  CancelButton,
  DownloadButton,
  DraftButton,
  SentButton,
} from "./QuotationInvoice.styles";

const QuotationInvoice = ({
  quotation = {},
  items = [],
  onCancel,
  onDownload,
  onSaveDraft,
  onSend,
  error,
}) => {
  const displayItems = Array.isArray(items) ? items : [];
  const invoiceData = {
    companyName: quotation.companyName || "",
    companyBuilding: quotation.companyBuilding || "",
    companyAddress: quotation.companyAddress || "",
    phone: quotation.phone || "",
    email: quotation.email || "",

    quoteNumber: quotation.quoteNumber || "",

    issueDate: quotation.issueDate || "",
    dueDate: quotation.dueDate || "",

    invoiceNumber: quotation.invoiceNumber || "",

    paymentStatus: quotation.paymentStatus || "Draft",

    billToName: quotation.billToName || "",
    billToAddress: quotation.billToAddress || "",

    subTotal: quotation.subTotal || "SAR 0.00",
    gstTotal: quotation.gstTotal || "SAR 0.00",
    discount: quotation.discount || "SAR 0.00",
    roundOff: quotation.roundOff || "SAR 0.00",
    grandTotal: quotation.grandTotal || "SAR 0.00",

    website: quotation.website || "https://tungstonlabs.com/",
  };

  return (
    <InvoicePage>
      <InvoiceContainer>
        {/* ================= HEADER ================= */}
        <InvoiceHeader>
          <CompanySection>
            <CompanyDetails>
              <CompanyName>{invoiceData.companyName}</CompanyName>

              <CompanyAddress>
                {invoiceData.companyBuilding}
                <br />

                {invoiceData.companyAddress.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}

                {invoiceData.phone}
                <br />

                {invoiceData.email}
              </CompanyAddress>
            </CompanyDetails>
          </CompanySection>

          {/* LOGO */}
          <LogoSection>
            <LogoIcon>
              <span>★</span>
            </LogoIcon>

            <LogoText>
              <LogoMainText>
                <span>Tungston</span>
              </LogoMainText>

              <LogoSubText>Labs.</LogoSubText>
            </LogoText>
          </LogoSection>

          {/* QUOTE */}
          <QuoteSection>
            <QuoteLabel>Quote</QuoteLabel>

            <QuoteNumber>{invoiceData.quoteNumber}</QuoteNumber>
          </QuoteSection>
        </InvoiceHeader>

        <Divider />

        {/* ================= INFORMATION ================= */}
        <InformationSection>
          {/* Issue Date */}
          <InfoColumn>
            <InfoLabel>Issue Date</InfoLabel>

            <InfoValue>{invoiceData.issueDate}</InfoValue>

            <InfoLabel>Due Date</InfoLabel>

            <InfoValue>{invoiceData.dueDate}</InfoValue>
          </InfoColumn>

          {/* Quote Number */}
          <InfoColumn>
            <InfoLabel>Quote Number</InfoLabel>

            <InfoValue>{invoiceData.invoiceNumber}</InfoValue>

            <InfoLabel>Payment Status</InfoLabel>

            <PaymentStatus>{invoiceData.paymentStatus}</PaymentStatus>
          </InfoColumn>

          {/* Bill To */}
          <InfoColumn>
            <InfoLabel>Bill To:</InfoLabel>

            <InfoValue>
              <strong>{invoiceData.billToName}</strong>

              <br />

              {invoiceData.billToAddress.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </InfoValue>
          </InfoColumn>
        </InformationSection>

        <Divider />

        {/* ================= ITEMS TABLE ================= */}
        <TableWrapper>
          <InvoiceTable>
            <TableHead>
              <tr>
                <TableHeaderCell>SL NO</TableHeaderCell>

                <TableHeaderCell $left>PARTICULAR</TableHeaderCell>

                <TableHeaderCell>QTY</TableHeaderCell>

                <TableHeaderCell>HSN</TableHeaderCell>

                <TableHeaderCell>RATE</TableHeaderCell>

                <TableHeaderCell>GST(%)</TableHeaderCell>

                <TableHeaderCell>GST(₹)</TableHeaderCell>

                <TableHeaderCell>AMOUNT</TableHeaderCell>
              </tr>
            </TableHead>

            <TableBody>
              {displayItems.map((item, index) => (
                <TableRow key={item.id || item.slNo || index}>
                  <TableCell>{item.slNo}</TableCell>

                  <TableCell $left>{item.particular}</TableCell>

                  <TableCell>{item.qty}</TableCell>

                  <TableCell>{item.hsn}</TableCell>

                  <TableCell>{item.rate}</TableCell>

                  <TableCell>{item.gstPercent}</TableCell>

                  <TableCell>{item.gstAmount}</TableCell>

                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </InvoiceTable>
        </TableWrapper>

        {/* ================= SUMMARY ================= */}
        <SummaryWrapper>
          <SummarySection>
            <SummaryRow>
              <SummaryLabel>SUB TOTAL</SummaryLabel>

              <SummaryValue>{invoiceData.subTotal}</SummaryValue>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>GST TOTAL</SummaryLabel>

              <SummaryValue>{invoiceData.gstTotal}</SummaryValue>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>DISCOUNT</SummaryLabel>

              <DiscountValue>{invoiceData.discount}</DiscountValue>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>ROUND OFF</SummaryLabel>

              <SummaryValue>{invoiceData.roundOff}</SummaryValue>
            </SummaryRow>

            <GrandTotalRow>
              <GrandTotalLabel>GRAND AMOUNT</GrandTotalLabel>

              <GrandTotalValue>{invoiceData.grandTotal}</GrandTotalValue>
            </GrandTotalRow>
          </SummarySection>
        </SummaryWrapper>

        {/* ================= TERMS ================= */}
        <TermsSection>
          <TermsTitle>Terms & Conditions</TermsTitle>

          <TermsText>
            Above information is not an invoice and only an estimate of
            services.
          </TermsText>

          <TermsNote>PLEASE CONFIRM YOUR ACCEPTANCE OF THIS QUOTE</TermsNote>
        </TermsSection>

        {/* ================= ACTION BUTTONS ================= */}
        <ActionSection>
          {error && (
            <div role="alert">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </div>
          )}

          <CancelButton type="button" onClick={onCancel}>
            <FiX />
            Cancel
          </CancelButton>

          <DownloadButton type="button" onClick={onDownload}>
            <FiDownload />
            Download
          </DownloadButton>

          <DraftButton type="button" onClick={onSaveDraft}>
            <FiSave />
            Save Draft
          </DraftButton>

          <SentButton type="button" onClick={onSend}>
            <FiSend />
            Sent
          </SentButton>
        </ActionSection>

        {/* ================= FOOTER ================= */}
        <FooterSection>
          <Website>{invoiceData.website}</Website>
        </FooterSection>
      </InvoiceContainer>
    </InvoicePage>
  );
};

export default QuotationInvoice;
