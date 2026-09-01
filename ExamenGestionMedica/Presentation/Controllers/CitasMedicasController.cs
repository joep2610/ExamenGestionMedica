using ExamenGestionMedica.Application.Appointments;
using ExamenGestionMedica.Application.Appointments.Dtos;
using ExamenGestionMedica.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace ExamenGestionMedica.Presentation.Controllers;

[ApiController]
[Route("api/citas-medicas")]
public sealed class CitasMedicasController : ControllerBase
{
    private readonly IAppointmentService _appointments;

    public CitasMedicasController(IAppointmentService appointments)
    {
        _appointments = appointments;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<AppointmentResponse>>> Get(
        [FromQuery] DateOnly? date,
        [FromQuery] string? medico,
        [FromQuery] AppointmentStatus? estado)
    {
        var appointments = await _appointments.GetAsync(date, medico, estado);
        return Ok(appointments);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppointmentResponse>> GetById(int id)
    {
        var appointment = await _appointments.GetByIdAsync(id);
        return Ok(appointment);
    }

    [HttpPost]
    public async Task<ActionResult<AppointmentResponse>> Create(CreateAppointmentRequest request)
    {
        var appointment = await _appointments.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = appointment.Id }, appointment);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AppointmentResponse>> Update(int id, UpdateAppointmentRequest request)
    {
        var appointment = await _appointments.UpdateAsync(id, request);
        return Ok(appointment);
    }

    [HttpPatch("{id:int}/cancelar")]
    public async Task<ActionResult<AppointmentResponse>> Cancel(int id)
    {
        var appointment = await _appointments.CancelAsync(id);
        return Ok(appointment);
    }
}


