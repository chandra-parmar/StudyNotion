import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  // optional but recommended
  withCredentials: true, // if you also use cookies
});

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = null
) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: bodyData,
      headers: {
        "Content-Type": "application/json",
        ...headers, // includes Authorization if passed
      },
      params,
    });

    return response;
  } catch (error) {
    console.error("API CONNECTOR ERROR:", error);
    throw error;
  }
};