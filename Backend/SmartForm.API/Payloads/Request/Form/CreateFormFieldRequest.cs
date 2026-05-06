using SmartForm.Application.Dtos.Form;

namespace SmartForm.API.Payloads.Request.Form
{
    public class CreateFormFieldRequest
    {
        public string Label { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool Required { get; set; }
        public string? Options { get; set; }

        public CreateFormFieldDto ToDto() => new()
        {
            Label = Label,
            Type = Type,
            Order = Order,
            Required = Required,
            Options = Options
        };
    }

    public class UpdateFormFieldRequest : CreateFormFieldRequest
    {
        public new UpdateFormFieldDto ToDto() => new()
        {
            Label = Label,
            Type = Type,
            Order = Order,
            Required = Required,
            Options = Options
        };
    }
}
