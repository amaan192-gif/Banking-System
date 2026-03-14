package com.example.mybank.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String password;
    private String email;
}