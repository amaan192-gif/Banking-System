package com.example.mybank.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Running");
        response.put("message", "Welcome to VEXA Bank Backend API 🚀");
        response.put("port", "4040");
        return response; // This will return a nice JSON object
    }
}