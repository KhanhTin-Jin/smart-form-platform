using System;
using System.Collections.Generic;

namespace SmartForm.Application.Dtos.Form
{
    public class FormDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Order { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<FormFieldDto> Fields { get; set; } = new();
    }
}
