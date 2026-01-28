import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config"; // Apna config path sahi check kar lena

export const baseApi = createApi({
  reducerPath: "api", // Ab sirf isi naam se store mein reducer jayega
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // Cookie auth ke liye
  }),
  // 🔥 Saare Tags yahan ek saath likh dijiye
  tagTypes: ["Course", "CreatorCourse", "PublishedCourse", "Lecture", "Purchase", "User", "Progress", "Contact","Roadmap"],
  endpoints: () => ({}), // Khali chhodein
});