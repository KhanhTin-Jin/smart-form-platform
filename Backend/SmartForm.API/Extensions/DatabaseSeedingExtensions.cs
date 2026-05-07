using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartForm.Application.Services;

namespace SmartForm.API.Extensions
{
    public static class DatabaseSeedingExtensions
    {
        public static WebApplication SeedDatabaseIfEnabled(this WebApplication app)
        {
            var autoSeed = app.Configuration.GetValue<bool>("AUTO_SEED");
            if (!app.Environment.IsDevelopment() || !autoSeed)
            {
                return app;
            }

            using var scope = app.Services.CreateScope();
            var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
            seeder.Seed();
            return app;
        }
    }
}
