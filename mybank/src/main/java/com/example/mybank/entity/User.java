package com.example.mybank.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String role; // This will hold either "CUSTOMER" or "ADMIN"

    @Column(length = 4)
private String transactionPin; // Stores a 4-digit PIN (e.g., "1234")

    // Add these to User.java
private int failedAttempts = 0;
private boolean accountNonLocked = true;

public String getTransactionPin() { return transactionPin; }
public void setTransactionPin(String transactionPin) { this.transactionPin = transactionPin; }

}
