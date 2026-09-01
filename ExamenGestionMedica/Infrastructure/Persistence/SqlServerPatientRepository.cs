using ExamenGestionMedica.Application.Patients;
using ExamenGestionMedica.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamenGestionMedica.Infrastructure.Persistence;

public sealed class SqlServerPatientRepository : IPatientRepository
{
    private readonly MedicalDbContext _context;

    public SqlServerPatientRepository(MedicalDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyCollection<Patient>> GetAsync(string? search)
    {
        IQueryable<Patient> query = _context.Patients.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(patient =>
                patient.Nombres.Contains(term) ||
                patient.Apellidos.Contains(term) ||
                patient.Email.Contains(term) ||
                patient.Telefono.Contains(term));
        }

        return await query
            .OrderBy(patient => patient.Apellidos)
            .ThenBy(patient => patient.Nombres)
            .ToArrayAsync();
    }

    public Task<Patient?> GetByIdAsync(int id)
    {
        return _context.Patients.FirstOrDefaultAsync(patient => patient.Id == id);
    }

    public async Task AddAsync(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Patient patient)
    {
        _context.Patients.Update(patient);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(item => item.Id == id);
        if (patient is null)
        {
            return;
        }

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync();
    }
}


