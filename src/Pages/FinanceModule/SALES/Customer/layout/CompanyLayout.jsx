import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import CompanyHeader from "../../../../../Components/Finance/sales/customer/CompanyHeader";
import "react-datepicker/dist/react-datepicker.css";
import {
  LayoutWrapper,
  ContentSection,
  DateRangeWrapper,
  DatePickerContainer,
  DateInput,
  DateSeparator,
  ToggleSwitch,
  StatusError,
} from "./CompanyLayout.styles";

import {
  getCustomerById,
  updateCustomerPartial,
} from "../../../../../Redux/finance/Sales/CustomerSlice";

/* =========================================================
   PAGE META  (set showDateFilter per page)
========================================================= */

const pageMeta = {
  overview:      { title: "Overview",     showAddButton: false, showDateFilter: false },
  quotations:    { title: "Quotations",   showAddButton: false, showDateFilter: true, buttonText: "+ Generate Invoice", },
  orders:        { title: "Orders",       showAddButton: false, showDateFilter: true },
  invoices:      { title: "Invoices",     showAddButton: true,   showDateFilter: true },
  payments:      { title: "Payments",     showAddButton: true,   showDateFilter: true },
  ledger:        { title: "Ledger",       showAddButton: true,   showDateFilter: true },
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

  /* ---------- STATUS TOGGLE STATE ---------- */

  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (!customerId) return;
    dispatch(getCustomerById(customerId));
  }, [dispatch, customerId]);

  /* ---------- CUSTOMER STATUS (Active = green, Inactive = red) ---------- */

  const clientStatus = selectedCustomer?.client_status || "";

  const statusLabel =
    selectedCustomer?.client_status_name ||
    (clientStatus
      ? clientStatus.charAt(0).toUpperCase() + clientStatus.slice(1)
      : "");

  // success = green, danger = red, default = grey
  const badgeVariant =
    clientStatus === "active"
      ? "success"
      : clientStatus === "inactive"
      ? "danger"
      : "default";

  // the toggle only makes sense for active / inactive customers
  const showStatusToggle =
    clientStatus === "active" || clientStatus === "inactive";

  const handleStatusToggle = async () => {
    if (!customerId || statusSaving) return;

    const nextStatus = clientStatus === "active" ? "inactive" : "active";

    setStatusSaving(true);
    setStatusError("");

    const result = await dispatch(
      updateCustomerPartial({
        id: customerId,
        customerData: { client_status: nextStatus },
      })
    );

    if (result.error) {
      setStatusError("Could not update status.");
    } else {
      // reload so the badge and toggle reflect the saved status
      await dispatch(getCustomerById(customerId));
    }

    setStatusSaving(false);
  };

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
        badge={statusLabel}
        badgeVariant={badgeVariant}
        badgeAction={
          showStatusToggle && (
            <>
              <ToggleSwitch
                type="button"
                role="switch"
                aria-checked={clientStatus === "active"}
                aria-label="Toggle customer status"
                title={
                  clientStatus === "active"
                    ? "Click to mark as Inactive"
                    : "Click to mark as Active"
                }
                $on={clientStatus === "active"}
                disabled={statusSaving}
                onClick={handleStatusToggle}
              />
              {statusError && <StatusError>{statusError}</StatusError>}
            </>
          )
        }
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