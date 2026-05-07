using SmartForm.Application.Validation;
using SmartForm.Domain.Entities;
using System;
using Xunit;

namespace SmartForm.Tests
{
    public class FieldValidationEngineTests
    {
        [Fact]
        public void ValidateField_RequiredButEmpty_ReturnsError()
        {
            var field = new FormField { Label = "Name", Required = true, Type = "text" };
            var result = FieldValidationEngine.ValidateField(field, "");
            Assert.NotNull(result);
            Assert.Contains("is required", result);
        }

        [Fact]
        public void ValidateField_TextLengthExceeds200_ReturnsError()
        {
            var field = new FormField { Label = "Desc", Required = false, Type = "text" };
            var longText = new string('A', 201);
            var result = FieldValidationEngine.ValidateField(field, longText);
            Assert.NotNull(result);
            Assert.Contains("exceed 200 characters", result);
        }

        [Theory]
        [InlineData("105", true)]
        [InlineData("-5", true)]
        [InlineData("50", false)]
        [InlineData("abc", true)]
        public void ValidateField_NumberConstraints_ReturnsExpected(string value, bool expectError)
        {
            var field = new FormField { Label = "Age", Required = false, Type = "number" };
            var result = FieldValidationEngine.ValidateField(field, value);
            if (expectError) Assert.NotNull(result);
            else Assert.Null(result);
        }

        [Fact]
        public void ValidateField_DateInPast_ReturnsError()
        {
            var field = new FormField { Label = "Date", Required = false, Type = "date" };
            var pastDate = DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd");
            var result = FieldValidationEngine.ValidateField(field, pastDate);
            Assert.NotNull(result);
        }

        [Fact]
        public void ValidateField_DateTodayOrFuture_ReturnsNull()
        {
            var field = new FormField { Label = "Date", Required = false, Type = "date" };
            var futureDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd");
            var result = FieldValidationEngine.ValidateField(field, futureDate);
            Assert.Null(result);
        }

        [Theory]
        [InlineData("#FFF", false)]
        [InlineData("#00b14f", false)]
        [InlineData("red", true)]
        [InlineData("#12345", true)]
        public void ValidateField_ColorHex_ReturnsExpected(string value, bool expectError)
        {
            var field = new FormField { Label = "Color", Required = false, Type = "color" };
            var result = FieldValidationEngine.ValidateField(field, value);
            if (expectError) Assert.NotNull(result);
            else Assert.Null(result);
        }

        [Theory]
        [InlineData("Opt 1, Opt 2", "Opt 1", false)]
        [InlineData("Opt 1, Opt 2", "Opt 3", true)]
        [InlineData("[\"JSON 1\", \"JSON 2\"]", "JSON 2", false)]
        [InlineData("[\"JSON 1\", \"JSON 2\"]", "JSON 3", true)]
        public void ValidateField_SelectOptions_ReturnsExpected(string options, string value, bool expectError)
        {
            var field = new FormField { Label = "Choice", Required = false, Type = "select", Options = options };
            var result = FieldValidationEngine.ValidateField(field, value);
            if (expectError) Assert.NotNull(result);
            else Assert.Null(result);
        }
    }
}
