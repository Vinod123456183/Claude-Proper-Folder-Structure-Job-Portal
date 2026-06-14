// 🧩 UI Components — reusable primitives
// 📦 React + lucide-react
// Stat card, job card, company card, empty state, loading skeleton

import { memo } from "react";
import type { Job, Company, Application } from "../../types";
import { formatSalary, timeAgo, getInitials, truncate } from "../../utils/helpers";
import { MapPin, Clock, Briefcase, Users, Building2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Stat card ────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  delay?: number;
}
export const StatCard = memo(({ label, value, icon, color = "var(--accent)", delay = 0 }: StatCardProps) => (
  <div
    className="card fade-up"
    style={{ animationDelay: `${delay}s`, display: "flex", alignItems: "center", gap: "16px" }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: "var(--radius)",
      background: `${color}18`,
      border: `1px solid ${color}30`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color, flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>{label}</div>
    </div>
  </div>
));

// ─── Job card ─────────────────────────────────────────────
interface JobCardProps {
  job: Job;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
  actionDone?: boolean;
  delay?: number;
}
export const JobCard = memo(({
  job, actionLabel, onAction, actionLoading, actionDone, delay = 0,
}: JobCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="card fade-up"
      style={{
        animationDelay: `${delay}s`,
        display: "flex", flexDirection: "column", gap: "12px",
        cursor: "pointer", transition: "border-color 0.15s, transform 0.15s",
      }}
      onClick={() => navigate(`/student/jobs/${job._id}`)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border2)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Company + time */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "var(--bg3)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", fontWeight: 700, color: "var(--accent)",
          }}>
            {getInitials(typeof job.company === "object" ? job.company.companyName : "C")}
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {typeof job.company === "object" ? job.company.companyName : "Company"}
            </div>
          </div>
        </div>
        <span style={{ fontSize: "0.72rem", color: "var(--muted2)" }}>{timeAgo(job.createdAt)}</span>
      </div>

      {/* Title */}
      <div>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1rem", fontWeight: 600,
          lineHeight: 1.3, marginBottom: 4,
        }}>
          {job.title}
        </h3>
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>
          {truncate(job.description, 100)}
        </p>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        <span className="badge badge-muted"><MapPin size={10} />{job.location}</span>
        <span className="badge badge-muted"><Clock size={10} />{job.jobType}</span>
        <span className="badge badge-amber">{formatSalary(job.salary)}</span>
        <span className="badge badge-blue"><Users size={10} />{job.numberOfPositions} pos.</span>
      </div>

      {/* Action button */}
      {actionLabel && (
        <button
          className={`btn btn-sm ${actionDone ? "btn-ghost" : "btn-primary"}`}
          disabled={actionLoading || actionDone}
          onClick={(e) => { e.stopPropagation(); onAction?.(); }}
          style={{ alignSelf: "flex-start", marginTop: 4 }}
        >
          {actionLoading ? <div className="spinner" style={{ width: 12, height: 12 }} /> : actionLabel}
        </button>
      )}
    </div>
  );
});

// ─── Company card ─────────────────────────────────────────
interface CompanyCardProps {
  company: Company;
  onEdit?: () => void;
  delay?: number;
}
export const CompanyCard = memo(({ company, onEdit, delay = 0 }: CompanyCardProps) => (
  <div className="card fade-up" style={{ animationDelay: `${delay}s`, display: "flex", flexDirection: "column", gap: "10px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: "var(--bg3)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.8rem", fontWeight: 700, color: "var(--purple)",
      }}>
        {getInitials(company.companyName)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem" }}>
          {company.companyName}
        </div>
        {company.companyWebsite && (
          <a
            href={company.companyWebsite}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: "0.75rem", color: "var(--blue)", display: "flex", alignItems: "center", gap: 3 }}
          >
            <ExternalLink size={10} /> Website
          </a>
        )}
      </div>
      {onEdit && (
        <button className="btn btn-ghost btn-sm" onClick={onEdit}>Edit</button>
      )}
    </div>
    {company.companyDescription && (
      <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>
        {truncate(company.companyDescription, 120)}
      </p>
    )}
  </div>
));

// ─── Application status row ───────────────────────────────
interface AppRowProps {
  app: Application;
  onStatusChange?: (id: string, status: "pending" | "accepted" | "rejected") => void;
  isRecruiter?: boolean;
}
export const ApplicationRow = memo(({ app, onStatusChange, isRecruiter }: AppRowProps) => {
  const badgeMap = { pending: "badge-amber", accepted: "badge-green", rejected: "badge-red" } as const;
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem" }}>
          {isRecruiter
            ? (app.applicant as any)?.userName ?? "Applicant"
            : (app.job as any)?.title ?? "Job"}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>
          {isRecruiter
            ? (app.applicant as any)?.userEmail
            : typeof app.job === "object" && app.job?.company
              ? (app.job.company as any)?.companyName
              : ""}
        </div>
      </div>
      <span className={`badge ${badgeMap[app.status]}`}>{app.status}</span>
      {isRecruiter && onStatusChange && (
        <select
          className="input"
          style={{ width: "auto", padding: "4px 8px", fontSize: "0.8rem" }}
          value={app.status}
          onChange={(e) => onStatusChange(app._id, e.target.value as any)}
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      )}
    </div>
  );
});

// ─── Skeleton loader ──────────────────────────────────────
export const Skeleton = ({ height = 80, count = 3 }: { height?: number; count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          height,
          background: "var(--bg3)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          animation: "pulse 1.4s ease-in-out infinite",
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
    `}</style>
  </>
);

// ─── Empty state ──────────────────────────────────────────
export const EmptyState = ({
  icon, title, description, action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <div className="empty-state">
    {icon}
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </div>
);

// ─── Page header ──────────────────────────────────────────
export const PageHeader = ({
  title, subtitle, action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
    <div>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.6rem", fontWeight: 700,
        letterSpacing: "-0.02em", lineHeight: 1.2,
      }}>
        {title}
      </h1>
      {subtitle && <p style={{ color: "var(--muted)", marginTop: 4, fontSize: "0.9rem" }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);
