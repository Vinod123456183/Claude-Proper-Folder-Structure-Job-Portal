// 📋 My Jobs — recruiter's job listings
// 📦 RTK Query (jobs + companies) + React Router
// 🔒 SECURITY: RoleRoute(recruiter)
// ⚡ Shows only jobs belonging to recruiter's companies

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, PlusCircle, Users, MapPin, Clock } from "lucide-react";
import { useGetAllJobsQuery } from "../../api/jobApi";
import { useGetCompaniesByRecruiterQuery } from "../../api/companyApi";
import { useAuth } from "../../hooks";
import { Skeleton, EmptyState, PageHeader } from "../../components/ui";
import { formatSalary, timeAgo } from "../../utils/helpers";

export default function MyJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: companiesData } = useGetCompaniesByRecruiterQuery(user?._id ?? "", { skip: !user?._id });
  const { data: jobsData, isLoading } = useGetAllJobsQuery();

  // 🗂 Filter to recruiter's own jobs
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

  return (
    <div className="page-container">
      <PageHeader
        title="My Jobs"
        subtitle={`${myJobs.length} active posting${myJobs.length !== 1 ? "s" : ""}`}
        action={
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/recruiter/jobs/new")}>
            <PlusCircle size={13} /> Post Job
          </button>
        }
      />

      {isLoading
        ? <div style={{ display: "flex", flexDirection: "column", gap: 12 }}><Skeleton count={4} height={100} /></div>
        : myJobs.length === 0
          ? (
            <EmptyState
              icon={<Briefcase size={40} />}
              title="No jobs posted yet"
              description="Post your first job to start receiving applications."
              action={<button className="btn btn-primary btn-sm" onClick={() => navigate("/recruiter/jobs/new")}>Post a Job</button>}
            />
          )
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {myJobs.map((job, i) => {
                const company = typeof job.company === "object" ? job.company : null;
                return (
                  <div
                    key={job._id}
                    className="card fade-up"
                    style={{ animationDelay: `${i * 0.04}s`, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "border-color 0.15s" }}
                    onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border2)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"}
                  >
                    {/* Job info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem" }}>{job.title}</div>
                      <div style={{ display: "flex", gap: 10, marginTop: 5, flexWrap: "wrap" }}>
                        {company && <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{company.companyName}</span>}
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 3 }}><MapPin size={10} />{job.location}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} />{job.jobType}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--accent)" }}>{formatSalary(job.salary)}</span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted2)", marginTop: 4 }}>{timeAgo(job.createdAt)}</div>
                    </div>

                    {/* Applicants count */}
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: "var(--radius)",
                        background: "rgba(91,156,246,0.1)", border: "1px solid rgba(91,156,246,0.2)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      }}>
                        <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--blue)", lineHeight: 1 }}>
                          {job.applications?.length ?? 0}
                        </div>
                        <div style={{ fontSize: "0.6rem", color: "var(--muted)", marginTop: 1 }}>apps</div>
                      </div>
                    </div>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => { e.stopPropagation(); navigate(`/recruiter/applicants/${job._id}`); }}
                    >
                      <Users size={13} /> View
                    </button>
                  </div>
                );
              })}
            </div>
          )}
    </div>
  );
}
