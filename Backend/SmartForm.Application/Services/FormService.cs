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
                
            var fields = await _unitOfWork.Repository<FormField>().GetAllAsync();
            
            var sortedForms = forms.OrderBy(f => f.Order).ToList();
            foreach (var form in sortedForms)
            {
                form.Fields = fields.Where(f => f.FormId == form.Id).OrderBy(f => f.Order).ToList();
            }

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
            if (dto.Order < 1) return ServiceResult<FormDto>.Warning(ResultCodeConst.ValidationError, "Order cannot be negative or zero.");
            
            var form = _mapper.Map<Form>(dto);
            await _unitOfWork.Repository<Form>().AddAsync(form);
            await _unitOfWork.CompleteAsync();

            return ServiceResult<FormDto>.Success(_mapper.Map<FormDto>(form));
        }

        public async Task<ServiceResult<FormDto>> UpdateFormAsync(Guid id, UpdateFormDto dto)
        {
            if (dto.Order < 1) return ServiceResult<FormDto>.Warning(ResultCodeConst.ValidationError, "Order cannot be negative or zero.");
            
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
            if (dto.Order < 1) return ServiceResult<FormFieldDto>.Warning(ResultCodeConst.ValidationError, "Order cannot be negative or zero.");
            
            var existingField = await _unitOfWork.Repository<FormField>().FirstOrDefaultAsync(f => f.FormId == formId && f.Order == dto.Order);
            if (existingField != null) return ServiceResult<FormFieldDto>.Warning(ResultCodeConst.ValidationError, "Order value is already used by another field.");

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
            if (dto.Order < 1) return ServiceResult<FormFieldDto>.Warning(ResultCodeConst.ValidationError, "Order cannot be negative or zero.");
            
            var existingField = await _unitOfWork.Repository<FormField>().FirstOrDefaultAsync(f => f.FormId == formId && f.Order == dto.Order && f.Id != fieldId);
            if (existingField != null) return ServiceResult<FormFieldDto>.Warning(ResultCodeConst.ValidationError, "Order value is already used by another field.");

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

        public async Task<ServiceResult> ReorderFieldsAsync(Guid formId, List<Guid> fieldIds)
        {
            var form = await _unitOfWork.Repository<Form>().GetByIdAsync(formId);
            if (form == null) return ServiceResult.Warning(ResultCodeConst.FormNotFound, "Form not found");

            var fields = await _unitOfWork.Repository<FormField>().GetAsync(f => f.FormId == formId);
            
            for (int i = 0; i < fieldIds.Count; i++)
            {
                var field = fields.FirstOrDefault(f => f.Id == fieldIds[i]);
                if (field != null)
                {
                    field.Order = i + 1;
                    _unitOfWork.Repository<FormField>().Update(field);
                }
            }

            await _unitOfWork.CompleteAsync();
            return ServiceResult.Success();
        }

        public async Task<ServiceResult> SubmitFormAsync(Guid formId, SubmitFormDto dto)
        {
            var form = await _unitOfWork.Repository<Form>().GetByIdAsync(formId);
            if (form == null || form.Status != "active") return ServiceResult.Warning(ResultCodeConst.FormNotFound, "Active form not found");

            var fields = await _unitOfWork.Repository<FormField>().GetAsync(f => f.FormId == formId);

            // Validation Engine (Extracted to separate module for scalability and testing)
            foreach (var field in fields)
            {
                var submittedValue = dto.Values.FirstOrDefault(v => v.FormFieldId == field.Id)?.Value;
                var errorMsg = SmartForm.Application.Validation.FieldValidationEngine.ValidateField(field, submittedValue);
                
                if (errorMsg != null)
                {
                    return ServiceResult.Warning(ResultCodeConst.ValidationError, errorMsg);
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
