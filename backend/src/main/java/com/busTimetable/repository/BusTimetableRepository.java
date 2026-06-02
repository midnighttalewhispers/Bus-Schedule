package com.busTimetable.repository;

import com.busTimetable.entity.BusTimetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for BusTimetable.
 * All basic CRUD methods (save, findById, findAll, delete) are provided
 * automatically — we only need to define custom queries here.
 */
@Repository
public interface BusTimetableRepository extends JpaRepository<BusTimetable, Long> {

    /**
     * Search by destination — checks both from AND to destination fields
     * using a case-insensitive partial match (SQL ILIKE via LOWER + LIKE).
     *
     * Example: searching "kand" will match records with "Kandy" in either field.
     */
    @Query("""
           SELECT b FROM BusTimetable b
           WHERE LOWER(b.fromDestination) LIKE LOWER(CONCAT('%', :keyword, '%'))
              OR LOWER(b.toDestination)   LIKE LOWER(CONCAT('%', :keyword, '%'))
           ORDER BY b.createdAt DESC
           """)
    List<BusTimetable> searchByDestination(@Param("keyword") String keyword);

    /**
     * Get all records ordered by newest first.
     */
    List<BusTimetable> findAllByOrderByCreatedAtDesc();
}
