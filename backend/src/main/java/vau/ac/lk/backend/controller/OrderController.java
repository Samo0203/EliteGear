package vau.ac.lk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vau.ac.lk.backend.model.Order;
import vau.ac.lk.backend.service.OrderService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/eg")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    // Get all orders (admin)
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(service.getAllOrders());
    }

    // Get orders by user ID
    @GetMapping("/orders/user/{userId}")
    public ResponseEntity<List<Order>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(service.getOrdersByUser(userId));
    }

    // Place a new order
    @PostMapping("/orders")
    public ResponseEntity<Order> create(@RequestBody Order order) {
        return ResponseEntity.ok(service.createOrder(order));
    }

    // Update order status (admin)
    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id,
                                              @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    // Partial update (generic)
    @PatchMapping("/orders/{id}")
    public ResponseEntity<Order> patch(@PathVariable String id,
                                       @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(service.partialUpdate(id, updates));
    }

    // Delete order
    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // Dashboard revenue stat
    @GetMapping("/orders/revenue")
    public ResponseEntity<Map<String, Double>> revenue() {
        return ResponseEntity.ok(Map.of("totalRevenue", service.getTotalRevenue()));
    }
}