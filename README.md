# Kari Shop - Backend

A comprehensive backend for the Kari Shop platform, a marketplace that connects artists with clients. Built with **Node.js**, **TypeScript**, **PostgreSQL**, and **TypeORM**, it includes role-based functionalities for artists, clients, and admins with enhanced security, data protection, and e-commerce features.

## Features

- **Role-based Access Control (RBAC)**: Distinct permissions for Artists, Clients, and Admins.
- **E-commerce Features**: Shopping cart, wishlist, orders, and reviews.
- **Digital Rights Management (DRM)**: Content protection for digital products.
- **Product Variants & Categories**: Flexibility for managing products in diverse categories.
- **Real-time Dashboard Analytics**: Interactive dashboards for data insights and sales trends.
- **Order Management**: Full CRUD support for orders and transactions.

## Table of Contents

1. [ERD Overview](#erd-overview)
2. [Installation](#installation)
3. [Environment Variables](#environment-variables)
4. [API Documentation](#api-documentation)
5. [Core Entities and Relationships](#core-entities-and-relationships)
6. [Enhancements and Advanced Features](#enhancements-and-advanced-features)

---

### ERD Overview

The Kari Shop’s entity-relationship structure reflects the core entities and their relationships for an e-commerce platform. Key entities include `User`, `Shop`, `Product`, `Order`, `Wishlist`, and `Cart`.

#### Entity Relationships:

1. **User**: 
   - Can have multiple shops (as Artist).
   - Can create multiple orders and maintain a cart and wishlist.
2. **Shop**:
   - Managed by an Artist.
   - Contains multiple products, linked by category.
3. **Product**:
   - Belongs to a single shop and category.
   - Can appear in orders, wishlists, and carts.
4. **Order**:
   - Tied to a specific user.
   - Includes multiple `Order_Items`.
5. **Order_Item**:
   - Refers to a product and its quantity within an order.

### Installation

#### Prerequisites

- **Node.js** and **npm** (for running JavaScript server code)
- **PostgreSQL** (as the relational database)

#### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Karizm-Karishop/ShopBack.git
   cd ShopBack
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables** (see [Environment Variables](#environment-variables) for details):
   - Create a `.env` file in the project root with the required values.

4. **Database Setup**:
   - Ensure PostgreSQL is running.
   - Create the database:
     ```sql
     CREATE DATABASE kari_shop;
     ```
   - Run migrations:
     ```bash
     npm run typeorm migration:run
     ```

5. **Start the Server**:
   ```bash
   npm run dev
   ```

### Environment Variables

In the `.env` file, set the following values:

```env
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/kari_shop
JWT_SECRET=your_jwt_secret
```

### API Documentation

For detailed API documentation, use Postman or Swagger (if implemented). Some core routes:

- **Users**:
  - `POST /auth/register`: Register a new user.
  - `POST /auth/login`: Log in a user.
- **Shops**:
  - `POST /shops`: Create a new shop (for artists only).
  - `GET /shops`: Retrieve shops based on filters.
- **Products**:
  - `POST /products`: Add a new product to a shop.
  - `GET /products/:id`: View a product’s details.
- **Orders**:
  - `POST /orders`: Place a new order.
  - `GET /orders`: View user’s order history.

### Core Entities and Relationships

#### 1. User
- **Attributes**: `user_id`, `name`, `email`, `password`, `phone_number`, `address`, `role`, `profile_picture`, `gender`
- **Relationships**:
  - **Shop**: Artists can create and manage shops.
  - **Order**: Clients can place multiple orders.
  - **Wishlist/Cart**: Users maintain a wishlist and cart.
  
#### 2. Shop
- **Attributes**: `shop_id`, `shop_name`, `icon`, `description`, `category_id`, `artist_id`
- **Relationships**:
  - Belongs to an **artist**.
  - Includes **products** linked by category.

#### 3. Category
- **Attributes**: `category_id`, `category_name`
- **Relationships**:
  - Categories have multiple products and shops.

#### 4. Product
- **Attributes**: `product_id`, `name`, `description`, `gallery`, `sales_price`, `regular_price`, `quantity`, `tags`, `category_id`, `shop_id`
- **Relationships**:
  - Tied to a single shop and category.
  - Can appear in orders, wishlists, and carts.

#### 5. Order
- **Attributes**: `order_id`, `user_id`, `order_date`, `status`, `delivery_info`, `payment_info`, `total_price`
- **Relationships**:
  - Linked to **users** and has **order items**.

### Enhancements and Advanced Features

1. **Transaction History**:
   - Tracks transactions for purchases, donations, and refunds.

2. **Review & Ratings**:
   - Allows users to review products.

3. **Digital Rights Management (DRM)**:
   - Protects digital products with download limits.

4. **Product Variants**:
   - Manages variations like size or color.

5. **Notifications**:
   - Delivers system notifications to users.

---

### Scenario Implementations

#### Authentication & Authorization
- **JWT** is used for authentication.
- **RBAC** ensures only authorized users access certain resources (e.g., artists can only manage their own shops).

#### CRUD Operations
- Each entity has corresponding CRUD operations.
- RESTful APIs manage entity interactions and relationships.

#### Data Security
- DRM-enforced protection for digital products.
- Role-based access control restricts features based on user roles.

#### Real-Time Features
- Interactive dashboard data for admins.
- Notifications system to engage users with updates.

---

This README provides an organized structure for the Kari Shop backend, ensuring that contributors and users understand the project structure, setup process, and essential features. For further details on individual routes and schema updates, consult the in-code documentation or Postman collection provided.