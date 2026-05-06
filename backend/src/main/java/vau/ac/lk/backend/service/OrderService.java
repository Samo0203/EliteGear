package vau.ac.lk.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vau.ac.lk.backend.model.Order;
import vau.ac.lk.backend.repository.OrderRepository;

import java.util.Map;
import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository repo;

    public List<Order> getAllOrders() {
        return repo.findAll();
    }

    public Optional<Order> getOrderById(String id) {
        return repo.findById(id);
    }

    public List<Order> getOrdersByUser(String userId) {
        return repo.findByUserId(userId);
    }

    public Order createOrder(Order order) {
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("PENDING");
        }
        return repo.save(order);
    }

    public Order updateStatus(String id, String status) {
        Order order = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        order.setStatus(status.toUpperCase());
        return repo.save(order);
    }

    public Order partialUpdate(String id, Map<String, Object> updates) {
        Order order = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        updates.forEach((key, value) -> {
            if ("status".equals(key)) {
                order.setStatus(((String) value).toUpperCase());
            }
        });

        return repo.save(order);
    }

    public void deleteOrder(String id) {
        repo.deleteById(id);
    }

    // Revenue sum for dashboard
    public double getTotalRevenue() {
        return repo.findAll().stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .mapToDouble(Order::getTotal)
                .sum();
    }
}