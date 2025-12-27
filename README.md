This project "GearGuard: The Ultimate Maintenance Tracker" is part of Odoo X Adani University Hackethon

## In the backend directory:

  -  `config` -> Contains environment configuration for Database and Server
  -  `controller` -> Contains buysiness logic
  -  `models` -> Tables/Schema for database
  -  `routes` -> Backend routes

---
## Inside `.env` file add the following
  - PORT = 3000
  - DB_HOST=localhost
  -  DB_USER=root
  -  DB_PASSWORD=your_password
  -  DB_NAME=gearguard
  -  JWT_SECRET=your_secret_key

---
## The database is designed to automate the assignment of maintenance teams based on equipment categories. It consists of 6 core tables:

1. User Management
  - users: Stores authentication details (Email, Password) and roles (Admin vs. Standard User).

  - maintenance_team: Defines specialized teams (e.g., IT Support, Mechanics).

  - team_members: A junction table linking Users to Teams. It allows specific technicians to be part of specific teams and flags "Managers".

2. Asset Management
  - equipment_category: The "Brain" of the auto-assignment logic.

  - It links a category (e.g., "Printers") to a specific Maintenance Team (e.g., "IT Support").

  - It ensures that any equipment created under this category is automatically routed to the correct team.

  - equipment: The physical assets. Contains details like Name, Serial Number, and links to the equipment_category.


3. Workflow Management

  - maintenance_request: The core transactional table.


  - Types: Tracks if a request is Corrective (Breakdown) or Preventive (Routine).


  - Status: Manages the lifecycle: New -> In Progress -> Repaired -> Scrap.


  - Data: Captures schedule_date and duration for reporting.

---
Authors: 
name: aryan
email: aryannayak1509@gmail.com

name: Himanshu 
email: Himanshhimanshuprajapati4695@gmail.com
