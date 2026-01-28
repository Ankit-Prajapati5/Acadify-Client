import { baseApi } from "./baseApi";

export const roadmapApi = baseApi.injectEndpoints({
    // 🔥 reducerPath, baseQuery aur tagTypes ab baseApi handle kar raha hai
    endpoints: (builder) => ({
        
        /* ================= GET ROADMAP ================= */
        getRoadmap: builder.query({
            query: () => "/roadmap",
            providesTags: ["Roadmap"],
        }),

        /* ================= SUGGEST IDEA ================= */
        suggestIdea: builder.mutation({
            query: (data) => ({ 
                url: "/roadmap/suggest", 
                method: "POST", 
                body: data 
            }),
            // 🔥 Naya idea aate hi list refresh hogi
            invalidatesTags: ["Roadmap"],
        }),

        /* ================= TOGGLE UPVOTE ================= */
        toggleUpvote: builder.mutation({
            query: (ideaId) => ({ 
                url: `/roadmap/upvote/${ideaId}`, 
                method: "PUT" 
            }),
            // 🔥 Upvote count turant badal jayega
            invalidatesTags: ["Roadmap"],
        }),

        /* ================= DELETE IDEA ================= */
        deleteIdea: builder.mutation({
            query: (id) => ({ 
                url: `/roadmap/delete/${id}`, 
                method: "DELETE" 
            }),
            invalidatesTags: ["Roadmap"],
        }),

        /* ================= EDIT IDEA ================= */
        editIdea: builder.mutation({
            query: ({ id, title, tag }) => ({ 
                url: `/roadmap/edit/${id}`, 
                method: "PUT", 
                body: { title, tag } 
            }),
            invalidatesTags: ["Roadmap"],
        }),
    }),
    overrideExisting: false,
});

export const { 
    useGetRoadmapQuery, 
    useSuggestIdeaMutation, 
    useToggleUpvoteMutation,
    useDeleteIdeaMutation,
    useEditIdeaMutation 
} = roadmapApi;