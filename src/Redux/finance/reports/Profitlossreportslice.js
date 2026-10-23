import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { fetchProfitLossReport } from "../../../services/finance/reports/Profitlossservice";

// params example: { date_from: "2026-01-01", date_to: "2026-10-23" }
export const getProfitLossReport = createAsyncThunk(
  "profitLossReport/getProfitLossReport",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchProfitLossReport(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


const ZERO = "0.00";

const emptyKpis = {
  totalRevenue: ZERO,
  costOfGoodsSold: ZERO,
  grossProfit: ZERO,
  operatingExpenses: ZERO,
  totalExpenses: ZERO,
  netProfit: ZERO,
};

// Section with rows (revenue, COGS, operating expenses, other expenses)
const emptySection = {
  rows: [],
  total: ZERO,
  lastYearTotal: ZERO,
  variance: ZERO,
};

// Result line without rows (gross profit, net profit)
const emptyResult = {
  currentYear: ZERO,
  lastYear: ZERO,
  variance: ZERO,
};

const emptySections = {
  revenue: { ...emptySection },
  costOfGoodsSold: { ...emptySection },
  grossProfit: { ...emptyResult },
  operatingExpenses: { ...emptySection },
  otherExpenses: { ...emptySection },
  netProfit: { ...emptyResult },
};

const emptyPeriod = {
  dateFrom: null,
  dateTo: null,
  comparisonDateFrom: null,
  comparisonDateTo: null,
};

const initialState = {
  // Period echoed back by the API
  period: { ...emptyPeriod },

  currency: "SAR",

  // KPI cards
  kpis: { ...emptyKpis },

  // Table sections
  sections: { ...emptySections },

  loading: false,
  error: null,
};


// ---------- mappers (snake_case API -> camelCase store) ----------

const mapRow = (row = {}) => ({
  accountId: row.account_id ?? null,
  particular: row.particular || "",
  currentYear: row.current_year || ZERO,
  lastYear: row.last_year || ZERO,
  variance: row.variance || ZERO,
});

const mapSection = (section = {}) => ({
  rows: (section.rows || []).map(mapRow),
  total: section.total || ZERO,
  lastYearTotal: section.last_year_total || ZERO,
  variance: section.variance || ZERO,
});

const mapResult = (result = {}) => ({
  currentYear: result.current_year || ZERO,
  lastYear: result.last_year || ZERO,
  variance: result.variance || ZERO,
});


const profitLossReportSlice = createSlice({
  name: "profitLossReport",

  initialState,

  reducers: {

    clearProfitLossReport(state) {
      state.period = { ...emptyPeriod };
      state.currency = "SAR";
      state.kpis = { ...emptyKpis };
      state.sections = { ...emptySections };
    },

    clearProfitLossReportError(state) {
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    builder

      .addCase(getProfitLossReport.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(getProfitLossReport.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};
        const kpis = data.kpis || {};
        const sections = data.sections || {};

        state.period = {
          dateFrom: data.date_from || null,
          dateTo: data.date_to || null,
          comparisonDateFrom: data.comparison_date_from || null,
          comparisonDateTo: data.comparison_date_to || null,
        };

        state.currency = data.currency || "SAR";

        state.kpis = {
          totalRevenue: kpis.total_revenue || ZERO,
          costOfGoodsSold: kpis.cost_of_goods_sold || ZERO,
          grossProfit: kpis.gross_profit || ZERO,
          operatingExpenses: kpis.operating_expenses || ZERO,
          totalExpenses: kpis.total_expenses || ZERO,
          netProfit: kpis.net_profit || ZERO,
        };

        state.sections = {
          revenue: mapSection(sections.revenue),
          costOfGoodsSold: mapSection(sections.cost_of_goods_sold),
          grossProfit: mapResult(sections.gross_profit),
          operatingExpenses: mapSection(sections.operating_expenses),
          otherExpenses: mapSection(sections.other_expenses),
          netProfit: mapResult(sections.net_profit),
        };

      })


      .addCase(getProfitLossReport.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load profit & loss report";

      });

  },
});


export const {
  clearProfitLossReport,
  clearProfitLossReportError,
} = profitLossReportSlice.actions;


export default profitLossReportSlice.reducer;