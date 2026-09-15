import { createSlice } from "@reduxjs/toolkit";
import {
  createQuotation,
  deleteQuotation,
  fetchQuotationKpi,
  fetchQuotationList,
} from "./quotationThunks";

const getRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  return payload?.results || payload?.data || payload?.quotations || [];
};

const quotationSlice = createSlice({
  name: "quotation",
  initialState: {
    list: [],
    pagination: {},
    kpi: {},
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearQuotationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = getRows(action.payload);
        state.pagination = {
          totalItems: action.payload?.total_items ?? action.payload?.count ?? state.list.length,
          totalPages: action.payload?.total_pages ?? 1,
          currentPage: action.payload?.current_page ?? 1,
          next: action.payload?.next ?? null,
          previous: action.payload?.previous ?? null,
        };
      })
      .addCase(fetchQuotationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuotationKpi.fulfilled, (state, action) => {
        state.kpi = action.payload?.data || action.payload || {};
      })
      .addCase(fetchQuotationKpi.rejected, (state) => {
        state.kpi = {};
      })
      .addCase(createQuotation.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.saving = false;
        const quotation = action.payload?.data || action.payload;
        if (quotation && !Array.isArray(quotation)) state.list.unshift(quotation);
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        state.list = state.list.filter((quotation) => quotation.id !== action.payload);
      });
  },
});

export const { clearQuotationError } = quotationSlice.actions;
export default quotationSlice.reducer;
