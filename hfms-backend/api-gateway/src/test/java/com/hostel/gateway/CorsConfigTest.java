package com.hostel.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class CorsConfigTest {

    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void preflightRequest_returnsCorsHeaders() {
        webTestClient.options()
                .uri("http://localhost:" + port + "/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "POST")
                .exchange()
                .expectStatus().isOk()
                .expectHeader().valueEquals(
                        "Access-Control-Allow-Origin", "http://localhost:5173")
                .expectHeader().exists("Access-Control-Allow-Methods");
    }

    @Test
    void preflightRequest_fromDisallowedOrigin_noCorsHeader() {
        webTestClient.options()
                .uri("http://localhost:" + port + "/auth/login")
                .header("Origin", "http://evil.com")
                .header("Access-Control-Request-Method", "POST")
                .exchange()
                .expectStatus().isForbidden();
    }

    @Test
    void actualRequest_includesCorsHeader() {
        webTestClient.post()
                .uri("http://localhost:" + port + "/auth/login")
                .header("Origin", "http://localhost:5173")
                .exchange()
                .expectHeader().valueEquals(
                        "Access-Control-Allow-Origin", "http://localhost:5173");
    }
}