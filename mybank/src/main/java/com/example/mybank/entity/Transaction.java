package com.example.mybank.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String senderAccountNumber;

    @Column(nullable = false)
    private String receiverAccountNumber;

    @Column(nullable = false)
    private BigDecimal amount;

    // This automatically records the exact date and time the transfer happened
    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String status; // "PENDING", "APPROVED", "REJECTED"

// Update your constructor or add a default
public Transaction() {
    this.status = "APPROVED"; // Default for transfers
}
public String getStatus() { return status; }
public void setStatus(String status) { this.status = status; }

}