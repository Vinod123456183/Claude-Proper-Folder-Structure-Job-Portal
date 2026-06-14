// 👥 Applicants — view & manage applicants for a job
// 📦 RTK Query (useGetApplicantsQuery, useUpdateStatusMutation)
// 🔒 SECURITY: RoleRoute(recruiter) + server checks job ownership before status update
// ⚡ CACHE: applicants cached 30s per jobId (scoped)

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Mail, Phone } from "lucide-react";
import {
  useGetApplicantsQuery,
  useUpdateStatusMutation,
} from "../../api/applicationApi";
import { useGetJobByIdQuery } from "../../api/jobApi";
import { Skeleton, EmptyState, PageHeader } from "../../components/ui";
import { timeAgo, getInitials } from "../../utils/helpers";
import toast from "react-hot-toast";

type Status = "pending" | "accepted" | "rejected";

const statusBadge: Record<Status, string> = {
  pending: "badge-amber",
  accepted: "badge-green",
  rejected: "badge-red",
};

export default function Applicants() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  // ♻️ Cached 120s for job details
  const { data: jobData } = useGetJobByIdQuery(jobId!, { skip: !jobId });
  // ♻️ Cached 30s for applicants (status changes often)
  const { data, isLoading } = useGetApplicantsQuery(jobId!, { skip: !jobId });
  const [updateStatus, { isLoading: updating }] = useUpdateStatusMutation();

  const applications = data?.applications ?? [];
  const job = jobData?.job;

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      // ✅ Pass jobId so RTK Query invalidates { type: "Applicants", id: jobId }
      // which matches exactly what getApplicants provides — triggers auto-refetch
      const res = await updateStatus({ id, jobId: jobId!, status }).unwrap();
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update status");
    }
  };

  return (
    <div className="page-container">
      {/* Back button */}
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => navigate("/recruiter/jobs")}
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={14} /> My Jobs
      </button>

      <PageHeader
        title={job ? `Applicants — ${job.title}` : "Applicants"}
        subtitle={`${applications.length} application${applications.length !== 1 ? "s" : ""} received`}
      />

      {/* Status summary chips */}
      {applications.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {(["pending", "accepted", "rejected"] as Status[]).map((s) => {
            const count = applications.filter((a) => a.status === s).length;
            return (
              <span
                key={s}
                className={`badge ${statusBadge[s]}`}
                style={{ fontSize: "0.78rem", padding: "4px 12px" }}
              >
                {count} {s}
              </span>
            );
          })}
        </div>
      )}

      {/* Applicants list */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Skeleton count={4} height={90} />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<Users size={40} />}
          title="No applicants yet"
          description="Share the job listing to attract candidates."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {applications.map((app, i) => {
            const applicant =
              typeof app.applicant === "object" ? app.applicant : null;
            const skills = applicant?.userProfile?.userSkills ?? [];
            return (
              <div
                key={app._id}
                className="card fade-up"
                style={{
                  animationDelay: `${i * 0.04}s`,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "var(--bg3)",
                    border: "2px solid var(--border2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--purple)",
                  }}
                >
                  {getInitials(applicant?.userName ?? "U")}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    {applicant?.userName ?? "Unknown"}
                  </div>
                  {applicant?.userEmail && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "0.78rem",
                        color: "var(--muted)",
                        marginTop: 3,
                      }}
                    >
                      <Mail size={10} /> {applicant.userEmail}
                    </div>
                  )}
                  {applicant?.userPhone && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "0.78rem",
                        color: "var(--muted)",
                        marginTop: 2,
                      }}
                    >
                      <Phone size={10} /> {applicant.userPhone}
                    </div>
                  )}
                  {applicant?.userProfile?.userBio && (
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--muted)",
                        marginTop: 6,
                        lineHeight: 1.5,
                      }}
                    >
                      {applicant.userProfile.userBio}
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 5,
                        marginTop: 8,
                      }}
                    >
                      {skills.map((s) => (
                        <span key={s} className="badge badge-muted">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--muted2)",
                      marginTop: 6,
                    }}
                  >
                    Applied {timeAgo(app.createdAt)}
                  </div>
                </div>

                {/* Status control */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "flex-end",
                    flexShrink: 0,
                  }}
                >
                  <span className={`badge ${statusBadge[app.status]}`}>
                    {app.status}
                  </span>
                  <select
                    className="input"
                    style={{
                      width: "auto",
                      padding: "5px 10px",
                      fontSize: "0.78rem",
                    }}
                    value={app.status}
                    disabled={updating}
                    onChange={(e) =>
                      handleStatusChange(app._id, e.target.value as Status)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accept</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
