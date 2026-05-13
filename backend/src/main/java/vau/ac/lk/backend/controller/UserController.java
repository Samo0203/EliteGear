package vau.ac.lk.backend.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vau.ac.lk.backend.model.User;
import vau.ac.lk.backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/eg")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ── Inner DTOs ────────────────────────────────────────────────────────────

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class LoginResponse {
        private boolean success;
        private User    user;
        private String  message;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class CheckFieldRequest {
        private String username;
        private String email;
        private String nic;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class CheckAvailabilityResponse {
        private boolean available;
    }

    // ── Endpoints ─────────────────────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/check-username")
    public ResponseEntity<CheckAvailabilityResponse> checkUsername(@RequestBody CheckFieldRequest req) {
        boolean available = !userService.existsUsername(req.getUsername());
        return ResponseEntity.ok(new CheckAvailabilityResponse(available));
    }

    @PostMapping("/check-email")
    public ResponseEntity<CheckAvailabilityResponse> checkEmail(@RequestBody CheckFieldRequest req) {
        boolean available = !userService.existsEmail(req.getEmail());
        return ResponseEntity.ok(new CheckAvailabilityResponse(available));
    }

    @PostMapping("/check-nic")
    public ResponseEntity<CheckAvailabilityResponse> checkNic(@RequestBody CheckFieldRequest req) {
        boolean available = !userService.existsNic(req.getNic());
        return ResponseEntity.ok(new CheckAvailabilityResponse(available));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        try {
            User user = userService.loginUser(req.getUsername(), req.getPassword());
            return ResponseEntity.ok(new LoginResponse(true, user, "Login successful"));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new LoginResponse(false, null, e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User user) {
        try {
            User updated = userService.updateUser(id, user);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}