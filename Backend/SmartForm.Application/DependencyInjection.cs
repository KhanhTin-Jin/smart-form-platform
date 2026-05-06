using FluentValidation;
using Mapster;
using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;
using SmartForm.Application.Mappings;
using SmartForm.Application.Services;
using System.Reflection;

namespace SmartForm.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            var config = TypeAdapterConfig.GlobalSettings;
            MappingRegistration.RegisterMappings();
            services.AddSingleton(config);
            services.AddScoped<IMapper, ServiceMapper>();

            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            services.AddScoped<IFormService, FormService>();

            return services;
        }
    }
}
