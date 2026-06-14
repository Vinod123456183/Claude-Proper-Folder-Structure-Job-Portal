// 👤 Student Profile — view + edit profile
// 📦 RTK Query (useUpdateProfileMutation) + Redux (updateUser) + React (useState)
// 🔒 SECURITY: Ownership enforced server-side (PUT /user/update-user/:id checks JWT userId)

import { useState } from "react";
import { useAuth, useAppDispatch } from "../../hooks";
import { useUpdateProfileMutation } from "../../api/authApi";
import { updateUser } from "../../store/slices/authSlice";
import { PageHeader } from "../../components/ui";
import { User, Mail, Phone, Edit2, Save, X } from "lucide-react";
import { getInitials } from "../../utils/helpers";
import toast from "react-hot-toast";

export default function StudentProfile() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    userName: user?.userName ?? "",
    userPhone: user?.userPhone ?? "",
    userBio: user?.userProfile?.userBio ?? "",
    userSkills: (user?.userProfile?.userSkills ?? []).join(", "),
  });
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSave = async () => {
    if (!user?._id) return;
    try {
      const res = await updateProfile({ id: user._id, data: form }).unwrap();
      dispatch(updateUser(res.user));   // 🔄 update Redux + localStorage
      toast.success("Profile updated!");
      setEditing(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Update failed");
    }
  };

  const handleCancel = () => {
    setForm({
      userName: user?.userName ?? "",
      userPhone: user?.userPhone ?? "",
      userBio: user?.userProfile?.userBio ?? "",
      userSkills: (user?.userProfile?.userSkills ?? []).join(", "),
    });
    setEditing(false);
  };

  const skills = user?.userProfile?.userSkills ?? [];

  return (
    <div className="page-container">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information"
        action={
          !editing
            ? <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}><Edit2 size={13} /> Edit</button>
            : <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={handleCancel} disabled={isLoading}><X size={13} /> Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? <div className="spinner" style={{ width: 12, height: 12 }} /> : <Save size={13} />}
                  Save
                </button>
              </div>
        }
      />

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Avatar card */}
        <div className="card fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "var(--bg3)", border: "2px solid var(--border2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)",
          }}>
            {getInitials(user?.userName ?? "U")}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700 }}>
              {user?.userName}
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 2 }}>{user?.userEmail}</div>
          </div>
          <span className="badge badge-blue">Student</span>

          {/* Skills display */}
          {skills.length > 0 && (
            <div style={{ width: "100%" }}>
              <div className="divider" />
              <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 8 }}>Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {skills.map((s) => (
                  <span key={s} className="badge badge-muted">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Edit form */}
        <div className="card fade-up fade-up-delay-1" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1rem" }}>
            Personal Information
          </h2>

          {/* Name */}
          <div>
            <label className="input-label"><User size={11} style={{ display: "inline", marginRight: 4 }} />Full Name</label>
            {editing
              ? <input className="input" value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} />
              : <div style={{ padding: "10px 14px", background: "var(--bg3)", borderRadius: "var(--radius)", fontSize: "0.9rem", border: "1px solid var(--border)" }}>{user?.userName}</div>}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="input-label"><Mail size={11} style={{ display: "inline", marginRight: 4 }} />Email</label>
            <div style={{ padding: "10px 14px", background: "var(--bg3)", borderRadius: "var(--radius)", fontSize: "0.9rem", border: "1px solid var(--border)", color: "var(--muted)" }}>
              {user?.userEmail}
              <span style={{ fontSize: "0.72rem", marginLeft: 8 }} className="badge badge-muted">Cannot change</span>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="input-label"><Phone size={11} style={{ display: "inline", marginRight: 4 }} />Phone</label>
            {editing
              ? <input className="input" value={form.userPhone} onChange={(e) => setForm({ ...form, userPhone: e.target.value })} />
              : <div style={{ padding: "10px 14px", background: "var(--bg3)", borderRadius: "var(--radius)", fontSize: "0.9rem", border: "1px solid var(--border)" }}>{user?.userPhone}</div>}
          </div>

          {/* Bio */}
          <div>
            <label className="input-label">Bio</label>
            {editing
              ? <textarea className="input" rows={3} value={form.userBio} onChange={(e) => setForm({ ...form, userBio: e.target.value })} placeholder="Tell recruiters about yourself…" style={{ resize: "vertical" }} />
              : <div style={{ padding: "10px 14px", background: "var(--bg3)", borderRadius: "var(--radius)", fontSize: "0.9rem", border: "1px solid var(--border)", color: user?.userProfile?.userBio ? "var(--text)" : "var(--muted2)", minHeight: 60 }}>
                  {user?.userProfile?.userBio || "No bio added yet."}
                </div>}
          </div>

          {/* Skills */}
          <div>
            <label className="input-label">Skills <span style={{ color: "var(--muted2)", fontSize: "0.72rem" }}>(comma-separated)</span></label>
            {editing
              ? <input className="input" value={form.userSkills} onChange={(e) => setForm({ ...form, userSkills: e.target.value })} placeholder="React, Node.js, Python…" />
              : <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 14px", background: "var(--bg3)", borderRadius: "var(--radius)", border: "1px solid var(--border)", minHeight: 40 }}>
                  {skills.length > 0
                    ? skills.map((s) => <span key={s} className="badge badge-purple">{s}</span>)
                    : <span style={{ color: "var(--muted2)", fontSize: "0.85rem" }}>No skills added yet.</span>}
                </div>}
          </div>
        </div>
      </div>
    </div>
  );
}
