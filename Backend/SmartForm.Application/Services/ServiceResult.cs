namespace SmartForm.Application.Services
{
    public class ServiceResult
    {
        public bool IsSuccess { get; set; }
        public string Code { get; set; } = string.Empty;
        public string? Message { get; set; }
        public object? Data { get; set; }

        public static ServiceResult Success(object? data = null) => new() { IsSuccess = true, Code = Domain.Constants.ResultCodeConst.Success, Data = data };
        public static ServiceResult Warning(string code, string? message = null) => new() { IsSuccess = false, Code = code, Message = message };
    }

    public class ServiceResult<T> : ServiceResult
    {
        public new T? Data { get => (T?)base.Data; set => base.Data = value; }

        public static ServiceResult<T> Success(T data) => new() { IsSuccess = true, Code = Domain.Constants.ResultCodeConst.Success, Data = data };
        public static new ServiceResult<T> Warning(string code, string? message = null) => new() { IsSuccess = false, Code = code, Message = message };
    }
}
