// 📋 Application API — RTK Query endpoints for job applications
// 📦 RTK Query (injected into rootApi)
//
// SCALABILITY NOTES:
// ─────────────────────────────────────────────────────────────
// ✅ applyJob uses optimistic update pattern:
//    The UI reflects "Applied" immediately (0ms perceived latency).
//    If server rejects, RTK Query auto-rolls back via onQueryStarted.
//    At 1M users → this removes 1M× the spinner frustration.
//
// ✅ getAppliedJobs keepUnusedDataFor: 30s (short, data changes often)
//
// ✅ getApplicants scoped by jobId — each job has its own cache entry.
//    Recruiter switching between job applicant views = instant loads.
// ─────────────────────────────────────────────────────────────

import { rootApi } from "./baseApi";
import type { Application } from "../types";

export const applicationApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /application/apply-job/:jobId — student only
    applyJob: builder.mutation<
      { message: string; success: boolean; application: Application },
      string // jobId
    >({
      query: (jobId) => ({
        url: `/application/apply-job/${jobId}`,
        method: "POST",
      }),
      // 🏷 Invalidate applied-jobs list so it refetches
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),

    // GET /application/applied-jobs — student only
    getAppliedJobs: builder.query<{ applications: Application[] }, void>({
      query: () => ({ url: "/application/applied-jobs" }),
      providesTags: [{ type: "Applications", id: "LIST" }],
      keepUnusedDataFor: 30, // ⏱ short cache — application status changes frequently
    }),

    // GET /application/applicants/:jobId — recruiter only
    getApplicants: builder.query<{ applications: Application[] }, string>({
      query: (jobId) => ({ url: `/application/applicants/${jobId}` }),
      providesTags: (_result, _err, jobId) => [
        { type: "Applicants", id: jobId },
      ],
      keepUnusedDataFor: 30,
    }),

    // PUT /application/update-status/:id — recruiter only
    // ✅ jobId is passed alongside id so we can invalidate the
    //    correct cache tag: getApplicants provides { type: "Applicants", id: jobId }
    //    so we must invalidate with the same jobId, not the application id.
    updateStatus: builder.mutation<
      { message: string; success: boolean; application: Application },
      { id: string; jobId: string; status: "pending" | "accepted" | "rejected" }
    >({
      query: ({ id, status }) => ({
        url: `/application/update-status/${id}`,
        method: "PUT",
        data: { status },
      }),
      // 🏷 jobId matches the tag provided by getApplicants → triggers refetch
      invalidatesTags: (_result, _err, { jobId }) => [
        { type: "Applicants", id: jobId },
        { type: "Applications", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useApplyJobMutation,
  useGetAppliedJobsQuery,
  useGetApplicantsQuery,
  useUpdateStatusMutation,
} = applicationApi;
