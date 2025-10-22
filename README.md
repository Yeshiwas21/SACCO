# 💼 SACCO Microfinance Management System

A **full-stack microfinance management system** built with **Django (Backend)** and **React (Frontend)** to automate and streamline Savings and Credit Cooperative (SACCO) operations.  
The system manages members, savings, loans, shares, repayments, fees, and dividends — providing an integrated solution for microfinance institutions.

---

## 🚀 Features

### 👥 Members Management

- Register and manage SACCO members
- Store detailed profiles, contact info, and membership status
- Track member accounts and transactions

### 💰 Savings Management

- Record deposits and withdrawals
- Track member savings balances
- Generate statements and summaries

### 🏦 Loan Management

- Create, approve, and disburse loans
- Set loan types, interest rates, and repayment schedules
- Track outstanding balances and overdue payments

### 📅 Repayment Tracking

- Manage scheduled loan repayments
- Automatically calculate principal and interest portions
- Update member loan balances in real time

### 📈 Share Management

- Record share purchases and redemptions
- Calculate total share capital
- Associate shares with dividend calculations

### 💸 Fee Management

- Define and charge service or penalty fees
- Auto-post fees to member accounts

### 💵 Dividend Management

- Declare annual or periodic dividends
- Automatically compute dividends per member based on shares or savings
- Post dividends to member savings or mark as paid

### 📊 Reports & Dashboard

- Real-time financial overview
- Summary charts for savings, loans, and repayments
- Admin dashboard for performance insights

---

## 🧩 System Architecture

| Layer               | Technology            | Description                                      |
| ------------------- | --------------------- | ------------------------------------------------ |
| **Frontend**        | React.js, TailwindCSS | Responsive user interface for members and admins |
| **Backend**         | Django REST Framework | Core business logic and REST API                 |
| **Database**        | PostgreSQL / MySQL    | Persistent data storage                          |
| **Authentication**  | JWT (JSON Web Token)  | Secure login and role-based access               |
| **Version Control** | Git + GitHub          | Collaborative development and tracking           |

---

## ⚙️ Installation Guide

### 1️⃣ Backend Setup (Django)

```bash
# Clone the repository
git clone https://github.com/Yeshiwas21/SACCO.git
cd SACCO/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run the development server
python manage.py runserver
```
