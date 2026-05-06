using MapsterMapper;
using SmartForm.Application.Dtos.Form;
using SmartForm.Domain.Constants;
using SmartForm.Domain.Entities;
using SmartForm.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SmartForm.Application.Services
{
    public class FormService : IFormService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public FormService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ServiceResult<List<FormDto>>> GetAllFormsAsync(bool activeOnly = false)
        {
            var forms = activeOnly
                ? await _unitOfWork.Repository<Form>().GetAsync(f => f.Status == "active")
                : await _unitOfWork.Repository<Form>().GetAllAsync();
                
            var sortedForms = forms.OrderBy(f => f.Order).ToList();
            var dtos = _mapper.Map<List<FormDto>>(sortedForms);
            return ServiceResult<List<FormDto>>.Success(dtos);
        }

        public async Task<ServiceResult<FormDto>> GetFormByIdAsync(Guid id)
        {
            var form = await _unitOfWork.Repository<Form>().GetByIdAsync(id);
            if (form == null) return ServiceResult<FormDto>.Warning(ResultCodeConst.FormNotFound, "Form not found");

            var fields = await _unitOfWork.Repository<FormField>().GetAsync(f => f.FormId == id);
            form.Fields = fields.OrderBy(f => f.Order).ToList();

            return ServiceResult<FormDto>.Success(_mapper.Map<FormDto>(form));
        }

        public async Task<ServiceResult<FormDto>> CreateFormAsync(CreateFormDto dto)
        {
            var form = _mapper.Map<Form>(dto);
            await _unitOfWork.Repository<Form>().AddAsync(form);
            await _unitOfWork.CompleteAsync();

            return ServiceResult<FormDto>.Success(_mapper.Map<FormDto>(form));
        }

        public async Task<ServiceResult<FormDto>> UpdateFormAsync(Guid id, UpdateFormDto dto)
        {
            var form = await _unitOfWork.Repository<Form>().GetByIdAsync(id);
            if (form == null) return ServiceResult<FormDto>.Warning(ResultCodeConst.FormNotFound, "Form not found");

            _mapper.Map(dto, form);
            form.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Repository<Form>().Update(form);
            await _unitOfWork.CompleteAsync();

            return ServiceResult<FormDto>.Success(_mapper.Map<FormDto>(form));
        }

        public async Task<ServiceResult> DeleteFormAsync(Guid id)
        {
            var form = await _unitOfWork.Repository<Form>().GetByIdAsync(id);
            if (form == null) return ServiceResult.Warning(ResultCodeConst.FormNotFound, "Form not found");

            _unitOfWork.Repository<Form>().Delete(form);
            await _unitOfWork.CompleteAsync();

            return ServiceResult.Success();
        }

        public async Task<ServiceResult<FormFieldDto>> AddFieldToFormAsync(Guid formId, CreateFormFieldDto dto)
        {
            var form = await _unitOfWork.Repository<Form>().GetByIdAsync(formId);
            if (form == null) return ServiceResult<FormFieldDto>.Warning(ResultCodeConst.FormNotFound, "Form not found");

            var field = _mapper.Map<FormField>(dto);
            field.FormId = formId;

            await _unitOfWork.Repository<FormField>().AddAsync(field);
            await _unitOfWork.CompleteAsync();

            return ServiceResult<FormFieldDto>.Success(_mapper.Map<FormFieldDto>(field));
        }

        public async Task<ServiceResult<FormFieldDto>> UpdateFormFieldAsync(Guid formId, Guid fieldId, UpdateFormFieldDto dto)
        {
            var field = await _unitOfWork.Repository<FormField>().FirstOrDefaultAsync(f => f.Id == fieldId && f.FormId == formId);
            if (field == null) return ServiceResult<FormFieldDto>.Warning(ResultCodeConst.FieldNotFound, "Field not found");

            _mapper.Map(dto, field);
            field.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Repository<FormField>().Update(field);
            await _unitOfWork.CompleteAsync();

            return ServiceResult<FormFieldDto>.Success(_mapper.Map<FormFieldDto>(field));
        }

        public async Task<ServiceResult> DeleteFormFieldAsync(Guid formId, Guid fieldId)
        {
            var field = await _unitOfWork.Repository<FormField>().FirstOrDefaultAsync(f => f.Id == fieldId && f.FormId == formId);
            if (field == null) return ServiceResult.Warning(ResultCodeConst.FieldNotFound, "Field not found");

            _unitOfWork.Repository<FormField>().Delete(field);
            await _unitOfWork.CompleteAsync();

            return ServiceResult.Success();
        }

        public async Task<ServiceResult> SubmitFormAsync(Guid formId, SubmitFormDto dto)
        {
            var form = await _unitOfWork.Repository<Form>().GetByIdAsync(formId);
            if (form == null || form.Status != "active") return ServiceResult.Warning(ResultCodeConst.FormNotFound, "Active form not found");

            var fields = await _unitOfWork.Repository<FormField>().GetAsync(f => f.FormId == formId);

            // Validation Engine
            foreach (var field in fields)
            {
                var submittedValue = dto.Values.FirstOrDefault(v => v.FormFieldId == field.Id)?.Value;

                if (field.Required && string.IsNullOrWhiteSpace(submittedValue))
                {
                    return ServiceResult.Warning(ResultCodeConst.ValidationError, $"Field '{field.Label}' is required.");
                }

                if (!string.IsNullOrWhiteSpace(submittedValue))
                {
                    switch (field.Type.ToLower())
                    {
                        case "text":
                            if (submittedValue.Length > 200)
                                return ServiceResult.Warning(ResultCodeConst.ValidationError, $"Field '{field.Label}' must not exceed 200 characters.");
                            break;
                        case "number":
                            if (!decimal.TryParse(submittedValue, out decimal num) || num < 0 || num > 100)
                                return ServiceResult.Warning(ResultCodeConst.ValidationError, $"Field '{field.Label}' must be a number between 0 and 100.");
                            break;
                        case "date":
                            if (!DateTime.TryParse(submittedValue, out DateTime date) || date < DateTime.UtcNow.Date)
                                return ServiceResult.Warning(ResultCodeConst.ValidationError, $"Field '{field.Label}' must be a valid date and not in the past.");
                            break;
                        case "color":
                            if (!Regex.IsMatch(submittedValue, "^#(?:[0-9a-fA-F]{3}){1,2}$"))
                                return ServiceResult.Warning(ResultCodeConst.ValidationError, $"Field '{field.Label}' must be a valid HEX color code.");
                            break;
                        case "select":
                            var options = field.Options?.Split(',').Select(o => o.Trim()).ToList() ?? new List<string>();
                            if (!options.Contains(submittedValue))
                                return ServiceResult.Warning(ResultCodeConst.ValidationError, $"Field '{field.Label}' must be one of the provided options.");
                            break;
                    }
                }
            }

            var submission = new FormSubmission
            {
                FormId = formId,
                SubmitterName = dto.SubmitterName,
                Values = dto.Values.Select(v => new SubmissionValue
                {
                    FormFieldId = v.FormFieldId,
                    Value = v.Value
                }).ToList()
            };

            await _unitOfWork.Repository<FormSubmission>().AddAsync(submission);
            await _unitOfWork.CompleteAsync();

            return ServiceResult.Success();
        }

        public async Task<ServiceResult<List<FormSubmissionDto>>> GetSubmissionsAsync()
        {
            var submissions = await _unitOfWork.Repository<FormSubmission>().GetAllAsync();
            var values = await _unitOfWork.Repository<SubmissionValue>().GetAllAsync();
            
            foreach (var sub in submissions)
            {
                sub.Values = values.Where(v => v.FormSubmissionId == sub.Id).ToList();
            }

            return ServiceResult<List<FormSubmissionDto>>.Success(_mapper.Map<List<FormSubmissionDto>>(submissions));
        }
    }
}
