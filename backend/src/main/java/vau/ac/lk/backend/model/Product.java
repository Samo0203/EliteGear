package vau.ac.lk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;

    private String name;
    private String category;
    private double price;
    private double offerPrice;   
    private int    stock;
    private String description;
    private String imageUrl;
    private List<String> colors;  
    private List<String> sizes;
    private List<String> weights;   
}