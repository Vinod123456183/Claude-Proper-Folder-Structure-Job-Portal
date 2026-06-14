// 💼 Job API — RTK Query endpoints for jobs
// 📦 RTK Query (injected into rootApi)
//
// SCALABILITY NOTES:
// ─────────────────────────────────────────────────────────────
// ✅ getAllJobs keepUnusedDataFor: 60s
//    Jobs list stays cached for 60s. A user browsing
//    multiple pages won't re-fetch the same list repeatedly.
//
// ✅ getJobById keepUnusedDataFor: 120s
//    Individual job pages stay hot in cache for 2 minutes.
//    Back button = instant load, no spinner.
//
// ✅ providesTags with id-based tags:
//    createJob/updateJob only invalidates the specific job
//    that changed, not the entire list. Surgical invalidation.
//
// ✅ getJobsByCompany scoped by companyId param so each
//    company's job list is cached independently.
// ─────────────────────────────────────────────────────────────

import { rootApi } from "./baseApi";
import type { Job } from "../types";

interface CreateJobPayload {
  title: string;
  description: string;
  requirements: string[];
  salary: number;
  location: string;
  jobType: string;
  numberOfPositions: number;
  company: string;
}

export const jobApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /job/all-jobs — public, cached 60s
    getAllJobs: builder.query<{ jobs: Job[] }, void>({
      query: () => ({ url: "/job/all-jobs" }),
      providesTags: (result) =>
        result
          ? [
              ...result.jobs.map(({ _id }) => ({ type: "Job" as const, id: _id })),
              { type: "Jobs", id: "LIST" },
            ]
          : [{ type: "Jobs", id: "LIST" }],
      keepUnusedDataFor: 60,     // ⏱ cache jobs list for 60s
    }),

    // GET /job/job-by-id/:jobId — cached 120s
    getJobById: builder.query<{ job: Job }, string>({
      query: (jobId) => ({ url: `/job/job-by-id/${jobId}` }),
      providesTags: (_result, _err, jobId) => [{ type: "Job", id: jobId }],
      keepUnusedDataFor: 120,    // ⏱ individual job pages cached 2min
    }),

    // GET /job/jobs-by-company/:companyId
    getJobsByCompany: builder.query<{ jobs: Job[] }, string>({
      query: (companyId) => ({ url: `/job/jobs-by-company/${companyId}` }),
      providesTags: (_result, _err, companyId) => [
        { type: "Jobs", id: `company-${companyId}` },
      ],
      keepUnusedDataFor: 60,
    }),

    // POST /job/create-job — recruiter only
    createJob: builder.mutation<{ message: string; success: boolean; job: Job }, CreateJobPayload>({
      query: (data) => ({
        url: "/job/create-job",
        method: "POST",
        data,
      }),
      // 🏷 Invalidate jobs list so it refetches with new job
      invalidatesTags: [{ type: "Jobs", id: "LIST" }],
    }),

    // PUT /job/update-job/:id — recruiter only
    updateJob: builder.mutation<
      { message: string; success: boolean; job: Job },
      { id: string; data: Partial<CreateJobPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/job/update-job/${id}`,
        method: "PUT",
        data,
      }),
      // 🏷 Surgical invalidation: only this job + the list
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Job", id },
        { type: "Jobs", id: "LIST" },
      ],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useGetJobsByCompanyQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
} = jobApi;
