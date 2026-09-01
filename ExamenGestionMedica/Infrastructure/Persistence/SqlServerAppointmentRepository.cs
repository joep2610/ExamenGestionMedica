using ExamenGestionMedica.Application.Appointments;
using ExamenGestionMedica.Domain.Entities;
using ExamenGestionMedica.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ExamenGestionMedica.Infrastructure.Persistence;

public sealed class SqlServerAppointmentRepository : IAppointmentRepository
{
    private readonly MedicalDbContext _context;

    public SqlServerAppointmentRepository(MedicalDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyCollection<MedicalAppointment>> GetAsync(DateOnly? date, string? medico, AppointmentStatus? estado)
    {
        IQueryable<MedicalAppointment> query = _context.MedicalAppointments.AsNoTracking();

        if (date.HasValue)
        {
            var start = date.Value.ToDateTime(TimeOnly.MinValue);
            var end = start.AddDays(1);
            query = query.Where(appointment => appointment.FechaHora >= start && appointment.FechaHora < end);
        }

        if (!string.IsNullOrWhiteSpace(medico))
        {
            var term = medico.Trim();
            query = query.Where(appointment => appointment.Medico.Contains(term));
        }

        if (estado.HasValue)
        {
            query = query.Where(appointment => appointment.Estado == estado.Value);
        }

        return await query
            .OrderBy(appointment => appointment.FechaHora)
            .ThenBy(appointment => appointment.Medico)
            .ToArrayAsync();
    }

    public Task<MedicalAppointment?> GetByIdAsync(int id)
    {
        return _context.MedicalAppointments.FirstOrDefaultAsync(appointment => appointment.Id == id);
    }

    public async Task AddAsync(MedicalAppointment appointment)
    {
        _context.MedicalAppointments.Add(appointment);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(MedicalAppointment appointment)
    {
        _context.MedicalAppointments.Update(appointment);
        await _context.SaveChangesAsync();
    }

    public Task<bool> HasDoctorConflictAsync(string medico, DateTime fechaHora, int? excludedAppointmentId)
    {
        return _context.MedicalAppointments.AnyAsync(appointment =>
            appointment.Id != excludedAppointmentId &&
            appointment.Estado != AppointmentStatus.Cancelled &&
            appointment.Medico == medico &&
            appointment.FechaHora == fechaHora);
    }
}


