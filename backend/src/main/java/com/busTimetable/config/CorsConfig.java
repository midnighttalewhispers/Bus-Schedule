package com.busTimetable.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * CORS configuration — allows the Angular frontend (running on a different
 * origin) to call the Spring Boot REST API.
 *
 * Allowed origins:
 *   - http://localhost:4200  → Angular dev server
 *   - https://*.onrender.com → Render.com production deployments
 *
 * To restrict further in production, replace the Render pattern with your
 * exact frontend URL (e.g. https://bus-frontend.onrender.com).
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow credentials (cookies / auth headers if needed later)
        config.setAllowCredentials(true);

        // Allowed origins — add your production frontend URL here
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:4200",            // Angular dev
                "http://localhost:4201",            // alternate dev port
                "https://*.onrender.com"            // Render.com production
        ));

        // Allowed HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));

        // Allowed request headers
        config.setAllowedHeaders(List.of("*"));

        // Headers the browser is allowed to read from the response
        config.setExposedHeaders(List.of("Content-Disposition"));

        // Cache pre-flight response for 1 hour (3600 seconds)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
