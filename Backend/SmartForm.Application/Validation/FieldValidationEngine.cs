using SmartForm.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace SmartForm.Application.Validation
{
    /// <summary>
    /// Extracting validation logic into a separate module (Strategy/Engine) 
    /// instead of keeping it directly inside the FormService or Controller.
    /// This strictly follows the Single Responsibility Principle and is highly extensible.
    /// </summary>
    public static class FieldValidationEngine
    {
        public static string ValidateField(FormField field, string submittedValue)
        {
            if (field.Required && string.IsNullOrWhiteSpace(submittedValue))
            {
                return $"Field '{field.Label}' is required.";
            }

            if (!string.IsNullOrWhiteSpace(submittedValue))
            {
                switch (field.Type.ToLower())
                {
                    case "text":
                        if (submittedValue.Length > 200)
                            return $"Field '{field.Label}' must not exceed 200 characters.";
                        break;
                    case "number":
                        if (!decimal.TryParse(submittedValue, out decimal num) || num < 0 || num > 100)
                            return $"Field '{field.Label}' must be a number between 0 and 100.";
                        break;
                    case "date":
                        if (!DateTime.TryParse(submittedValue, out DateTime date) || date < DateTime.UtcNow.Date)
                            return $"Field '{field.Label}' must be a valid date and not in the past.";
                        break;
                    case "color":
                        if (!Regex.IsMatch(submittedValue, "^#(?:[0-9a-fA-F]{3}){1,2}$"))
                            return $"Field '{field.Label}' must be a valid HEX color code.";
                        break;
                    case "select":
                        var options = ParseOptions(field.Options);
                        if (!options.Contains(submittedValue))
                            return $"Field '{field.Label}' must be one of the provided options.";
                        break;
                }
            }

            return null; // Null means valid
        }

        private static List<string> ParseOptions(string optionsStr)
        {
            if (string.IsNullOrWhiteSpace(optionsStr)) return new List<string>();
            try
            {
                // Attempt JSON parsing first for robustness
                var parsed = System.Text.Json.JsonSerializer.Deserialize<List<string>>(optionsStr);
                if (parsed != null) return parsed.Select(o => o.Trim()).ToList();
            }
            catch { }
            
            // Fallback to CSV format
            return optionsStr.Split(',').Select(o => o.Trim()).ToList();
        }
    }
}
