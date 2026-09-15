import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createQuotationService,
  convertQuotationService,
  deleteQuotationService,
  getQuotationService,
  listQuotationService,
  quotationKpiService,
  updateQuotationService,
} from "../services/quotationService";

const apiError = (error) => error.response?.data || error.message;

export const fetchQuotationList = createAsyncThunk(
  "quotation/list",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await listQuotationService(params);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const createQuotation = createAsyncThunk(
  "quotation/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createQuotationService(data);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const fetchQuotationDetails = createAsyncThunk(
  "quotation/details",
  async (id, { rejectWithValue }) => {
    try {
      return await getQuotationService(id);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const updateQuotation = createAsyncThunk(
  "quotation/update",
  async ({ id, data, partial = false }, { rejectWithValue }) => {
    try {
      return await updateQuotationService(id, data, partial);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const deleteQuotation = createAsyncThunk(
  "quotation/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteQuotationService(id);
      return id;
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const convertQuotation = createAsyncThunk(
  "quotation/convert",
  async (id, { rejectWithValue }) => {
    try {
      return await convertQuotationService(id);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const fetchQuotationKpi = createAsyncThunk(
  "quotation/kpi",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await quotationKpiService(params);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);
