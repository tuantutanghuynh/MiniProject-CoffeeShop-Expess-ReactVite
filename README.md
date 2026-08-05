# ☕ Coffee Shop Express

A coffee shop management application built with **Node.js + Express + MongoDB (Mongoose)**, server-side rendered with **Pug**. Supports registration/login, category and drink management with Admin/User role-based access.

## 🚀 Features

- **User authentication**: register, login, logout (session-based, passwords hashed with `bcrypt`).
- **Role-based access**: Admins have full CRUD rights; Users have read-only access.
- **Category management**: full CRUD for drink categories.
- **Drink management**: full CRUD for drinks, with image upload (`multer`).
- **Input validation** with `express-validator`.

## 🛠️ Tech Stack

| Layer             | Technology                          |
|-------------------|--------------------------------------|
| Backend           | Node.js, Express 5                  |
| Database          | MongoDB, Mongoose                   |
| View engine       | Pug                                  |
| Authentication    | express-session, bcrypt              |
| Validation        | express-validator                    |
| File upload       | multer                               |
| Others            | dotenv, morgan, method-override      |

## 📁 Project Structure

```
server/
├── bin/               # Entry point (www)
├── config/            # Database connection
├── controllers/       # Request handling logic
├── middlewares/       # requireLogin, requireAdmin, upload
├── models/            # Mongoose schemas (account, category, drink, order, user)
├── public/            # Static assets (CSS, images)
├── routes/            # Routing (auth, category, drink)
├── services/          # JWT service
├── views/             # Pug views
└── app.js             # Express app entry point
```

## ⚙️ Setup & Run

### 1. Clone the repository

```bash
git clone https://github.com/tuantutanghuynh/MiniProject-CoffeeShop-Expess-ReactVite.git
cd MiniProject-CoffeeShop-Expess-ReactVite/server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server/` folder:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/coffeeshop
SESSION_SECRET=your_secret_key
```

### 4. Run the app

```bash
# Development mode (auto-reload on changes)
npm run dev

# Production mode
npm start
```

The app runs at: `http://localhost:3000`

## 🔑 Roles & Permissions

| Role    | Permissions                                    |
|---------|--------------------------------------------------|
| Admin   | View, create, edit, delete categories & drinks    |
| User    | View categories & drinks only                     |

## 📜 License

This project is for educational purposes.
