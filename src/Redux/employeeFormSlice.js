// redux/slices/employeeFormSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  basicInfo: {},
  jobDetails: {},
  legalInfo: {},
};

const employeeFormSlice = createSlice({
  name: 'employeeForm',
  initialState,
  reducers: {
    saveBasicInfo: (state, action) => {
      state.basicInfo = action.payload;
    },
    saveJobDetails: (state, action) => {
      state.jobDetails = action.payload;
    },
    saveLegalInfo: (state, action) => {
      state.legalInfo = action.payload;
    },
    clearEmployeeForm: () => initialState,
  },
});

export const {
  saveBasicInfo,
  saveJobDetails,
  saveLegalInfo,
  clearEmployeeForm,
} = employeeFormSlice.actions;

export default employeeFormSlice.reducer;
