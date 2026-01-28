import { baseApi } from "./baseApi";
import { userLoggedIn, userLoggedOut } from "../authSlice";

export const authApi = baseApi.injectEndpoints({
  // 🔥 reducerPath, baseQuery aur tagTypes ab baseApi sambhal raha hai
  endpoints: (builder) => ({
    
    /* ================= REGISTER ================= */
    register: builder.mutation({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        body: data,
      }),
    }),

    /* ================= LOGIN ================= */
    login: builder.mutation({
      query: (userData) => ({
        url: "/user/login",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Pehle login state update karo
          dispatch(userLoggedIn({ user: data.user }));
          
          // 🔥 Load user profile for roles
          dispatch(baseApi.endpoints.loadUser.initiate({}, { forceRefetch: true }));
        } catch (err) {
          console.error("Login Error:", err);
        }
      },
    }),

    /* ================= LOGOUT ================= */
   
logout: builder.mutation({
  query: () => ({
    url: "/user/logout",
    method: "POST",
  }),
  async onQueryStarted(_, { dispatch, queryFulfilled }) {
    try {
      await queryFulfilled;
      // ✅ Redux state clear karein
      dispatch(userLoggedOut());
      // 🧹 Saara cache delete karein (VVIP for Mobile)
      setTimeout(() => {
        dispatch(baseApi.util.resetApiState());
      }, 100); 
    } catch (err) {
      console.error("Logout Error:", err);
      // Fallback: Agar network error bhi aaye, tab bhi local logout kar dein
      dispatch(userLoggedOut());
    }
  },
}),

    /* ================= SEND OTP ================= */
    sendOtp: builder.mutation({
      query: (email) => ({
        url: "/user/send-otp",
        method: "POST",
        body: { email },
      }),
    }),

    /* ================= RESET PASSWORD ================= */
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/user/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    /* ================= LOAD USER ================= */
    loadUser: builder.query({
      query: () => "/user/profile",
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(userLoggedIn({ user: data.user }));
          }
        } catch (err) {
          // No action needed if not logged in
        }
      },
    }),

    /* ================= UPDATE PROFILE ================= */
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/user/profile",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(userLoggedIn({ user: data.user }));
          }
        } catch (err) {
          console.error("Profile Update Error:", err);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useLoadUserQuery,
  useUpdateProfileMutation,
  useSendOtpMutation,
  useResetPasswordMutation,
} = authApi;