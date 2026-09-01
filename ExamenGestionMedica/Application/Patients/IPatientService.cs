using ExamenGestionMedica.Application.Patients.Dtos;

namespace ExamenGestionMedica.Application.Patients;

public interface IPatientService
{
    Task<IReadOnlyCollection<PatientResponse>> GetAsync(string? search);

    Task<PatientResponse> GetByIdAsync(int id);

    Task<PatientResponse> CreateAsync(CreatePatientRequest request);

    Task<PatientResponse> UpdateAsync(int id, UpdatePatientRequest request);

    Task DeleteAsync(int id);
}


