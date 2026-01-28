import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import { baseApi } from "@/features/api/baseApi.js"; // 🔥 BaseApi import karein

const rootReducer = combineReducers({
  auth: authReducer,
  // 🔥 Ab sirf EK reducer path rahega saari APIs ke liye
  [baseApi.reducerPath]: baseApi.reducer,
});

export default rootReducer;