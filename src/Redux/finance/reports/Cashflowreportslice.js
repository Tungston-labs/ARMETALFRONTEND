import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { fetchCashFlowReport } from "../../../services/finance/reports/Cashflowreportservices";

// params example: { date_from: "2026-04-01", date_to: "2026-04-30", search: "Main", bank_account_id: 1 }
export const getCashFlowReport = createAsyncThunk(
  "cashFlowReport/getCashFlowReport",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchCashFlowReport(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


const ZERO = "0.00";

const emptySummary = {
  openingBalance: ZERO,
  cashInflow: ZERO,
  cashOutflow: ZERO,
  netCashFlow: ZERO,
  closingBalance: ZERO,
};

const makeEmptySection = (label) => ({
  label,
  rows: [],
  cashIn: ZERO,
  cashOut: ZERO,
  netAmount: ZERO,
});

const emptySections = {
  operating: makeEmptySection("Operating Activities"),
  investing: makeEmptySection("Investing Activities"),
  financing: makeEmptySection("Financing Activities"),
};

const emptyTotals = {
  cashIn: ZERO,
  cashOut: ZERO,
  netCashFlow: ZERO,
  openingBalance: ZERO,
  closingBalance: ZERO,
};

const emptyPeriod = {
  dateFrom: null,
  dateTo: null,
};

const initialState = {
  // Period echoed back by the API
  period: { ...emptyPeriod },

  currency: "SAR",

  // Summary cards
  summary: { ...emptySummary },

  // Operating / Investing / Financing
  sections: {
    operating: { ...emptySections.operating },
    investing: { ...emptySections.investing },
    financing: { ...emptySections.financing },
  },

  // Grand totals
  totals: { ...emptyTotals },

  loading: false,
  error: null,
};


// ---------- mappers (snake_case API -> camelCase store) ----------

// Row fields are not visible in the sample (rows are empty), so this accepts
// the likely names. Adjust here if your backend uses different keys.
const mapRow = (row = {}, index = 0) => ({
  id: row.id ?? row.account_id ?? `${row.particular || row.label || "row"}-${index}`,
  particular: row.particular || row.label || row.name || "",
  cashIn: row.cash_in || ZERO,
  cashOut: row.cash_out || ZERO,
  netAmount: row.net_amount ?? row.net ?? ZERO,
});

const mapSection = (section = {}, fallbackLabel = "") => ({
  label: section.label || fallbackLabel,
  rows: (section.rows || []).map(mapRow),
  cashIn: section.cash_in || ZERO,
  cashOut: section.cash_out || ZERO,
  netAmount: section.net_amount || ZERO,
});


const cashFlowReportSlice = createSlice({
  name: "cashFlowReport",

  initialState,

  reducers: {

    clearCashFlowReport(state) {
      state.period = { ...emptyPeriod };
      state.currency = "SAR";
      state.summary = { ...emptySummary };
      state.sections = {
        operating: { ...emptySections.operating },
        investing: { ...emptySections.investing },
        financing: { ...emptySections.financing },
      };
      state.totals = { ...emptyTotals };
    },

    clearCashFlowReportError(state) {
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    builder

      .addCase(getCashFlowReport.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(getCashFlowReport.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};
        const summary = data.summary || {};
        const sections = data.sections || {};
        const totals = data.totals || {};

        state.period = {
          dateFrom: data.date_from || null,
          dateTo: data.date_to || null,
        };

        state.currency = data.currency || "SAR";

        state.summary = {
          openingBalance: summary.opening_balance || ZERO,
          cashInflow: summary.cash_inflow || ZERO,
          cashOutflow: summary.cash_outflow || ZERO,
          netCashFlow: summary.net_cash_flow || ZERO,
          closingBalance: summary.closing_balance || ZERO,
        };

        state.sections = {
          operating: mapSection(sections.operating, "Operating Activities"),
          investing: mapSection(sections.investing, "Investing Activities"),
          financing: mapSection(sections.financing, "Financing Activities"),
        };

        state.totals = {
          cashIn: totals.cash_in || ZERO,
          cashOut: totals.cash_out || ZERO,
          netCashFlow: totals.net_cash_flow || ZERO,
          openingBalance: totals.opening_balance || ZERO,
          closingBalance: totals.closing_balance || ZERO,
        };

      })


      .addCase(getCashFlowReport.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load cash flow report";

      });

  },
});


export const {
  clearCashFlowReport,
  clearCashFlowReportError,
} = cashFlowReportSlice.actions;


export default cashFlowReportSlice.reducer;