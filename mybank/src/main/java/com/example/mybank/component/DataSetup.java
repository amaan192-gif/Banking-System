package com.example.mybank.component;

import com.example.mybank.entity.Account;
import com.example.mybank.entity.User;
import com.example.mybank.repo.AccountRepository;
import com.example.mybank.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

//@Component
public class DataSetup implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // The new scrambler

    @Override
    public void run(String... args) throws Exception {
        // Clear old data so we don't have a mix of plain and encrypted passwords
        accountRepository.deleteAll();
        userRepository.deleteAll();
        
        // 1. Create User A (John)
        User user1 = new User();
        user1.setUsername("john_doe");
        // Encrypt the password before saving!
        user1.setPassword(passwordEncoder.encode("password123"));
        user1.setEmail("john@bank.com");
        user1.setRole("CUSTOMER");
        userRepository.save(user1);

        Account account1 = new Account();
        account1.setAccountNumber("ACC1001");
        account1.setBalance(new BigDecimal("10000.00"));
        account1.setUser(user1);
        accountRepository.save(account1);

        // 2. Create User B (Jane)
        User user2 = new User();
        user2.setUsername("jane_smith");
        user2.setPassword(passwordEncoder.encode("password456"));
        user2.setEmail("jane@bank.com");
        user2.setRole("CUSTOMER");
        userRepository.save(user2);

        Account account2 = new Account();
        account2.setAccountNumber("ACC1002");
        account2.setBalance(new BigDecimal("10000.00"));
        account2.setUser(user2);
        accountRepository.save(account2);

        System.out.println("✅ Secure Dummy Data Created with Encrypted Passwords!");
    }
}