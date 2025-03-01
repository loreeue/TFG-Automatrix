package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = {"org.example"})
public class Main {
    public static void main(String[] args) {
        System.setProperty("java.awt.headless", "false"); // To use the graphical interface of my laptop
		System.setProperty("spring.h2.console.enabled", "true");
        SpringApplication.run(Main.class, args);
    }
}
