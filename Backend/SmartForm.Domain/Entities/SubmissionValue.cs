using System;

namespace SmartForm.Domain.Entities
{
    public class SubmissionValue : BaseEntity
    {
        public Guid FormSubmissionId { get; set; }
        public Guid FormFieldId { get; set; }
        public string? Value { get; set; }

        // Navigation
        public FormSubmission FormSubmission { get; set; } = null!;
        public FormField FormField { get; set; } = null!;
    }
}
