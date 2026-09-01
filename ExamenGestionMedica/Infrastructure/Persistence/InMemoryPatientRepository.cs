using System.Collections.Concurrent;
using ExamenGestionMedica.Application.Patients;
using ExamenGestionMedica.Domain.Entities;

namespace ExamenGestionMedica.Infrastructure.Persistence;

public sealed class InMemoryPatientRepository : IPatientRepository
{
    private readonly ConcurrentDictionary<int, Patient> _patients = new();
    private int _nextId;

    public Task<IReadOnlyCollection<Patient>> GetAsync(string? search)
    {
        IEnumerable<Patient> patients = _patients.Values;

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            patients = patients.Where(patient =>
                patient.Nombres.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                patient.Apellidos.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                patient.Email.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                patient.Telefono.Contains(term, StringComparison.OrdinalIgnoreCase));
        }

        var ordered = patients
            .OrderBy(patient => patient.Apellidos)
            .ThenBy(patient => patient.Nombres)
            .ToArray();

        return Task.FromResult<IReadOnlyCollection<Patient>>(ordered);
    }

    public Task<Patient?> GetByIdAsync(int id)
    {
        _patients.TryGetValue(id, out var patient);
        return Task.FromResult(patient);
    }

    public Task AddAsync(Patient patient)
    {
        patient.Id = Interlocked.Increment(ref _nextId);
        _patients[patient.Id] = patient;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Patient patient)
    {
        _patients[patient.Id] = patient;
        return Task.CompletedTask;
    }

    public Task DeleteAsync(int id)
    {
        _patients.TryRemove(id, out _);
        return Task.CompletedTask;
    }
}


