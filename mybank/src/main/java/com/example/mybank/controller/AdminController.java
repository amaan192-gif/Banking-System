package com.example.mybank.controller;

import com.example.mybank.entity.Transaction;
import com.example.mybank.service.AccountService;
import com.example.mybank.repo.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
// Ensure your SecurityConfig allows only "ADMIN" or "MANAGER" roles to access this!
public class AdminController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountService accountService;

    // 1. Get all pending deposit requests for the manager to see
    @GetMapping("/pending-deposits")
    public List<Transaction> getPendingDeposits() {
        return transactionRepository.findAllByStatus("PENDING");
    }

    // 2. Approve a specific deposit by ID
    @PostMapping("/approve/{id}")
    public ResponseEntity<String> approve(@PathVariable Long id) {
        String result = accountService.approveDeposit(id);
        return ResponseEntity.ok(result);
    }
    @PostMapping("/reject/{id}")
public ResponseEntity<String> reject(@PathVariable Long id) {
    String result = accountService.rejectDeposit(id);
    return ResponseEntity.ok(result);
}
}