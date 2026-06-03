import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusTimetable } from '../../models/bus-timetable.model';
import { BusTimetableService } from '../../services/bus-timetable.service';
import { PopupService } from '../../services/popup.service';

/**
 * BusListComponent — Public page component.
 *
 * Responsibilities:
 *  - Load and display all bus records as cards
 *  - Live search/filter by destination
 *  - Show loading spinner and empty state
 *  - Read-only for public users
 */
@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.scss']
})
export class BusListComponent implements OnInit {

  // ── State ──────────────────────────────────────────────────────────────

  buses: BusTimetable[] = [];          // all records from API
  isLoading = false;                    // show spinner while fetching
  searchKeyword = '';                   // live search input value

  constructor(
    private busService: BusTimetableService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.loadBuses();
  }

  // ── Load / Search ───────────────────────────────────────────────────────

  /** Fetch all buses from API (called on init) */
  loadBuses(): void {
    this.isLoading = true;
    this.busService.getAllBuses().subscribe({
      next: (data) => {
        this.buses = data;
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
}
