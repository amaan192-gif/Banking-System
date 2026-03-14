package com.example.mybank.repo;

import com.example.mybank.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    // Finds an account using the account number
    Optional<Account> findByAccountNumber(String accountNumber);
}