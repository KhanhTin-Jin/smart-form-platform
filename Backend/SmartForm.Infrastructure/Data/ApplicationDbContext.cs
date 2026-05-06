using Microsoft.EntityFrameworkCore;
using SmartForm.Domain.Entities;
using System.Reflection;

namespace SmartForm.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Form> Forms { get; set; } = null!;
        public DbSet<FormField> FormFields { get; set; } = null!;
        public DbSet<FormSubmission> FormSubmissions { get; set; } = null!;
        public DbSet<SubmissionValue> SubmissionValues { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
