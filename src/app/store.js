import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { baseApi } from "@/features/api/baseApi"; // 🔥 BaseApi import karein

export const appStore = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware // 🔥 Sirf ek middleware kaafi hai
    ),
});