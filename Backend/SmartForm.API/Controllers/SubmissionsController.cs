using Microsoft.AspNetCore.Mvc;
using SmartForm.API.Extensions;
using SmartForm.API.Payloads;
using SmartForm.Application.Services;
using System.Threading.Tasks;

namespace SmartForm.API.Controllers
{
    [ApiController]
    public class SubmissionsController : ControllerBase
    {
        private readonly IFormService _formService;

        public SubmissionsController(IFormService formService)
        {
            _formService = formService;
        }

        [HttpGet(APIRoute.Submissions.GetAll)]
        public async Task<IActionResult> GetSubmissions()
        {
            var result = await _formService.GetSubmissionsAsync();
            return this.ToIActionResult(result);
        }
    }
}
