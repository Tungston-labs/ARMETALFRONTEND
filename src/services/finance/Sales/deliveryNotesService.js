import axios from "axios";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const DELIVERY_NOTES_URL =
  `${BASE_URL}/api/finance/delivery-notes/`;

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

export const getDeliveryNotes = async (params = {}) => {
  const response = await axios.get(
    DELIVERY_NOTES_URL,
    {
      params,
      headers: getHeaders(),
    },
  );

  return response.data;
};

export const createDeliveryNote = async (payload) => {
  console.log(
    "CREATE DELIVERY NOTE PAYLOAD:",
    payload,
  );

  try {
    const response = await axios.post(
      DELIVERY_NOTES_URL,
      payload,
      {
        headers: getHeaders(),
      },
    );

    console.log(
      "CREATE DELIVERY NOTE RESPONSE:",
      response.data,
    );

    return response.data;
  } catch (error) {
    console.error(
      "CREATE DELIVERY NOTE API ERROR:",
      error.response?.data || error.response || error,
    );

    throw error;
  }
};

export const getDeliveryNoteById = async (id) => {
  const response = await axios.get(
    `${DELIVERY_NOTES_URL}${id}/`,
    {
      headers: getHeaders(),
    },
  );

  return response.data;
};

export const updateDeliveryNote = async (
  id,
  payload,
) => {
  console.log(
    "UPDATE DELIVERY NOTE PAYLOAD:",
    payload,
  );

  try {
    const response = await axios.put(
      `${DELIVERY_NOTES_URL}${id}/`,
      payload,
      {
        headers: getHeaders(),
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE DELIVERY NOTE API ERROR:",
      error.response?.data ||
        error.response ||
        error,
    );

    throw error;
  }
};

export const patchDeliveryNote = async (
  id,
  payload,
) => {
  const response = await axios.patch(
    `${DELIVERY_NOTES_URL}${id}/`,
    payload,
    {
      headers: getHeaders(),
    },
  );

  return response.data;
};

export const deleteDeliveryNote = async (id) => {
  await axios.delete(
    `${DELIVERY_NOTES_URL}${id}/`,
    {
      headers: getHeaders(),
    },
  );

  return id;
};

export const getDeliveryNoteKpi = async () => {
  const response = await axios.get(
    `${DELIVERY_NOTES_URL}kpi/`,
    {
      headers: getHeaders(),
    },
  );

  return response.data;
};