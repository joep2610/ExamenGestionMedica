using ExamenGestionMedica.Domain.Entities;
using ExamenGestionMedica.Domain.Enums;

namespace ExamenGestionMedica.Application.Appointments;

public interface IAppointmentRepository
{
    Task<IReadOnlyCollection<MedicalAppointment>> GetAsync(DateOnly? date, string? medico, AppointmentStatus? estado);

    Task<MedicalAppointment?> GetByIdAsync(int id);

    Task AddAsync(MedicalAppointment appointment);

    Task UpdateAsync(MedicalAppointment appointment);

    Task<bool> HasDoctorConflictAsync(string medico, DateTime fechaHora, int? excludedAppointmentId);
}


