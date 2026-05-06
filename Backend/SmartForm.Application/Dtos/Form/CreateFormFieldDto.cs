namespace SmartForm.Application.Dtos.Form
{
    public class CreateFormFieldDto
    {
        public string Label { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool Required { get; set; }
        public string? Options { get; set; }
    }

    public class UpdateFormFieldDto
    {
        public string Label { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool Required { get; set; }
        public string? Options { get; set; }
    }
}
