using Microsoft.AspNetCore.Mvc;
using SmartForm.Application.Services;

namespace SmartForm.API.Extensions
{
    public static class ControllerExtensions
    {
        public static IActionResult ToIActionResult(this ControllerBase controller, ServiceResult result)
        {
            if (result.IsSuccess)
            {
                return controller.Ok(result);
            }

            if (result.Code == Domain.Constants.ResultCodeConst.FormNotFound || result.Code == Domain.Constants.ResultCodeConst.FieldNotFound)
            {
                return controller.NotFound(result);
            }

            return controller.BadRequest(result);
        }
    }
}
