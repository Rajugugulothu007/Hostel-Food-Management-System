package com.hostel.gateway;

import com.hostel.gateway.config.RouteConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.test.context.ActiveProfiles;
import reactor.core.publisher.Flux;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class RouteConfigTest {

    @Autowired
    private RouteLocator routeLocator;

    @Autowired
    private RouteConfig routeConfig;

    @Test
    void routeLocator_loadsAllThreeRoutes() {
        List<Route> routes = routeLocator.getRoutes()
                .collectList()
                .block();

        assertThat(routes).isNotNull();
        assertThat(routes).hasSize(3);

        List<String> routeIds = routes.stream().map(Route::getId).toList();
        assertThat(routeIds).containsExactlyInAnyOrder(
                "auth-service", "user-service", "voting-service");
    }

    @Test
    void authServiceRoute_routesToPort8081() {
        Route route = routeLocator.getRoutes()
                .filter(r -> r.getId().equals("auth-service"))
                .blockFirst();

        assertThat(route).isNotNull();
        assertThat(route.getUri().toString()).isEqualTo("http://localhost:8081");
    }

    @Test
    void userServiceRoute_routesToPort8082() {
        Route route = routeLocator.getRoutes()
                .filter(r -> r.getId().equals("user-service"))
                .blockFirst();

        assertThat(route).isNotNull();
        assertThat(route.getUri().toString()).isEqualTo("http://localhost:8082");
    }

    @Test
    void votingServiceRoute_routesToPort8083() {
        Route route = routeLocator.getRoutes()
                .filter(r -> r.getId().equals("voting-service"))
                .blockFirst();

        assertThat(route).isNotNull();
        assertThat(route.getUri().toString()).isEqualTo("http://localhost:8083");
    }

    @Test
    void routeLocatorBeanExists() {
        assertThat(routeConfig).isNotNull();

        Flux<Route> routes = routeConfig.routes(null) == null
                ? Flux.empty() : null;
        // Sanity check — bean is wired
    }
}