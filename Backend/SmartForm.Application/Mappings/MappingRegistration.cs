using Mapster;
using SmartForm.Domain.Entities;
using SmartForm.Application.Dtos.Form;

namespace SmartForm.Application.Mappings
{
    public static class MappingRegistration
    {
        public static void RegisterMappings()
        {
            TypeAdapterConfig<Form, FormDto>.NewConfig()
                .Map(dest => dest.Fields, src => src.Fields);

            TypeAdapterConfig<FormField, FormFieldDto>.NewConfig();

            TypeAdapterConfig<CreateFormDto, Form>.NewConfig();
            TypeAdapterConfig<CreateFormFieldDto, FormField>.NewConfig();
            TypeAdapterConfig<UpdateFormDto, Form>.NewConfig();
            TypeAdapterConfig<UpdateFormFieldDto, FormField>.NewConfig();
            
            TypeAdapterConfig<FormSubmission, FormSubmissionDto>.NewConfig()
                .Map(dest => dest.Values, src => src.Values);
                
            TypeAdapterConfig<SubmissionValue, SubmissionValueDto>.NewConfig();
        }
    }
}
