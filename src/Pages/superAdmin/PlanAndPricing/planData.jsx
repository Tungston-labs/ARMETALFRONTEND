import React from "react";
import { FiEdit2 } from "react-icons/fi";
import {
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi";
import {
  MdArrowDownward,
  MdArrowUpward,
} from "react-icons/md";

export const getPlanColumns = (onEdit) => [
  /* =====================================================
     SL NO
  ===================================================== */

  {
    header: "Sl. No.",
    accessor: "slNo",
    sortable: false,

    render: (row) => {
      return row.slNo;
    },
  },

  /* =====================================================
     PLAN NAME
  ===================================================== */

  {
    header: "Plan Name",
    accessor: "plan",
  },

  /* =====================================================
     TIER
  ===================================================== */

  {
    header: "Tier",
    accessor: "tier",
  },

  /* =====================================================
     EMPLOYEE LIMIT
  ===================================================== */

  {
    header: "Employee Limit",
    accessor: "employeeLimit",
  },

  /* =====================================================
     PRICE
  ===================================================== */

  {
    header: "Price / Month",
    accessor: "priceText",
  },

  /* =====================================================
     EXTRA EMPLOYEE CHARGE
  ===================================================== */

  {
    header: "Extra Employee Charge",
    accessor: "extra",
  },

  /* =====================================================
     FEATURES
  ===================================================== */

  {
    header: "Features",
    accessor: "feature_count",
    sortable: false,

    render: (row) => {
      const count =
        row.feature_count || 0;

      return `${count} ${
        count === 1
          ? "Feature"
          : "Features"
      }`;
    },
  },

  /* =====================================================
     STATUS
  ===================================================== */

  {
    header: "Status",
    accessor: "status",

    render: (row) => (
      <span
        style={{
          color: row.is_active
            ? "#22C55E"
            : "#EF4444",
          fontWeight: 500,
        }}
      >
        {row.is_active
          ? "Active"
          : "Inactive"}
      </span>
    ),
  },

  /* =====================================================
     EDIT
  ===================================================== */

  {
    header: "Edit",
    accessor: "edit",
    sortable: false,

    render: (row) => (
      <button
        type="button"
        onClick={() =>
          onEdit?.(row.raw)
        }
        style={{
          border: "none",
          background: "#FFF2E1",
          color: "#E0822D",
          width: "34px",
          height: "34px",
          borderRadius: "7px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        title="Edit Plan"
      >
        <FiEdit2 size={16} />
      </button>
    ),
  },
];

/* =========================================================
   MAP PLAN DATA
========================================================= */

export const mapPlanData = (
  plans = []
) => {
  const planList = Array.isArray(plans)
    ? plans
    : plans?.results || [];

  return planList.map(
    (plan, index) => ({
      /* =========================
         ORIGINAL API DATA
      ========================= */

      id: plan.id,

      name: plan.name,

      plan_type:
        plan.plan_type,

      description:
        plan.description,

      base_price:
        plan.base_price,

      employee_limit:
        plan.employee_limit,

      extra_employee_price:
        plan.extra_employee_price,

      is_active:
        plan.is_active,

      status:
        plan.status ||
        (plan.is_active
          ? "Active"
          : "Inactive"),

      feature_count:
        plan.feature_count || 0,

      features:
        plan.features || [],

      created_at:
        plan.created_at,

      updated_at:
        plan.updated_at,

      /* =========================
         SERIAL NUMBER
      ========================= */

      slNo: index + 1,

      /* =========================
         TABLE DATA
      ========================= */

      plan: plan.name,

      tier: plan.plan_type,

      employeeLimit:
        plan.employee_limit,

      priceText:
        `₹${Number(
          plan.base_price || 0
        ).toFixed(2)}/-`,

      extra:
        `₹${Number(
          plan.extra_employee_price ||
            0
        ).toFixed(2)}/-`,

      /* =========================
         CARD DATA
      ========================= */

      price:
        plan.base_price,

      featureList:
        plan.features || [],

      /* =========================
         ORIGINAL OBJECT
      ========================= */

      raw: plan,
    })
  );
};

/* =========================================================
   STATS CARDS
========================================================= */

export const planCards = [
  {
    title: "Total Plans",
    count: "0",
    icon: <FiCreditCard />,
    backgroundColor: "#E8EDFF",
    iconColor: "#4F6EF7",
  },


  {
    title: "Lowest Plan",
    count: "₹0.00",
    icon: <MdArrowDownward />,
    backgroundColor: "#E7F8EC",
    iconColor: "#22C55E",
  },

  {
    title: "Highest Plan",
    count: "₹0.00",
    icon: <MdArrowUpward />,
    backgroundColor: "#FFE8E8",
    iconColor: "#EF4444",
  },
];