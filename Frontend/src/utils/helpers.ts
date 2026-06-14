// 🛠 Helpers — pure utility functions
// 📦 Vanilla TypeScript (no dependencies)

// Format salary: 100000 → "₹1,00,000 / yr"
export const formatSalary = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L / yr`;
  }
  return `₹${amount.toLocaleString("en-IN")} / yr`;
};

// Relative time: "2 days ago", "just now"
export const timeAgo = (dateStr: string): string => {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN");
};

// Capitalize first letter
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

// Status color map
export const statusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: "var(--amber)",
    accepted: "var(--green)",
    rejected: "var(--red)",
  };
  return map[status] ?? "var(--muted)";
};

// Truncate long strings
export const truncate = (str: string, max = 120): string =>
  str.length > max ? str.slice(0, max) + "…" : str;

// Get initials from name
export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
