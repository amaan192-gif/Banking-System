package com.example.mybank.controller;

import com.example.mybank.dto.TransferRequest;
import com.example.mybank.entity.Account;
import com.example.mybank.entity.Transaction;
import com.example.mybank.repo.AccountRepository;
import com.example.mybank.repo.TransactionRepository;
import com.example.mybank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private AccountService accountService;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private TransactionRepository transactionRepository;

    @PostMapping("/transfer")
    public String transferMoney(@RequestBody TransferRequest request) {
        return accountService.transferMoney(
                request.getSenderAccountNumber(),
                request.getReceiverAccountNumber(),
                request.getAmount(),
                request.getPin()
        );
    }

    @GetMapping("/{accountNumber}")
    public Account getAccountDetails(@PathVariable String accountNumber) {
        return accountService.getAccountDetails(accountNumber);
    }

    @GetMapping("/{accountNumber}/history")
    public List<Transaction> getHistory(@PathVariable String accountNumber) {
        return accountService.getTransactionHistory(accountNumber);
    }

    @GetMapping("/my-profile")
public org.springframework.http.ResponseEntity<?> getMyProfile() {
    // Now it matches the Map being returned by the service
    return org.springframework.http.ResponseEntity.ok(accountService.getMyProfile());
}

    // Add this to your AccountController.java
@PostMapping("/set-pin")
public org.springframework.http.ResponseEntity<String> setPin(@RequestBody java.util.Map<String, String> request) {
    String pin = request.get("pin");
    
    if (pin == null || pin.length() != 4) {
        return org.springframework.http.ResponseEntity.badRequest().body("PIN must be exactly 4 digits.");
    }

    // Call the service to save it
    String result = accountService.saveTransactionPin(pin);
    return org.springframework.http.ResponseEntity.ok(result);
}

    // This is the clean way: Let the Service handle the DB logic
    @PostMapping("/{accountNumber}/deposit")
    public ResponseEntity<?> deposit(
            @PathVariable String accountNumber, 
            @RequestBody Map<String, Double> request) {
        
        Double amount = request.get("amount");
        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest().body("Invalid deposit amount");
        }

        // We call the service instead of using repositories directly here
        String result = accountService.depositMoney(accountNumber, BigDecimal.valueOf(amount));
        return ResponseEntity.ok(result);
    }

    public String depositMoney(String accountNumber, BigDecimal amount) {
    // 1. Fetch the account from DB
    Account account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found"));

    // 2. Add the new amount to the existing balance
    account.setBalance(account.getBalance().add(amount));
    accountRepository.save(account);

    // 3. Create a Transaction record so it shows up in history
    Transaction depositTx = new Transaction();
    depositTx.setSenderAccountNumber("SELF-DEPOSIT");
    depositTx.setReceiverAccountNumber(accountNumber);
    depositTx.setAmount(amount);
    depositTx.setTimestamp(java.time.LocalDateTime.now());
    transactionRepository.save(depositTx);

    return "Deposit of ₹" + amount + " successful! New Balance: ₹" + account.getBalance();
}

}