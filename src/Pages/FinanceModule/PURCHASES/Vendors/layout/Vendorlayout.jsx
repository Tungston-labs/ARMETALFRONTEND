import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  LayoutWrapper,
  ContentSection,
  DateRangeWrapper,
  DatePickerContainer,
  DateInput,
  DateSeparator,
} from "./Vendorlayout.styles";

import VendorHeader from "../../../../../Components/Finance/purchase/vendor/VendorHeader";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import {
  getVendorOverview,
  clearVendorDetail,
} from "../../../../../Redux/finance/purchases/Vendordetailslice"; 

const pageMeta = {
  overview: { title: "Overview", showAddButton: false, showDateFilter: false },

  "purchase-orders": {
    title: "Purchase Orders",
    showAddButton: true,
    buttonText: "+ New Purchase Order",
    showDateFilter: true,
  },

  invoices: {
    title: "Bills",
    showAddButton: true,
    buttonText: "+ Create bills",
    showDateFilter: true,
  },

  payments: {
    title: "Payments",
    showAddButton: true,
    buttonText: "+ Record Payment",
    showDateFilter: true,
  },

  ledger: {
    title: "Ledger",
    showAddButton: true,
    buttonText: "+ New Journal Entry",
    showDateFilter: true,
  },

  "debit-notes": { title: "Debit Notes", showAddButton: false, showDateFilter: true },
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const VendorLayout = () => {
  const { vendorId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ---------- VENDOR (from API) ---------- */

  const { vendor: fetched, overviewLoading } =
    useSelector((state) => state.vendorDetail) || {};

  useEffect(() => {
    if (vendorId) dispatch(getVendorOverview(vendorId));
    return () => {
      dispatch(clearVendorDetail());
    };
  }, [dispatch, vendorId]);

  // ignore a stale vendor left over from a previously opened row
  const selectedVendor =
    fetched && String(fetched.id) === String(vendorId) ? fetched : null;

  /* ---------- DATE STATES (empty by default) ---------- */

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ---------- ACTIVE PAGE ---------- */

  const activeKey =
    Object.keys(pageMeta).find((key) =>
      location.pathname.endsWith(`/${key}`)
    ) || "overview";

  const { showAddButton, buttonText, showDateFilter } = pageMeta[activeKey];

  /* ---------- HEADER BUTTON CLICK ---------- */

  const handleHeaderButtonClick = () => {
    if (!vendorId) return;

    if (activeKey === "purchase-orders") {
      navigate(`/purchases/purchase-orders/add?vendor_id=${vendorId}`);
      return;
    }

    if (activeKey === "invoices") {
      // TODO: add a bills route, then update this path
      navigate(`/purchases/bills/add?vendor_id=${vendorId}`);
      return;
    }

    if (activeKey === "payments") {
      // Open your payment modal here
      return;
    }

    if (activeKey === "ledger") {
      navigate(`/finance/ledger/create?vendor_id=${vendorId}`);
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

    if (endDate && value > endDate) {
      setEndDate(value);
    }
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

  const outletContext = {
    vendorId,
    selectedVendor,

    startDate,
    endDate,

    formattedStartDate: formatDisplayDate(startDate),
    formattedEndDate: formatDisplayDate(endDate),

    // names the backend reads
    dateRange: {
      date_from: startDate,
      date_to: endDate,
    },
  };

  /* ---------- RETURN ---------- */

  return (
    <LayoutWrapper>
      <ReusableHeader
        title={
          selectedVendor?.name ||
          (overviewLoading ? "Loading..." : "Vendor not found")
        }
        subtitle={
          selectedVendor
            ? `${selectedVendor.vendor_id || ""}${
                selectedVendor.created_at
                  ? `, Created On: ${selectedVendor.created_at}`
                  : ""
              }`
            : ""
        }
        badge={selectedVendor?.client_status || "active"}
        showBack
        onBack={() => navigate("/purchase/vendors")}
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

      <VendorHeader />

      <ContentSection>
        <Outlet context={outletContext} />
      </ContentSection>
    </LayoutWrapper>
  );
};

export default VendorLayout;