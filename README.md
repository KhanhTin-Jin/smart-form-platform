# 🚀 SmartForm Platform – Dynamic Form Builder System

> **Bài test Young Talent – TopCV**
> Hệ thống quản lý form động cho phép Admin tạo form với nhiều loại trường dữ liệu, và nhân viên SW điền vào form theo đúng thứ tự.

---

## 🏗 Kiến trúc Tổng Quan

```
SmartForm/
├── Backend/          # .NET 8 – Clean Architecture
│   ├── SmartForm.API             # Controller, Routes, Swagger
│   ├── SmartForm.Application     # Business Logic, DTOs, Validation Engine
│   ├── SmartForm.Domain          # Entities, Interfaces, Constants
│   ├── SmartForm.Infrastructure  # EF Core, PostgreSQL, Repository
│   └── SmartForm.Tests           # Unit Tests (xUnit)
├── Frontend/         # React + Vite
└── docker-compose.yml
```

Backend tuân thủ **Clean Architecture** với 4 tầng tách biệt, áp dụng các pattern:
- **Repository + Unit of Work** – tách biệt data access logic
- **Service Result Wrapper** – chuẩn hoá response format toàn bộ API
- **FieldValidationEngine** – module validate độc lập, dễ test và mở rộng
- **Mapster DTO** – không để Entity "lộ" ra ngoài API

---

## ✅ Checklist Yêu Cầu

| Hạng mục | Trạng thái |
|---|---|
| CRUD Form (title, description, order, status) | ✅ Hoàn thành |
| CRUD Field (text, number, date, color, select) | ✅ Hoàn thành |
| Server-side Validation theo từng loại field | ✅ Hoàn thành |
| API Submit Form + lưu DB | ✅ Hoàn thành |
| GET /api/forms/active – sắp theo order | ✅ Hoàn thành |
| GET /api/submissions | ✅ Hoàn thành |
| Unified error response format | ✅ `ServiceResult<T>` |
| Swagger / API Docs | ✅ `/swagger` |
| Unit Tests (FieldValidationEngine) | ✅ 17/17 Passed |
| Docker Compose | ✅ Hoàn thành |
| Drag & Drop + API Reorder fields | ✅ `PUT /api/forms/:id/fields/reorder` |
| README | ✅ Tài liệu này |

---

## 🛠 Cách Chạy Dự Án

### Cách 1: Docker Compose (Khuyến nghị – nhanh nhất)

> **Lưu ý:** Chạy lệnh từ **thư mục gốc của project** (nơi chứa file `docker-compose.yml`), không phải từ `Backend/` hay `Frontend/`.

```bash
# Clone project về (nếu chưa có)
git clone <repo-url>
cd TopCV   # hoặc tên thư mục repo của bạn

# Đảm bảo Docker Desktop đang chạy, rồi chạy:
docker-compose up --build
```

Sau khi khởi động (~3-5 phút lần đầu do pull images):
- **Frontend UI:** http://localhost:3000
- **Backend API:** http://localhost:5282
- **Swagger Docs:** http://localhost:5282/swagger

---

### Cách 2: Chạy thủ công (Local Dev)

**Yêu cầu:** .NET 8 SDK, Node.js 20+, PostgreSQL

**1. Cấu hình Database**

Mở `Backend/SmartForm.API/appsettings.json`, cập nhật:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=SmartFormDb;Username=postgres;Password=postgres"
}
```

**2. Khởi tạo & Chạy Backend**

```bash
cd Backend/SmartForm.API
dotnet ef database update --project ../SmartForm.Infrastructure --startup-project .
dotnet run
# API: http://localhost:5282
# Swagger: http://localhost:5282/swagger
```

**3. Chạy Frontend**

```bash
cd Frontend
npm install
npm run dev
# UI: http://localhost:5173
```

---

## 📡 API Endpoints

### Form Management
| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/forms` | Lấy tất cả form |
| `GET` | `/api/forms/active` | Lấy form đang active, sắp theo order |
| `GET` | `/api/forms/:id` | Lấy chi tiết 1 form kèm fields |
| `POST` | `/api/forms` | Tạo form mới |
| `PUT` | `/api/forms/:id` | Cập nhật form |
| `DELETE` | `/api/forms/:id` | Xóa form |

### Field Management
| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/forms/:id/fields` | Thêm field vào form |
| `PUT` | `/api/forms/:id/fields/:fid` | Cập nhật field |
| `DELETE` | `/api/forms/:id/fields/:fid` | Xóa field |
| `PUT` | `/api/forms/:id/fields/reorder` | Sắp xếp lại thứ tự fields (bulk) |

### Submissions
| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/forms/:id/submit` | Nhân viên submit form |
| `GET` | `/api/submissions` | Xem tất cả submissions |

---

## 🔒 Validation Rules

| Field Type | Rules |
|---|---|
| `text` | Bắt buộc nhập (nếu required), tối đa 200 ký tự |
| `number` | Phải là số hợp lệ, trong khoảng 0–100 |
| `date` | Phải là ngày hợp lệ, không được chọn ngày quá khứ |
| `color` | Phải là mã HEX hợp lệ (`#RGB` hoặc `#RRGGBB`) |
| `select` | Giá trị phải nằm trong danh sách options cho sẵn |
| `order` | Phải là số nguyên dương (>= 1), không được trùng |

> Toàn bộ validation được xử lý **tại tầng Backend** qua module `FieldValidationEngine.cs`, tách biệt khỏi Controller theo đúng gợi ý của đề bài.

---

## 🧪 Chạy Unit Tests

```bash
cd Backend/SmartForm.Tests
dotnet test
# Expected: Passed! - Failed: 0, Passed: 17
```

Tests bao gồm: Required check, Text max-length, Number range (Theory), Date past validation, Color HEX regex (Theory), Select option matching (hỗ trợ cả CSV và JSON format).

---

## 🗄 Database Schema

```
Form (1) ──────< FormField (N)
  │
  └──────< FormSubmission (N)
               │
               └──────< SubmissionValue (N)
```

| Table | Mô tả |
|---|---|
| `Forms` | Thông tin form (title, description, order, status) |
| `FormFields` | Các trường trong form, FK → Forms |
| `FormSubmissions` | Bản ghi submit của nhân viên, FK → Forms |
| `SubmissionValues` | Giá trị từng field trong 1 lần submit, FK → FormSubmissions + FormFields |

> Migration script: `Backend/SmartForm.Infrastructure/Migrations/`

---

## 🧠 Quyết Định Thiết Kế

### 1. Tại sao dùng Clean Architecture?
Bài test đánh giá khả năng "xây dựng tính năng có thể mở rộng". Clean Architecture đảm bảo việc thêm một loại field mới (ví dụ: `file_upload`) chỉ cần thêm 1 `case` vào `FieldValidationEngine` và 1 handler ở Frontend – không phải chạm vào DB, Controller hay Service.

### 2. Tại sao tách `FieldValidationEngine` thành module riêng?
Đề bài gợi ý rõ: *"tách logic validate thành một lớp/module riêng thay vì viết thẳng vào controller"*. Module này:
- **Không phụ thuộc** vào bất kỳ framework nào → dễ viết Unit Test thuần tuý
- **Single Responsibility**: chỉ làm 1 việc duy nhất – validate 1 field
- **Dễ mở rộng**: thêm loại field mới chỉ cần thêm `case` mới

### 3. Tại sao dùng `ServiceResult<T>` thay vì throw Exception?
Để có **unified error response format** trên toàn bộ API. Mọi response đều có cùng cấu trúc JSON:
```json
{ "code": "ValidationError", "message": "Field 'Name' is required.", "data": null }
```
Frontend chỉ cần xử lý 1 format duy nhất, không cần lo về exception format khác nhau giữa các endpoint.

### 4. Tại sao dùng `PUT /fields/reorder` thay vì N lần `PUT /fields/:fid`?
Khi người dùng kéo thả để sắp xếp lại 10 fields, cách naive là gửi 10 API riêng lẻ. Cách này gây:
- N round-trip HTTP không cần thiết
- Race condition nếu các request về không theo thứ tự
- Lỗi trùng `order` khi 2 fields hoán đổi vị trí cho nhau

API Bulk Reorder nhận `List<Guid>` (danh sách ID theo thứ tự mới), tính lại `order = index + 1` cho từng field, rồi commit **1 lần duy nhất** qua `UnitOfWork` → atomic, không thể xảy ra lỗi nửa vời.

### 5. Options của Select field lưu dạng gì?
Lưu dạng **chuỗi CSV** (ví dụ: `Rất hài lòng,Bình thường,Không hài lòng`) trong cột `Options` (text). Lý do:
- Đơn giản, không cần bảng riêng cho bài test này
- `FieldValidationEngine` và Frontend đều có hàm `parseOptions` xử lý linh hoạt cả CSV lẫn JSON array để đảm bảo backward compatibility

---

## 🤖 Minh Bạch Về Việc Sử Dụng AI

Tôi đã sử dụng AI (cụ thể là **Gemini/Claude** thông qua công cụ AI assistant) trong suốt quá trình làm bài test này. Tôi chọn minh bạch điều này vì tôi tin rằng khả năng **sử dụng AI hiệu quả và có kiểm soát** là một kỹ năng quan trọng của lập trình viên hiện đại.

### Tôi dùng AI như thế nào?

| Việc tôi nhờ AI | Việc tôi tự quyết định |
|---|---|
| Sinh boilerplate code (Entity, Controller) | **Thiết kế kiến trúc tổng thể** (Clean Architecture, layer separation) |
| Gợi ý cú pháp C# / React không nhớ | **Định nghĩa business rules** (validation logic, order constraints) |
| Viết unit test nhanh hơn | **Phán xét code có đúng không** trước khi commit |
| Format README, Dockerfile | **Quyết định pattern** (ServiceResult, ValidationEngine tách riêng) |
| Debug lỗi UI (calendar popup) | **Hiểu nguyên nhân gốc rễ** và xác nhận fix đúng hướng |

### Tôi kiểm soát AI như thế nào?

1. **Luôn đọc và hiểu code trước khi accept** – Không copy-paste mù quáng. Mỗi đoạn code AI gợi ý, tôi đều đọc, verify logic, và sửa lại nếu không phù hợp với context.

2. **Đặt câu hỏi đúng hướng (Prompt Engineering)** – Thay vì hỏi "viết cho tôi backend form builder", tôi hỏi theo từng vấn đề cụ thể: *"Tại sao calendar popup bị lệch vị trí?"*, *"Thiết kế API reorder như thế nào để tránh race condition?"*. Điều này giúp tôi nhận được câu trả lời có **tư duy**, không chỉ là code.

3. **Double-check kết quả** – Tôi tự chạy `dotnet test` để xác nhận 17/17 tests pass thực sự, không chỉ tin lời AI nói "tests sẽ pass".

4. **AI không thay thế phán xét kỹ thuật** – Ví dụ: AI ban đầu gợi ý dùng nhiều API riêng lẻ khi kéo thả. Tôi tự nhận ra vấn đề race condition và yêu cầu AI thiết kế lại thành **Bulk Reorder API**.

5. **Commit thường xuyên, từng tính năng** – Lịch sử 7 commits giúp tôi (và reviewer) thấy rõ tôi làm gì, theo thứ tự nào, không phải "AI dump 1 đống code vào".

### Kết luận

> AI là công cụ tăng tốc độ thực thi, không phải thay thế tư duy thiết kế. Tôi dùng AI để **làm nhanh hơn những thứ tôi đã biết**, không phải để **làm thay những thứ tôi chưa hiểu**.

