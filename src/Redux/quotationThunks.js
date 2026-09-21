import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  convertQuotationToSalesOrder,
  createQuotationService,
  deleteQuotationById,
  getQuotationById,
  getQuotationKPI,
  listQuotationService,
  patchQuotationService,
  updateQuotationService,
} from "../services/quotationService";

const apiError = (error) => error.response?.data || error.message;

export const fetchQuotationList = createAsyncThunk(
  "quotation/fetchQuotationList",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await listQuotationService(params);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const fetchQuotationById = createAsyncThunk(
  "quotation/fetchQuotationById",
  async (id, { rejectWithValue }) => {
    try {
      return await getQuotationById(id);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const fetchQuotationDetails = fetchQuotationById;

export const createQuotation = createAsyncThunk(
  "quotation/createQuotation",
  async (data, { rejectWithValue }) => {
    try {
      return await createQuotationService(data);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const updateQuotation = createAsyncThunk(
  "quotation/updateQuotation",
  async ({ id, data, partial = false }, { rejectWithValue }) => {
    try {
      return await updateQuotationService(id, data, partial);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const patchQuotation = createAsyncThunk(
  "quotation/patchQuotation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await patchQuotationService(id, data);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const deleteQuotation = createAsyncThunk(
  "quotation/deleteQuotation",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteQuotationById(id);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const convertQuotation = createAsyncThunk(
  "quotation/convertQuotation",
  async (id, { rejectWithValue }) => {
    try {
      return await convertQuotationToSalesOrder(id);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const fetchQuotationKpi = createAsyncThunk(
  "quotation/fetchQuotationKpi",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getQuotationKPI(params);
    } catch (error) {
      return rejectWithValue(apiError(error));
    }
  },
);

export const getQuotationKPIThunk = fetchQuotationKpi;
export const getQuotationByIdThunk = fetchQuotationById;
export const deleteQuotationIdThunk = deleteQuotationById;
export const convertQuotationToSalesOrderThunk = convertQuotationToSalesOrder;

export {
  getQuotationById,
  getQuotationKPI,
  deleteQuotationById,
  convertQuotationToSalesOrder,
};
