import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";

import ReusableTable from "../../../Components/ReusableTable/ReusableTable";

import {
  Container,
  TableCard,
  TableHeader,
  Title,
  TitleUnderline,
} from "./PlanAndPricing.styles";

import { VscFiles } from "react-icons/vsc";

import {
  getPlanColumns,
  planCards,
  mapPlanData,
} from "./planData";

import StatsCards from "../../../Components/StatsCards/StatsCards";

import PlanCards from "./PlanCards";

import ReusablePagination from "../../../Components/Pagination/ReusablePagination";

import PlanModal from "./modal/PlanModal";

import {
  fetchSubscriptionPlans,
  fetchSubscriptionPlanSummary,
} from "../../../services/superAdminService";
import { FiGrid, FiList } from "react-icons/fi";
import { PiFingerprintDuotone } from "react-icons/pi";

function PlanAndPricing() {
  /* =====================================================
     STATE
  ===================================================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  const rowsPerPage = 20;

  const [view, setView] =
    useState("table");

  const [plans, setPlans] =
    useState([]);

  const [summary, setSummary] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState(null);

  const [mode, setMode] =
    useState("add");

  /* =====================================================
     ADD PLAN
  ===================================================== */

  const handleAddPlan = useCallback(() => {
    setMode("add");

    setSelectedPlan(null);

    setIsModalOpen(true);
  }, []);

  /* =====================================================
     EDIT PLAN
  ===================================================== */

  const handleEditPlan = useCallback(
    (plan) => {
      console.log(
        "Selected plan for edit:",
        plan
      );

      setMode("edit");

      setSelectedPlan(plan);

      setIsModalOpen(true);
    },
    []
  );

  /* =====================================================
     TABLE COLUMNS
  ===================================================== */

  const planColumns = useMemo(
    () => getPlanColumns(handleEditPlan),
    [handleEditPlan]
  );

  /* =====================================================
     LOAD PLANS
  ===================================================== */

  const loadPlans = useCallback(
    async () => {
      try {
        setLoading(true);

        const [
          planRes,
          summaryRes,
        ] = await Promise.all([
          fetchSubscriptionPlans(),
          fetchSubscriptionPlanSummary(),
        ]);

        console.log(
          "Plan response:",
          planRes
        );

        console.log(
          "Summary response:",
          summaryRes
        );

        /* =========================
           MAP PLANS
        ========================= */

        const mappedPlans =
          mapPlanData(planRes);

        setPlans(mappedPlans);

        /* =========================
           SUMMARY
        ========================= */

        setSummary(
          summaryRes || {}
        );

        /* =========================
           RESET PAGE
        ========================= */

        setCurrentPage(1);
      } catch (error) {
        console.error(
          "Failed to load plans:",
          error
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      plans.length / rowsPerPage
    )
  );

  const paginatedData = useMemo(() => {
    const start =
      (currentPage - 1) *
      rowsPerPage;

    return plans.slice(
      start,
      start + rowsPerPage
    );
  }, [
    plans,
    currentPage,
  ]);

  /* =====================================================
     STATS CARDS
  ===================================================== */

  const statsCards = useMemo(() => {
    return planCards.map(
      (card, index) => {
        let count = "₹0.00";

        /*
         * Total Plans
         */
        if (index === 0) {
          count =
            summary?.total_plans ?? 0;
        }

        /*
         * Monthly Revenue
         */
        if (index === 1) {
          count = `₹${Number(
            summary?.monthly_revenue ||
              0
          ).toFixed(2)}`;
        }

        /*
         * Lowest Plan
         */
        if (index === 2) {
          count = `₹${Number(
            summary?.lowest_plan_amount ||
              0
          ).toFixed(2)}`;
        }

        /*
         * Highest Plan
         */
        if (index === 3) {
          count = `₹${Number(
            summary?.highest_plan_amount ||
              0
          ).toFixed(2)}`;
        }

        return {
          ...card,
          count,
        };
      }
    );
  }, [summary]);

  /* =====================================================
     SAVE / UPDATE PLAN
  ===================================================== */

  const handleSavePlan = async () => {
    try {
      setLoading(true);

      /*
       * Reload both plans and summary
       * after Add/Edit.
       */

      const [
        planRes,
        summaryRes,
      ] = await Promise.all([
        fetchSubscriptionPlans(),
        fetchSubscriptionPlanSummary(),
      ]);

      const mappedPlans =
        mapPlanData(planRes);

      setPlans(mappedPlans);

      setSummary(
        summaryRes || {}
      );

      /*
       * Reset pagination
       */

      setCurrentPage(1);

      /*
       * Close modal
       */

      setIsModalOpen(false);

      setSelectedPlan(null);

      setMode("add");
    } catch (error) {
      console.error(
        "Failed to refresh plans:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setSelectedPlan(null);

    setMode("add");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <Container>
      {/* =================================================
          HEADER
      ================================================= */}

      <ReusableHeader
        title="Plans & Pricing"
        breadcrumbs={[
          "Plans & Pricing",
        ]}
        buttonText="+ ADD NEW PLAN"
        onButtonClick={
          handleAddPlan
        }
      />

      {/* =================================================
          STATS
      ================================================= */}

      <StatsCards
        cards={statsCards}
      />

      {/* =================================================
          TABLE / CARD CONTAINER
      ================================================= */}

      <TableCard>
       <TableHeader>
  <div className="header-content">
    <div className="title-section">
      <Title>Plans & Pricing</Title>
      <TitleUnderline />
    </div>

    <div className="view-switcher">
      <button
        type="button"
        className={view === "table" ? "active" : ""}
        onClick={() => setView("table")}
        title="Table View"
      >
        <FiList />
        <span>Table</span>
      </button>

      <button
        type="button"
        className={view === "card" ? "active" : ""}
        onClick={() => setView("card")}
        title="Card View"
      >
        <FiGrid />
        <span>Cards</span>
      </button>
    </div>
  </div>
</TableHeader>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign:
                "center",
              color: "#777",
            }}
          >
            Loading plans...
          </div>
        ) : plans.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign:
                "center",
              color: "#777",
            }}
          >
            No plans available.
          </div>
        ) : view === "table" ? (
          /* =================================================
             TABLE VIEW
          ================================================= */

          <ReusableTable
            columns={planColumns}
            data={paginatedData}
            currentPage={
              currentPage
            }
            setCurrentPage={
              setCurrentPage
            }
            totalPages={
              totalPages
            }
          />
        ) : (
          /* =================================================
             CARD VIEW
          ================================================= */

          <PlanCards
            plans={paginatedData}
            onEdit={
              handleEditPlan
            }
          />
        )}

        {/* =================================================
            PAGINATION
        ================================================= */}

        {plans.length > 0 && (
          <ReusablePagination
            currentPage={
              currentPage
            }
            totalPages={
              totalPages
            }
            totalRecords={plans.length}
            onPageChange={
              setCurrentPage
            }
          />
        )}
      </TableCard>

      {/* =================================================
          PLAN MODAL
      ================================================= */}

      <PlanModal
        open={isModalOpen}
        mode={mode}
        initialData={
          selectedPlan
        }
        onClose={
          handleCloseModal
        }
        onSubmit={
          handleSavePlan
        }
      />
    </Container>
  );
}

export default PlanAndPricing;