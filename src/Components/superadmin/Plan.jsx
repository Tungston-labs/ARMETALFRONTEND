import React, { useState, useEffect, useRef } from 'react';
import { MdOutlineFileDownload } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { VscSend } from "react-icons/vsc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { generateInvoiceHTML } from '../../services/utlis/invoiceGenerator';
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
  ScrollWrapper,
  PlanIconWrapper,
  Toast,
  SpinningIcon,
} from './Plan.Styles';
import API from '../../services/api';
import { useReactToPrint } from "react-to-print";
import Invoice from "../../Pages/superAdmin/print/Invoice";

const PaymentOverview = ({ companyId: propCompanyId }) => {
  const { id: urlCompanyId } = useParams();
  const companyId = propCompanyId || urlCompanyId;
  const invoiceRef = useRef();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [company, setCompany] = useState(null);

  // Track loading per entry id, e.g. { 12: true }
  const [sendingIds, setSendingIds] = useState({});

  // Toast: { type: 'success' | 'error', message: string } or null
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (companyId) {
      fetchPaymentData(companyId);
    }
  }, [companyId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchPaymentData = async (id) => {
    try {
      const res = await API.get(`/subscriptions/${id}/`);
      setCompany(res.data.company || null);
      setPaymentData(res.data.subscriptions || []);
    } catch (error) {
      console.error(error);
      setCompany(null);
      setPaymentData([]);
    }
  };

  const handleStatusChange = async (subscriptionId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
    try {
      await API.patch(
        `/subscriptions/mark-paid/${subscriptionId}/`,
        { status: newStatus },
      );
      await fetchPaymentData(companyId);
    } catch (error) {
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: "Invoice",
  });

  const handleDownload = (entry) => {
    setSelectedInvoice(entry);

    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const handleSendEmail = async (entry) => {
    if (sendingIds[entry.id]) return;

    setSendingIds((prev) => ({ ...prev, [entry.id]: true }));

    try {
      await API.post("/invoice/send-email/", {
        entry: entry,
        company_id: entry.company,
      });

      setToast({ type: "success", message: "Invoice successfully submitted." });
    } catch (error) {
      setToast({ type: "error", message: "Failed to submit invoice. Please try again." });
    } finally {
      setSendingIds((prev) => {
        const next = { ...prev };
        delete next[entry.id];
        return next;
      });
    }
  };

  return (
    <>
      <SectionTitle>Payment Overview</SectionTitle>

      <PlanCard>
        <PlanIconWrapper>
          <PlanIcon>
            <img src="/images/plan.png" alt="Plan Icon" />
          </PlanIcon>
        </PlanIconWrapper>

        <PlanDetails>
          <h3>Enterprise plan</h3>
          <p>
            Pay a fixed amount per employee.<br />
            Simple, transparent, and ideal for managing individual payroll with ease.
          </p>
        </PlanDetails>

        <PlanPrice></PlanPrice>
      </PlanCard>


      <ScrollWrapper>
        <PaymentTable>
          <thead>
            <tr>
              <TableHead>Month</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Import</TableHead>
            </tr>
          </thead>
          <tbody>
            {paymentData.length === 0 ? (
              <TableRow>
                <TableData colSpan="5">No records found.</TableData>
              </TableRow>
            ) : (
              paymentData.map((entry) => {
                const isSending = !!sendingIds[entry.id];

                return (
                  <TableRow key={entry.id} status={entry.status}>
                    <TableData>{entry.month_display}</TableData>
                    <TableData>{entry.paid_date || '-'} <SlCalender /></TableData>
                    <TableData><strong>{entry.amount} </strong></TableData>
                    <TableData>
                      <button
                        onClick={() => handleStatusChange(entry.id, entry.status)}
                        style={{
                          backgroundColor: entry.status === 'paid' ? '#4CAF50' : '#f28b82',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          minWidth: '100px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {entry.status}
                      </button>
                    </TableData>
                    <TableData style={{ gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => handleDownload(entry)} title="Download" style={{ background: 'transparent', border: 'none', fontSize: '18px' }}>
                        <MdOutlineFileDownload />
                      </button>
                      <button
                        title="Import"
                        onClick={() => handleSendEmail(entry)}
                        disabled={isSending}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '18px',
                          cursor: isSending ? 'not-allowed' : 'pointer',
                          opacity: isSending ? 0.6 : 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSending ? <SpinningIcon as={AiOutlineLoading3Quarters} /> : <VscSend />}
                      </button>
                    </TableData>
                  </TableRow>
                );
              })
            )}
          </tbody>
        </PaymentTable>
      </ScrollWrapper>

      {toast && (
        <Toast $type={toast.type}>
          {toast.message}
        </Toast>
      )}

      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        <div ref={invoiceRef}>
          {selectedInvoice && (
            <Invoice
              entry={selectedInvoice}
              company={company}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentOverview;