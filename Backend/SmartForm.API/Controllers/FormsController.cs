using Microsoft.AspNetCore.Mvc;
using SmartForm.API.Extensions;
using SmartForm.API.Payloads;
using SmartForm.API.Payloads.Request.Form;
using SmartForm.Application.Services;
using System;
using System.Threading.Tasks;

namespace SmartForm.API.Controllers
{
    [ApiController]
    public class FormsController : ControllerBase
    {
        private readonly IFormService _formService;

        public FormsController(IFormService formService)
        {
            _formService = formService;
        }

        [HttpGet(APIRoute.Forms.GetAll)]
        public async Task<IActionResult> GetAllForms()
        {
            var result = await _formService.GetAllFormsAsync(activeOnly: false);
            return this.ToIActionResult(result);
        }

        [HttpGet(APIRoute.Forms.GetActive)]
        public async Task<IActionResult> GetActiveForms()
        {
            var result = await _formService.GetAllFormsAsync(activeOnly: true);
            return this.ToIActionResult(result);
        }

        [HttpGet(APIRoute.Forms.GetById)]
        public async Task<IActionResult> GetFormById(Guid id)
        {
            var result = await _formService.GetFormByIdAsync(id);
            return this.ToIActionResult(result);
        }

        [HttpPost(APIRoute.Forms.Create)]
        public async Task<IActionResult> CreateForm([FromBody] CreateFormRequest req)
        {
            var result = await _formService.CreateFormAsync(req.ToDto());
            return this.ToIActionResult(result);
        }

        [HttpPut(APIRoute.Forms.Update)]
        public async Task<IActionResult> UpdateForm(Guid id, [FromBody] UpdateFormRequest req)
        {
            var result = await _formService.UpdateFormAsync(id, req.ToDto());
            return this.ToIActionResult(result);
        }

        [HttpDelete(APIRoute.Forms.Delete)]
        public async Task<IActionResult> DeleteForm(Guid id)
        {
            var result = await _formService.DeleteFormAsync(id);
            return this.ToIActionResult(result);
        }

        [HttpPost(APIRoute.Forms.AddField)]
        public async Task<IActionResult> AddField(Guid id, [FromBody] CreateFormFieldRequest req)
        {
            var result = await _formService.AddFieldToFormAsync(id, req.ToDto());
            return this.ToIActionResult(result);
        }

        [HttpPut(APIRoute.Forms.UpdateField)]
        public async Task<IActionResult> UpdateField(Guid id, Guid fid, [FromBody] UpdateFormFieldRequest req)
        {
            var result = await _formService.UpdateFormFieldAsync(id, fid, req.ToDto());
            return this.ToIActionResult(result);
        }

        [HttpDelete(APIRoute.Forms.DeleteField)]
        public async Task<IActionResult> DeleteField(Guid id, Guid fid)
        {
            var result = await _formService.DeleteFormFieldAsync(id, fid);
            return this.ToIActionResult(result);
        }

        [HttpPost(APIRoute.Forms.Submit)]
        public async Task<IActionResult> SubmitForm(Guid id, [FromBody] SubmitFormRequest req)
        {
            var result = await _formService.SubmitFormAsync(id, req.ToDto());
            return this.ToIActionResult(result);
        }
    }
}
