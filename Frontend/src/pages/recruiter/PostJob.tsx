// 💼 Post Job Page
// 📦 RTK Query (useCreateJobMutation, useGetCompaniesByRecruiterQuery)
// 🔒 SECURITY: RoleRoute(recruiter) + server checks company ownership before creating
// ✅ Only shows recruiter's own companies in the dropdown

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, PlusCircle, Minus } from "lucide-react";
import { useCreateJobMutation } from "../../api/jobApi";
import { useGetCompaniesByRecruiterQuery } from "../../api/companyApi";
import { useAuth } from "../../hooks";
import { PageHeader } from "../../components/ui";
import toast from "react-hot-toast";

const JOB_TYPES = ["Full-time", "Part-time", "Remote", "Internship", "Contract"];

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ♻️ Load recruiter's companies for the dropdown
  const { data: companiesData } = useGetCompaniesByRecruiterQuery(user?._id ?? "", { skip: !user?._id });
  const [createJob, { isLoading }] = useCreateJobMutation();

  const [form, setForm] = useState({
    title: "", description: "", salary: "", location: "",
    jobType: "Full-time", numberOfPositions: "1", company: "",
  });
  const [requirements, setRequirements] = useState<string[]>([""]); // dynamic requirement fields

  const companies = companiesData?.companies ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reqs = requirements.filter((r) => r.trim());
    if (reqs.length === 0) { toast.error("Add at least one requirement"); return; }
    if (!form.company) { toast.error("Select a company"); return; }
    try {
      const res = await createJob({
        ...form,
        salary: Number(form.salary),
        numberOfPositions: Number(form.numberOfPositions),
        requirements: reqs,
      }).unwrap();
      toast.success(res.message);
      navigate("/recruiter/jobs");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to post job");
    }
  };

  const addReq = () => setRequirements([...requirements, ""]);
  const removeReq = (i: number) => setRequirements(requirements.filter((_, idx) => idx !== i));
  const updateReq = (i: number, val: string) => setRequirements(requirements.map((r, idx) => idx === i ? val : r));

  if (companies.length === 0) return (
    <div className="page-container">
      <PageHeader title="Post a Job" subtitle="Create a company first before posting jobs." />
      <div className="card" style={{ textAlign: "center", padding: 40 }}>
        <Briefcase size={40} style={{ color: "var(--muted2)", margin: "0 auto 12px" }} />
        <p style={{ color: "var(--muted)", marginBottom: 16 }}>You need at least one company to post a job.</p>
        <button className="btn btn-primary" onClick={() => navigate("/recruiter/companies")}>
          Create a Company
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <PageHeader title="Post a Job" subtitle="Fill in the details to attract the right candidates" />

      <div style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit} className="card fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Company selector */}
          <div>
            <label className="input-label">Company *</label>
            <select className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required>
              <option value="">Select a company…</option>
              {companies.map((c) => <option key={c._id} value={c._id}>{c.companyName}</option>)}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="input-label">Job Title *</label>
            <input className="input" placeholder="e.g. Frontend Developer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          {/* Description */}
          <div>
            <label className="input-label">Job Description *</label>
            <textarea className="input" rows={5} placeholder="Describe the role, responsibilities, team…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required style={{ resize: "vertical" }} />
          </div>

          {/* 2-col row */}
          <div className="grid-2">
            <div>
              <label className="input-label">Location *</label>
              <input className="input" placeholder="e.g. Bangalore / Remote" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div>
              <label className="input-label">Job Type *</label>
              <select className="input" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Salary (₹ / yr) *</label>
              <input className="input" type="number" placeholder="e.g. 1200000" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required min={0} />
            </div>
            <div>
              <label className="input-label">Number of Positions *</label>
              <input className="input" type="number" placeholder="e.g. 3" value={form.numberOfPositions} onChange={(e) => setForm({ ...form, numberOfPositions: e.target.value })} required min={1} />
            </div>
          </div>

          {/* Dynamic requirements */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label className="input-label" style={{ marginBottom: 0 }}>Requirements *</label>
              <button type="button" className="btn btn-ghost btn-sm" onClick={addReq}>
                <PlusCircle size={12} /> Add
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {requirements.map((req, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <input
                    className="input"
                    placeholder={`Requirement ${i + 1}`}
                    value={req}
                    onChange={(e) => updateReq(i, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {requirements.length > 1 && (
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeReq(i)}>
                      <Minus size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4, borderTop: "1px solid var(--border)" }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/recruiter/jobs")}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Posting…</> : <><Briefcase size={14} /> Post Job</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
