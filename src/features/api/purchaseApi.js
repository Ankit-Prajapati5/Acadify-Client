import { baseApi } from "./baseApi";

// 🔥 Fix: createApi ki jagah baseApi.injectEndpoints use karein 
// taaki Tags (Course, Purchase) pure app mein share ho sakein
export const purchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* ==============================
       CREATE ORDER
    ============================== */
    createCourseOrder: builder.mutation({
      query: (courseId) => ({
        url: "/course-purchase/create-order",
        method: "POST",
        body: { courseId },
      }),
      // 🔥 Sabse important part: 
      // Ye "Course" tag invalidate karega jo CourseDetail page use kar raha hai.
      // Isse button instant "Continue Course" mein badal jayega.
      invalidatesTags: ["Purchase", "Course"],
    }),

    /* ==============================
       CHECK PURCHASE STATUS
    ============================== */
    checkCoursePurchase: builder.query({
      query: (courseId) => `/course-purchase/check/${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: "Purchase", id: courseId }
      ],
    }),

    /* ==============================
       MY LEARNING COURSES
    ============================== */
    getMyLearning: builder.query({
      query: () => "/course-purchase/my-learning",
      providesTags: ["Purchase"],
    }),

  }),
  // Purane code se override na ho isliye overrideExisting use karein
  overrideExisting: false, 
});

export const {
  useCreateCourseOrderMutation,
  useCheckCoursePurchaseQuery,
  useGetMyLearningQuery,
} = purchaseApi;