import API from "./api"; // Your Axios instance with baseURL & headers


export const fetchHolidayTypes = async () => {
  const response = await API.get("/holiday-types/");
  return response.data;  // Expects: [{key: "public", label: "Public Holiday"}, ...]
};


// GET: List all holidays
export const fetchHolidays = async (page = 1) => {
  const response = await API.get(`/holidays/?page=${page}`);
  return response.data;
};

// POST: Create a holiday
export const createHolidays = async (data) => {
  const response = await API.post("/holidays/",data);
  return response.data;
};

// GET: holiday detail by ID
export const fetchHolidaysById = async (id) => {
  const response = await API.get(`/holidays/${id}/`);
  return response.data;
};

// PUT: Update holidays by ID
export const updateHolidays = async (id, data) => {
  const response = await API.put(`/holidays/${id}/`, data);
  return response.data;
};

// DELETE: Delete holidays by ID
export const deleteHolidays = async (id) => {
  const response = await API.delete(`/holidays/${id}/`);
  return response.data;
};




  