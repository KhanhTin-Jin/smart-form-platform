using System.Collections.Generic;

namespace SmartForm.Domain.Entities
{
    public class Form : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Order { get; set; } = 0;
        public string Status { get; set; } = "draft"; // active, draft

        // Navigation
        public ICollection<FormField> Fields { get; set; } = new List<FormField>();
        public ICollection<FormSubmission> Submissions { get; set; } = new List<FormSubmission>();
    }
}
