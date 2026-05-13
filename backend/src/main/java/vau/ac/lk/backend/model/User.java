package vau.ac.lk.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String mobile;
    private String region;

    @Indexed(unique = true)
    private String nic;        
    private String avatarUrl;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @CreatedDate
    private LocalDateTime joinedAt;
}