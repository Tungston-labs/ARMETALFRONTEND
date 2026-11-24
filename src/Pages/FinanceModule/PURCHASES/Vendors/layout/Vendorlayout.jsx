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
  ToggleSwitch,
  StatusError,
} from "./Vendorlayout.styles";

import VendorHeader from "../../../../../Components/Finance/purchase/vendor/VendorHeader";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import {
  getVendorOverview,
  clearVendorDetail,
} from "../../../../../Redux/finance/purchases/Vendordetailslice";

// editVendor sends a PATCH to /finance/vendor/vendors/:id/
import { editVendor } from "../../../../../Redux/finance/purchases/vendorsSlice";

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

  /* ---------- STATUS (Active = green, Inactive = red) ---------- */

  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState("");

  const vendorStatus = (selectedVendor?.client_status || "").toLowerCase();

  const statusLabel =
    selectedVendor?.client_status_display ||
    (vendorStatus
      ? vendorStatus.charAt(0).toUpperCase() + vendorStatus.slice(1)
      : "");

  // success = green, danger = red, default = grey
  const badgeVariant =
    vendorStatus === "active"
      ? "success"
      : vendorStatus === "inactive"
      ? "danger"
      : "default";

  // the toggle only makes sense for active / inactive vendors
  const showStatusToggle =
    vendorStatus === "active" || vendorStatus === "inactive";

  const handleStatusToggle = async () => {
    if (!selectedVendor?.id || statusSaving) return;

    const nextStatus = vendorStatus === "active" ? "inactive" : "active";

    setStatusSaving(true);
    setStatusError("");

    const result = await dispatch(
      editVendor({
        id: selectedVendor.id,
        data: { client_status: nextStatus },
      })
    );

    if (result?.error) {
      setStatusError("Could not update status.");
    } else {
      // reload so the badge and toggle reflect the saved status
      await dispatch(getVendorOverview(vendorId));
    }

    setStatusSaving(false);
  };

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
        badge={statusLabel}
        badgeVariant={badgeVariant}
        badgeAction={
          showStatusToggle && (
            <>
              <ToggleSwitch
                type="button"
                role="switch"
                aria-checked={vendorStatus === "active"}
                aria-label="Toggle vendor status"
                title={
                  vendorStatus === "active"
                    ? "Click to mark as Inactive"
                    : "Click to mark as Active"
                }
                $on={vendorStatus === "active"}
                disabled={statusSaving}
                onClick={handleStatusToggle}
              />
              {statusError && <StatusError>{statusError}</StatusError>}
            </>
          )
        }
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