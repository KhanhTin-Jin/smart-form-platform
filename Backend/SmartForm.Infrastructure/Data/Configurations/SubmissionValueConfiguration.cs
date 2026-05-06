using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartForm.Domain.Entities;

namespace SmartForm.Infrastructure.Data.Configurations
{
    public class SubmissionValueConfiguration : IEntityTypeConfiguration<SubmissionValue>
    {
        public void Configure(EntityTypeBuilder<SubmissionValue> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.FormSubmission)
                .WithMany(s => s.Values)
                .HasForeignKey(x => x.FormSubmissionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.FormField)
                .WithMany()
                .HasForeignKey(x => x.FormFieldId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
