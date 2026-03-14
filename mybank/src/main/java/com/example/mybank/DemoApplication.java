package com.example.mybank;

import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        // 1. Load .env file
        Dotenv dotenv = Dotenv.configure()
                .directory("./") // Look in the root folder
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        // 2. Set the variables as System properties so Spring can see them
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        // 3. Start Spring
        SpringApplication.run(DemoApplication.class, args);
    }
}