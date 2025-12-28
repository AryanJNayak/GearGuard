# 🛡️ GearGuard - Maintenance Management System (Odoo Edition)

GearGuard is a specialized full-stack maintenance management application. While built with a modern React and Node.js stack, it is designed to mirror the robust workflow logic of **Odoo's Maintenance Module**, offering a lightweight, high-performance alternative or a custom external portal for Odoo ecosystems.

This project replicates key Odoo features—such as equipment categorization, maintenance teams, and request logic—but delivers them through a responsive, custom-built interface.

## 🚀 Project Overview

GearGuard serves as a **Maintenance Management System (CMMS)** that handles:
* **Asset Management:** Tracking equipment, serial numbers, and locations.
* **Preventive & Corrective Maintenance:** Managing request lifecycles.
* **Team Workflows:** Auto-assigning tasks based on equipment categories (similar to Odoo's routing logic).

## 🛠️ Tech Stack

* **Frontend:** React (Vite), TailwindCSS, Lucide Icons
* **Backend:** Node.js, Express.js
* **Database:** MySQL (Relational schema designed to parallel Odoo models)
* **Auth:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)

---

## ⚙️ Odoo-Like Features

This project implements specific logic found in Odoo's Maintenance module:

1.  **Maintenance Teams:**
    * Requests are routed to specific teams (e.g., "Hardware Team", "HVAC Team").
    * Managers have exclusive rights to change request status (New → In Progress → Repaired).

2.  **Equipment Categories:**
    * Just like Odoo `maintenance.equipment.category`, selecting a category (e.g., "Laptops") automatically links the request to the responsible maintenance team.

3.  **Request Stages (Kanban Logic):**
    * Requests move through defined stages: **New**, **In Progress**, **Repaired**, and **Scrap**.

---

## 📥 Installation & Setup

### **1. Backend Setup**

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` inside `backend/config/` and add:
    ```env
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=gearguard_db
    JWT_SECRET=your_super_secret_key
    ```
    *(Note: Replace `your_mysql_password` with your actual MySQL root password)*

4.  **Initialize Database:**
    Run the script to generate the Odoo-compatible schema:
    ```bash
    npm run init-db
    ```
    *You should see: "✅ All tables created successfully!"*

5.  Start the Server:
    ```bash
    npm run dev
    ```

### **2. Frontend Setup**

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Interface:
    ```bash
    npm run dev
    ```
    *App should run on `http://localhost:5173`*

---
