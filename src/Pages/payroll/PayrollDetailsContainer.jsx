import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPayrollDetail } from "../../Redux/payrollSlice";
import {
  Container,
  Header,
  Badge,
  PrintIcon,
  GridLayout,
  InfoTable,
  InfoRow,
  Label,
  Value,
  TableWrapper,
  Table,
  TableData,
  BackTitle,
  BackIcon,
  CompanyHeader,
  CompanyInfo,
  CompanyLogo,
  CompanyName,
  CompanyText,
} from "./PayrollDetailsView.styles";
import { BsPrinter } from "react-icons/bs";

const PayrollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { payrollDetail, loading, error } = useSelector(
    (state) => state.payroll
  );

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (id) dispatch(getPayrollDetail(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading payroll details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!payrollDetail) return <div>No payroll data found.</div>;

  const {
    employee_id,
    employee_name,
    department,
    designation,
    working_days,
    joining_date,
    days_present,
    gross_earnings,
    total_deductions,
    net_pay,
    account_number,
    status,
    earnings,
      deductions,
    lop_days,
    lop_amount,
    company,
    basic_salary,
    total_increment_amount,
    month,
    year,
  } = payrollDetail;

  const monthName = new Date(year, month - 1).toLocaleString("en-IN", {
    month: "long",
  });

 
const formatAmount = (value) => {
  return Number(value || 0).toFixed(2);
};
const formatDate = (date) => {
  if (!date) return "----";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
  return (
    <div>
      <Container>

        {/* ================= BACK ================= */}
        <Header>
          <BackTitle onClick={() => navigate("/PayrollList")}>
            <BackIcon className="no-print" />
          </BackTitle>
        </Header>

        {/* ================= COMPANY HEADER ================= */}
        {company && (
  <CompanyHeader>
    <CompanyInfo>
      <CompanyName>{company.name}</CompanyName>
      <CompanyText>{company.address}</CompanyText>
      <CompanyText>{company.email}</CompanyText>
      <CompanyText>{company.contact_number}</CompanyText>
    </CompanyInfo>

    {company.logo_url && (
      <CompanyLogo
        src={company.logo_url}
        alt="Company Logo"
      />
    )}
  </CompanyHeader>
)}

        {/* ================= PAYSLIP TITLE ================= */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h2 style={{ margin: 0 }}>
            Payslip – {monthName} {year}
          </h2>
          
        </div>

        {/* ================= EMPLOYEE INFO ================= */}
        <GridLayout>
          <InfoTable>
            <InfoRow>
              <Label>Employee Name</Label>
              <Value>{employee_name}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Department</Label>
              <Value>{department}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Account Number</Label>
              <Value>{account_number}</Value>
            </InfoRow>
          </InfoTable>

          <InfoTable>
            <InfoRow>
              <Label>Employee ID</Label>
              <Value>{employee_id}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Designation</Label>
              <Value>{designation}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Joining Date</Label>
              <Value>{formatDate(joining_date)}</Value>
            </InfoRow>
          </InfoTable>
        </GridLayout>

        {/* ================= EARNINGS & WORK SUMMARY ================= */}
        <GridLayout>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Earnings</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData><strong>Total Salary</strong></TableData>
                  <TableData><strong>{formatAmount(basic_salary)}</strong></TableData>
                </tr>

                <tr>
                  <TableData>Increment</TableData>
                  <TableData>{formatAmount(total_increment_amount)}</TableData>
                </tr>

                {earnings?.map((item, index) => (
                  <tr key={index}>
                    <TableData>{item.label}</TableData>
                    <TableData>{formatAmount(item.amount)}</TableData>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>


          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Work Summary</th>
                  <th>Days / Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>Total Working Days</TableData>
                  <TableData>{working_days} Days</TableData>
                </tr>
                <tr>
                  <TableData>No. of Days Paid</TableData>
                  <TableData>{days_present} Days</TableData>
                </tr>
                <tr>
                  <TableData>Loss of Pay</TableData>
                  <TableData>
                    {formatAmount(lop_amount)}
                    {lop_days > 0 &&
                      ` (${lop_days} day${lop_days > 1 ? "s" : ""})`}
                  </TableData>
                </tr>
              </tbody>
            </Table>
          </TableWrapper>

          <TableWrapper>
  <Table>
    <thead>
      <tr>
        <th>Deduction Breakdown</th>
        <th>Amount</th>
      </tr>
    </thead>

    <tbody>
      {deductions?.map((item, index) => (
        <tr key={index}>
          <TableData>{item.label}</TableData>
          <TableData>
            {formatAmount(item.value)}
          </TableData>
        </tr>
      ))}

      <tr>
        <TableData>
          <strong>Total Deductions</strong>
        </TableData>
        <TableData>
          <strong>
            {formatAmount(total_deductions)}
          </strong>
        </TableData>
      </tr>
    </tbody>
  </Table>
</TableWrapper>
        {/* </GridLayout> */}

        {/* ================= PAY SUMMARY ================= */}
        {/* <GridLayout> */}
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Pay Summary</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>Gross Pay</TableData>
                  <TableData>{formatAmount(gross_earnings)}</TableData>
                </tr>
                <tr>
                  <TableData>Deductions</TableData>
                  <TableData>{formatAmount(total_deductions)}</TableData>
                </tr>
                <tr className="net-pay">
                  <TableData><strong>Net Pay</strong></TableData>
                  <TableData><strong>{formatAmount(net_pay)}</strong></TableData>
                </tr>
              </tbody>
            </Table>
          </TableWrapper>
        </GridLayout>

        {/* ================= STATUS + PRINT ================= */}
        <div
          className="no-print"
          style={{
            position: "fixed",
            top: "20px",
            right: "40px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            background: "#ffffff",
            padding: "10px 15px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {/* <Badge>{status || "Unpaid"}</Badge> */}
          <PrintIcon onClick={handlePrint}>
            <BsPrinter />
          </PrintIcon>
        </div>

      </Container>

      {/* ================= PRINT STYLES ================= */}
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .no-print {
              display: none !important;
            }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
              table-layout: fixed !important;
            }

            .net-pay td {
              font-weight: bold;
              border: 1px solid #000;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PayrollDetails;