package vau.ac.lk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vau.ac.lk.backend.model.Category;
import vau.ac.lk.backend.service.CategoryService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/eg")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService service;

    @GetMapping("/getcategory")
    public List<Category> getAll() {
        return service.getAllCategories();
    }

    @GetMapping("/getcategory/{id}")
    public ResponseEntity<Category> getById(@PathVariable String id) {
        return service.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/postcategory")
    public String create(@RequestBody Category category) {
        service.createCategory(category);
        return "Successfully Added";
    }

    @PutMapping("/putcategory/{id}")
    public Category update(@PathVariable String id, @RequestBody Category category) {
        return service.updateCategory(id, category);
    }

    @PatchMapping("/patchcategory/{id}")
    public Category patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        return service.partialUpdate(id, updates);
    }

    @DeleteMapping("/deletecategory")
    public String deleteCategory() {
        service.deleteCategory();
        return "Deleted Successfully";
    }

    @DeleteMapping("/deletecategory/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
