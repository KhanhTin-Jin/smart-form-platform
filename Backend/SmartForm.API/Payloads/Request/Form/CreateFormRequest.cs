using SmartForm.Application.Dtos.Form;

namespace SmartForm.API.Payloads.Request.Form
{
    public class CreateFormRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Order { get; set; }
        public string Status { get; set; } = "active";

        public CreateFormDto ToDto() => new()
        {
            Title = Title,
            Description = Description,
            Order = Order,
            Status = Status
        };
    }

    public class UpdateFormRequest : CreateFormRequest
    {
        public new UpdateFormDto ToDto() => new()
        {
            Title = Title,
            Description = Description,
            Order = Order,
            Status = Status
        };
    }
}
