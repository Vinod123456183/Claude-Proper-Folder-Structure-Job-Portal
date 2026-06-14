// 🏢 My Companies Page
// 📦 RTK Query (useGetCompaniesByRecruiterQuery, useCreateCompanyMutation, useUpdateCompanyMutation)
// 🔒 SECURITY: RoleRoute(recruiter) + server ownership check on update
// ⚡ CACHE: companies cached 60s, surgical invalidation on create/update

import { useState, useMemo } from "react";
import { Building2, PlusCircle, Save, X, Edit2 } from "lucide-react";
import {
  useGetCompaniesByRecruiterQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "../../api/companyApi";
import { useAuth } from "../../hooks";
import {
  CompanyCard,
  Skeleton,
  EmptyState,
  PageHeader,
} from "../../components/ui";
import type { Company } from "../../types";
import toast from "react-hot-toast";

export default function MyCompanies() {
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Create form
  const [newName, setNewName] = useState("");

  // Edit form
  const [editForm, setEditForm] = useState({
    companyDescription: "",
    companyWebsite: "",
    companyLogo: "",
  });

  // ♻️ Scoped query — cached per recruiter userId
  const { data, isLoading } = useGetCompaniesByRecruiterQuery(user?._id ?? "", {
    skip: !user?._id,
  });
  const [createCompany, { isLoading: creating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: updating }] = useUpdateCompanyMutation();

  const companies = data?.companies ?? [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      // ✅ userId passed so RTK Query can invalidate recruiter-${userId} tag
      const res = await createCompany({
        companyName: newName.trim(),
        userId: user!._id,
      }).unwrap();
      toast.success(res.message);
      setNewName("");
      setShowCreate(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to create company");
    }
  };

  const startEdit = (company: Company) => {
    setEditingId(company._id);
    setEditForm({
      companyDescription: company.companyDescription ?? "",
      companyWebsite: company.companyWebsite ?? "",
      companyLogo: company.companyLogo ?? "",
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      // ✅ userId passed so RTK Query can invalidate recruiter-${userId} tag
      const res = await updateCompany({
        id: editingId,
        data: { ...editForm, userId: user!._id },
      }).unwrap();
      toast.success(res.message);
      setEditingId(null);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Update failed");
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        title="My Companies"
        subtitle={`${companies.length} ${companies.length === 1 ? "company" : "companies"}`}
        action={
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowCreate(!showCreate)}
          >
            <PlusCircle size={13} /> New Company
          </button>
        }
      />

      {/* Create form */}
      {showCreate && (
        <div className="card fade-up" style={{ marginBottom: 24 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              marginBottom: 14,
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <PlusCircle size={14} style={{ color: "var(--accent)" }} /> Create
            New Company
          </h3>
          <form onSubmit={handleCreate} style={{ display: "flex", gap: 10 }}>
            <input
              className="input"
              placeholder="Company name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              style={{ flex: 1 }}
              autoFocus
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={creating}
            >
              {creating ? (
                <div className="spinner" style={{ width: 14, height: 14 }} />
              ) : (
                <Save size={14} />
              )}
              Create
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setShowCreate(false);
                setNewName("");
              }}
            >
              <X size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Companies list */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Skeleton count={3} height={110} />
        </div>
      ) : companies.length === 0 ? (
        <EmptyState
          icon={<Building2 size={40} />}
          title="No companies yet"
          description="Create a company to start posting jobs."
          action={
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowCreate(true)}
            >
              Create Company
            </button>
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {companies.map((company, i) => (
            <div key={company._id} style={{ animationDelay: `${i * 0.05}s` }}>
              {editingId === company._id ? (
                // ─── Edit mode ───────────────────────────────
                <div
                  className="card fade-up"
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                      }}
                    >
                      {company.companyName}
                    </h3>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setEditingId(null)}
                        disabled={updating}
                      >
                        <X size={13} /> Cancel
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleUpdate}
                        disabled={updating}
                      >
                        {updating ? (
                          <div
                            className="spinner"
                            style={{ width: 12, height: 12 }}
                          />
                        ) : (
                          <Save size={13} />
                        )}{" "}
                        Save
                      </button>
                    </div>
                  </div>
                  <div className="grid-2">
                    <div>
                      <label className="input-label">Website</label>
                      <input
                        className="input"
                        placeholder="https://…"
                        value={editForm.companyWebsite}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            companyWebsite: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="input-label">Logo URL</label>
                      <input
                        className="input"
                        placeholder="https://…"
                        value={editForm.companyLogo}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            companyLogo: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Description</label>
                    <textarea
                      className="input"
                      rows={3}
                      value={editForm.companyDescription}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          companyDescription: e.target.value,
                        })
                      }
                      placeholder="Describe your company…"
                      style={{ resize: "vertical" }}
                    />
                  </div>
                </div>
              ) : (
                // ─── View mode ───────────────────────────────
                <CompanyCard
                  company={company}
                  delay={i * 0.05}
                  onEdit={() => startEdit(company)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
