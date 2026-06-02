import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusTimetable } from '../../models/bus-timetable.model';
import { BusTimetableService } from '../../services/bus-timetable.service';
import { PopupService } from '../../services/popup.service';
import { BusFormComponent } from '../bus-form/bus-form.component';

/**
 * BusListComponent — Main page component.
 *
 * Responsibilities:
 *  - Load and display all bus records as cards
 *  - Live search/filter by destination
 *  - Open the Add/Edit modal form
 *  - Handle delete with confirmation
 *  - Show loading spinner and empty state
 */
@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BusFormComponent],
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.scss']
})
export class BusListComponent implements OnInit {

  // ── State ──────────────────────────────────────────────────────────────

  buses: BusTimetable[] = [];          // all records from API
  isLoading = false;                    // show spinner while fetching
  searchKeyword = '';                   // live search input value
  allRouteNumbers: string[] = [];       // unique route numbers for autocomplete

  // Modal state
  isFormVisible = false;
  busToEdit: BusTimetable | null = null;

  constructor(
    private busService: BusTimetableService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.loadBuses();
  }

  // ── Load / Search ───────────────────────────────────────────────────────

  /** Fetch all buses from API (called on init and after mutations) */
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

  /**
   * Called on every keystroke in the search box.
   * Uses the backend search endpoint for server-side filtering.
   */
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

  /** Clear search and reload all records */
  clearSearch(): void {
    this.searchKeyword = '';
    this.loadBuses();
  }

  // ── Modal Control ───────────────────────────────────────────────────────

  /** Open the modal in Add mode */
  openAddForm(): void {
    this.busToEdit = null;
    this.isFormVisible = true;
  }

  /** Open the modal in Edit mode with the selected bus */
  openEditForm(bus: BusTimetable): void {
    this.busToEdit = { ...bus };   // shallow copy so form doesn't mutate list directly
    this.isFormVisible = true;
  }

  /** Close the modal */
  closeForm(): void {
    this.isFormVisible = false;
    this.busToEdit = null;
  }

  // ── CRUD Handlers ───────────────────────────────────────────────────────

  /**
   * Called when the form emits a valid submission.
   * Routes to create or update depending on whether busToEdit has an id.
   */
  onFormSubmit(bus: BusTimetable): void {
    if (this.busToEdit?.id) {
      // Edit mode
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
      // Add mode
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

  /** Delete a bus record after user confirmation */
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
      }
    );
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

}
