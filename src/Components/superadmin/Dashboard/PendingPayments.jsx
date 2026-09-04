import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PaymentContainer,
  PaymentHeader,
  PaymentTitle,
  PaymentCount,
  PaymentTableWrapper,
  PaymentTable,
  TableHeader,
  TableRow,
  TableCell,
} from "./PendingPayments.Styles";

import { getCompanyOverview } from "../../../Redux/superAdminSlice";

const PendingPaymentDetails = () => {
  const dispatch = useDispatch();

  const { overview, loading, error } = useSelector(
    (state) => state.superAdmin
  );

  useEffect(() => {
    dispatch(getCompanyOverview());
  }, [dispatch]);

  // API returns pending companies inside "unpaid_companies"
  const payments = overview?.unpaid_companies || [];

  return (
    <PaymentContainer>
      <PaymentHeader>
        <PaymentTitle>Pending Payment Details</PaymentTitle>

        <PaymentCount>
          {String(payments.length).padStart(2, "0")}
        </PaymentCount>
      </PaymentHeader>

      <PaymentTableWrapper>
        <PaymentTable>
          <thead>
            <tr>
              <TableHeader>Company name</TableHeader>
              <TableHeader>Address</TableHeader>
              <TableHeader>Company ID</TableHeader>
              <TableHeader>Contact details</TableHeader>
              <TableHeader>No of Employees</TableHeader>
              <TableHeader>Due Date</TableHeader>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <TableRow>
                <TableCell colSpan="6">
                  Loading pending payments...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan="6">
                  Failed to load pending payments.
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan="6">
                  No pending payments found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.name || "-"}
                  </TableCell>

                  <TableCell>
                    {item.address || "-"}
                  </TableCell>

                  <TableCell>
                    {item.company_id || "-"}
                  </TableCell>

                  <TableCell>
                    {item.contact_number || "-"}
                  </TableCell>

                  <TableCell>
                    {item.number_of_employees ?? 0}
                  </TableCell>

                  <TableCell>
                    {item.next_due_date || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </PaymentTable>
      </PaymentTableWrapper>
    </PaymentContainer>
  );
};

export default PendingPaymentDetails;
