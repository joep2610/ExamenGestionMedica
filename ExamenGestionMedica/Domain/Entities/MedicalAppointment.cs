using ExamenGestionMedica.Domain.Enums;

namespace ExamenGestionMedica.Domain.Entities;

public sealed class MedicalAppointment
{
    public int Id { get; set; }

    public int PacienteId { get; set; }

    public string Medico { get; set; } = string.Empty;

    public DateTime FechaHora { get; set; }

    public AppointmentStatus Estado { get; set; }

    public string Motivo { get; set; } = string.Empty;

    public string? Diagnostico { get; set; }

    public string? Tratamiento { get; set; }
}

