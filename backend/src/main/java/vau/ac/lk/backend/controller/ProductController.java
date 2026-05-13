package vau.ac.lk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vau.ac.lk.backend.model.Product;
import vau.ac.lk.backend.service.ProductService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/eg")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @GetMapping("/getproduct")
    public List<Product> getAll() {
        return service.getAllProducts();
    }

    @GetMapping("/getproduct/{id}")
    public ResponseEntity<Product> getById(@PathVariable String id) {
        return service.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Filter by category
    @GetMapping("/getproduct/category/{category}")
    public List<Product> getByCategory(@PathVariable String category) {
        return service.getProductsByCategory(category);
    }

    // Search by name
    @GetMapping("/getproduct/search")
    public List<Product> search(@RequestParam String name) {
        return service.searchProducts(name);
    }

    @PostMapping("/postproduct")
    public ResponseEntity<String> create(@RequestBody Product product) {
        service.createProduct(product);
        return ResponseEntity.ok("Product created successfully");
    }

    @PutMapping("/putproduct/{id}")
    public ResponseEntity<Product> update(@PathVariable String id, @RequestBody Product product) {
        return ResponseEntity.ok(service.updateProduct(id, product));
    }

    @PatchMapping("/patchproduct/{id}")
    public ResponseEntity<Product> patch(@PathVariable String id,
                                         @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(service.partialUpdate(id, updates));
    }

    @DeleteMapping("/deleteproduct/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}