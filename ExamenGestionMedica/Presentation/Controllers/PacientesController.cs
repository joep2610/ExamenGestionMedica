using ExamenGestionMedica.Application.Patients;
using ExamenGestionMedica.Application.Patients.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ExamenGestionMedica.Presentation.Controllers;

[ApiController]
[Route("api/pacientes")]
public sealed class PacientesController : ControllerBase
{
    private readonly IPatientService _patients;

    public PacientesController(IPatientService patients)
    {
        _patients = patients;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<PatientResponse>>> Get([FromQuery] string? search)
    {
        var patients = await _patients.GetAsync(search);
        return Ok(patients);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PatientResponse>> GetById(int id)
    {
        var patient = await _patients.GetByIdAsync(id);
        return Ok(patient);
    }

    [HttpPost]
    public async Task<ActionResult<PatientResponse>> Create(CreatePatientRequest request)
    {
        var patient = await _patients.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = patient.Id }, patient);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<PatientResponse>> Update(int id, UpdatePatientRequest request)
    {
        var patient = await _patients.UpdateAsync(id, request);
        return Ok(patient);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _patients.DeleteAsync(id);
        return NoContent();
    }
}


