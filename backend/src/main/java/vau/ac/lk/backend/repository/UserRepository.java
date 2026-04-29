package vau.ac.lk.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import vau.ac.lk.backend.model.User;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}