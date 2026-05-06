using System;
using System.Collections.Generic;

namespace SmartForm.Application.Dtos.Form
{
    public class SubmitFormDto
    {
        public string SubmitterName { get; set; } = string.Empty;
        public List<SubmitFieldValueDto> Values { get; set; } = new();
    }

    public class SubmitFieldValueDto
    {
        public Guid FormFieldId { get; set; }
        public string? Value { get; set; }
    }
    
    public class FormSubmissionDto
    {
        public Guid Id { get; set; }
        public Guid FormId { get; set; }
        public string SubmitterName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<SubmissionValueDto> Values { get; set; } = new();
    }
    
    public class SubmissionValueDto
    {
        public Guid FormFieldId { get; set; }
        public string? Value { get; set; }
    }
}
