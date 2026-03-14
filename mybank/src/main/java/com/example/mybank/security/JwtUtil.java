package com.example.mybank.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    // 1. Define a fixed secret string (must be at least 32 characters for HS256)
    private final String SECRET_STRING = "VEXA_BANK_SUPER_SECRET_KEY_1234567890_SECURITY";
    
    // 2. Create the key from that string
    private final Key key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());
    
    private final int expirationMs = 86400000; 

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + expirationMs))
                .signWith(key) // This now uses the fixed key
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}