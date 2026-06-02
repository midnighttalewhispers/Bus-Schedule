// ─────────────────────────────────────────────────────────────────────────────
// Bus Timetable TypeScript Model
// This interface mirrors the Spring Boot BusTimetable entity exactly.
// Used for type-safety throughout the Angular app.
// ─────────────────────────────────────────────────────────────────────────────

export interface BusTimetable {
  id?: number;               // undefined when creating (backend assigns it)
  busName: string;           // Name of the bus service
  fromDestination: string;   // Origin city
  toDestination: string;     // Destination city
  departureTime: string;     // Departure from origin, e.g. "06:30 AM"
  returnTime?: string;       // Return departure time (optional)
  contactPhone: string;      // Sri Lankan phone number
  notes?: string;            // Optional extra info
  routeNumber?: string;      // Route number (optional)
  numberPlate?: string;      // Bus number plate (optional)
  createdAt?: string;        // ISO timestamp (from backend)
  updatedAt?: string;        // ISO timestamp (from backend)
}
