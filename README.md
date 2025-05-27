# 💸 Digital Payment Web Application — Full-Stack Wallet System

A personal full-stack **digital wallet application** inspired by platforms like **Google Pay (GPay)** and **PhonePe**, built using **React**, **Node.js**, **Express.js**, and **SQL**. This app supports secure user authentication, wallet creation, fund transfers, and transaction history — simulating real-time UPI-style operations.

## 🚀 Features

- 🔐 **JWT Authentication** for secure logins and sessions.
- 🧾 **User Registration & Profile Management**
- 💼 **Wallet Balance Check**
- 💸 **Send Money via QR, Mobile Number, or UPI ID**
- 📜 **Transaction History Viewer**
- 📲 **Modern, responsive React UI** (works across devices)
- 🧠 **Data Encryption using bcrypt**
- 🛠️ **RESTful APIs for all wallet operations**

---
---

## 🛠️ Tech Stack

### Frontend
- React.js (integrated using script tags within HTML files)
- Responsive design (optimized for mobile and desktop)
- Clean, intuitive UI inspired by UPI apps

### Backend
- Node.js
- Express.js
- SQLite (lightweight and efficient embedded SQL database)
- JWT for secure session management
- bcrypt for password hashing

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/digital-wallet-app.git
cd digital-wallet-app
````

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Start Backend Server

```bash
node app.js
```

> Backend runs typically on `http://localhost:3000`

### 4. Launch Frontend

Open `Frontend/Home_and_Login/Login.html` or any other HTML entry point directly in a browser.
Ensure API endpoints are correctly pointing to the backend server.

---

## 🔐 Security & Best Practices

* Passwords and UPI PINs hashed with **bcrypt**
* All sensitive routes are protected via **JWT**
* Clean and modular code architecture (separates APIs, logic, DB)
* Input validation and database integrity checks implemented

---

## 📷 Screenshots

> Add screenshots of Login, Home Page, Send Money, Transaction History, etc.

---

## 📅 Timeline

**Project Duration**: Feb 2025
Built as a part of a self-initiated project to explore digital wallet systems.

---

## 🙌 Author

**Brahmaji Mothukuri**
[GitHub Profile](https://github.com/your-username)

## 📂 Project Structure

```

📦 Root
├── Backend/
│   ├── APIs/
│   │   └── UPI\_Accounts/
│   │       ├── UsersData.js
│   │       ├── checkUserBankStatus.js
│   │       ├── createBankUser\_API.js
│   │       └── createUsersTable.js
│   ├── DATABASE/
│   │   ├── UsersDatabase.db
│   │   ├── transactions.db
│   │   └── upiDatabase.db
│   ├── Functions/
│   │   └── Transactions/
│   │       ├── BalanceCheck.js
│   │       ├── checkAuthentication.js
│   │       ├── checkUPI\_pin.js
│   │       ├── check\_UPI\_Account.js
│   │       ├── getUser.js
│   │       └── insertData.js
│   ├── app.js
│   ├── package.json
│   └── output.log
├── Frontend/
│   ├── AccountCreation/
│   │   ├── Fail.html
│   │   └── Success.html
│   ├── Home\_and\_Login/
│   │   ├── Home.html
│   │   ├── Login.html
│   │   ├── PinEntryPage.js
│   │   ├── Profile.html
│   │   └── TransactionHistory.html
│   ├── TransactionTypes/
│   │   └── SendMoney/
│   │       ├── QR.html
│   │       ├── TransactionStatus.html
│   │       ├── byMobile.html
│   │       └── Mobile.html
│   ├── UpiAccounts/
│   │   ├── CreditCheckPIN.html
│   │   └── EnterPinPage.html
│   ├── WEBPAGE/
│   │   ├── initialPage.html
│   │   └── upLogin.html
│   └── checkBalance/
│       └── (balance-related files)
└── README.md

````

---
