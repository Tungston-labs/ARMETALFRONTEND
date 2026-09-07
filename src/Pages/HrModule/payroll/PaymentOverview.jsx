import React, { useState } from 'react';
import {
  SectionTitle,
  PlanCard,
  PlanIcon,
  PlanDetails,
  PlanPrice,
  PaymentTable,
  TableHead,
  TableRow,
  TableData,
  StatusSelect,
  IconButton,
  ButtonGroup,
  CancelButton,
  SaveButton
} from './PaymentOverview.styles';



const PaymentOverview = () => {
  const [paymentData, setPaymentData] = useState(initialData);

  const handleStatusChange = (index, newStatus) => {
    const updatedData = [...paymentData];
    updatedData[index].status = newStatus;
    setPaymentData(updatedData);
  };

  const formatDate = (dateStr) => {
  if (!dateStr) return "---";

  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr; // fallback to original if invalid

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
  return (
    <>
      <SectionTitle>Payment Overview</SectionTitle>

      <PlanCard>
        <div
          style={{
            background: "#182657",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "70px",
            borderRadius: "10px",
            height: "75px"
          }}
        >
          <PlanIcon>
            <img src="/images/plan.png" alt="Plan Icon" />
          </PlanIcon>
        </div>

        <PlanDetails>
          <h3>Enterprise plan</h3>
          <p>
            Pay a fixed $5 per employee.<br />
            Simple, transparent, and ideal for managing individual payroll with ease.
          </p>
        </PlanDetails>

        <PlanPrice>$5</PlanPrice>
      </PlanCard>

      <PaymentTable>
        <thead>
          <tr>
            <TableHead>Month</TableHead>
            <TableHead>Paid date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Import</TableHead>
          </tr>
        </thead>
        <tbody>
          {paymentData.map((entry, index) => (
            <TableRow key={index} status={entry.status}>
              <TableData>{entry.month}</TableData>
           <TableData>{formatDate(entry.date)} 📅</TableData>
              <TableData><strong>{entry.amount}</strong></TableData>
              <TableData>
                <StatusSelect
                  value={entry.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  <option value="Paid">Paid</option>
                  <option value="Un-Paid">Un-Paid</option>
                </StatusSelect>
              </TableData>
              <TableData>
                <IconButton title="Download">⬇️</IconButton>
                <IconButton title="Import">▶️</IconButton>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </PaymentTable>

      <ButtonGroup>
        <CancelButton>Cancel</CancelButton>
        <SaveButton>Save</SaveButton>
      </ButtonGroup>
    </>
  );
};

export default PaymentOverview;
