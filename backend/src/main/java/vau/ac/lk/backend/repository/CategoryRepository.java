package vau.ac.lk.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import vau.ac.lk.backend.model.Category;

public interface CategoryRepository extends MongoRepository<Category, String> {
}
