using System;
using System.Collections.Generic;

namespace SmartForm.Domain.Entities
{
    public class FormSubmission : BaseEntity
    {
        public Guid FormId { get; set; }
        public string SubmitterName { get; set; } = string.Empty;

        // Navigation
        public Form Form { get; set; } = null!;
        public ICollection<SubmissionValue> Values { get; set; } = new List<SubmissionValue>();
    }
}
