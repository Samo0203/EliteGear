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
@CrossOrigin(origins = "http://localhost:3000")
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

    @PostMapping("/postproduct")
    public String create(@RequestBody Product product) {
        service.createProduct(product);
        return "Successfully Added";
    }

    @PutMapping("/putproduct/{id}")
    public Product update(@PathVariable String id, @RequestBody Product product) {
        return service.updateProduct(id, product);
    }

    @PatchMapping("/patchproduct/{id}")
    public Product patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        return service.partialUpdate(id, updates);
    }

    @DeleteMapping("/deleteproduct")
    public  String deleteProduct(){
        service.deleteProduct();
        return "Deleted Successfully";
    }

    @DeleteMapping("/deleteproduct/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

}
