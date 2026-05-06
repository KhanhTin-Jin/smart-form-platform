using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartForm.Domain.Entities;

namespace SmartForm.Infrastructure.Data.Configurations
{
    public class FormFieldConfiguration : IEntityTypeConfiguration<FormField>
    {
        public void Configure(EntityTypeBuilder<FormField> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Label).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Type).IsRequired().HasMaxLength(50);
            
            builder.HasOne(x => x.Form)
                .WithMany(f => f.Fields)
                .HasForeignKey(x => x.FormId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
