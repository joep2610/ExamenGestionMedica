using ExamenGestionMedica.Application.Appointments.Dtos;
using ExamenGestionMedica.Domain.Enums;

namespace ExamenGestionMedica.Application.Appointments;

public interface IAppointmentService
{
    Task<IReadOnlyCollection<AppointmentResponse>> GetAsync(DateOnly? date, string? medico, AppointmentStatus? estado);

    Task<AppointmentResponse> GetByIdAsync(int id);

    Task<AppointmentResponse> CreateAsync(CreateAppointmentRequest request);

    Task<AppointmentResponse> UpdateAsync(int id, UpdateAppointmentRequest request);

    Task<AppointmentResponse> CancelAsync(int id);
}


