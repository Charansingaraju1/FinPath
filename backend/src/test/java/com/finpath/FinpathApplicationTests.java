package com.finpath;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class FinpathApplicationTests {

    @Test
    @DisplayName("Context loads successfully and Flyway schema migrations execute properly")
    void contextLoads() {
        // Verifies Spring context, Flyway migration execution, JPA repositories, and SecurityFilterChain
    }
}
