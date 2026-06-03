import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BusTimetableService } from '../../services/bus-timetable.service';
import { PopupService } from '../../services/popup.service';
import { BusTimetable } from '../../models/bus-timetable.model';
import { Admin } from '../../models/admin.model';
import { BusFormComponent } from '../bus-form/bus-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BusFormComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  // ── Tab State ───────────────────────────────────────────────────────────
  activeTab: 'buses' | 'admins' = 'buses';

  // ── Bus State ───────────────────────────────────────────────────────────
  buses: BusTimetable[] = [];
  isLoading = false;
  searchKeyword = '';
  allRouteNumbers: string[] = [];

  // Modal state
  isFormVisible = false;
  busToEdit: BusTimetable | null = null;

  // ── Admin State ─────────────────────────────────────────────────────────
  admins: Admin[] = [];
  newAdminName = '';
  newAdminEmail = '';
  newAdminPassword = '';
  adminFormError = '';
  showNewAdminPassword = false;

  // ── Auth ────────────────────────────────────────────────────────────────
  currentAdmin: { email: string; name: string } | null = null;
  showMobileMenu = false;

  constructor(
    private authService: AuthService,
    private busService: BusTimetableService,
    private popupService: PopupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentAdmin = this.authService.getCurrentAdmin();
    this.loadBuses();
    this.loadAdmins();
  }

  // ── Tab Navigation ──────────────────────────────────────────────────────

  switchTab(tab: 'buses' | 'admins'): void {
    this.activeTab = tab;
    this.showMobileMenu = false;
  }

  // ── Auth Actions ────────────────────────────────────────────────────────

  logout(): void {
    this.popupService.confirm(
      'Logout',
      'Are you sure you want to sign out?',
      () => this.authService.logout(),
      undefined,
      'Logout',
      'btn-primary'
    );
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  // ── Bus CRUD ────────────────────────────────────────────────────────────

  loadBuses(): void {
    this.isLoading = true;
    this.busService.getAllBuses().subscribe({
      next: (data) => {
        this.buses = data;
        this.allRouteNumbers = Array.from(new Set(data.map(b => b.routeNumber).filter(r => r))) as string[];
        this.isLoading = false;
      },
      error: (err) => {
        this.popupService.error('Loading Error', 'Failed to load bus records. Is the backend running?');
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSearch(): void {
    this.isLoading = true;
    const query = this.searchKeyword.trim();

    const search$ = query
      ? this.busService.searchBuses(query)
      : this.busService.getAllBuses();

    search$.subscribe({
      next: (data) => {
        this.buses = data;
        if (!query) {
          this.allRouteNumbers = Array.from(new Set(data.map(b => b.routeNumber).filter(r => r))) as string[];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.popupService.error('Search Error', 'Search failed. Please try again.');
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.loadBuses();
  }

  openAddForm(): void {
    this.busToEdit = null;
    this.isFormVisible = true;
  }

  openEditForm(bus: BusTimetable): void {
    this.busToEdit = { ...bus };
    this.isFormVisible = true;
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.busToEdit = null;
  }

  onFormSubmit(bus: BusTimetable): void {
    if (this.busToEdit?.id) {
      this.busService.updateBus(this.busToEdit.id, bus).subscribe({
        next: () => {
          this.closeForm();
          this.popupService.success('Success', 'Bus record updated successfully!');
          this.loadBuses();
        },
        error: (err) => {
          this.popupService.error('Update Error', 'Update failed. Please try again.');
          console.error(err);
        }
      });
    } else {
      this.busService.createBus(bus).subscribe({
        next: () => {
          this.closeForm();
          this.popupService.success('Success', 'New bus record added successfully!');
          this.loadBuses();
        },
        error: (err) => {
          this.popupService.error('Save Error', 'Failed to add bus record. Please try again.');
          console.error(err);
        }
      });
    }
  }

  onDelete(bus: BusTimetable): void {
    this.popupService.confirm(
      'Confirm Delete',
      `Are you sure you want to delete "${bus.busName}" (${bus.fromDestination} → ${bus.toDestination})? This action cannot be undone.`,
      () => {
        this.busService.deleteBus(bus.id!).subscribe({
          next: () => {
            this.popupService.success('Deleted', `"${bus.busName}" deleted.`);
            this.loadBuses();
          },
          error: (err) => {
            this.popupService.error('Delete Error', 'Delete failed. Please try again.');
            console.error(err);
          }
        });
      },
      undefined,
      'Delete Bus',
      'btn-danger'
    );
  }

  // ── Admin CRUD ──────────────────────────────────────────────────────────

  loadAdmins(): void {
    this.admins = this.authService.getAllAdmins();
  }

  onCreateAdmin(): void {
    this.adminFormError = '';

    if (!this.newAdminName.trim() || !this.newAdminEmail.trim() || !this.newAdminPassword.trim()) {
      this.adminFormError = 'All fields are required.';
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newAdminEmail.trim())) {
      this.adminFormError = 'Please enter a valid email address.';
      return;
    }

    // Password strength
    if (this.newAdminPassword.length < 6) {
      this.adminFormError = 'Password must be at least 6 characters.';
      return;
    }

    const error = this.authService.createAdmin(
      this.newAdminName.trim(),
      this.newAdminEmail.trim(),
      this.newAdminPassword
    );

    if (error) {
      this.adminFormError = error;
    } else {
      this.popupService.success('Admin Created', `${this.newAdminName.trim()} has been added as an admin.`);
      this.newAdminName = '';
      this.newAdminEmail = '';
      this.newAdminPassword = '';
      this.loadAdmins();
    }
  }

  onDeleteAdmin(admin: Admin): void {
    this.popupService.confirm(
      'Delete Admin',
      `Are you sure you want to remove "${admin.name}" (${admin.email}) as an admin?`,
      () => {
        const error = this.authService.deleteAdmin(admin.email);
        if (error) {
          this.popupService.error('Cannot Delete', error);
        } else {
          this.popupService.success('Removed', `"${admin.name}" has been removed.`);
          this.loadAdmins();
        }
      },
      undefined,
      'Remove Admin',
      'btn-danger'
    );
  }

  isCurrentAdmin(email: string): boolean {
    return this.currentAdmin?.email.toLowerCase() === email.toLowerCase();
  }

  toggleNewAdminPassword(): void {
    this.showNewAdminPassword = !this.showNewAdminPassword;
  }
}
