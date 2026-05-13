package vau.ac.lk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import vau.ac.lk.backend.model.User;
import vau.ac.lk.backend.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository     userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // ── Register ──────────────────────────────────────────────────────────────
    public void registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByNic(user.getNic())) {
            throw new RuntimeException("NIC already registered");
        }

        // Hash password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    public User loginUser(String username, String password) {
        // Try username first, then email
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    // ── Admin helpers ─────────────────────────────────────────────────────────
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public User updateUser(String id, User updatedUser) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedUser.getEmail() != null
                && !updatedUser.getEmail().equalsIgnoreCase(existing.getEmail())
                && userRepository.existsByEmail(updatedUser.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (updatedUser.getUsername() != null
                && !updatedUser.getUsername().equalsIgnoreCase(existing.getUsername())
                && userRepository.existsByUsername(updatedUser.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        if (updatedUser.getNic() != null
                && !updatedUser.getNic().equals(existing.getNic())
                && userRepository.existsByNic(updatedUser.getNic())) {
            throw new RuntimeException("NIC already registered");
        }

        if (updatedUser.getName() != null) existing.setName(updatedUser.getName());
        if (updatedUser.getEmail() != null) existing.setEmail(updatedUser.getEmail());
        if (updatedUser.getMobile() != null) existing.setMobile(updatedUser.getMobile());
        if (updatedUser.getRegion() != null) existing.setRegion(updatedUser.getRegion());
        if (updatedUser.getNic() != null) existing.setNic(updatedUser.getNic());
        if (updatedUser.getAvatarUrl() != null) existing.setAvatarUrl(updatedUser.getAvatarUrl());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(existing);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    public boolean existsUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsNic(String nic) {
        return userRepository.existsByNic(nic);
    }
}
