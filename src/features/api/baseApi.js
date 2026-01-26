import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1" || import.meta.env.VITE_API_BASE_URL,
  credentials: "include", // 🔥 VERY IMPORTANT (cookie auth)
});
