import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    fetchVendors,
    createVendor,
    fetchVendorDashboard,
    uploadVendorDocuments,
    updateVendor, deleteVendor,
} from "../../../services/finance/purchases/VendorsService";

// ==========================================
// THUNKS
// ==========================================

// GET Vendors (paginated, searchable, filterable)
export const getVendors = createAsyncThunk(
    "vendor/getVendors",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchVendors(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// CREATE Vendor
export const addVendor = createAsyncThunk(
    "vendor/addVendor",
    async (vendorData, { rejectWithValue }) => {
        try {
            return await createVendor(vendorData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Vendor Dashboard (stat cards)
export const getVendorDashboard = createAsyncThunk(
    "vendor/getVendorDashboard",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchVendorDashboard(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// UPLOAD Vendor Documents (one or many files)
// Usage: dispatch(uploadVendorDocumentsThunk({ id, files: [file1, file2] }))
export const uploadVendorDocumentsThunk = createAsyncThunk(
    "vendor/uploadVendorDocuments",
    async ({ id, files = [] }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append("documents", file));

            return await uploadVendorDocuments(id, formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const editVendor = createAsyncThunk(
    "vendor/editVendor",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await updateVendor(id, data);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeVendor = createAsyncThunk(
    "vendor/removeVendor",
    async (id, { rejectWithValue }) => {
        try {
            await deleteVendor(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ==========================================
// STATE
// ==========================================

const initialState = {
    vendors: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    updateLoading: false,
    deleteLoading: false,
    dashboard: null,

    loading: false,
    createLoading: false,
    dashboardLoading: false,
    uploadLoading: false,

    error: null,
    successMessage: null,
};

const vendorSlice = createSlice({
    name: "vendor",
    initialState,

    reducers: {
        clearVendorError: (state) => {
            state.error = null;
        },
        clearVendorMessage: (state) => {
            state.successMessage = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // ---------- GET VENDORS ----------
            .addCase(getVendors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVendors.fulfilled, (state, action) => {
                state.loading = false;
                state.vendors = action.payload?.results || [];
                state.totalItems = action.payload?.total_items || 0;
                state.totalPages = action.payload?.total_pages || 0;
                state.currentPage = action.payload?.current_page || 1;
            })
            .addCase(getVendors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ---------- CREATE VENDOR ----------
            .addCase(addVendor.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(addVendor.fulfilled, (state, action) => {
                state.createLoading = false;
                state.successMessage =
                    action.payload?.message || "Vendor created successfully.";

                const vendor = action.payload?.data;
                if (vendor) {
                    state.vendors.unshift(vendor);
                    state.totalItems += 1;
                }
            })
            .addCase(addVendor.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })

            // ---------- VENDOR DASHBOARD ----------
            .addCase(getVendorDashboard.pending, (state) => {
                state.dashboardLoading = true;
                state.error = null;
            })
            .addCase(getVendorDashboard.fulfilled, (state, action) => {
                state.dashboardLoading = false;
                state.dashboard = action.payload?.data || action.payload;
            })
            .addCase(getVendorDashboard.rejected, (state, action) => {
                state.dashboardLoading = false;
                state.error = action.payload;
            })

            // ---------- UPLOAD DOCUMENTS ----------
            .addCase(uploadVendorDocumentsThunk.pending, (state) => {
                state.uploadLoading = true;
                state.error = null;
            })
            .addCase(uploadVendorDocumentsThunk.fulfilled, (state, action) => {
                state.uploadLoading = false;
                state.successMessage =
                    action.payload?.message ||
                    "Document(s) uploaded successfully.";

                // Merge returned documents into the matching vendor by id.
                // If the response has no `documents`, refetch the list instead.
                const newDocuments = action.payload?.documents || [];
                const vendorId = action.meta.arg?.id;

                if (newDocuments.length && vendorId) {
                    const vendor = state.vendors.find(
                        (v) => String(v.id) === String(vendorId)
                    );

                    if (vendor) {
                        const byId = new Map(
                            (vendor.documents || []).map((doc) => [doc.id, doc])
                        );
                        newDocuments.forEach((doc) => byId.set(doc.id, doc));
                        vendor.documents = Array.from(byId.values());
                    }
                }
            })
            .addCase(uploadVendorDocumentsThunk.rejected, (state, action) => {
                state.uploadLoading = false;
                state.error = action.payload;
            })
            // ---------- UPDATE VENDOR ----------
.addCase(editVendor.pending, (state) => {
    state.updateLoading = true;
    state.error = null;
})
.addCase(editVendor.fulfilled, (state, action) => {
    state.updateLoading = false;
    state.successMessage = action.payload?.message || "Vendor updated successfully.";
    const updated = action.payload?.data;
    if (updated) {
        const i = state.vendors.findIndex((v) => v.id === updated.id);
        if (i !== -1) state.vendors[i] = updated;
    }
})
.addCase(editVendor.rejected, (state, action) => {
    state.updateLoading = false;
    state.error = action.payload;
})

// ---------- DELETE VENDOR ----------
.addCase(removeVendor.pending, (state) => {
    state.deleteLoading = true;
    state.error = null;
})
.addCase(removeVendor.fulfilled, (state, action) => {
    state.deleteLoading = false;
    state.successMessage = "Vendor deleted successfully.";
    state.vendors = state.vendors.filter((v) => v.id !== action.payload);
    state.totalItems = Math.max(0, state.totalItems - 1);
})
.addCase(removeVendor.rejected, (state, action) => {
    state.deleteLoading = false;
    state.error = action.payload;
});
    },
});

export const { clearVendorError, clearVendorMessage } = vendorSlice.actions;

// ==========================================
// SELECTORS
// ==========================================

export const selectVendors = (state) => state.vendor?.vendors || [];
export const selectVendorLoading = (state) => state.vendor?.loading || false;
export const selectVendorCreateLoading = (state) =>
    state.vendor?.createLoading || false;
export const selectVendorDashboard = (state) => state.vendor?.dashboard || null;
export const selectVendorDashboardLoading = (state) =>
    state.vendor?.dashboardLoading || false;
export const selectVendorUploadLoading = (state) =>
    state.vendor?.uploadLoading || false;
export const selectVendorError = (state) => state.vendor?.error || null;

export default vendorSlice.reducer;