import { baseApi } from "./baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (formData) => ({
        url: "/contact",
        method: "POST",
        body: formData,
      }),
      // Agar future mein admin panel banayenge messages dekhne ke liye,
      // toh ye tag kaam aayega.
      invalidatesTags: ["Contact"],
    }),
  }),
  overrideExisting: false,
});

export const { useSendMessageMutation } = contactApi;