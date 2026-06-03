// ─────────────────────────────────────────────────────────────────────────────
// Admin Model
// Interface for admin user accounts stored in localStorage.
// ─────────────────────────────────────────────────────────────────────────────

export interface Admin {
  email: string;
  password: string;
  name: string;
  createdAt: string;   // ISO timestamp
}
