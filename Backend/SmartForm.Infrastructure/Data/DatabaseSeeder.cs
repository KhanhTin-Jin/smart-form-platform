using SmartForm.Application.Services;
using SmartForm.Domain.Entities;
using SmartForm.Infrastructure.Data;
using System;
using System.Linq;

namespace SmartForm.Infrastructure.Data
{
    public sealed class DatabaseSeeder : IDatabaseSeeder
    {
        private readonly ApplicationDbContext _dbContext;

        public DatabaseSeeder(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Seed()
        {
            // Idempotent seed: only seed when database is empty.
            if (_dbContext.Forms.Any())
            {
                return;
            }

            var form = new Form
            {
                Title = "Employee Onboarding",
                Description = "Sample form seeded for local development",
                Order = 1,
                Status = "active",
                CreatedBy = "seed",
            };

            var fullNameField = new FormField
            {
                Form = form,
                Label = "Full name",
                Type = "text",
                Order = 1,
                Required = true,
                CreatedBy = "seed",
            };

            var emailField = new FormField
            {
                Form = form,
                Label = "Email",
                Type = "text",
                Order = 2,
                Required = true,
                CreatedBy = "seed",
            };

            var startDateField = new FormField
            {
                Form = form,
                Label = "Start date",
                Type = "date",
                Order = 3,
                Required = true,
                CreatedBy = "seed",
            };

            var departmentField = new FormField
            {
                Form = form,
                Label = "Department",
                Type = "select",
                Order = 4,
                Required = true,
                Options = "[\"Engineering\",\"HR\",\"Sales\"]",
                CreatedBy = "seed",
            };

            _dbContext.Forms.Add(form);
            _dbContext.FormFields.AddRange(fullNameField, emailField, startDateField, departmentField);

            var submission = new FormSubmission
            {
                Form = form,
                SubmitterName = "Jane Doe",
                CreatedBy = "seed",
            };

            var startDateValue = DateTime.UtcNow.AddDays(7).ToString("yyyy-MM-dd");

            _dbContext.FormSubmissions.Add(submission);
            _dbContext.SubmissionValues.AddRange(
                new SubmissionValue { FormSubmission = submission, FormField = fullNameField, Value = "Jane Doe", CreatedBy = "seed" },
                new SubmissionValue { FormSubmission = submission, FormField = emailField, Value = "jane.doe@example.com", CreatedBy = "seed" },
                new SubmissionValue { FormSubmission = submission, FormField = startDateField, Value = startDateValue, CreatedBy = "seed" },
                new SubmissionValue { FormSubmission = submission, FormField = departmentField, Value = "Engineering", CreatedBy = "seed" }
            );

            _dbContext.SaveChanges();
        }
    }
}
