package com.busTimetable.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * JPA entity representing one bus timetable record.
 * Hibernate will auto-create the 'bus_timetable' table in PostgreSQL.
 */
@Entity
@Table(name = "bus_timetable")
public class BusTimetable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Bus name is required")
    @Size(max = 100, message = "Bus name must be at most 100 characters")
    @Column(name = "bus_name", nullable = false, length = 100)
    private String busName;

    @NotBlank(message = "From destination is required")
    @Size(max = 100, message = "From destination must be at most 100 characters")
    @Column(name = "from_destination", nullable = false, length = 100)
    private String fromDestination;

    @NotBlank(message = "To destination is required")
    @Size(max = 100, message = "To destination must be at most 100 characters")
    @Column(name = "to_destination", nullable = false, length = 100)
    private String toDestination;

    @NotBlank(message = "Departure time is required")
    @Column(name = "departure_time", nullable = false, length = 20)
    private String departureTime;

    @Column(name = "return_time", length = 20)
    private String returnTime;

    @NotBlank(message = "Contact phone is required")
    @Size(max = 255, message = "Contact phone must be at most 255 characters")
    @Column(name = "contact_phone", nullable = false, length = 255)
    private String contactPhone;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "route_number", length = 50)
    private String routeNumber;

    @Column(name = "number_plate", length = 100)
    private String numberPlate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public BusTimetable() {
    }

    public BusTimetable(Long id, String busName, String fromDestination, String toDestination, String departureTime, String returnTime, String contactPhone, String notes, String routeNumber, String numberPlate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.busName = busName;
        this.fromDestination = fromDestination;
        this.toDestination = toDestination;
        this.departureTime = departureTime;
        this.returnTime = returnTime;
        this.contactPhone = contactPhone;
        this.notes = notes;
        this.routeNumber = routeNumber;
        this.numberPlate = numberPlate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBusName() { return busName; }
    public void setBusName(String busName) { this.busName = busName; }

    public String getFromDestination() { return fromDestination; }
    public void setFromDestination(String fromDestination) { this.fromDestination = fromDestination; }

    public String getToDestination() { return toDestination; }
    public void setToDestination(String toDestination) { this.toDestination = toDestination; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getReturnTime() { return returnTime; }
    public void setReturnTime(String returnTime) { this.returnTime = returnTime; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getRouteNumber() { return routeNumber; }
    public void setRouteNumber(String routeNumber) { this.routeNumber = routeNumber; }

    public String getNumberPlate() { return numberPlate; }
    public void setNumberPlate(String numberPlate) { this.numberPlate = numberPlate; }
}
