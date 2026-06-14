// 🏢 Company API — RTK Query endpoints for companies
// 📦 RTK Query (injected into rootApi)
//
// SCALABILITY NOTES:
// ─────────────────────────────────────────────────────────────
// ✅ keepUnusedDataFor: 300s (5 minutes) for company data.
//    Companies change rarely. Long cache = fewer requests.
//
// ✅ getCompaniesByRecruiter scoped by userId so each
//    recruiter sees their own fresh company list.
//    Cache key includes userId → no cross-user data leakage.
// ─────────────────────────────────────────────────────────────

import { rootApi } from "./baseApi";
import type { Company } from "../types";

interface CreateCompanyPayload {
  companyName: string;
  userId: string; // ✅ needed to invalidate recruiter-scoped cache tag
}

interface UpdateCompanyPayload {
  companyDescription?: string;
  companyWebsite?: string;
  companyLogo?: string;
  userId: string; // ✅ needed to invalidate recruiter-scoped cache tag
}

export const companyApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /company/display-all-companies — public
    getAllCompanies: builder.query<{ companies: Company[] }, void>({
      query: () => ({ url: "/company/display-all-companies" }),
      providesTags: (result) =>
        result
          ? [
              ...result.companies.map(({ _id }) => ({
                type: "Company" as const,
                id: _id,
              })),
              { type: "Companies", id: "LIST" },
            ]
          : [{ type: "Companies", id: "LIST" }],
      keepUnusedDataFor: 300, // ⏱ companies cached 5 min (rarely change)
    }),

    // GET /company/display-company-by-id/:id — public
    getCompanyById: builder.query<{ company: Company }, string>({
      query: (id) => ({ url: `/company/display-company-by-id/${id}` }),
      providesTags: (_result, _err, id) => [{ type: "Company", id }],
      keepUnusedDataFor: 300,
    }),

    // GET /company/display-company-by-recruiter-id/:userId — recruiter only
    getCompaniesByRecruiter: builder.query<{ companies: Company[] }, string>({
      query: (userId) => ({
        url: `/company/display-company-by-recruiter-id/${userId}`,
      }),
      providesTags: (_result, _err, userId) => [
        { type: "Companies", id: `recruiter-${userId}` },
      ],
      keepUnusedDataFor: 60,
    }),

    // POST /company/add-company — recruiter only
    createCompany: builder.mutation<
      { message: string; success: boolean; company: Company },
      CreateCompanyPayload
    >({
      query: ({ companyName }) => ({
        // ✅ userId stripped from body — server reads it from JWT, not request body
        url: "/company/add-company",
        method: "POST",
        data: { companyName },
      }),
      // ✅ invalidate both: "LIST" (getAllCompanies) + recruiter-scoped (getCompaniesByRecruiter)
      invalidatesTags: (_result, _err, { userId }) => [
        { type: "Companies", id: "LIST" },
        { type: "Companies", id: `recruiter-${userId}` },
      ],
    }),

    // PATCH /company/update-company/:id — recruiter only
    updateCompany: builder.mutation<
      { message: string; success: boolean; company: Company },
      { id: string; data: UpdateCompanyPayload }
    >({
      query: ({ id, data: { userId: _userId, ...rest } }) => ({
        // ✅ userId stripped from body — server reads it from JWT
        url: `/company/update-company/${id}`,
        method: "PATCH",
        data: rest,
      }),
      // ✅ invalidate specific company + both list variants
      invalidatesTags: (_result, _err, { id, data: { userId } }) => [
        { type: "Company", id },
        { type: "Companies", id: "LIST" },
        { type: "Companies", id: `recruiter-${userId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCompaniesQuery,
  useGetCompanyByIdQuery,
  useGetCompaniesByRecruiterQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} = companyApi;
