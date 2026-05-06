using System;

namespace SmartForm.Application.Dtos.Form
{
    public class FormFieldDto
    {
        public Guid Id { get; set; }
        public Guid FormId { get; set; }
        public string Label { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool Required { get; set; }
        public string? Options { get; set; }
    }
}
