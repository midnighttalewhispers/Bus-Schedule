import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../models/admin.model';

/**
 * AuthService
 *
 * Manages admin authentication using localStorage.
 * On first load, seeds a default admin account.
 *
 * Default credentials:
 *   Email:    admin@gmail.com
 *   Password: Admin123@
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ADMINS_KEY = 'bus_app_admins';
  private readonly SESSION_KEY = 'bus_app_session';

  private readonly DEFAULT_ADMIN: Admin = {
    email: 'admin@gmail.com',
    password: 'Admin123@',
    name: 'Super Admin',
    createdAt: new Date().toISOString()
  };

  constructor(private router: Router) {
    this.initializeDefaultAdmin();
  }

  // ── Initialization ──────────────────────────────────────────────────────

  /** Seed the default admin if no admins exist yet */
  private initializeDefaultAdmin(): void {
    const admins = this.getAllAdmins();
    if (admins.length === 0) {
      this.saveAdmins([this.DEFAULT_ADMIN]);
    }
  }

  // ── Authentication ──────────────────────────────────────────────────────

  /** Validate credentials and create a session */
  login(email: string, password: string): boolean {
    const admins = this.getAllAdmins();
    const admin = admins.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (admin) {
      const session = { email: admin.email, name: admin.name, loggedInAt: new Date().toISOString() };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }

  /** Clear the session and redirect to login */
  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this.router.navigate(['/admin/login']);
  }

  /** Check if an admin is currently logged in */
  isLoggedIn(): boolean {
    return localStorage.getItem(this.SESSION_KEY) !== null;
  }

  /** Get the currently logged-in admin's info */
  getCurrentAdmin(): { email: string; name: string } | null {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (session) {
      try {
        return JSON.parse(session);
      } catch {
        return null;
      }
    }
    return null;
  }

  // ── Admin CRUD ──────────────────────────────────────────────────────────

  /** Get all admin accounts */
  getAllAdmins(): Admin[] {
    const data = localStorage.getItem(this.ADMINS_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return [];
  }

  /** Create a new admin account. Returns error message or null on success. */
  createAdmin(name: string, email: string, password: string): string | null {
    const admins = this.getAllAdmins();

    // Check for duplicate email
    if (admins.some(a => a.email.toLowerCase() === email.toLowerCase())) {
      return 'An admin with this email already exists.';
    }

    const newAdmin: Admin = {
      email,
      password,
      name,
      createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    this.saveAdmins(admins);
    return null;
  }

  /** Delete an admin by email. Cannot delete the currently logged-in admin. */
  deleteAdmin(email: string): string | null {
    const current = this.getCurrentAdmin();
    if (current && current.email.toLowerCase() === email.toLowerCase()) {
      return 'You cannot delete your own account while logged in.';
    }

    const admins = this.getAllAdmins();
    const filtered = admins.filter(a => a.email.toLowerCase() !== email.toLowerCase());

    if (filtered.length === admins.length) {
      return 'Admin not found.';
    }

    this.saveAdmins(filtered);
    return null;
  }

  // ── Private Helpers ─────────────────────────────────────────────────────

  private saveAdmins(admins: Admin[]): void {
    localStorage.setItem(this.ADMINS_KEY, JSON.stringify(admins));
  }
}
