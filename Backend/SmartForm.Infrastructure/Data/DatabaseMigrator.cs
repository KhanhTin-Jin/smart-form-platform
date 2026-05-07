using Microsoft.EntityFrameworkCore;
using SmartForm.Application.Services;

namespace SmartForm.Infrastructure.Data
{
    public sealed class DatabaseMigrator : IDatabaseMigrator
    {
        private readonly ApplicationDbContext _dbContext;

        public DatabaseMigrator(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Migrate()
        {
            _dbContext.Database.Migrate();
        }
    }
}
