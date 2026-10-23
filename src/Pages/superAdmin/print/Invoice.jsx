import React from "react";
import {
  Page,
  Header,
  Logo,
  Divider,
  InvoiceTitle,
  TopSection,
  AddressSection,
  InvoiceSection,
  SectionTitle,
  AddressText,
  InvoiceText,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  GrandTotalRow,
  NotesSection,
  NotesTitle,
  NotesList,
  BankSection,
  Footer,
  Watermark,
  BottomLine,
  FooterCard,
  FooterIcon,
  FooterAddress,
  FooterText,
} from "./Invoice.styles";

import { IoMdCall } from "react-icons/io";
import { CiGlobe } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";

import logo from "/images/invoice.png";
import watermark from "/images/invoice.png";

const Invoice = ({ entry, company }) => {
  if (!entry || !company) return null;


  const invoiceItems = [
    {
      slno: 1,
      description: `HR App monthly subscription charge (${entry.month_display} ${entry.year}) (${company.employee_count} Employees)`,
      price: Number(company.amount_per_employee).toFixed(2),
      total: Number(entry.amount).toFixed(2),
    },
  ];
  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };
  return (
    <Page>
      <Watermark src={watermark} alt="watermark" />

      {/* Header */}
      <Header>
        <Logo src={logo} alt="logo" />
      </Header>

      <Divider />

      <InvoiceTitle>INVOICE</InvoiceTitle>

      {/* Customer + Invoice Details */}
      <TopSection>
        <AddressSection>
          <SectionTitle>TO:</SectionTitle>

          <AddressText>
            <strong>{company.name}</strong>
            <br />
            {company.address}
            <br />

            Phone : {company.contact_number}
            <br />
            Email : {company.email}
          </AddressText>
        </AddressSection>

        <InvoiceSection>
          <SectionTitle>Invoice Details</SectionTitle>

          <InvoiceText>
            Invoice No : INV-{entry.id}
            <br />
            Date : {formatDate(entry.paid_date || company.today)}
            <br />
            Status : {entry.status.toUpperCase()}
          </InvoiceText>
        </InvoiceSection>
      </TopSection>

      {/* Description */}
      <SectionTitle>DESCRIPTION</SectionTitle>

      <Table>
        <thead>
          <TableHead>
            <TableHeader style={{ width: "10%" }}>SL.NO</TableHeader>
            <TableHeader style={{ width: "55%" }}>DESCRIPTION</TableHeader>
            <TableHeader style={{ width: "17%" }}>BASE PRICE</TableHeader>
            <TableHeader style={{ width: "18%" }}>TOTAL</TableHeader>
          </TableHead>
        </thead>

        <tbody>
          {invoiceItems.map((item) => (
            <TableRow key={item.slno}>
              <TableCell>{item.slno}</TableCell>

              <TableCell style={{ textAlign: "left" }}>
                {item.description}
              </TableCell>

              <TableCell>{item.price}</TableCell>

              <TableCell>{item.total}</TableCell>
            </TableRow>
          ))}

          <GrandTotalRow>
            <TableCell colSpan={3}>GRAND TOTAL</TableCell>
            <TableCell>

              {Number(entry.amount).toFixed(2)}
            </TableCell>
          </GrandTotalRow>
        </tbody>
      </Table>

      {/* Notes */}
      <NotesSection>
        <NotesTitle>NOTES</NotesTitle>

        <NotesList>
          <li>Amounts received will not be reimbursed.</li>
          <li>Project will be taken forward after the payment.</li>
          <li>Payment terms due on receipt.</li>
        </NotesList>
      </NotesSection>

      {/* Bank Details */}
      <BankSection>
        <NotesTitle>BANK DETAILS</NotesTitle>

        <AddressText>
          Account holder: OFFRADAR TUNGSTON LABS
          <br />
          Account number: 14690200014910
          <br />
          IFSC: FDRL0001469
          <br />
          Bank address:
          <br />
          FEDERAL BANK KAKKANAD
        </AddressText>
      </BankSection>

      {/* Footer */}
      <Footer>
        <FooterCard>
          <FooterIcon>
            <IoMdCall />
          </FooterIcon>

          <FooterText>+91 9778377526</FooterText>
        </FooterCard>

        <FooterCard>
          <FooterIcon>
            <CiGlobe />
          </FooterIcon>

          <div>
            <FooterText>tungstonlabs.com</FooterText>
            <FooterText>info@tungstonlabs.com</FooterText>
          </div>
        </FooterCard>

        <FooterCard>
          <FooterIcon>
            <FaLocationDot />
          </FooterIcon>

          <FooterAddress>
            4th Floor, Ullampilly Building,
            <br />
            Seaport - Airport Rd,
            <br />
            Kakkanad, Kochi, Kerala 682030
          </FooterAddress>
        </FooterCard>
      </Footer>

      <BottomLine />
    </Page>
  );
};

export default Invoice;