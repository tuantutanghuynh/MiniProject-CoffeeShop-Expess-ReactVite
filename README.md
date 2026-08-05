# ☕ Coffee Shop Express

Ứng dụng quản lý quán cà phê xây dựng bằng **Node.js + Express + MongoDB (Mongoose)**, giao diện render phía server bằng **Pug**. Hỗ trợ đăng ký/đăng nhập, quản lý danh mục và đồ uống với phân quyền Admin/User.

## 🚀 Tính năng

- **Xác thực người dùng**: đăng ký, đăng nhập, đăng xuất (session-based, mật khẩu mã hoá với `bcrypt`).
- **Phân quyền**: Admin có toàn quyền thêm/sửa/xoá; User chỉ xem.
- **Quản lý danh mục (Category)**: CRUD danh mục đồ uống.
- **Quản lý đồ uống (Drink)**: CRUD đồ uống, upload hình ảnh (`multer`).
- **Validate dữ liệu** đầu vào với `express-validator`.

## 🛠️ Công nghệ sử dụng

| Thành phần       | Công nghệ                          |
|-------------------|-------------------------------------|
| Backend           | Node.js, Express 5                 |
| Database          | MongoDB, Mongoose                  |
| View engine       | Pug                                 |
| Xác thực          | express-session, bcrypt             |
| Validate          | express-validator                   |
| Upload file       | multer                              |
| Khác              | dotenv, morgan, method-override     |

## 📁 Cấu trúc thư mục

```
server/
├── bin/               # Entry point (www)
├── config/            # Kết nối database
├── controllers/       # Xử lý logic request
├── middlewares/       # requireLogin, requireAdmin, upload
├── models/            # Mongoose schemas (account, category, drink, order, user)
├── public/            # Static assets (CSS, hình ảnh)
├── routes/            # Định tuyến (auth, category, drink)
├── services/          # JWT service
├── views/             # Giao diện Pug
└── app.js             # Khởi tạo Express app
```

## ⚙️ Cài đặt & Chạy dự án

### 1. Clone repository

```bash
git clone https://github.com/tuantutanghuynh/MiniProject-CoffeeShop-Expess-ReactVite.git
cd MiniProject-CoffeeShop-Expess-ReactVite/server
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` trong thư mục `server/` với nội dung:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/coffeeshop
SESSION_SECRET=your_secret_key
```

### 4. Chạy ứng dụng

```bash
# Chế độ development (tự reload khi code thay đổi)
npm run dev

# Chế độ production
npm start
```

Ứng dụng chạy tại: `http://localhost:3000`

## 🔑 Phân quyền

| Vai trò | Quyền hạn                                   |
|---------|----------------------------------------------|
| Admin   | Xem, thêm, sửa, xoá danh mục & đồ uống        |
| User    | Chỉ xem danh mục & đồ uống                    |

## 📜 License

Dự án phục vụ mục đích học tập.
