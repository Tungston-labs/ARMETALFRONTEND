

// list or search comapany
import API from './api'; // axios instance

export const fetchCompany = async (page = 1, search = "") => {
  const response = await API.get("/companies/list/", {
    params: {
      page,
      search: search.trim(),
    },
  });

  return response.data;
};


// POST: Create a Company
export const createCompany = async (data) => {
  const response = await API.post("/create-company/",data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// GET: company detail by ID
export const fetchCompanyById = async (id) => {
  const response = await API.get(`/companies/${id}/`);
  return response.data;
};

// PATCH: Update company by ID
export const updateCompany = async (id, data) => {
  const response = await API.patch(`/companies/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// DELETE: Delete Company by ID
export const deleteCompany = async (id) => {
  const response = await API.delete(`/companies/${id}/`);
  return response.data;
};

// GET: Company Overview
export const fetchCompanyOverview = async () => {
  const response = await API.get("/companies/overview/");
  return response.data;
};

export const updateCompanyStatus = async (companyId, action) => {
  const response = await API.post("/subscription/company-status/", {
    company_id: companyId,
    action,
  });

  return response.data;
};



// GET: List Features
export const fetchSubscriptionFeatures = async () => {
  const response = await API.get("/subscription-features/");
  return response.data;
};

// POST: Create Feature
export const createSubscriptionFeature = async (data) => {
  const response = await API.post("/subscription-features/", data);
  return response.data;
};




// GET: List Plans
export const fetchSubscriptionPlans = async () => {
  const response = await API.get("/plans/");
  return response.data;
};

// POST: Create Plan
export const createSubscriptionPlan = async (data) => {
  const response = await API.post("/plans/", data);
  return response.data;
};

// GET: Retrieve Plan
export const fetchSubscriptionPlanById = async (id) => {
  const response = await API.get(`/plans/${id}/`);
  return response.data;
};

// PUT: Update Plan
export const updateSubscriptionPlan = async (id, data) => {
  const response = await API.put(`/plans/${id}/`, data);
  return response.data;
};



// GET: Subscription Plan Summary
export const fetchSubscriptionPlanSummary = async () => {
  const response = await API.get("/plans/summary/");
  return response.data;
};