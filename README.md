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

```bash
# Đảm bảo Docker Desktop đang chạy
docker-compose up --build
```

Sau khi khởi động:
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
