package com.finpath.config;

import org.flywaydb.core.api.migration.JavaMigration;
import org.flywaydb.core.api.resource.LoadableResource;
import org.flywaydb.core.api.ResourceProvider;
import org.flywaydb.core.internal.scanner.LocationScannerCache;
import org.flywaydb.core.internal.scanner.ResourceNameCache;
import org.flywaydb.core.internal.scanner.Scanner;
import org.springframework.boot.autoconfigure.flyway.FlywayConfigurationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.Collection;

/**
 * Ensures clean separation between general (H2/MySQL) and PostgreSQL-specific migrations.
 * When running outside the postgres profile, prevents Flyway's recursive scanner from discovering
 * the duplicate V1/V2/V3 migrations located inside the db/migration/postgresql subfolder.
 */
@Configuration
public class FlywayConfig {

    @Bean
    public FlywayConfigurationCustomizer flywayConfigurationCustomizer(Environment environment) {
        return configuration -> {
            boolean isPostgres = Arrays.asList(environment.getActiveProfiles()).contains("postgres");
            if (!isPostgres) {
                Scanner<JavaMigration> scanner = new Scanner<>(
                        JavaMigration.class,
                        configuration.isFailOnMissingLocations(),
                        new ResourceNameCache(),
                        new LocationScannerCache(),
                        configuration
                );

                configuration.resourceProvider(new ResourceProvider() {
                    @Override
                    public LoadableResource getResource(String name) {
                        if (name != null && (name.contains("/postgresql/") || name.contains("\\postgresql\\"))) {
                            return null;
                        }
                        return scanner.getResource(name);
                    }

                    @Override
                    public Collection<LoadableResource> getResources(String prefix, String[] suffixes) {
                        return scanner.getResources(prefix, suffixes).stream()
                                .filter(r -> {
                                    String path = r.getRelativePath().replace('\\', '/');
                                    return !path.startsWith("postgresql/") && !path.contains("/postgresql/");
                                })
                                .toList();
                    }
                });
            }
        };
    }
}
