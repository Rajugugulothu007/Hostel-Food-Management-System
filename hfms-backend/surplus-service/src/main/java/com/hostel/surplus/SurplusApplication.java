package com.hostel.surplus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.hostel.surplus", "com.hostel.common"})
public class SurplusApplication {
    public static void main(String[] args) {
        SpringApplication.run(SurplusApplication.class, args);
    }
}