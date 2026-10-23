import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import CompanyHeader from "../../../../../Components/Finance/sales/customer/CompanyHeader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  LayoutWrapper,
  ContentSection,
  DateRangeWrapper,
  DatePickerContainer,
  DateInput,
  DateSeparator,
} from "./CompanyLayout.styles";

import { getCustomerById } from "../../../../../Redux/finance/Sales/CustomerSlice";

/* =========================================================
   PAGE META  (set showDateFilter per page)
========================================================= */

const pageMeta = {
  overview:      { title: "Overview",     showAddButton: false, showDateFilter: false },
  quotations:    { title: "Quotations",   showAddButton: false, showDateFilter: true },
  orders:        { title: "Orders",       showAddButton: false, showDateFilter: true },
  invoices:      { title: "Invoices",     showAddButton: true,  buttonText: "+ Generate Invoice",    showDateFilter: true },
  payments:      { title: "Payments",     showAddButton: true,  buttonText: "+ Record Payment",      showDateFilter: true },
  ledger:        { title: "Ledger",       showAddButton: true,  buttonText: "+ New Journal Entry",   showDateFilter: true },
  "credit-notes":{ title: "Credit Notes", showAddButton: false, showDateFilter: false },
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const CompanyLayout = () => {
  const { customerId } = useParams();

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedCustomer } = useSelector((state) => state.customer);

  /* ---------- DATE STATES (empty by default) ---------- */

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
const toStr = (d) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    : "";

const toDate = (s) => (s ? new Date(`${s}T00:00:00`) : null);
  useEffect(() => {
    if (!customerId) return;
    dispatch(getCustomerById(customerId));
  }, [dispatch, customerId]);

  /* ---------- ACTIVE PAGE ---------- */

  const activeKey =
    Object.keys(pageMeta).find((key) =>
      location.pathname.endsWith(`/${key}`)
    ) || "overview";

  const { showAddButton, buttonText, showDateFilter } = pageMeta[activeKey];

  // clear the range when moving to a tab that has no date filter
  useEffect(() => {
    if (!showDateFilter) {
      setStartDate("");
      setEndDate("");
    }
  }, [showDateFilter, activeKey]);

  /* ---------- HEADER BUTTON CLICK ---------- */

  const handleHeaderButtonClick = () => {
    if (!customerId) return;

    if (activeKey === "invoices") {
      navigate(`/sales/invoices/add`);
      return;
    }

    if (activeKey === "payments") {
      // setShowPaymentModal(true);
      return;
    }

    if (activeKey === "ledger") {
      navigate(`/finance/ledger/create?customer_id=${customerId}`);
      return;
    }
  };

  /* ---------- DATE CHANGE ---------- */

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setStartDate("");
      return;
    }
    setStartDate(value);
    if (endDate && value > endDate) setEndDate(value);
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setEndDate("");
      return;
    }
    if (startDate && value < startDate) return;
    setEndDate(value);
  };

  /* ---------- OUTLET CONTEXT ---------- */

  // pages without the filter always get an empty range
  const activeStart = showDateFilter ? startDate : "";
  const activeEnd = showDateFilter ? endDate : "";

  const outletContext = {
    customerId,

    startDate: activeStart,
    endDate: activeEnd,

    formattedStartDate: formatDisplayDate(activeStart),
    formattedEndDate: formatDisplayDate(activeEnd),

    dateRange: {
      start_date: activeStart,
      end_date: activeEnd,
    },
  };

  /* ---------- RETURN ---------- */

  return (
    <LayoutWrapper>
      <ReusableHeader
        title={selectedCustomer?.customer_name || "Loading..."}
        subtitle={
          selectedCustomer
            ? `${selectedCustomer.customer_id || ""}${
                selectedCustomer.created_at
                  ? `, Created On: ${selectedCustomer.created_at}`
                  : ""
              }`
            : ""
        }
        badge={selectedCustomer?.status || "Active"}
        showBack
        onBack={() => navigate("/sales/customers")}
        showButton={showAddButton}
        buttonText={buttonText}
        onButtonClick={handleHeaderButtonClick}
      >
        {showDateFilter && (
          <DateRangeWrapper>
            <DatePickerContainer>
              <DateInput
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                max={endDate || undefined}
                aria-label="Start date"
              />

              <DateSeparator>-</DateSeparator>

              <DateInput
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate || undefined}
                aria-label="End date"
              />
            </DatePickerContainer>
          </DateRangeWrapper>
        )}
      </ReusableHeader>

      <CompanyHeader />

      <ContentSection>
        <Outlet context={outletContext} />
      </ContentSection>
    </LayoutWrapper>
  );
};

export default CompanyLayout;