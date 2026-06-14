// 🎓 Student Dashboard
// 📦 RTK Query (useGetAllJobsQuery, useGetAppliedJobsQuery) + useAuth
// 🔒 SECURITY: RoleRoute(student) wraps this — recruiters can never land here
// ⚡ CACHE: jobs cached 60s, applied-jobs 30s — fast loads on re-visit

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, BookMarked, Clock, TrendingUp } from "lucide-react";
import { useGetAllJobsQuery } from "../../api/jobApi";
import { useGetAppliedJobsQuery } from "../../api/applicationApi";
import { useAuth } from "../../hooks";
import { StatCard, JobCard, Skeleton, PageHeader, EmptyState } from "../../components/ui";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ♻️ RTK Query — deduped, cached, background-refetched
  const { data: jobsData, isLoading: jobsLoading } = useGetAllJobsQuery();
  const { data: appliedData, isLoading: appliedLoading } = useGetAppliedJobsQuery();

  // 📊 Derived stats — useMemo so they don't recompute on unrelated renders
  const stats = useMemo(() => {
    const applied = appliedData?.applications ?? [];
    return {
      totalJobs: jobsData?.jobs?.length ?? 0,
      totalApplied: applied.length,
      pending: applied.filter((a) => a.status === "pending").length,
      accepted: applied.filter((a) => a.status === "accepted").length,
    };
  }, [jobsData, appliedData]);

  // Recent 4 jobs for preview
  const recentJobs = useMemo(() => (jobsData?.jobs ?? []).slice(0, 4), [jobsData]);

  // Recent 3 applications
  const recentApps = useMemo(() => (appliedData?.applications ?? []).slice(0, 3), [appliedData]);

  return (
    <div className="page-container">
      {/* Header */}
      <PageHeader
        title={`Good to see you, ${user?.userName?.split(" ")[0]} 👋`}
        subtitle="Here's what's happening with your job search"
      />

      {/* Stats */}
      <div className="grid-stats" style={{ marginBottom: 32 }}>
        <StatCard label="Jobs Available"  value={stats.totalJobs}    icon={<Briefcase size={18} />} color="var(--accent)"  delay={0.0} />
        <StatCard label="Applied"         value={stats.totalApplied} icon={<BookMarked size={18} />} color="var(--blue)"  delay={0.05} />
        <StatCard label="Pending Review"  value={stats.pending}      icon={<Clock size={18} />}     color="var(--amber)" delay={0.1} />
        <StatCard label="Accepted"        value={stats.accepted}     icon={<TrendingUp size={18} />} color="var(--green)" delay={0.15} />
      </div>

      {/* Two-column layout */}
      <div className="grid-2" style={{ alignItems: "start" }}>

        {/* Recent Jobs */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600 }}>
              Latest Jobs
            </h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/student/jobs")}>
              View all
            </button>
          </div>

          {jobsLoading
            ? <div style={{ display: "flex", flexDirection: "column", gap: 12 }}><Skeleton count={3} height={160} /></div>
            : recentJobs.length === 0
              ? <EmptyState icon={<Briefcase size={32} />} title="No jobs yet" description="Check back soon for new listings." />
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {recentJobs.map((job, i) => (
                    <JobCard key={job._id} job={job} delay={i * 0.05} />
                  ))}
                </div>
              )}
        </section>

        {/* Recent Applications */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600 }}>
              Recent Applications
            </h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/student/applied")}>
              View all
            </button>
          </div>

          {appliedLoading
            ? <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><Skeleton count={3} height={70} /></div>
            : recentApps.length === 0
              ? (
                <EmptyState
                  icon={<BookMarked size={32} />}
                  title="No applications yet"
                  description="Browse jobs and apply to get started."
                  action={
                    <button className="btn btn-primary btn-sm" onClick={() => navigate("/student/jobs")}>
                      Browse jobs
                    </button>
                  }
                />
              )
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {recentApps.map((app) => {
                    const badgeMap = { pending: "badge-amber", accepted: "badge-green", rejected: "badge-red" } as const;
                    return (
                      <div key={app._id} className="card fade-up" style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                            {typeof app.job === "object" ? app.job.title : "Job"}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2 }}>
                            {typeof app.job === "object" && typeof app.job.company === "object"
                              ? app.job.company.companyName : ""}
                          </div>
                        </div>
                        <span className={`badge ${badgeMap[app.status]}`}>{app.status}</span>
                      </div>
                    );
                  })}
                </div>
              )}
        </section>
      </div>
    </div>
  );
}
