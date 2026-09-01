namespace ExamenGestionMedica.Application.Patients.Dtos;

public sealed class UpdatePatientRequest
{
    public string? Nombres { get; set; }

    public string? Apellidos { get; set; }

    public DateOnly FechaNacimiento { get; set; }

    public string? Genero { get; set; }

    public string? Direccion { get; set; }

    public string? Telefono { get; set; }

    public string? Email { get; set; }
}


