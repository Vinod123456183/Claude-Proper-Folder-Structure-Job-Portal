// 📋 Applied Jobs — student's application history
// 📦 RTK Query (useGetAppliedJobsQuery)
// ⚡ CACHE: cached 30s (status changes frequently, short TTL)
// 🔒 SECURITY: RoleRoute(student) — recruiters cannot access

import { useMemo, useState } from "react";
import { useGetAppliedJobsQuery } from "../../api/applicationApi";
import { Skeleton, EmptyState, PageHeader } from "../../components/ui";
import { formatSalary, timeAgo } from "../../utils/helpers";
import { BookMarked, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

type StatusFilter = "all" | "pending" | "accepted" | "rejected";

export default function AppliedJobs() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const navigate = useNavigate();

  // ♻️ RTK Query — 30s cache (status changes, keep fresh)
  const { data, isLoading, isFetching } = useGetAppliedJobsQuery();

  const applications = useMemo(() => {
    const all = data?.applications ?? [];
    if (filter === "all") return all;
    return all.filter((a) => a.status === filter);
  }, [data, filter]);

  // 📊 Status counts for filter tabs
  const counts = useMemo(() => {
    const all = data?.applications ?? [];
    return {
      all: all.length,
      pending: all.filter((a) => a.status === "pending").length,
      accepted: all.filter((a) => a.status === "accepted").length,
      rejected: all.filter((a) => a.status === "rejected").length,
    };
  }, [data]);

  const badgeMap = { pending: "badge-amber", accepted: "badge-green", rejected: "badge-red" } as const;
  const filterLabels: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Applied Jobs"
        subtitle={`${counts.all} total applications`}
      />

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {filterLabels.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`btn btn-sm ${filter === key ? "btn-primary" : "btn-ghost"}`}
          >
            {label}
            <span style={{
              background: filter === key ? "rgba(0,0,0,0.15)" : "var(--bg3)",
              padding: "1px 7px",
              borderRadius: 999,
              fontSize: "0.72rem",
              marginLeft: 2,
            }}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading || isFetching
        ? <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><Skeleton count={4} height={90} /></div>
        : applications.length === 0
          ? (
            <EmptyState
              icon={<BookMarked size={40} />}
              title={filter === "all" ? "No applications yet" : `No ${filter} applications`}
              description={filter === "all" ? "Start applying to jobs to see them here." : `You have no ${filter} applications.`}
              action={
                <button className="btn btn-primary btn-sm" onClick={() => navigate("/student/jobs")}>
                  Browse Jobs
                </button>
              }
            />
          )
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {applications.map((app, i) => {
                const job = typeof app.job === "object" ? app.job : null;
                const company = job && typeof job.company === "object" ? job.company : null;
                return (
                  <div
                    key={app._id}
                    className="card fade-up"
                    style={{
                      animationDelay: `${i * 0.04}s`,
                      display: "flex", gap: 16, alignItems: "center",
                      cursor: "pointer",
                      transition: "border-color 0.15s",
                    }}
                    onClick={() => job && navigate(`/student/jobs/${job._id}`)}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border2)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem" }}>
                        {job?.title ?? "Job"}
                      </div>
                      <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
                        {company && <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{company.companyName}</span>}
                        {job?.location && <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 3 }}><MapPin size={10} />{job.location}</span>}
                        {job?.jobType && <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} />{job.jobType}</span>}
                        {job?.salary && <span style={{ fontSize: "0.78rem", color: "var(--accent)" }}>{formatSalary(job.salary)}</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                      <span className={`badge ${badgeMap[app.status]}`}>{app.status}</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted2)" }}>{timeAgo(app.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
    </div>
  );
}
