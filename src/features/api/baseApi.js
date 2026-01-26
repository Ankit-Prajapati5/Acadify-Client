import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../../config";

export const baseApi = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // 🔥 cookie auth ke liye zaroori
});
