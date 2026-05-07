using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartForm.Infrastructure.Data;

namespace SmartForm.API.Extensions
{
    public static class DatabaseMigrationExtensions
    {
        public static WebApplication MigrateDatabaseIfEnabled(this WebApplication app)
        {
            var autoMigrate = app.Configuration.GetValue<bool>("AUTO_MIGRATE");
            if (app.Environment.IsDevelopment() && autoMigrate)
            {
                using var scope = app.Services.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                dbContext.Database.Migrate();
            }

            return app;
        }
    }
}
