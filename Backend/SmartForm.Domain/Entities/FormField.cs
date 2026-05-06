using System;

namespace SmartForm.Domain.Entities
{
    public class FormField : BaseEntity
    {
        public Guid FormId { get; set; }
        public string Label { get; set; } = string.Empty;
        public string Type { get; set; } = "text"; // text, number, date, color, select
        public int Order { get; set; } = 0;
        public bool Required { get; set; } = false;
        
        // JSON array of strings, or just simple comma-separated options for 'select'
        public string? Options { get; set; } 

        // Navigation
        public Form Form { get; set; } = null!;
    }
}
