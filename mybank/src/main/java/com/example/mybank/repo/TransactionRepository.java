package com.example.mybank.repo;

import com.example.mybank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // This finds transactions where the account was either the sender OR the receiver
    // and sorts them by time (newest first)
    List<Transaction> findBySenderAccountNumberOrReceiverAccountNumberOrderByTimestampDesc(
            String sender, String receiver);
            List<Transaction> findAllByStatus(String status);
}