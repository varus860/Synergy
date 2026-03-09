<img width="1526" height="871" alt="image" src="https://github.com/user-attachments/assets/9233e162-5416-4c03-9cbb-1f75cf88f170" />

# Synergy
![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB) 
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=fff)

Synergy simulates a pharmaceutical e-commerce platform that demonstrates product catalogs, checkout flows, user authentication, and inventory management.

---

## Features

- User Registration and Login - Account creation and authentication with role-based access.
- Email Verification - Code is sent to user to verify account ownership.
- Product Catalog - Browse list of products with detailed drug information and filtering.
- Cart Management - Add and update items with real-time price handling
- Review - Product ratings based on packaging, transport and delivery condition.
- Inventory Management - Track stock levels and adjust them manually.

## Quick Start

### Prerequisites

- Java JDK 17+
- Maven
- PostgreSQL
- A valid email and app-specific password (for Email Service)
- Google OAuth client ID and secret 

### Installations

```bash
# Go to the backend folder
cd backend

# Change the following properties inside of application.properties file
## spring.mail.username
## spring.mail.password
## jwt.auth.app
## jwt.auth.secret_key
## spring.security.oauth2.client.registration.google.client-id
## spring.security.oauth2.client.registration.google.client-secret
## image.upload.dir

# Run maven install
./mvnw install

# Run the jar
cd /backend/target/
java -jar medihub-0.0.1-SNAPSHOT.jar
```

## Building

The frontend is built with Vite while the backend is managed using Maven.

### Requirements
- NodeJS
- Java JDK 17 or above
- Maven
- PostgreSQL
```bash
# Go to the frontend folder and install dependencies
cd frontend
npm install

# After making code changes, build the frontend into the following directory.
# /backend/src/main/resources/static

# Then navigate to the Quick start section and follow the steps listed there.
```

## Troubleshooting

If the project fails to build, check the database.
```bash
# Ensure that the database is running
sudo systemctl start postgresql
# In postgresql, create database for the program and name it "medihub"
```

If there is no products when running the project, it is like that by default. 
```bash
# You can add product information by going to the admin page. Access it directly using this link:
# http://localhost:8080/admin
```
