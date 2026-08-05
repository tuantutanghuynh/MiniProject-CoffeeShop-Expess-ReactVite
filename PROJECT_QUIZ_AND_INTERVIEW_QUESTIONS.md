# 📚 TỦ SÁCH CÂU HỎI THỬ THÁCH & PHỎNG VẤN CHUYÊN SÂU
## Dự Án: Coffee Shop Menu Management System (Node.js - Express - MongoDB - MVC)

---

> **Mục tiêu của bộ tài liệu:**
> Bộ câu hỏi này được thiết kế để bạn bóc tách **từng dòng code, từng cú pháp, từng đối tượng, từng dấu chấm dấu phẩy** trong dự án `MiniProject-CoffeeShop-Express`.
> Giúp bạn từ bỏ thói quen "gõ vẹt/copy vẹt" và làm chủ 100% bản chất kiến thức Node.js, Express, JavaScript Async, MongoDB, Mongoose, Security và File System.

---

## 📌 MỤC LỤC
1. [Phần 1: Kiến Trúc Tổng Thể MVC & Vòng Đời Request (Request Lifecycle)](#phần-1-kiến-trúc-tổng-thể-mvc--vòng-đời-request)
2. [Phần 2: Mongoose Models & Database Schema (Chi Tiết Cú Pháp & Hooks)](#phần-2-mongoose-models--database-schema)
3. [Phần 3: Authentication, Hashing & Session Management](#phần-3-authentication-hashing--session-management)
4. [Phần 4: Express Middlewares, Flow Control & Phân Quyền](#phần-4-express-middlewares-flow-control--phân-quyền)
5. [Phần 5: Category CRUD, Tìm Kiếm Regex & Toán Tử MongoDB](#phần-5-category-crud-tìm-kiếm-regex--toán-tử-mongodb)
6. [Phần 6: Drink CRUD, Multer Upload Ảnh & Thao Tác File System (fs)](#phần-6-drink-crud-multer-upload-ảnh--thao-tác-file-system)
7. [Phần 7: Bóc Tách Cú Pháp JavaScript, Node.js Runtime & Best Practices](#phần-7-bóc-tách-cú-pháp-javascript-nodejs-runtime)

---

## 🏛️ PHẦN 1: KIẾN TRÚC TỔNG THỂ MVC & VÒNG ĐỜI REQUEST

### ❓ Câu 1.1: Trách nhiệm duy nhất (Single Responsibility) của 4 tầng: Route, Middleware, Controller, Model trong dự án này là gì?
- **Trả lời:**
  - **Route (`routes/*.js`):** Định nghĩa URL endpoint và HTTP Method (GET, POST...). Nhận diện URL nào sẽ kích hoạt Middleware nào và chuyển tiếp tới hàm Controller nào. Không chứa logic nghiệp vụ hay truy vấn DB.
  - **Middleware (`middlewares/*.js`):** Kiểm tra các điều kiện tiền xử lý (như xác thực đăng nhập, kiểm tra quyền admin, validate dữ liệu, upload file). Nếu thỏa mãn thì gọi `next()`, nếu không thì ngắt luồng và trả về response lỗi.
  - **Controller (`controllers/*.js`):** Trung tâm xử lý logic nghiệp vụ (Business Logic). Nhận dữ liệu từ `req`, gọi Model để tương tác với Database, xử lý dữ liệu và quyết định render giao diện Pug hoặc redirect.
  - **Model (`models/*.js`):** Định nghĩa cấu trúc dữ liệu (Schema), kiểu dữ liệu các trường, quy tắc validation dữ liệu, quan hệ giữa các bảng và các hook tự động (như hash mật khẩu). Làm việc trực tiếp với MongoDB.

---

### ❓ Câu 1.2: Vòng đời của một HTTP Request gửi lên từ trình duyệt sẽ trải qua các bước nào theo đúng thứ tự trong dự án của bạn?
- **Trả lời:**
  1. Trình duyệt gửi HTTP Request (ví dụ: `POST /drinks`).
  2. `app.js` tiếp nhận request ➔ Đi qua các Built-in/Third-party Middlewares (`express.json()`, `express.urlencoded()`, `session()`, `res.locals`).
  3. `app.js` khớp tiền tố URL `/drinks` và chuyển vào `routes/drink.route.js`.
  4. Router kiểm tra và chạy Router-level Middlewares theo thứ tự: `requireLogin` ➔ `requireAdmin` ➔ `upload.single('image')`.
  5. Nếu tất cả Middlewares đều gọi `next()`, request chuyển vào Controller `drinkController.postCreate`.
  6. Controller tương tác với Model `Drink.save()` ➔ Model gọi `pre('save')` (nếu có) ➔ Ghi dữ liệu vào MongoDB.
  7. Controller trả response (`res.redirect('/drinks')` hoặc `res.render()`) kết thúc vòng đời HTTP Request.

---

## 🗄️ PHẦN 2: MONGOOSE MODELS & DATABASE SCHEMA

### ❓ Câu 2.1: Trong `user.model.js`, hàm `userSchema.pre('save', async function (next) { ... })` hoạt động như thế nào? Tại sao bắt buộc phải dùng `function` truyền thống mà KHÔNG ĐƯỢC dùng Arrow Function `() => {}`?
- **Trả lời:**
  - **Cơ chế:** Đây là một **Mongoose Middleware (Pre-save Hook)**. Nó tự động kích hoạt **ngay trước khi** một document `User` được lưu (`save()`) vào cơ sở dữ liệu.
  - **Tại sao không dùng Arrow Function?** Arrow function **không tạo ra ngữ cảnh `this` riêng** (lexical `this`), làm cho `this` bên trong bị `undefined` hoặc trỏ ra ngoài global. Mongoose bắt buộc dùng `function` truyền thống để bind từ khóa `this` trỏ trực tiếp tới **document chuẩn bị được lưu**.
  - **Dòng code `if (!this.isModified('password')) return next();` có tác dụng gì?** Tránh việc mã hóa lại mật khẩu đã bị mã hóa rồi mỗi khi ta update các thông tin khác của user (như `fullname` hay `avatar`).

---

### ❓ Câu 2.2: Trong `drink.model.js`, đoạn code sau có ý nghĩa từng dấu chấm, từ khóa như thế nào?
```javascript
category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: [true, 'Đồ uống phải thuộc một danh mục'] 
}
```
- **Trả lời:**
  - `mongoose.Schema.Types.ObjectId`: Quy định kiểu dữ liệu của trường `category` là một BSON ObjectId 24-character hexadecimal đặc trưng của MongoDB.
  - `ref: 'Category'`: Khai báo với Mongoose rằng ID này tham chiếu (reference) tới Model có tên đăng ký là `'Category'`. Giúp Mongoose biết cần JOIN (populate) với collection nào.
  - `required: [true, '...']`: Mảng gồm 2 phần tử: phần tử 1 (`true`) bắt buộc trường này không được để trống/null/undefined; phần tử 2 là thông báo lỗi tùy chỉnh (custom error message) trả về khi validation thất bại.

---

### ❓ Câu 2.3: Sự khác biệt giữa `unique: true` và `required: true` trong Mongoose Schema là gì?
- **Trả lời:**
  - `required: true`: Là một **Validator ở tầng Mongoose**. Kiểm tra xem dữ liệu truyền vào có tồn tại hay không trước khi gửi câu lệnh xuống MongoDB.
  - `unique: true`: **KHÔNG PHẢI là một Validator ở tầng Mongoose**. Nó là một chỉ thị để Mongoose bảo MongoDB tạo ra một **Unique Index** trong database. Nếu chèn dữ liệu trùng, chính MongoDB Engine sẽ quăng ra lỗi `E11000 duplicate key error`.

---

## 🔐 PHẦN 3: AUTHENTICATION, HASHING & SESSION MANAGEMENT

### ❓ Câu 3.1: Trong `auth.controller.js`, tại sao đăng nhập thành công ta lại gán `req.session.userId = user._id;`? Quá trình này diễn ra dưới底层 (under the hood) như thế nào?
- **Trả lời:**
  - **Ý nghĩa:** Lưu trữ ID của người dùng đã xác thực vào bộ nhớ Session trên Server.
  - **Cơ chế ngầm bên dưới:**
    1. Express Session tạo một Session Object trên bộ nhớ RAM server (hoặc MongoStore).
    2. Server tạo ra một chuỗi Session ID ngẫu nhiên và mã hóa nó.
    3. Server gửi chuỗi Session ID này về trình duyệt Client qua HTTP Response Header: `Set-Cookie: connect.sid=s%3A...`.
    4. Ở các request tiếp theo, trình duyệt tự động đính kèm Cookie này lên Server. Express Session dựa vào Cookie này để tìm lại đúng `req.session` của user đó.

---

### ❓ Câu 3.2: Đoạn code xử lý lỗi validation trong `auth.controller.js` hoạt động ra sao?
```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
    const errMap = {};
    errors.array().forEach(e => { errMap[e.path] = e.msg; });
    return res.render('auth/register', { title: '...', errors: errMap, oldData: req.body });
}
```
- **Trả lời:**
  - `validationResult(req)`: Gom tất cả các lỗi được kiểm tra từ các rules trong `auth.route.js`.
  - `errors.array()`: Trả về một mảng chứa các object lỗi, mỗi object có dạng `{ type: 'field', path: 'email', msg: 'Email không hợp lệ', ... }`.
  - `errMap[e.path] = e.msg`: Biến đổi mảng thành một Object key-value (ví dụ: `{ email: "Email không hợp lệ", password: "Mật khẩu quá ngắn" }`). Giúp ở giao diện Pug có thể truy cập nhanh theo tên trường `errors.email` thay vì phải dùng vòng lặp `find()` mảng.
  - `oldData: req.body`: Gửi lại các dữ liệu user vừa nhập để fill lại vào các input, giúp user không phải gõ lại từ đầu khi form bị lỗi.

---

### ❓ Câu 3.3: Tại sao hàm `req.session.destroy()` trong `logout` lại nhận vào một callback function `(err) => { ... }` thay vì dùng `await`?
- **Trả lời:**
  - Thư viện `express-session` được thiết kế theo chuẩn **Node.js Callback Pattern (Error-First Callback)** đời cũ, chưa hỗ trợ Native Promise.
  - Do đó, `destroy()` bắt buộc nhận vào một callback có tham số đầu tiên là `err`. Nếu có lỗi xảy ra trong quá trình xóa session trên store, `err` sẽ chứa object lỗi đó.

---

## 🛡️ PHẦN 4: EXPRESS MIDDLEWARES, FLOW CONTROL & PHÂN QUYỀN

### ❓ Câu 4.1: Phân tích từng từ khóa và luồng rẽ nhánh trong Middleware `requireAdmin.js`:
```javascript
module.exports = (req, res, next) => {
    if (req.session && req.session.userId && req.session.role === 'admin') {
        return next();
    }
    res.status(403).render('error', {
        title: '403 Forbidden',
        message: 'Bạn không có quyền thực hiện chức năng này!'
    });
};
```
- **Trả lời:**
  - `req.session`: Kiểm tra xem session middleware có đang hoạt động và khởi tạo hay không.
  - `req.session.userId`: Kiểm tra xem user đã đăng nhập chưa (ngừa trường hợp `req.session` tồn tại nhưng chưa có user).
  - `req.session.role === 'admin'`: Kiểm tra xem quyền của user lưu trong session có chính xác là chuỗi `'admin'` hay không.
  - Short-circuit evaluation (`&&`): JS đánh giá từ trái sang phải, nếu 1 điều kiện sai sẽ dừng ngay, tránh lỗi `TypeError: Cannot read properties of undefined`.
  - `return next()`: Từ khóa `return` cực kỳ quan trọng! Nó đảm bảo sau khi gọi `next()` cho request đi tiếp, hàm Middleware sẽ **kết thúc ngay lập tức**, không chạy xuống lệnh `res.render()` bên dưới.

---

### ❓ Câu 4.2: Trong `app.js`, đoạn code Middleware toàn cục (Global Middleware) này giải quyết bài toán gì?
```javascript
app.use((req, res, next) => {
    res.locals.accountId = req.session.accountId || null;
    res.locals.fullname = req.session.fullname || null;
    res.locals.role = req.session.role || null;
    next();
});
```
- **Trả lời:**
  - `res.locals`: Là một object chứa các biến cục bộ trong phạm vi của một Request-Response cycle.
  - Tất cả các biến gán vào `res.locals` sẽ **tự động biến thành biến toàn cục trong toàn bộ các file giao diện Pug** mà không cần phải truyền thủ công ở từng hàm `res.render('view', { fullname: ... })`.
  - Giúp thanh Header/Navbar hiển thị đúng tên User và Nút bấm Admin ở mọi trang.

---

## 🔍 PHẦN 5: CATEGORY CRUD, TÌM KIẾM REGEX & TOÁN TỬ MONGODB

### ❓ Câu 5.1: Phân tích chi tiết câu lệnh query tìm kiếm và sắp xếp trong `category.controller.js`:
```javascript
const categories = await Category.find(query).sort({ createdAt: -1 });
```
- **Trả lời:**
  - `Category.find(query)`: Trả về một **Mongoose Query Object** (chưa phải là Promise thực sự hay Mảng kết quả).
  - `.sort({ createdAt: -1 })`: Thêm điều kiện sắp xếp vào Query Object. `-1` nghĩa là giảm dần (Descending - bản ghi mới tạo gần nhất sẽ lên đầu), `1` là tăng dần (Ascending).
  - `await`: Kích hoạt việc gửi câu lệnh Query đã hoàn chỉnh xuống MongoDB Server và đợi nhận về kết quả là một **Mảng các JavaScript Objects/Documents**.
  - **Lỗi phổ biến:** Nếu viết `(await Category.find(query)).sort(...)` ➔ Lỗi crash ứng dụng vì `await` đã chuyển kết quả thành Mảng JS, mà Mảng JS không có phương thức `.sort({ createdAt: -1 })` của Mongoose.

---

### ❓ Câu 5.2: Trong hàm `postUpdate` của `category.controller.js`, toán tử `$ne` có vai trò sinh tử như thế nào?
```javascript
const existingCategory = await Category.findOne({
    name: name.trim(),
    _id: { $ne: categoryId }
});
```
- **Trả lời:**
  - `$ne` viết tắt của **Not Equal (Không bằng)**.
  - **Ngữ cảnh:** Khi Admin sửa một danh mục (ví dụ danh mục A có ID là `123`), nếu Admin **không sửa tên** (vẫn giữ nguyên tên cũ là "Cà phê") và bấm Lưu.
  - Nếu KHÔNG có `_id: { $ne: categoryId }`: Query sẽ tìm thấy chính bản ghi `123` đó ➔ Hệ thống nhầm tưởng tên "Cà phê" đã bị trùng ➔ Báo lỗi không cho lưu!
  - Nhờ có `$ne: categoryId`: Query tìm xem có danh mục **NÀO KHÁC** ID `123` mà cũng mang tên "Cà phê" hay không.

---

## 📦 PHẦN 6: DRINK CRUD, MULTER UPLOAD ẢNH & THAO TÁC FILE SYSTEM

### ❓ Câu 6.1: Trong `upload.js`, hãy phân tích từng dòng code của hàm `filename`:
```javascript
filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
}
```
- **Trả lời:**
  - `req, file, cb`: `file` chứa thông tin file đang upload (`originalname`, `mimetype`...); `cb` là callback function `cb(error, filename)` để báo cho Multer tên file cuối cùng.
  - `Date.now()`: Trả về số miligiây tính từ mốc 01/01/1970 ➔ Đảm bảo tính duy nhất theo thời gian.
  - `Math.random() * 1E9`: Nhân với 1 tỷ và làm tròn (`Math.round`) để tạo chuỗi ngẫu nhiên 9 chữ số ➔ Tránh xung đột nếu 2 người upload cùng 1 miligiây.
  - `path.extname(file.originalname)`: Trích xuất đuôi mở rộng của file gốc (ví dụ: `.jpg`, `.png`).
  - `file.fieldname`: Tên của ô input trong HTML Form (ở đây là `'image'`).
  - Kết quả tên file: `image-1722435000000-849201934.jpg`.

---

### ❓ Câu 6.2: Đoạn code dọn dẹp ảnh cũ trong `postUpdate` của `drink.controller.js` hoạt động ra sao? Tại sao phải dùng `fs.existsSync` trước khi gọi `fs.unlinkSync`?
```javascript
if (req.file) {
    if (drink.image) {
        const oldImagePath = path.join(__dirname, '../public/images', drink.image);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    }
    imageName = req.file.filename;
}
```
- **Trả lời:**
  - `path.join(__dirname, ...)`: Tạo đường dẫn tuyệt đối đến file ảnh cũ trên ổ đĩa server.
  - `fs.existsSync(oldImagePath)`: Kiểm tra xem file ảnh đó có **thực sự tồn tại** trên ổ đĩa cứng hay không.
  - `fs.unlinkSync(oldImagePath)`: Hàm đồng bộ của Node.js để xóa file khỏi ổ đĩa.
  - **Tại sao phải dùng `existsSync`?** Nếu ai đó lỡ tay xóa mất file ảnh trong thư mục `public/images` bằng tay, hoặc dữ liệu DB bị sai, hàm `unlinkSync` sẽ lập tức ném ra lỗi `ENOENT: no such file or directory` và làm **crash ngắt đột ngột ứng dụng Node.js** nếu không kiểm tra `existsSync` trước!

---

### ❓ Câu 6.3: Phân tích sự khác biệt giữa `Drink.find().populate('category')` và `Drink.find()` không có populate?
- **Trả lời:**
  - **Không có `populate('category')`:** Dữ liệu trả về ở trường `category` chỉ là một chuỗi ObjectId thô:
    `{ name: "Bạc Xỉu", price: 30000, category: "66ab1234..." }`
  - **Có `populate('category')`:** Mongoose thực hiện câu lệnh JOIN phụ sang collection `categories` và thay thế ID thô bằng toàn bộ Object danh mục chi tiết:
    `{ name: "Bạc Xỉu", price: 30000, category: { _id: "66ab1234...", name: "Cà phê", description: "..." } }`
  - Nhờ đó ở file Pug ta mới gọi được `drink.category.name`.

---

## ⚡ PHẦN 7: BÓC TÁCH CÚ PHÁP JAVASCRIPT, NODE.JS RUNTIME & BEST PRACTICES

### ❓ Câu 7.1: Phân biệt `exports.getDrinks = ...` và `module.exports = router` trong CommonJS Module của Node.js?
- **Trả lời:**
  - Trong Node.js, `module.exports` là một Object thực sự được trả về khi một file khác gọi `require()`.
  - `exports` chỉ là một biến tham chiếu (alias / shortcut) trỏ cùng đến vùng nhớ của `module.exports`.
  - Khi viết `exports.getDrinks = ...`: Ta đang gắn thêm thuộc tính `getDrinks` vào object chung đó ➔ Nối thêm nhiều hàm vào cùng 1 module.
  - Khi viết `module.exports = router`: Ta đang GHI ĐÈ toàn bộ object export bằng một Router Instance duy nhất. (Nếu viết `exports = router` sẽ bị SAI vì chỉ làm mất tham chiếu của biến `exports` chứ không thay đổi `module.exports`).

---

### ❓ Câu 7.2: Kỹ thuật Destructuring Assignment `const { fullname, email, password } = req.body;` mang lại lợi ích gì so với cách gán truyền thống?
- **Trả lời:**
  - **Truyền thống:**
    `const fullname = req.body.fullname;`
    `const email = req.body.email;`
    `const password = req.body.password;`
  - **Destructuring:** Rút ngắn 3 dòng code thành 1 dòng duy nhất, giúp code sạch sẽ, rõ ràng.
  - Đồng thời giúp dễ dàng nhận biết controller đó đang cần và trích xuất những trường dữ liệu cụ thể nào từ `req.body`.

---

### ❓ Câu 7.3: Tại sao trong tất cả các hàm Controller xử lý Async/Await ta luôn phải bọc trong khối `try { ... } catch (error) { next(error); }`?
- **Trả lời:**
  - Trong Express 4.x, nếu một hàm `async` quăng ra lỗi (Uncaught Exception hoặc Rejection từ Database) mà không có `try/catch`, Express sẽ **không tự động bắt được lỗi đó**.
  - Request sẽ bị treo vĩnh viễn (hanging connection) hoặc ứng dụng Node.js bị đứt luồng.
  - Khối `catch (error) { next(error); }` bắt lấy lỗi và đẩy lỗi đó vào **Express Global Error Handler** (hàm `app.use((err, req, res, next) => ...)` ở cuối file `app.js`) để render ra trang báo lỗi 500 đẹp mắt cho người dùng.

---

### ❓ Câu 7.4: Toán tử 3 ngôi (Ternary Operator) và Logical OR (`||`) được dùng như thế nào trong đoạn code render dưới đây?
```javascript
res.render('drinks/index', {
    title: 'Menu đồ uống',
    drinks,
    categories,
    keyword: keyword || '',
    categoryId: categoryId || ''
});
```
- **Trả lời:**
  - `keyword: keyword || ''`: Nếu `keyword` bị `undefined` hoặc `null` (khi người dùng mới vào trang chưa tìm kiếm), phép toán `||` sẽ lấy giá trị mặc định là chuỗi rỗng `''`. Giúp thẻ `<input value=keyword>` trong Pug không bị hiển thị chữ `undefined`.
  - Cú pháp rút gọn ES6 `drinks, categories`: Tương đương với `drinks: drinks, categories: categories` khi tên key trùng với tên biến.

---

## 🎯 BẢNG CHỦ ĐỀ ÔN TẬP NHANH (CHEATSHEET)

| Chủ đề | Từ khóa / Cú pháp cốt lõi | Vị trí áp dụng trong dự án |
| :--- | :--- | :--- |
| **Password Security** | `bcrypt.hash`, `bcrypt.compare`, `pre('save')` | [user.model.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/models/user.model.js), [auth.controller.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/controllers/auth.controller.js) |
| **Session & Cookie** | `req.session.userId`, `req.session.destroy()` | [auth.controller.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/controllers/auth.controller.js), [app.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/app.js) |
| **Authorization** | `(req, res, next)`, `return next()` | [requireLogin.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/middlewares/requireLogin.js), [requireAdmin.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/middlewares/requireAdmin.js) |
| **Validation** | `body('field').isEmail()`, `validationResult(req)` | [auth.route.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/routes/auth.route.js), [auth.controller.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/controllers/auth.controller.js) |
| **Database Query** | `populate()`, `$regex`, `$options`, `$ne` | [category.controller.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/controllers/category.controller.js), [drink.controller.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/controllers/drink.controller.js) |
| **File Upload** | `multer.diskStorage`, `upload.single('image')` | [upload.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/middlewares/upload.js), [drink.route.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/routes/drink.route.js) |
| **File Cleanup** | `fs.existsSync()`, `fs.unlinkSync()` | [drink.controller.js](file:///Users/tanghuynhtuantu/Programming/nodejs/MiniProject-CoffeeShop-Express/server/controllers/drink.controller.js) |

---
*Chúc bạn ôn tập tốt và làm chủ hoàn toàn dự án Node.js Express Backend!*
