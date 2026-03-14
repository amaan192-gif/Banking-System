package com.example.mybank.repo;

import com.example.mybank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Finds a user by their username automatically!
    Optional<User> findByUsername(String username);
    
    // Finds a user by their email!
    Optional<User> findByEmail(String email);
}