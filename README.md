# 🛒 EliteGear E-Commerce System

## 📌 Project Overview

EliteGear is a full-stack e-commerce web application built using **React (Frontend)** and **Spring Boot (Backend)**. It allows users to browse products, manage carts, and perform secure authentication, while admins can manage products and categories.

---

## 🚀 Technologies Used

### 💻 Frontend

* React.js
* Vite
* CSS
* Axios (API calls)

### ⚙️ Backend

* Java
* Spring Boot
* Spring Data JPA
* Maven

### 🗄️ Database

* MySQL

---

## ✨ Features

### 👤 User Features

* User Registration & Login
* Browse Products
* Add to Cart
* View Profile

### 🛠️ Admin Features

* Admin Dashboard
* Manage Products (CRUD)
* View Product List

---

## 🔐 Authentication

* Role-based access control (`USER`, `ADMIN`)
* Admin users have access to dashboard and product management

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-repo/EliteGear.git
cd EliteGear
```

---

### 2️⃣ Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Backend runs at:
👉 http://localhost:8080

---

### 3️⃣ Frontend Setup

```bash
cd elitegear-frontend
npm install
npm run dev
```

Frontend runs at:
👉 http://localhost:5173

---

## 🗄️ Database Configuration

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/elitegear
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```

---

## 🔑 Admin Access

To login as admin:

### Option 1: Use existing admin

```
Email: admin@gmail.com
Password: admin123
```

### Option 2: Create admin manually

```sql
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@gmail.com', 'admin123', 'ADMIN');
```

---

## 📁 Project Structure

```
EliteGear/
│
├── backend/                 # Spring Boot Backend
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── model/
│
├── elitegear-frontend/     # React Frontend
│   ├── pages/
│   ├── components/
│   └── services/
```

---

## 🧠 Future Improvements

* JWT Authentication
* Payment Integration
* Order Management
* Responsive UI enhancements

---

## 👨‍💻 Author

Developed as an academic project for learning full-stack development.

---
