package vau.ac.lk.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import vau.ac.lk.backend.model.Order;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByUserId(String userId);

    List<Order> findByStatus(String status);
}