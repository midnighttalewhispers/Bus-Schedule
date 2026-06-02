package com.busTimetable.controller;

import com.busTimetable.entity.BusTimetable;
import com.busTimetable.service.BusTimetableService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller — exposes all bus timetable endpoints under /api/buses.
 *
 * Endpoints:
 *   GET    /api/buses              → get all buses (newest first)
 *   GET    /api/buses/search?q=X  → search by destination keyword
 *   GET    /api/buses/{id}        → get one bus by ID
 *   POST   /api/buses             → create new bus record
 *   PUT    /api/buses/{id}        → update existing bus record
 *   DELETE /api/buses/{id}        → delete bus record
 */
@RestController
@RequestMapping("/api/buses")
public class BusTimetableController {

    private final BusTimetableService service;

    public BusTimetableController(BusTimetableService service) {
        this.service = service;
    }

    // ── READ ────────────────────────────────────────────────────────────────

    /**
     * GET /api/buses
     * Returns all bus timetable records ordered by newest first.
     */
    @GetMapping
    public ResponseEntity<List<BusTimetable>> getAllBuses() {
        return ResponseEntity.ok(service.getAllBuses());
    }

    /**
     * GET /api/buses/search?q=kandy
     * Searches by destination keyword (from OR to field, case-insensitive).
     * Returns all records if q is blank.
     */
    @GetMapping("/search")
    public ResponseEntity<List<BusTimetable>> searchBuses(
            @RequestParam(name = "q", defaultValue = "") String keyword) {
        return ResponseEntity.ok(service.searchByDestination(keyword));
    }

    /**
     * GET /api/buses/{id}
     * Returns a single bus record. Returns 404 if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BusTimetable> getBusById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getBusById(id));
    }

    // ── CREATE ──────────────────────────────────────────────────────────────

    /**
     * POST /api/buses
     * Creates a new bus timetable record.
     * Request body is validated via @Valid — returns 400 if invalid.
     * Returns 201 Created with the saved record.
     */
    @PostMapping
    public ResponseEntity<BusTimetable> createBus(@Valid @RequestBody BusTimetable bus) {
        BusTimetable created = service.createBus(bus);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ── UPDATE ──────────────────────────────────────────────────────────────

    /**
     * PUT /api/buses/{id}
     * Updates an existing bus record. Returns 404 if ID not found.
     */
    @PutMapping("/{id}")
    public ResponseEntity<BusTimetable> updateBus(
            @PathVariable Long id,
            @Valid @RequestBody BusTimetable bus) {
        return ResponseEntity.ok(service.updateBus(id, bus));
    }

    // ── DELETE ──────────────────────────────────────────────────────────────

    /**
     * DELETE /api/buses/{id}
     * Deletes a bus record. Returns 204 No Content on success, 404 if not found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        service.deleteBus(id);
        return ResponseEntity.noContent().build();
    }
}
