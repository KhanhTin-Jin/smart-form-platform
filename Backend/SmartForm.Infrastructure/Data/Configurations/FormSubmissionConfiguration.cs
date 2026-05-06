using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartForm.Domain.Entities;

namespace SmartForm.Infrastructure.Data.Configurations
{
    public class FormSubmissionConfiguration : IEntityTypeConfiguration<FormSubmission>
    {
        public void Configure(EntityTypeBuilder<FormSubmission> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.SubmitterName).IsRequired().HasMaxLength(200);

            builder.HasOne(x => x.Form)
                .WithMany(f => f.Submissions)
                .HasForeignKey(x => x.FormId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
