using ExamenGestionMedica.Application.Common;
using ExamenGestionMedica.Application.Patients.Dtos;
using ExamenGestionMedica.Domain.Entities;

namespace ExamenGestionMedica.Application.Patients;

public sealed class PatientService : IPatientService
{
    private readonly IPatientRepository _patients;

    public PatientService(IPatientRepository patients)
    {
        _patients = patients;
    }

    public async Task<IReadOnlyCollection<PatientResponse>> GetAsync(string? search)
    {
        var patients = await _patients.GetAsync(search);
        return patients.Select(ToResponse).ToArray();
    }

    public async Task<PatientResponse> GetByIdAsync(int id)
    {
        var patient = await FindPatientAsync(id);
        return ToResponse(patient);
    }

    public async Task<PatientResponse> CreateAsync(CreatePatientRequest request)
    {
        var patient = new Patient();

        Apply(patient, request.Nombres, request.Apellidos, request.FechaNacimiento, request.Genero, request.Direccion, request.Telefono, request.Email);

        await _patients.AddAsync(patient);
        return ToResponse(patient);
    }

    public async Task<PatientResponse> UpdateAsync(int id, UpdatePatientRequest request)
    {
        var patient = await FindPatientAsync(id);

        Apply(patient, request.Nombres, request.Apellidos, request.FechaNacimiento, request.Genero, request.Direccion, request.Telefono, request.Email);

        await _patients.UpdateAsync(patient);
        return ToResponse(patient);
    }

    public async Task DeleteAsync(int id)
    {
        _ = await FindPatientAsync(id);
        await _patients.DeleteAsync(id);
    }

    private async Task<Patient> FindPatientAsync(int id)
    {
        var patient = await _patients.GetByIdAsync(id);
        return patient ?? throw new NotFoundException("Paciente no encontrado.");
    }

    private static void Apply(
        Patient patient,
        string? nombres,
        string? apellidos,
        DateOnly fechaNacimiento,
        string? genero,
        string? direccion,
        string? telefono,
        string? email)
    {
        if (fechaNacimiento == default)
        {
            throw new AppValidationException("La fecha de nacimiento es obligatoria.");
        }

        if (fechaNacimiento > DateOnly.FromDateTime(DateTime.Today))
        {
            throw new AppValidationException("La fecha de nacimiento no puede ser futura.");
        }

        patient.Nombres = Guard.Required(nombres, "Los nombres");
        patient.Apellidos = Guard.Required(apellidos, "Los apellidos");
        patient.FechaNacimiento = fechaNacimiento;
        patient.Genero = Guard.Required(genero, "El genero");
        patient.Direccion = Guard.Required(direccion, "La direccion");
        patient.Telefono = Guard.Required(telefono, "El telefono");
        patient.Email = Guard.Email(email);
    }

    private static PatientResponse ToResponse(Patient patient) => new()
    {
        Id = patient.Id,
        Nombres = patient.Nombres,
        Apellidos = patient.Apellidos,
        FechaNacimiento = patient.FechaNacimiento,
        Genero = patient.Genero,
        Direccion = patient.Direccion,
        Telefono = patient.Telefono,
        Email = patient.Email
    };
}


