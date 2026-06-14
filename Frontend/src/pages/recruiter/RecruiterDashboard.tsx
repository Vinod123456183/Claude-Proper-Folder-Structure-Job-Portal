// 🏢 Recruiter Dashboard
// 📦 RTK Query (companies, jobs) + useAuth
// 🔒 SECURITY: RoleRoute(recruiter) — students can never land here
// ⚡ CACHE: companies 60s, jobs 60s

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Briefcase, Users, PlusCircle, ArrowRight } from "lucide-react";
import { useGetCompaniesByRecruiterQuery } from "../../api/companyApi";
import { useGetAllJobsQuery } from "../../api/jobApi";
import { useAuth } from "../../hooks";
import { StatCard, CompanyCard, Skeleton, PageHeader, EmptyState } from "../../components/ui";
import { timeAgo } from "../../utils/helpers";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ♻️ Scoped by userId — each recruiter gets their own cache entry
  const { data: companiesData, isLoading: companiesLoading } = useGetCompaniesByRecruiterQuery(user?._id ?? "", { skip: !user?._id });
  const { data: jobsData, isLoading: jobsLoading } = useGetAllJobsQuery();

  // 📊 Recruiter's own jobs (filter by their companies)
  const myCompanyIds = useMemo(
    () => new Set((companiesData?.companies ?? []).map((c) => c._id)),
    [companiesData]
  );

  const myJobs = useMemo(
    () => (jobsData?.jobs ?? []).filter((j) =>
      typeof j.company === "object" ? myCompanyIds.has(j.company._id) : myCompanyIds.has(j.company)
    ),
    [jobsData, myCompanyIds]
  );

  const totalApplications = useMemo(
    () => myJobs.reduce((sum, j) => sum + (j.applications?.length ?? 0), 0),
    [myJobs]
  );

  const recentCompanies = (companiesData?.companies ?? []).slice(0, 3);
  const recentJobs = myJobs.slice(0, 4);

  return (
    <div className="page-container">
      <PageHeader
        title={`Hello, ${user?.userName?.split(" ")[0]} 👋`}
        subtitle="Manage your companies and job postings"
        action={
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/recruiter/jobs/new")}>
            <PlusCircle size={14} /> Post a Job
          </button>
        }
      />

      {/* Stats */}
      <div className="grid-stats" style={{ marginBottom: 32 }}>
        <StatCard label="My Companies"    value={companiesData?.companies?.length ?? 0} icon={<Building2 size={18} />} color="var(--purple)" delay={0.0} />
        <StatCard label="Active Jobs"     value={myJobs.length}         icon={<Briefcase size={18} />} color="var(--accent)"  delay={0.05} />
        <StatCard label="Total Applicants" value={totalApplications}    icon={<Users size={18} />}     color="var(--blue)"   delay={0.1} />
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>

        {/* My Companies */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600 }}>My Companies</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/recruiter/companies")}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          {companiesLoading
            ? <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><Skeleton count={2} height={100} /></div>
            : recentCompanies.length === 0
              ? (
                <EmptyState
                  icon={<Building2 size={32} />}
                  title="No companies yet"
                  description="Create your first company to start posting jobs."
                  action={<button className="btn btn-primary btn-sm" onClick={() => navigate("/recruiter/companies/new")}>Create Company</button>}
                />
              )
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {recentCompanies.map((c, i) => (
                    <CompanyCard key={c._id} company={c} delay={i * 0.05} onEdit={() => navigate("/recruiter/companies")} />
                  ))}
                </div>
              )}
        </section>

        {/* My Jobs */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600 }}>Active Job Posts</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/recruiter/jobs")}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          {jobsLoading
            ? <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><Skeleton count={3} height={80} /></div>
            : recentJobs.length === 0
              ? (
                <EmptyState
                  icon={<Briefcase size={32} />}
                  title="No jobs posted yet"
                  description="Post your first job to start receiving applications."
                  action={<button className="btn btn-primary btn-sm" onClick={() => navigate("/recruiter/jobs/new")}>Post a Job</button>}
                />
              )
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {recentJobs.map((job, i) => (
                    <div
                      key={job._id}
                      className="card fade-up"
                      style={{ animationDelay: `${i * 0.05}s`, cursor: "pointer", padding: "14px 18px", transition: "border-color 0.15s" }}
                      onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
                      onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border2)"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem" }}>{job.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2 }}>{job.location} · {job.jobType}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--blue)" }}>
                            {job.applications?.length ?? 0}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>applicants</div>
                        </div>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted2)", marginTop: 6 }}>{timeAgo(job.createdAt)}</div>
                    </div>
                  ))}
                </div>
              )}
        </section>
      </div>
    </div>
  );
}
