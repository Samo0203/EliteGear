package vau.ac.lk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    private String id;

    private String userId;

    /**
     * Each item: { productId, name, price, quantity }
     */
    private List<Map<String, Object>> items;

    private double total;

    /**
     * Status values: PENDING | PROCESSING | DELIVERED | CANCELLED
     */
    private String status = "PENDING";

    /**
     * Recipient / delivery info captured from Checkout form
     */
    private Map<String, Object> recipient;

    @CreatedDate
    private LocalDateTime createdAt;
}