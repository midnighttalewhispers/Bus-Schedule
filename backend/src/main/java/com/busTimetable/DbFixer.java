package com.busTimetable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DbFixer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DbFixer.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            logger.info("Executing database fix to alter contact_phone column length...");
            jdbcTemplate.execute("ALTER TABLE bus_timetable ALTER COLUMN contact_phone TYPE VARCHAR(255);");
            logger.info("Successfully altered contact_phone column to VARCHAR(255).");
        } catch (Exception e) {
            logger.warn("Could not alter column (it may already be fixed): " + e.getMessage());
        }
    }
}
