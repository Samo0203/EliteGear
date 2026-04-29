package vau.ac.lk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vau.ac.lk.backend.model.Product;
import vau.ac.lk.backend.repository.ProductRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repo;

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Optional<Product> getProductById(String id) {
        return repo.findById(id);
    }

    public List<Product> getProductsByCategory(String category) {
        return repo.findByCategory(category);
    }

    public List<Product> searchProducts(String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }

    public Product createProduct(Product product) {
        return repo.save(product);
    }

    public Product updateProduct(String id, Product newProduct) {
        newProduct.setId(id);
        return repo.save(newProduct);
    }

    public Product partialUpdate(String id, Map<String, Object> updates) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        updates.forEach((key, value) -> {
            switch (key) {
                case "name"        -> product.setName((String) value);
                case "category"    -> product.setCategory((String) value);
                case "price"       -> product.setPrice(((Number) value).doubleValue());
                case "offerPrice"  -> product.setOfferPrice(((Number) value).doubleValue());
                case "stock"       -> product.setStock(((Number) value).intValue());
                case "description" -> product.setDescription((String) value);
                case "imageUrl"    -> product.setImageUrl((String) value);
            }
        });

        return repo.save(product);
    }

    public void deleteProduct(String id) {
        repo.deleteById(id);
    }

    public void deleteAllProducts() {
        repo.deleteAll();
    }
}