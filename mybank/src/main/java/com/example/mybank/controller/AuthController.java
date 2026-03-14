package com.example.mybank.controller;

import com.example.mybank.dto.LoginRequest;
import com.example.mybank.dto.SignupRequest;
import com.example.mybank.entity.Account;
import com.example.mybank.entity.User;
import com.example.mybank.repo.AccountRepository;
import com.example.mybank.repo.UserRepository;
import com.example.mybank.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AccountRepository accountRepository; // Add this at the top with other autowired fields
    
    @Autowired
    private JwtUtil jwtUtil; // Inject the wristband maker
    
@PostMapping("/login")
public org.springframework.http.ResponseEntity<?> login(@RequestBody LoginRequest request) {
    User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 1. Check if the account is already locked
    if (!user.isAccountNonLocked()) {
        return org.springframework.http.ResponseEntity.status(403)
                .body("Account is locked due to 5 failed attempts. Contact admin.");
    }

    // 2. Try to match password
    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        // SUCCESS: Reset failed attempts
        user.setFailedAttempts(0);
        userRepository.save(user);
        
        // Generate the token
        String token = jwtUtil.generateToken(user.getUsername());

        // 👇 NEW LOGIC: Create a Map to hold both Token and Role
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole()); // Assumes your User entity has getRole()
        
        return org.springframework.http.ResponseEntity.ok(response);
        
    } else {
        // FAILURE logic remains the same
        int newAttempts = user.getFailedAttempts() + 1;
        user.setFailedAttempts(newAttempts);

        if (newAttempts >= 5) {
            user.setAccountNonLocked(false);
            userRepository.save(user);
            return org.springframework.http.ResponseEntity.status(401)
                    .body("Invalid Credentials. Account has been LOCKED.");
        }

        userRepository.save(user);
        return org.springframework.http.ResponseEntity.status(401)
                .body("Invalid Credentials. Attempt " + newAttempts + " of 5.");
    }
}


@PostMapping("/signup")
public org.springframework.http.ResponseEntity<?> signup(@RequestBody SignupRequest request) {
    // 1. Check if username already exists
    if (userRepository.findByUsername(request.getUsername()).isPresent()) {
        return ResponseEntity.badRequest().body("Error: Username is already taken!");
    }
    
    // 2. Create and Save New User
    User newUser = new User();
    newUser.setUsername(request.getUsername());
    newUser.setPassword(passwordEncoder.encode(request.getPassword())); // Secure it!
    newUser.setEmail(request.getEmail());
    newUser.setRole("CUSTOMER");
    userRepository.save(newUser);
    
    // 3. Automatically Create a Bank Account for them
    Account newAccount = new Account();
    newAccount.setAccountNumber("ACC" + System.currentTimeMillis()); // Generate a unique ID
    newAccount.setBalance(new java.math.BigDecimal("0.00")); // Starting balance
    newAccount.setUser(newUser);
    accountRepository.save(newAccount);

    // 4. Return a Map (JSON Object) instead of a String
    java.util.Map<String, String> response = new java.util.HashMap<>();
    response.put("message", "User registered successfully!");
    response.put("accountNumber", newAccount.getAccountNumber());
    
    return ResponseEntity.ok(response);
}
}