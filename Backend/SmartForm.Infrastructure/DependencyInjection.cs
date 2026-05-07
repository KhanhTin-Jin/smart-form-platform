using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartForm.Application.Services;
using SmartForm.Domain.Interfaces;
using SmartForm.Infrastructure.Data;
using SmartForm.Infrastructure.Repositories;

namespace SmartForm.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(config.GetConnectionString("DefaultConnection")));

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();
            services.AddScoped<IDatabaseMigrator, DatabaseMigrator>();

            return services;
        }
    }
}
