# Dynamic Form Builder System

Đây là giải pháp cho bài test Young Talent - Hệ thống quản lý form động (Dynamic Form Builder). 
Backend được xây dựng bằng **.NET 8** kết hợp với **PostgreSQL** và tuân thủ nghiêm ngặt **Clean Architecture**.

## 🏗 Kiến trúc Backend (Clean Architecture)

Hệ thống được chia thành 4 layer chính:
1. **Domain**: Chứa các Entity (`Form`, `FormField`, `FormSubmission`, `SubmissionValue`) kế thừa từ `BaseEntity`. Định nghĩa các hằng số lỗi (`ResultCodeConst`), Interfaces (`IRepository`, `IUnitOfWork`).
2. **Infrastructure**: Implement EF Core `DbContext`, cấu hình database schema sử dụng Fluent API, implement `GenericRepository` và `UnitOfWork` pattern.
3. **Application**: Chứa toàn bộ Business Logic (`FormService`), DTOs, cấu hình Mapping (sử dụng Mapster) và sử dụng wrapper `ServiceResult` chuẩn hóa response. Logic validate form submission động được xử lý tại đây.
4. **API**: Các endpoints RESTful, Controllers (`FormsController`, `SubmissionsController`) nhận payload, tự động map sang DTO, giao tiếp với Application layer và trả về `HTTP Status Codes` thông qua `ControllerExtensions`.

## 🚀 Tính năng hỗ trợ
- Quản lý Form (CRUD form)
- Quản lý Field (Thêm/Sửa/Xóa các trường động)
- Hỗ trợ đa dạng loại field: `text`, `number`, `date`, `color`, `select` (kèm danh sách options).
- Cung cấp API Submit Form có cơ chế Validation động từ server theo thuộc tính của từng field (Required, max length, number range, date validation, HEX color regex, select options matching).
- Quản lý danh sách kết quả (Submissions).

## 🛠 Hướng dẫn chạy dự án

### Yêu cầu
- .NET 8 SDK
- PostgreSQL (có thể dùng docker)

### Cài đặt Database
Mở file `Backend/SmartForm.API/appsettings.json` và sửa `ConnectionStrings:DefaultConnection` thành kết nối PostgreSQL của bạn.

Mặc định: `Host=localhost;Database=SmartFormDb;Username=postgres;Password=postgres`

### Khởi tạo & Chạy Backend
Mở Terminal tại thư mục `Backend` và chạy:

```bash
cd SmartForm.API
# Tạo migration cho CSDL
dotnet ef migrations add InitialCreate --project ../SmartForm.Infrastructure --startup-project .
# Cập nhật DB
dotnet ef database update --project ../SmartForm.Infrastructure --startup-project .
# Chạy dự án
dotnet run
```
Sau đó truy cập [https://localhost:5001/swagger](https://localhost:5001/swagger) hoặc port được cấp tương tự để xem tài liệu API và test trực tiếp qua Swagger UI.
