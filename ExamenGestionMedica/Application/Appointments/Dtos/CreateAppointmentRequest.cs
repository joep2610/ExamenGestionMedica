using ExamenGestionMedica.Domain.Enums;

namespace ExamenGestionMedica.Application.Appointments.Dtos;

public sealed class CreateAppointmentRequest
{
    public int PacienteId { get; set; }

    public string? Medico { get; set; }

    public DateTime FechaHora { get; set; }

    public AppointmentStatus Estado { get; set; } = AppointmentStatus.Scheduled;

    public string? Motivo { get; set; }

    public string? Diagnostico { get; set; }

    public string? Tratamiento { get; set; }
}


