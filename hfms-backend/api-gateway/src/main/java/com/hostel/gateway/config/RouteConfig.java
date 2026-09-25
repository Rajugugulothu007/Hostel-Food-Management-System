package com.hostel.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/auth/**")
                        .uri("http://localhost:8081"))
                .route("user-service", r -> r
                        .path("/api/students/**")
                        .uri("http://localhost:8082"))
                .route("voting-service", r -> r
                        .path("/api/votes/**")
                        .uri("http://localhost:8083"))
                .route("menu-service", r -> r
                        .path("/api/menu/**")
                        .uri("http://localhost:8084"))
                .route("feedback-service", r -> r
                        .path("/api/feedback/**")
                        .uri("http://localhost:8085"))
                .route("surplus-service", r -> r
                        .path("/api/surplus/**")
                        .uri("http://localhost:8086"))
                .build();
    }
}