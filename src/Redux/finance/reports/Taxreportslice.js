import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { fetchTaxReport } from "../../../services/finance/reports/Taxreportservices";

// params example:
// { start_date: "2026-01-01", end_date: "2026-10-23", invoice_type: "sales",
//   customer: 1, tax_status: "paid", chart_year: 2026, page: 1, page_size: 10 }
export const getTaxReport = createAsyncThunk(
  "taxReport/getTaxReport",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchTaxReport(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


const emptyCards = {
  totalTaxCollected: 0,
  inputTaxCredit: 0,
  netTaxPayable: 0,
  taxableSales: 0,
};

const emptyFilters = {
  taxTypes: [],
  invoiceTypes: [],
  customers: [],
  vendors: [],
  taxStatuses: [],
  note: "",
};

const emptyMonthlyTax = {
  year: null,
  data: [],
};

const emptyPagination = {
  count: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: 10,
  next: null,
  previous: null,
};

const initialState = {
  // KPI cards
  cards: { ...emptyCards },

  // Dropdown options, already shaped as { label, value } for ReusableFilter
  filters: { ...emptyFilters },

  // Chart data (output tax vs input tax per month)
  monthlyTax: { ...emptyMonthlyTax },

  // Table rows
  report: [],

  // API pagination
  pagination: { ...emptyPagination },

  loading: false,
  error: null,
};


// ---------- mappers (snake_case API -> camelCase store) ----------

const mapOption = (item = {}) => ({
  label: item.label || "",
  value: item.value ?? "",
});

// Customers and vendors are sent as { id, customer_id, customer_name } /
// { id, vendor_id, name }. Several customers share a name in your data
// ("ABC Trading LLC" x3), so the code is added to tell them apart.
const mapCustomer = (item = {}) => ({
  label: item.customer_id
    ? `${item.customer_name} (${item.customer_id})`
    : item.customer_name || "",
  value: item.id,
});

const mapVendor = (item = {}) => ({
  label: item.vendor_id ? `${item.name} (${item.vendor_id})` : item.name || "",
  value: item.id,
});

const mapRow = (row = {}) => ({
  documentId: row.document_id ?? null,
  documentNumber: row.document_number || "",
  date: row.date || "",
  type: row.type || "",
  customerVendor: row.customer_vendor || "",
  taxableAmount: row.taxable_amount || 0,
  taxAmount: row.tax_amount || 0,
  taxType: row.tax_type || "",
  status: row.status || "",
});

const mapMonth = (item = {}) => ({
  month: item.month ?? null,
  monthName: item.month_name || "",
  outputTax: item.output_tax || 0,
  inputTax: item.input_tax || 0,
});


const taxReportSlice = createSlice({
  name: "taxReport",

  initialState,

  reducers: {

    clearTaxReport(state) {
      state.cards = { ...emptyCards };
      state.filters = { ...emptyFilters };
      state.monthlyTax = { ...emptyMonthlyTax };
      state.report = [];
      state.pagination = { ...emptyPagination };
    },

    clearTaxReportError(state) {
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    builder

      .addCase(getTaxReport.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(getTaxReport.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};
        const cards = data.cards || {};
        const filters = data.filters || {};
        const monthly = data.monthly_tax || {};
        const table = data.table || {};

        state.cards = {
          totalTaxCollected: cards.total_tax_collected || 0,
          inputTaxCredit: cards.input_tax_credit || 0,
          netTaxPayable: cards.net_tax_payable || 0,
          taxableSales: cards.taxable_sales || 0,
        };

        state.filters = {
          taxTypes: (filters.tax_types || []).map(mapOption),
          invoiceTypes: (filters.invoice_types || []).map(mapOption),
          customers: (filters.customers || []).map(mapCustomer),
          vendors: (filters.vendors || []).map(mapVendor),
          taxStatuses: (filters.tax_statuses || []).map(mapOption),
          note: filters.note || "",
        };

        state.monthlyTax = {
          year: monthly.year || null,
          data: (monthly.data || []).map(mapMonth),
        };

        state.report = (table.results || []).map(mapRow);

        state.pagination = {
          count: table.count || 0,
          totalPages: table.total_pages || 1,
          currentPage: table.page || 1,
          pageSize: table.page_size || 10,
          next: table.next_page || null,
          previous: table.previous_page || null,
        };

      })


      .addCase(getTaxReport.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load tax report";

      });

  },
});


export const {
  clearTaxReport,
  clearTaxReportError,
} = taxReportSlice.actions;


export default taxReportSlice.reducer;