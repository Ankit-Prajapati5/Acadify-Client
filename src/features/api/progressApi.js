import { baseApi } from "./baseApi";

export const progressApi = baseApi.injectEndpoints({
  // 🔥 reducerPath, baseQuery aur tagTypes ab baseApi sambhal raha hai
  endpoints: (builder) => ({

    /* ================= GET PROGRESS ================= */
    getCourseProgress: builder.query({
      query: (courseId) => `/progress/${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: "Progress", id: courseId },
      ],
    }),

    /* ================= MARK COMPLETED ================= */
    markLectureCompleted: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/progress/${courseId}/lecture/${lectureId}`,
        method: "POST",
      }),
      // 🔥 Isse progress query automatic refresh hogi
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Progress", id: courseId },
      ],
    }),

    /* ================= RESET PROGRESS ================= */
    resetCourseProgress: builder.mutation({
      query: (courseId) => ({
        url: `/progress/${courseId}/reset`,
        method: "POST",
      }),
      invalidatesTags: (result, error, courseId) => [
        { type: "Progress", id: courseId },
      ],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetCourseProgressQuery,
  useMarkLectureCompletedMutation,
  useResetCourseProgressMutation,
} = progressApi;