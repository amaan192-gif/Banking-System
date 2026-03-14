package com.example.mybank.service;

import com.example.mybank.entity.Account;
import com.example.mybank.entity.Transaction;
import com.example.mybank.entity.User;
import com.example.mybank.repo.AccountRepository;
import com.example.mybank.repo.TransactionRepository;
import com.example.mybank.repo.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder; // Add this import
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String transferMoney(String senderAccountNum, String receiverAccountNum, BigDecimal amount,String enteredPin) {
        
        // 1. CYBERSECURITY: Get the username of the person who is currently logged in
        String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        //String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(loggedInUsername)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. VERIFY THE PIN!
        if (user.getTransactionPin() == null || !user.getTransactionPin().equals(enteredPin)) {
            throw new RuntimeException("Incorrect Transaction PIN. Access Denied.");
        }
        // 3. Find the sender account
        Account sender = accountRepository.findByAccountNumber(senderAccountNum)
                .orElseThrow(() -> new RuntimeException("Sender account not found!"));

        // 4. SECURE CHECK: Does this account actually belong to the logged-in user?
        if (!sender.getUser().getUsername().equals(loggedInUsername)) {
            throw new RuntimeException("Security Alert: Access Denied. You do not own account " + senderAccountNum);
        }

        // 5. Find the receiver
        Account receiver = accountRepository.findByAccountNumber(receiverAccountNum)
                .orElseThrow(() -> new RuntimeException("Receiver account not found!"));

        // 6. Balance Check
        if (sender.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance!");
        }

        // 7. Perform the math
        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));

        accountRepository.save(sender);
        accountRepository.save(receiver);

        // 8. Log it
        Transaction transaction = new Transaction();
        transaction.setSenderAccountNumber(senderAccountNum);
        transaction.setReceiverAccountNumber(receiverAccountNum);
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);

        return "Transfer successful!";
    }

    // Update your getAccountDetails similarly if you want to protect balances!
    public Account getAccountDetails(String accountNumber) {
        String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getUser().getUsername().equals(loggedInUsername)) {
            throw new RuntimeException("Security Alert: You cannot view someone else's balance!");
        }
        return account;
    }

    // Add this method to AccountService.java
public List<Transaction> getTransactionHistory(String accountNumber) {
    // 1. Security Check: Who is logged in?
    String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();
    
    // 2. Find the account and check ownership
    Account account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found"));

    if (!account.getUser().getUsername().equals(loggedInUsername)) {
        throw new RuntimeException("Security Alert: Access Denied. You cannot view this history.");
    }

    // 3. Fetch the history (using the account number for both fields to get all movement)
    return transactionRepository.findBySenderAccountNumberOrReceiverAccountNumberOrderByTimestampDesc(
            accountNumber, accountNumber);
}

    // Add this to AccountService.java
public Map<String, Object> getMyProfile() {
    String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();
    Account account = accountRepository.findAll().stream()
            .filter(acc -> acc.getUser().getUsername().equals(loggedInUsername))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Profile not found"));

    Map<String, Object> response = new HashMap<>();
    response.put("accountNumber", account.getAccountNumber());
    response.put("balance", account.getBalance());
    // 👇 This tells React if we need to show the "Set PIN" screen
    response.put("hasPin", account.getUser().getTransactionPin() != null); 
    
    return response;
}

@Transactional
public String depositMoney(String accountNumber, BigDecimal amount) {
    // 1. Security Check: Only the owner can request a deposit
    String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();
    Account account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found!"));

    if (!account.getUser().getUsername().equals(loggedInUsername)) {
        throw new RuntimeException("Security Alert: Access Denied!");
    }

    // 2. Log the Transaction as PENDING
    // We do NOT update account.setBalance here anymore!
    Transaction transaction = new Transaction();
    transaction.setSenderAccountNumber("CASH-DEPOSIT"); // Changed from SELF-DEPOSIT
    transaction.setReceiverAccountNumber(accountNumber);
    transaction.setAmount(amount);
    transaction.setStatus("PENDING"); // You must add this field to your Transaction entity
    transaction.setTimestamp(LocalDateTime.now());
    
    transactionRepository.save(transaction);

    return "Deposit request for ₹" + amount + " submitted. Status: PENDING. Please provide cash to the manager.";
}

@Transactional
public String approveDeposit(Long transactionId) {
    // 1. Find the pending transaction
    Transaction tx = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction request not found!"));

    if (!"PENDING".equals(tx.getStatus())) {
        throw new RuntimeException("Error: This transaction is already " + tx.getStatus());
    }

    // 2. Find the user's account to actually add the money
    Account account = accountRepository.findByAccountNumber(tx.getReceiverAccountNumber())
            .orElseThrow(() -> new RuntimeException("Target account not found!"));

    // 3. NOW we perform the math
    account.setBalance(account.getBalance().add(tx.getAmount()));
    accountRepository.save(account);

    // 4. Update the status to APPROVED
    tx.setStatus("APPROVED");
    transactionRepository.save(tx);

    return "Success: ₹" + tx.getAmount() + " has been added to Account " + account.getAccountNumber();
}

@Transactional
public String rejectDeposit(Long transactionId) {
    Transaction tx = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction request not found!"));

    if (!"PENDING".equals(tx.getStatus())) {
        throw new RuntimeException("Error: This transaction is already " + tx.getStatus());
    }

    // Mark as REJECTED
    tx.setStatus("REJECTED");
    transactionRepository.save(tx);

    return "Deposit request for ₹" + tx.getAmount() + " has been REJECTED.";
}

@jakarta.transaction.Transactional
public String saveTransactionPin(String newPin) {
    // 1. Get the username from the security context
    String loggedInUsername = org.springframework.security.core.context.SecurityContextHolder
            .getContext().getAuthentication().getName();

    // 2. Find the user
    User user = userRepository.findByUsername(loggedInUsername)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 3. Save the PIN
    user.setTransactionPin(newPin);
    userRepository.save(user);

    return "Transaction PIN set successfully!";
}

}