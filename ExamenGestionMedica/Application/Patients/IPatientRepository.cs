using ExamenGestionMedica.Domain.Entities;

namespace ExamenGestionMedica.Application.Patients;

public interface IPatientRepository
{
    Task<IReadOnlyCollection<Patient>> GetAsync(string? search);

    Task<Patient?> GetByIdAsync(int id);

    Task AddAsync(Patient patient);

    Task UpdateAsync(Patient patient);

    Task DeleteAsync(int id);
}


