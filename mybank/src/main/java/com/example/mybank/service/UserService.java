package com.example.mybank.service;

import com.example.mybank.entity.User;
import com.example.mybank.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    // This connects our Brain (Service) to our Messenger (Repo)
    @Autowired
    private UserRepository userRepository;

    // A simple rule to register a new user and save them in the database
    public User registerUser(User user) {
        // (Later on, we will add the security magic here to encrypt their password!)
        return userRepository.save(user);
    }
}