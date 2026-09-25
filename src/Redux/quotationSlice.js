import { createSlice } from "@reduxjs/toolkit";
import {
  createQuotation,
  deleteQuotation,
  fetchQuotationById,
  fetchQuotationKpi,
  fetchQuotationList,
  updateQuotation,
  patchQuotation,
  convertQuotation,
} from "./quotationThunks";

const getRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    return payload.results || payload.data || payload.quotations || [];
  }
  return [];
};

const initialState = {
  quotations: [],
  selectedQuotation: null,
  quotationDraft: null,
  list: [],
  pagination: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    next: null,
    previous: null,
  },
  kpi: {
    totalQuotationValue: 0,
    negotiationAmount: 0,
    approvedQuotes: 0,
    rejectedQuotes: 0,
    pendingQuotes: 0,
  },
  loading: false,
  listLoading: false,
  detailsLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  convertLoading: false,
  saving: false,
  error: null,
  successMessage: null,
};

const quotationSlice = createSlice({
  name: "quotation",
  initialState,
  reducers: {
    clearQuotationError: (state) => {
      state.error = null;
    },
    setQuotationDraft: (state, action) => {
      state.quotationDraft = action.payload;
    },
    clearQuotationDraft: (state) => {
      state.quotationDraft = null;
    },
    setSelectedQuotation: (state, action) => {
      state.selectedQuotation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotationList.pending, (state) => {
        state.loading = true;
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchQuotationList.fulfilled, (state, action) => {
        state.loading = false;
        state.listLoading = false;
        state.list = getRows(action.payload);
        state.quotations = state.list;
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
        state.listLoading = false;
        state.error = action.payload || "Failed to fetch quotations";
      })
      .addCase(fetchQuotationById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchQuotationById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        const payload = action.payload?.data || action.payload || null;
        state.selectedQuotation = payload;
      })
      .addCase(fetchQuotationById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload || "Failed to fetch quotation detail";
      })
      .addCase(fetchQuotationKpi.fulfilled, (state, action) => {
        const payload = action.payload?.data || action.payload || {};
        state.kpi = {
          totalQuotationValue:
            payload.totalQuotationValue ?? payload.total_quotation_value ?? payload.totalValue ?? 0,
          negotiationAmount:
            payload.negotiationAmount ?? payload.negotiation_amount ?? payload.negotiation ?? 0,
          approvedQuotes:
            payload.approvedQuotes ?? payload.approved_quotes ?? payload.approved ?? 0,
          rejectedQuotes:
            payload.rejectedQuotes ?? payload.rejected_quotes ?? payload.rejected ?? 0,
          pendingQuotes:
            payload.pendingQuotes ?? payload.pending_quotes ?? payload.pending ?? 0,
        };
      })
      .addCase(fetchQuotationKpi.rejected, (state) => {
        state.kpi = {
          totalQuotationValue: 0,
          negotiationAmount: 0,
          approvedQuotes: 0,
          rejectedQuotes: 0,
          pendingQuotes: 0,
        };
      })
      .addCase(createQuotation.pending, (state) => {
        state.saving = true;
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.saving = false;
        state.createLoading = false;
        state.successMessage = "Quotation created successfully.";
        const quotation = action.payload?.data || action.payload;
        if (quotation && !Array.isArray(quotation)) {
          state.list = [quotation, ...state.list.filter((item) => String(item.id) !== String(quotation.id))];
          state.quotations = state.list;
        }
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.saving = false;
        state.createLoading = false;
        state.error = action.payload || "Failed to create quotation";
      })
      .addCase(updateQuotation.pending, (state) => {
        state.saving = true;
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateQuotation.fulfilled, (state, action) => {
        state.saving = false;
        state.updateLoading = false;
        const quotation = action.payload?.data || action.payload || null;
        if (quotation) {
          state.list = state.list.map((item) => (String(item.id) === String(quotation.id) ? quotation : item));
          state.quotations = state.list;
        }
      })
      .addCase(updateQuotation.rejected, (state, action) => {
        state.saving = false;
        state.updateLoading = false;
        state.error = action.payload || "Failed to update quotation";
      })
      .addCase(patchQuotation.pending, (state) => {
        state.saving = true;
        state.updateLoading = true;
      })
      .addCase(patchQuotation.fulfilled, (state, action) => {
        state.saving = false;
        state.updateLoading = false;
        const quotation = action.payload?.data || action.payload || null;
        if (quotation) {
          state.list = state.list.map((item) => (String(item.id) === String(quotation.id) ? quotation : item));
          state.quotations = state.list;
        }
      })
      .addCase(patchQuotation.rejected, (state, action) => {
        state.saving = false;
        state.updateLoading = false;
        state.error = action.payload || "Failed to patch quotation";
      })
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = state.list.filter((quotation) => String(quotation.id) !== String(id));
        state.quotations = state.list;
      })
      .addCase(deleteQuotation.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || "Failed to delete quotation";
      })
      .addCase(convertQuotation.pending, (state) => {
        state.convertLoading = true;
        state.error = null;
      })
      .addCase(convertQuotation.fulfilled, (state) => {
        state.convertLoading = false;
        state.successMessage = "Quotation converted to sales order.";
      })
      .addCase(convertQuotation.rejected, (state, action) => {
        state.convertLoading = false;
        state.error = action.payload || "Failed to convert quotation to sales order";
      });
  },
});

export const { clearQuotationError, setQuotationDraft, clearQuotationDraft, setSelectedQuotation } = quotationSlice.actions;
export default quotationSlice.reducer;
