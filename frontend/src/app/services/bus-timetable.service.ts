import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BusTimetable } from '../models/bus-timetable.model';

/**
 * BusTimetableService
 *
 * This service is the single point of contact between the Angular UI
 * and the Spring Boot REST API. All HTTP calls live here — components
 * just call these methods and subscribe to the returned Observables.
 *
 * Base URL comes from environment.ts (dev) or environment.prod.ts (prod).
 */
@Injectable({
  providedIn: 'root'   // singleton — shared across the whole app
})
export class BusTimetableService {

  // The full API base URL, e.g. "http://localhost:8081/api/buses"
  private readonly apiUrl = `${environment.apiUrl}/buses`;

  constructor(private http: HttpClient) {}

  // ── READ ──────────────────────────────────────────────────────────────────

  /**
   * GET /api/buses
   * Returns all bus timetable records (newest first).
   */
  getAllBuses(): Observable<BusTimetable[]> {
    return this.http.get<BusTimetable[]>(this.apiUrl);
  }

  /**
   * GET /api/buses/search?q=keyword
   * Searches buses by destination keyword (from OR to, case-insensitive).
   */
  searchBuses(keyword: string): Observable<BusTimetable[]> {
    const params = new HttpParams().set('q', keyword);
    return this.http.get<BusTimetable[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * GET /api/buses/:id
   * Returns a single bus record by its ID.
   */
  getBusById(id: number): Observable<BusTimetable> {
    return this.http.get<BusTimetable>(`${this.apiUrl}/${id}`);
  }

  // ── CREATE ────────────────────────────────────────────────────────────────

  /**
   * POST /api/buses
   * Creates a new bus timetable record.
   * @param bus The new bus data (no id field needed)
   */
  createBus(bus: BusTimetable): Observable<BusTimetable> {
    return this.http.post<BusTimetable>(this.apiUrl, bus);
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────

  /**
   * PUT /api/buses/:id
   * Updates an existing bus record.
   * @param id The bus record ID to update
   * @param bus The updated bus data
   */
  updateBus(id: number, bus: BusTimetable): Observable<BusTimetable> {
    return this.http.put<BusTimetable>(`${this.apiUrl}/${id}`, bus);
  }

  // ── DELETE ────────────────────────────────────────────────────────────────

  /**
   * DELETE /api/buses/:id
   * Deletes a bus record by ID.
   * Returns void (204 No Content from backend).
   */
  deleteBus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
