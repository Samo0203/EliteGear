package vau.ac.lk.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import vau.ac.lk.backend.model.Product;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(String category);
}