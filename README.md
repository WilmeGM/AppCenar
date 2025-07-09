# 🍽️ AppCenar – Node.js Food Delivery Platform

A robust and modular food delivery system built with **Node.js + Express.js** using the **MVC pattern**, **Sequelize ORM**, and session-based security. AppCenar supports four dynamic user roles—Clients, Deliveries, Merchants, and Administrators—and streamlines the food ordering experience from browsing to doorstep delivery.

---

## 🚀 Features by Role

### 👥 Client

- 🔐 Register/Login with role-specific activation and email confirmation.
- 🛍️ Browse merchant categories and view product catalogs.
- ❤️ Favorite merchants and manage delivery addresses.
- 📦 Track orders with pricing breakdown (subtotal, ITBIS, total).
- 🧾 View past orders, reorder from favorites, and edit profile data.

### 🛒 Merchant

- 👤 Profile management and operational schedule settings.
- 📁 Category and product maintenance with image uploads (via Multer).
- 📃 Order dashboard sorted by recent activity.
- 🚚 Assign delivery personnel to orders and monitor statuses.

### 🚴 Delivery

- 👤 Update personal profile and avatar.
- 🚚 View and complete assigned deliveries.
- 📜 Track real-time order progress (pending, in process, completed).

### 🛠️ Admin

- 📊 Dashboard with system KPIs: active/inactive users, order metrics, and product counts.
- 🗂️ Manage users across all roles (activate/deactivate).
- 🛒 Maintain commerce types with icons and descriptions.
- ⚙️ Configure global settings such as ITBIS rate.

---

## 🔧 Tech Stack

| Layer              | Technology                     |
|--------------------|--------------------------------|
| Backend            | Node.js + Express.js           |
| Architecture       | MVC Pattern                    |
| ORM / DB           | Sequelize + MySQL/MariaDB      |
| Session Management | Express Session                |
| File Uploads       | Multer                         |
| Frontend           | HTML, CSS (Bootstrap), JS (jQuery) |
| Security           | Session-based access control   |

---

## 🧠 Architecture

This system is modularly segmented by role and function:

- **Model**: Sequelize ORM-based schemas for users, orders, merchants, and deliveries.
- **Views**: Bootstrap-powered templates categorized by user role.
- **Controllers**: Logic for handling role-based navigation, order workflows, and security constraints.

---

## 📂 Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/WilmeGM/AppCenar.git

2. **Install Dependencies**

   ```bash
   npm install

3. **Run Migrations and Seed Data**

4. **Start the server**
   
   ```
   npm strat

---

## ✨ Highlights

- Multi-role architecture with contextual redirections and restricted routes.

- Secure password reset and account activation flow via email links with unique tokens.

- Real-time calculation of pricing including ITBIS configuration.

- Well-structured admin dashboard with full control over platform entities.

## 📄 License

This project is licensed under the MIT License – use it, fork it, and feel free to contribute! 🛠️
