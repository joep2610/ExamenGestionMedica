using System.Collections.Concurrent;
using ExamenGestionMedica.Application.Appointments;
using ExamenGestionMedica.Domain.Entities;
using ExamenGestionMedica.Domain.Enums;

namespace ExamenGestionMedica.Infrastructure.Persistence;

public sealed class InMemoryAppointmentRepository : IAppointmentRepository
{
    private readonly ConcurrentDictionary<int, MedicalAppointment> _appointments = new();
    private int _nextId;

    public Task<IReadOnlyCollection<MedicalAppointment>> GetAsync(DateOnly? date, string? medico, AppointmentStatus? estado)
    {
        IEnumerable<MedicalAppointment> appointments = _appointments.Values;

        if (date.HasValue)
        {
            appointments = appointments.Where(appointment => DateOnly.FromDateTime(appointment.FechaHora) == date.Value);
        }

        if (!string.IsNullOrWhiteSpace(medico))
        {
            var term = medico.Trim();
            appointments = appointments.Where(appointment => appointment.Medico.Contains(term, StringComparison.OrdinalIgnoreCase));
        }

        if (estado.HasValue)
        {
            appointments = appointments.Where(appointment => appointment.Estado == estado.Value);
        }

        var ordered = appointments
            .OrderBy(appointment => appointment.FechaHora)
            .ThenBy(appointment => appointment.Medico)
            .ToArray();

        return Task.FromResult<IReadOnlyCollection<MedicalAppointment>>(ordered);
    }

    public Task<MedicalAppointment?> GetByIdAsync(int id)
    {
        _appointments.TryGetValue(id, out var appointment);
        return Task.FromResult(appointment);
    }

    public Task AddAsync(MedicalAppointment appointment)
    {
        appointment.Id = Interlocked.Increment(ref _nextId);
        _appointments[appointment.Id] = appointment;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(MedicalAppointment appointment)
    {
        _appointments[appointment.Id] = appointment;
        return Task.CompletedTask;
    }

    public Task<bool> HasDoctorConflictAsync(string medico, DateTime fechaHora, int? excludedAppointmentId)
    {
        var hasConflict = _appointments.Values.Any(appointment =>
            appointment.Id != excludedAppointmentId &&
            appointment.Estado != AppointmentStatus.Cancelled &&
            appointment.Medico.Equals(medico, StringComparison.OrdinalIgnoreCase) &&
            appointment.FechaHora == fechaHora);

        return Task.FromResult(hasConflict);
    }
}


