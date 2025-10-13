package com.example.auth_service.controller;

import com.example.auth_service.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000") // allow React frontend
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        // trim and lower-case just in case
        String username = user.getUsername().trim().toLowerCase();
        String password = user.getPassword().trim();

        if ("admin".equals(username) && "admin123".equals(password)) {
            user.setRole("ADMIN");
            return ResponseEntity.ok(user);
        } else if ("user".equals(username) && "user123".equals(password)) {
            user.setRole("USER");
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/health-check")
    public String healthCheck() {
        return "Auth service running fine!";
    }
}
