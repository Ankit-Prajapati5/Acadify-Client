import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  // 🔄 Default true taaki jab tak loadUser chal raha ho, app guest na mane
  isLoading: true, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false; // Data mil gaya, loading khatam
    },

    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false; // Logout ke baad loading khatam
    },
    
    // 🛡️ Iska use hum tab karenge jab loadUser fail ho jaye
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
});

export const { userLoggedIn, userLoggedOut, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;