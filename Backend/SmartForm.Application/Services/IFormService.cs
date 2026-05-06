using SmartForm.Application.Dtos.Form;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartForm.Application.Services
{
    public interface IFormService
    {
        Task<ServiceResult<List<FormDto>>> GetAllFormsAsync(bool activeOnly = false);
        Task<ServiceResult<FormDto>> GetFormByIdAsync(Guid id);
        Task<ServiceResult<FormDto>> CreateFormAsync(CreateFormDto dto);
        Task<ServiceResult<FormDto>> UpdateFormAsync(Guid id, UpdateFormDto dto);
        Task<ServiceResult> DeleteFormAsync(Guid id);

        Task<ServiceResult<FormFieldDto>> AddFieldToFormAsync(Guid formId, CreateFormFieldDto dto);
        Task<ServiceResult<FormFieldDto>> UpdateFormFieldAsync(Guid formId, Guid fieldId, UpdateFormFieldDto dto);
        Task<ServiceResult> DeleteFormFieldAsync(Guid formId, Guid fieldId);

        Task<ServiceResult> SubmitFormAsync(Guid formId, SubmitFormDto dto);
        Task<ServiceResult<List<FormSubmissionDto>>> GetSubmissionsAsync();
    }
}
