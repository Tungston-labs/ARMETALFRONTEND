import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createFinanceService,
  listFinanceService,
  deleteFinanceService,createFinanceCategoryService,
  listFinanceCategoryService,
} from "../services/financeService";

export const createFinance = createAsyncThunk(
  "finance/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createFinanceService(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchFinanceList = createAsyncThunk(
  "finance/list",
  async (
    {
      page = 1,
      pageSize = 20,
      search = "",
      payment_type = "",
      month = "",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await listFinanceService(
        page,
        pageSize,
        search,
        payment_type,
        month
      );

      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



export const deleteFinance = createAsyncThunk(
  "finance/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFinanceService(id);
      return id; // return deleted id
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createFinanceCategory = createAsyncThunk(
  "financeCategory/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createFinanceCategoryService(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchFinanceCategoryList = createAsyncThunk(
  "financeCategory/list",
  async (payment_type = "", { rejectWithValue }) => {
    try {
      return await listFinanceCategoryService(payment_type);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);