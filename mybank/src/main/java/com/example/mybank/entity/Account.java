package com.example.mybank.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "accounts")
@Data
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String accountNumber;

    @Column(nullable = false)
    private BigDecimal balance;

    // This magically links the bank account to the user who owns it!
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

}