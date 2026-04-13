# JShop
Full-stack e-commerce application built with Spring Boot, React and PostgreSQL.

## Frontend Folder Structure
src/
 ├── api/            // axios calls
 ├── components/     // reusable (Navbar, Card, etc.)
 ├── pages/          // main pages
 ├── features/       // optional (cart logic, auth)
 ├── hooks/          // custom hooks
 ├── context/        // auth/cart state (or Redux)
 ├── routes/         // router config
 ├── utils/          // helpers
 ├── App.jsx
 └── main.jsx

##  API Endpoints
###  Auth
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
### Products
GET    /api/products
GET    /api/products/{id}
POST   /api/products        (ADMIN)
PUT    /api/products/{id}   (ADMIN)
DELETE /api/products/{id}   (ADMIN)
### Categories
GET    /api/categories
POST   /api/categories      (ADMIN)
🛒 Cart
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update
DELETE /api/cart/remove/{id}
### Orders
POST /api/orders        // checkout
GET  /api/orders/my     // user orders
GET  /api/orders        (ADMIN)

## DB Design
-indexes
-created_at fields
-enum για roles

-κάθε χρήστης έχει ένα cart
-μπορεί να έχει πολλά orders
User
 ├── 1 → * Orders
 └── 1 → 1 ShoppingCart

-...
Category
 └── 1 → * Products

-...
 Product
 └── * → 1 Category

-order belongs to user
-order έχει πολλά items
Order
 └── 1 → * OrderItems

-το price μπορεί να αλλάξει στο μέλλον.
-Άρα στο order αποθηκεύουμε το price εκείνη τη στιγμή.

-...
ShoppingCart
 └── 1 → * CartItems

## DB Design 
User
 ├── Orders
 │     └── OrderItems
 │            └── Product
 │
 └── ShoppingCart
        └── CartItems
               └── Product
Category
   └── Products

## How to Run
1)install env plugin
2)In Intellijence edit config
SPRING_PROFILES_ACTIVE=dev
ή
SPRING_PROFILES_ACTIVE=prod

## Todo
Add More Tabeles? 
-Payments
-Addresses
-Reviews
-Discounts
-Role(If i only got Admin/Customer we dont need table)
 Απλα role ENUM στο User.
 Role table χρειάζεται μόνο όταν έχεις:users,roles,permissions,role_permissions
-Θα έβαζα status στο order.
 PENDING
 PAID
 SHIPPED
 CANCELLED

## Info
Why not autowired

## Architecture
The project follows a layered architecture with the following components:
• Presentation Layer (SpringBoot MVC): Manages user interaction and displays the views.
• API Layer (SpringBoot Web API): Exposes RESTful API endpoints for database interactions and business logic.
• Business Logic Layer (Class Library): Contains business logic, repository patterns, and the DbContext.
• Data Access Layer (Hibernate if we had .net we would use EF core): Manages communication with the SQL Server database.
• Cross-cutting Concerns: Security, exception handling, localization, logging, and caching.

