# 🛒 EliteGear

## 📌 Project Overview

EliteGear is a full-stack **e-commerce web application** built with **React** frontend and **Spring Boot** backend. It provides a complete online shopping experience with admin management capabilities.

## 🚀 Built With

- **Frontend**: React, Tailwind CSS
- **Backend**: Java, Spring Boot
- **Database**: MongoDB
- **Build Tools**: Maven, npm

## ✨ Key Features

- User registration and login
- Product browsing, category filtering, and search
- Order placement and order history
- Admin dashboard for managing products, categories, users, and orders
- Revenue tracking
- Responsive design

## 📁 Repository Structure

```bash
EliteGear/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/vau/ac/lk/backend/
│   │   ├── config/                   # SecurityConfig, CorsConfig
│   │   ├── controller/               # OrderController, ProductController, etc.
│   │   ├── model/                    # User, Product, Order, Category
│   │   ├── repository/               # MongoDB Repositories
│   │   ├── service/                  # Business Logic Layer
│   │   └── BackendApplication.java
│   ├── src/main/resources/
│   └── pom.xml
│
├── elitegear-frontend/               # React + Vite Frontend
│   ├── src/
│   └── package.json
│
└── README.md
```

⚙️ Getting Started
1️⃣ Clone the repository
Bashgit clone https://github.com/<your-username>/EliteGear.git
cd EliteGear
2️⃣ Configure MongoDB
Make sure MongoDB is installed and running. No need to create a database manually — Spring Boot will create it automatically.
Update backend/src/main/resources/application.properties:
propertiesspring.data.mongodb.uri=mongodb://localhost:27017/elitegear
spring.data.mongodb.database=elitegear

# Optional: For better logging
logging.level.org.springframework.data.mongodb=DEBUG
3️⃣ Run the Backend
Bashcd backend
./mvnw spring-boot:run
Backend will start at: http://localhost:8080
4️⃣ Run the Frontend
Bashcd elitegear-frontend
npm install
npm run dev
Frontend will be available at: http://localhost:5173
📌 API Base Path
All backend endpoints are prefixed with /eg
Example:

GET http://localhost:8080/eg/getproduct
POST http://localhost:8080/eg/orders

🔐 Current Authentication Status

User registration and login are implemented.
Passwords are securely hashed using BCrypt.
JWT Authentication is not yet implemented (All endpoints are currently public for development).
Role-based access control (USER, ADMIN) is planned for future implementation.

🧪 Testing

Backend unit tests can be run with:Bashcd backend
./mvnw test
Frontend tests are not implemented yet.

🌟 Admin Features
You can manage the system through these endpoints:

Products: POST /eg/postproduct, GET /eg/getproduct, etc.
Categories: POST /eg/postcategory, GET /eg/getcategory
Orders: View all orders, update status, view total revenue
Users: View and manage registered users

📌 Notes

Ensure MongoDB is running before starting the backend.
Frontend API base URL should be configured to point to http://localhost:8080/eg
This project is currently in development stage. Security hardening (JWT + RBAC) is recommended before production.

🚀 Future Enhancements

JWT Authentication & Role-based Authorization
Shopping Cart persistence
Payment gateway integration
Order validation

📄 License
This project is available under the MIT License.
