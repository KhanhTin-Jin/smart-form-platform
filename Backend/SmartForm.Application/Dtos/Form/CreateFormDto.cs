namespace SmartForm.Application.Dtos.Form
{
    public class CreateFormDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Order { get; set; }
        public string Status { get; set; } = "active";
    }

    public class UpdateFormDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Order { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
