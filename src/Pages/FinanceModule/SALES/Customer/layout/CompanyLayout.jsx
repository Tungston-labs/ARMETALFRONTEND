import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import CompanyHeader from "../../../../../Components/Finance/sales/customer/CompanyHeader";

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
   PAGE META
========================================================= */

const pageMeta = {
  overview: {
    title: "Overview",
    showAddButton: false,
  },

  quotations: {
    title: "Quotations",
    showAddButton: false,
  },

  orders: {
    title: "Orders",
    showAddButton: false,
  },

  invoices: {
    title: "Invoices",
    showAddButton: true,
    buttonText: "+ Generate Invoice",
  },

  payments: {
    title: "Payments",
    showAddButton: true,
    buttonText: "+ Record Payment",
  },

  ledger: {
    title: "Ledger",
    showAddButton: true,
    buttonText: "+ New Journal Entry",
  },

  "credit-notes": {
    title: "Credit Notes",
    showAddButton: false,
  },
};

/* =========================================================
   GET CURRENT MONTH RANGE
========================================================= */

const getCurrentMonthRange = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return {
    start: formatDate(firstDay),
    end: formatDate(lastDay),
  };
};

/* =========================================================
   FORMAT DATE FOR DISPLAY
   2026-09-01 -> 01/09/2026
========================================================= */

const formatDisplayDate = (dateString) => {
  if (!dateString) {
    return "";
  }

  const [year, month, day] = dateString.split("-");

  return `${day}/${month}/${year}`;
};

/* =========================================================
   COMPANY LAYOUT
========================================================= */

const CompanyLayout = () => {
  const { customerId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  /* =========================================================
     CUSTOMER
  ========================================================= */

  const { selectedCustomer } = useSelector(
    (state) => state.customer
  );

  /* =========================================================
     CURRENT MONTH
  ========================================================= */

  const currentMonth = getCurrentMonthRange();

  /* =========================================================
     DATE STATES
  ========================================================= */

  const [startDate, setStartDate] = useState(
    currentMonth.start
  );

  const [endDate, setEndDate] = useState(
    currentMonth.end
  );

  /* =========================================================
     GET CUSTOMER BY ID
  ========================================================= */

  useEffect(() => {
    if (!customerId) {
      return;
    }

    dispatch(getCustomerById(customerId));
  }, [dispatch, customerId]);

  /* =========================================================
     ACTIVE PAGE
  ========================================================= */

  const activeKey =
    Object.keys(pageMeta).find((key) =>
      location.pathname.endsWith(`/${key}`)
    ) || "overview";

  const {
    title,
    showAddButton,
    buttonText,
  } = pageMeta[activeKey];

  /* =========================================================
     START DATE CHANGE
  ========================================================= */

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

  /* =========================================================
     END DATE CHANGE
  ========================================================= */

  const handleEndDateChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setEndDate("");
      return;
    }

    if (startDate && value < startDate) {
      return;
    }

    setEndDate(value);
  };

  /* =========================================================
     OUTLET CONTEXT
  ========================================================= */

  const outletContext = {
    customerId,

    startDate,
    endDate,

    formattedStartDate: formatDisplayDate(startDate),
    formattedEndDate: formatDisplayDate(endDate),

    dateRange: {
      start_date: startDate,
      end_date: endDate,
    },
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <LayoutWrapper>

      {/* =====================================================
          CUSTOMER PAGE HEADER
      ===================================================== */}

      <ReusableHeader
        title={
          selectedCustomer?.customer_name ||
          "Loading..."
        }

        subtitle={
          selectedCustomer
            ? `${selectedCustomer.customer_id || ""}${
                selectedCustomer.created_at
                  ? `, Created On: ${selectedCustomer.created_at}`
                  : ""
              }`
            : ""
        }

        badge={
          selectedCustomer?.status || "Active"
        }

        showBack
  onBack={() => navigate("/sales/customers")}
        showButton={showAddButton}

        buttonText={buttonText}
      >

        {/* ===================================================
            DATE RANGE
        =================================================== */}

        <DateRangeWrapper>

          <DatePickerContainer>

            {/* START DATE */}

            <DateInput
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              max={endDate || undefined}
              aria-label="Start date"
            />

            {/* SEPARATOR */}

            <DateSeparator>
              -
            </DateSeparator>

            {/* END DATE */}

            <DateInput
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate || undefined}
              aria-label="End date"
            />

          </DatePickerContainer>

        </DateRangeWrapper>

      </ReusableHeader>

      {/* =====================================================
          CUSTOMER HEADER
      ===================================================== */}

      <CompanyHeader />

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <ContentSection>

        <Outlet
          context={outletContext}
        />

      </ContentSection>

    </LayoutWrapper>
  );
};

export default CompanyLayout;