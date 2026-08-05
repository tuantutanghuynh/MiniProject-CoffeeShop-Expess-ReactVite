# Coffee Menu Management

## 1. Giới thiệu

Đây là dự án học tập nhằm xây dựng một hệ thống quản lý menu quán cà phê
bằng **Node.js, Express.js, Pug và MongoDB**.

Mục tiêu của dự án không phải là tạo ra một sản phẩm hoàn chỉnh ngay lập
tức, mà là học đúng tư duy xây dựng một ứng dụng Backend theo kiến trúc
MVC và các nguyên tắc Clean Code.

------------------------------------------------------------------------

## 2. Công nghệ sử dụng

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   Pug Template Engine
-   Express Session
-   bcrypt
-   Multer
-   express-validator

------------------------------------------------------------------------

## 3. Kiến trúc

Dự án áp dụng mô hình MVC:

    Browser
        │
        ▼
    Route
        │
        ▼
    Middleware
        │
        ▼
    Controller
        │
        ▼
    Model
        │
        ▼
    MongoDB

Mỗi thành phần chỉ đảm nhận một trách nhiệm duy nhất.

------------------------------------------------------------------------

## 4. Chức năng

### Authentication

-   Đăng ký
-   Đăng nhập
-   Đăng xuất
-   Phân quyền theo Role

### Quản lý danh mục đồ uống

-   Thêm danh mục
-   Sửa danh mục
-   Xóa danh mục
-   Danh sách danh mục

### Quản lý đồ uống

-   Thêm đồ uống
-   Sửa đồ uống
-   Xóa đồ uống
-   Danh sách đồ uống
-   Tìm kiếm

------------------------------------------------------------------------

## 5. Cấu trúc cơ sở dữ liệu

### User

-   fullname
-   email
-   password
-   role
-   avatar

### DrinkCategory

-   name
-   description

### Drink

-   name
-   price
-   image
-   description
-   category

Quan hệ:

-   Một DrinkCategory có nhiều Drink.
-   Một Drink chỉ thuộc một DrinkCategory.

------------------------------------------------------------------------

## 6. Mục tiêu học tập

Sau khi hoàn thành dự án, người học sẽ hiểu:

-   MVC trong Express
-   Routing
-   Controller
-   Middleware
-   Mongoose Schema
-   Model
-   CRUD
-   Session Authentication
-   Password Hashing bằng bcrypt
-   Upload ảnh
-   Validation
-   Phân quyền
-   Clean Code
-   Tổ chức dự án theo chuẩn thực tế

------------------------------------------------------------------------

## 7. Quy tắc

-   Không viết business logic trong Route.
-   Controller chịu trách nhiệm xử lý request/response.
-   Model chỉ làm việc với dữ liệu.
-   Đặt tên rõ ràng, nhất quán.
-   Mỗi bài học chỉ tập trung vào một chủ đề.
-   Chỉ học phần tiếp theo sau khi hoàn thành phần hiện tại.
