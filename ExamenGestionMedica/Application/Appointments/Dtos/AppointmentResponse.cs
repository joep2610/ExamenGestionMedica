using ExamenGestionMedica.Domain.Enums;

namespace ExamenGestionMedica.Application.Appointments.Dtos;

public sealed class AppointmentResponse
{
    public int Id { get; set; }

    public int PacienteId { get; set; }

    public string NombreCompletoPaciente { get; set; } = string.Empty;

    public string Medico { get; set; } = string.Empty;

    public DateTime FechaHora { get; set; }

    public AppointmentStatus Estado { get; set; }

    public string Motivo { get; set; } = string.Empty;

    public string? Diagnostico { get; set; }

    public string? Tratamiento { get; set; }
}


