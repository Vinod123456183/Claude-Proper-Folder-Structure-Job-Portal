// 📄 Job Detail Page
// 📦 RTK Query (useGetJobByIdQuery, useApplyJobMutation) + React Router
// ⚡ CACHE: Job cached 120s — back button = instant, no spinner
// 🔒 SECURITY: RoleRoute(student) — only students can apply

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Briefcase, Users, DollarSign, Building2, CheckCircle2 } from "lucide-react";
import { useGetJobByIdQuery } from "../../api/jobApi";
import { useApplyJobMutation, useGetAppliedJobsQuery } from "../../api/applicationApi";
import { Skeleton } from "../../components/ui";
import { formatSalary, timeAgo, getInitials } from "../../utils/helpers";
import { useMemo } from "react";
import toast from "react-hot-toast";

export default function JobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  // ♻️ Cached 120s — navigating back to this page = instant
  const { data, isLoading } = useGetJobByIdQuery(jobId!);
  const { data: appliedData } = useGetAppliedJobsQuery();
  const [applyJob, { isLoading: applying }] = useApplyJobMutation();

  const job = data?.job;

  // 🗂 O(1) applied check
  const alreadyApplied = useMemo(() =>
    (appliedData?.applications ?? []).some((a) =>
      typeof a.job === "object" ? a.job._id === jobId : a.job === jobId
    ),
    [appliedData, jobId]
  );

  const handleApply = async () => {
    if (!jobId) return;
    try {
      const res = await applyJob(jobId).unwrap();
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to apply");
    }
  };

  if (isLoading) return (
    <div className="page-container">
      <Skeleton count={1} height={40} />
      <div style={{ marginTop: 16 }}><Skeleton count={3} height={100} /></div>
    </div>
  );

  if (!job) return (
    <div className="page-container">
      <div className="empty-state">
        <h3>Job not found</h3>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/student/jobs")}>Go back</button>
      </div>
    </div>
  );

  const company = typeof job.company === "object" ? job.company : null;

  return (
    <div className="page-container">
      {/* Back button */}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid-2" style={{ alignItems: "start", gap: 24 }}>
        {/* Left: Job details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Title card */}
          <div className="card fade-up">
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: "var(--bg3)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", fontWeight: 700, color: "var(--accent)", flexShrink: 0,
              }}>
                {getInitials(company?.companyName ?? "C")}
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {job.title}
                </h1>
                <div style={{ color: "var(--muted)", marginTop: 4, fontSize: "0.875rem" }}>
                  {company?.companyName ?? "Company"} · {timeAgo(job.createdAt)}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              <span className="badge badge-muted"><MapPin size={11} />{job.location}</span>
              <span className="badge badge-muted"><Clock size={11} />{job.jobType}</span>
              <span className="badge badge-amber"><DollarSign size={11} />{formatSalary(job.salary)}</span>
              <span className="badge badge-blue"><Users size={11} />{job.numberOfPositions} openings</span>
            </div>

            {/* Apply button */}
            <button
              className={`btn btn-lg w-full ${alreadyApplied ? "btn-ghost" : "btn-primary"}`}
              style={{ marginTop: 20 }}
              disabled={alreadyApplied || applying}
              onClick={handleApply}
            >
              {applying
                ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Applying…</>
                : alreadyApplied
                  ? <><CheckCircle2 size={16} /> Applied</>
                  : "Apply Now"}
            </button>
          </div>

          {/* Description */}
          <div className="card fade-up fade-up-delay-1">
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: 12, fontSize: "1rem" }}>
              About the role
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "0.9rem", whiteSpace: "pre-line" }}>
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="card fade-up fade-up-delay-2">
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: 12, fontSize: "1rem" }}>
              Requirements
            </h2>
            <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {job.requirements.map((req, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.875rem", color: "var(--muted)" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", marginTop: 7, flexShrink: 0 }} />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Company info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {company && (
            <div className="card fade-up fade-up-delay-1">
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: 14, fontSize: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                <Building2 size={15} style={{ color: "var(--accent)" }} /> About the Company
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: "var(--bg3)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "0.8rem", color: "var(--purple)",
                }}>
                  {getInitials(company.companyName)}
                </div>
                <span style={{ fontWeight: 600 }}>{company.companyName}</span>
              </div>
              {company.companyDescription && (
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                  {company.companyDescription}
                </p>
              )}
              {company.companyWebsite && (
                <a href={company.companyWebsite} target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 10, fontSize: "0.8rem", color: "var(--blue)" }}>
                  <Briefcase size={11} /> Visit website
                </a>
              )}
            </div>
          )}

          {/* Quick stats */}
          <div className="card fade-up fade-up-delay-2">
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: 14, fontSize: "1rem" }}>
              Job Overview
            </h2>
            {[
              { label: "Salary", value: formatSalary(job.salary) },
              { label: "Job Type", value: job.jobType },
              { label: "Location", value: job.location },
              { label: "Openings", value: `${job.numberOfPositions} positions` },
              { label: "Posted", value: timeAgo(job.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--muted)" }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
