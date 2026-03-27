package vau.ac.lk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vau.ac.lk.backend.model.Category;
import vau.ac.lk.backend.repository.CategoryRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository repo;

    public List<Category> getAllCategories() {
        return repo.findAll();
    }

    public Optional<Category> getCategoryById(String id) {
        return repo.findById(id);
    }

    public Category createCategory(Category category) {
        return repo.save(category);
    }

    // Full update (PUT)
    public Category updateCategory(String id, Category newCategory) {
        newCategory.setId(id);
        return repo.save(newCategory);
    }

    // Partial update (PATCH)
    public Category partialUpdate(String id, Map<String, Object> updates) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "name" -> category.setName((String) value);
                case "description" -> category.setDescription((String) value);
                case "imageUrl" -> category.setImageUrl((String) value);
                case "type" -> category.setType((String) value);
            }
        });
        return repo.save(category);
    }

    public void deleteCategory(String id) {
        repo.deleteById(id);
    }

    public void deleteCategory() {
        repo.deleteAll();
    }

}
