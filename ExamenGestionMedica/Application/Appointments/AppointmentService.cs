using ExamenGestionMedica.Application.Appointments.Dtos;
using ExamenGestionMedica.Application.Common;
using ExamenGestionMedica.Application.Patients;
using ExamenGestionMedica.Domain.Entities;
using ExamenGestionMedica.Domain.Enums;

namespace ExamenGestionMedica.Application.Appointments;

public sealed class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointments;
    private readonly IPatientRepository _patients;

    public AppointmentService(IAppointmentRepository appointments, IPatientRepository patients)
    {
        _appointments = appointments;
        _patients = patients;
    }

    public async Task<IReadOnlyCollection<AppointmentResponse>> GetAsync(DateOnly? date, string? medico, AppointmentStatus? estado)
    {
        var appointments = await _appointments.GetAsync(date, medico, estado);
        return await MapCollectionAsync(appointments);
    }

    public async Task<AppointmentResponse> GetByIdAsync(int id)
    {
        var appointment = await FindAppointmentAsync(id);
        return await ToResponseAsync(appointment);
    }

    public async Task<AppointmentResponse> CreateAsync(CreateAppointmentRequest request)
    {
        await ValidatePatientExistsAsync(request.PacienteId);

        var appointment = new MedicalAppointment();

        await ApplyAsync(
            appointment,
            request.PacienteId,
            request.Medico,
            request.FechaHora,
            request.Estado,
            request.Motivo,
            request.Diagnostico,
            request.Tratamiento,
            excludedAppointmentId: null);

        await _appointments.AddAsync(appointment);
        return await ToResponseAsync(appointment);
    }

    public async Task<AppointmentResponse> UpdateAsync(int id, UpdateAppointmentRequest request)
    {
        await ValidatePatientExistsAsync(request.PacienteId);
        var appointment = await FindAppointmentAsync(id);

        await ApplyAsync(
            appointment,
            request.PacienteId,
            request.Medico,
            request.FechaHora,
            request.Estado,
            request.Motivo,
            request.Diagnostico,
            request.Tratamiento,
            excludedAppointmentId: id);

        await _appointments.UpdateAsync(appointment);
        return await ToResponseAsync(appointment);
    }

    public async Task<AppointmentResponse> CancelAsync(int id)
    {
        var appointment = await FindAppointmentAsync(id);
        appointment.Estado = AppointmentStatus.Cancelled;
        await _appointments.UpdateAsync(appointment);

        return await ToResponseAsync(appointment);
    }

    private async Task ApplyAsync(
        MedicalAppointment appointment,
        int pacienteId,
        string? medico,
        DateTime fechaHora,
        AppointmentStatus estado,
        string? motivo,
        string? diagnostico,
        string? tratamiento,
        int? excludedAppointmentId)
    {
        if (pacienteId <= 0)
        {
            throw new AppValidationException("El paciente es obligatorio.");
        }

        if (fechaHora == default)
        {
            throw new AppValidationException("La fecha y hora de la cita son obligatorias.");
        }

        if (!Enum.IsDefined(estado))
        {
            throw new AppValidationException("El estado de la cita no es valido.");
        }

        var normalizedDoctor = Guard.Required(medico, "El medico");
        var normalizedReason = Guard.Required(motivo, "El motivo");

        var hasConflict = await _appointments.HasDoctorConflictAsync(normalizedDoctor, fechaHora, excludedAppointmentId);
        if (hasConflict && estado != AppointmentStatus.Cancelled)
        {
            throw new ConflictException("El medico ya tiene una cita activa en el mismo horario.");
        }

        appointment.PacienteId = pacienteId;
        appointment.Medico = normalizedDoctor;
        appointment.FechaHora = fechaHora;
        appointment.Estado = estado;
        appointment.Motivo = normalizedReason;
        appointment.Diagnostico = string.IsNullOrWhiteSpace(diagnostico) ? null : diagnostico.Trim();
        appointment.Tratamiento = string.IsNullOrWhiteSpace(tratamiento) ? null : tratamiento.Trim();
    }

    private async Task ValidatePatientExistsAsync(int pacienteId)
    {
        var patient = await _patients.GetByIdAsync(pacienteId);
        if (patient is null)
        {
            throw new NotFoundException("Paciente no encontrado.");
        }
    }

    private async Task<MedicalAppointment> FindAppointmentAsync(int id)
    {
        var appointment = await _appointments.GetByIdAsync(id);
        return appointment ?? throw new NotFoundException("Cita medica no encontrada.");
    }

    private async Task<IReadOnlyCollection<AppointmentResponse>> MapCollectionAsync(IReadOnlyCollection<MedicalAppointment> appointments)
    {
        var responses = new List<AppointmentResponse>();
        foreach (var appointment in appointments)
        {
            responses.Add(await ToResponseAsync(appointment));
        }

        return responses;
    }

    private async Task<AppointmentResponse> ToResponseAsync(MedicalAppointment appointment)
    {
        var patient = await _patients.GetByIdAsync(appointment.PacienteId);
        var patientName = patient is null ? "Paciente no encontrado" : $"{patient.Nombres} {patient.Apellidos}";

        return new AppointmentResponse
        {
            Id = appointment.Id,
            PacienteId = appointment.PacienteId,
            NombreCompletoPaciente = patientName,
            Medico = appointment.Medico,
            FechaHora = appointment.FechaHora,
            Estado = appointment.Estado,
            Motivo = appointment.Motivo,
            Diagnostico = appointment.Diagnostico,
            Tratamiento = appointment.Tratamiento
        };
    }
}


