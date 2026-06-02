package com.busTimetable.service;

import com.busTimetable.entity.BusTimetable;
import com.busTimetable.exception.ResourceNotFoundException;
import com.busTimetable.repository.BusTimetableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service layer — contains all business logic for bus timetable operations.
 * Keeps the controller thin and testable.
 */
@Service
public class BusTimetableService {

    private final BusTimetableRepository repository;

    public BusTimetableService(BusTimetableRepository repository) {
        this.repository = repository;
    }

    /**
     * Retrieve all bus records, newest first.
     */
    public List<BusTimetable> getAllBuses() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Retrieve a single bus record by ID.
     * Throws ResourceNotFoundException (→ HTTP 404) if not found.
     */
    public BusTimetable getBusById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Bus record not found with id: " + id));
    }

    /**
     * Search bus records by destination keyword (from OR to).
     * Returns all records if keyword is blank.
     */
    public List<BusTimetable> searchByDestination(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllBuses();
        }
        return repository.searchByDestination(keyword.trim());
    }

    /**
     * Create a new bus timetable record.
     */
    public BusTimetable createBus(BusTimetable bus) {
        return repository.save(bus);
    }

    /**
     * Update an existing bus record.
     * Fetches the existing record first (throws 404 if not found),
     * then applies all updated fields and saves.
     */
    public BusTimetable updateBus(Long id, BusTimetable updatedBus) {
        BusTimetable existing = getBusById(id);

        existing.setBusName(updatedBus.getBusName());
        existing.setFromDestination(updatedBus.getFromDestination());
        existing.setToDestination(updatedBus.getToDestination());
        existing.setDepartureTime(updatedBus.getDepartureTime());
        existing.setReturnTime(updatedBus.getReturnTime());
        existing.setContactPhone(updatedBus.getContactPhone());
        existing.setNotes(updatedBus.getNotes());
        existing.setRouteNumber(updatedBus.getRouteNumber());
        existing.setNumberPlate(updatedBus.getNumberPlate());

        return repository.save(existing);
    }

    /**
     * Delete a bus record by ID.
     * Throws 404 if the record doesn't exist.
     */
    public void deleteBus(Long id) {
        // Ensure record exists before deletion
        getBusById(id);
        repository.deleteById(id);
    }
}
