using SmartForm.Application.Dtos.Form;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SmartForm.API.Payloads.Request.Form
{
    public class SubmitFormRequest
    {
        public string SubmitterName { get; set; } = string.Empty;
        public List<SubmitFieldValueRequest> Values { get; set; } = new();

        public SubmitFormDto ToDto() => new()
        {
            SubmitterName = SubmitterName,
            Values = Values.Select(v => new SubmitFieldValueDto
            {
                FormFieldId = v.FormFieldId,
                Value = v.Value
            }).ToList()
        };
    }

    public class SubmitFieldValueRequest
    {
        public Guid FormFieldId { get; set; }
        public string? Value { get; set; }
    }
}
