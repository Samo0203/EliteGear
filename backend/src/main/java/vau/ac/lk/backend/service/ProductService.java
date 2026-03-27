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

    public Product createProduct(Product product) {
        return repo.save(product);
    }

    // Full update (PUT)
    public Product updateProduct(String id, Product newProduct) {
        newProduct.setId(id);
        return repo.save(newProduct);
    }

    // Partial update (PATCH)
    public Product partialUpdate(String id, Map<String, Object> updates) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "name" -> product.setName((String) value);
                case "price" -> product.setPrice((Double) value);
                case "offerprice" -> product.setOfferprice((Double) value);
                case "stock" -> product.setStock((Integer) value);
                case "description" -> product.setDescription((String) value);
                case "imageUrl" -> product.setImageUrl((String) value);
                case "category" -> product.setCategory((String) value);
            }
        });
        return repo.save(product);
    }

    public void deleteProduct(String id) {
        repo.deleteById(id);
    }

    public void deleteProduct() {
        repo.deleteAll();
    }
}
