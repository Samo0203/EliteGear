package vau.ac.lk.backend.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vau.ac.lk.backend.model.User;
import vau.ac.lk.backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/eg")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
