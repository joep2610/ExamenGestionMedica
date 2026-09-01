using ExamenGestionMedica.Application.Appointments.Dtos;
using FluentValidation;

namespace ExamenGestionMedica.Application.Appointments.Validators;

public sealed class UpdateAppointmentRequestValidator : AbstractValidator<UpdateAppointmentRequest>
{
    public UpdateAppointmentRequestValidator()
    {
        RuleFor(request => request.PacienteId).NotEmpty().WithMessage("El paciente es obligatorio.");
        RuleFor(request => request.Medico).NotEmpty().WithMessage("El médico es obligatorio.").MaximumLength(120);
        RuleFor(request => request.FechaHora).NotEmpty().WithMessage("La fecha y hora son obligatorias.");
        RuleFor(request => request.Estado).IsInEnum().WithMessage("El estado de la cita no es válido.");
        RuleFor(request => request.Motivo).NotEmpty().WithMessage("El motivo es obligatorio.").MaximumLength(250);
        RuleFor(request => request.Diagnostico).MaximumLength(500);
        RuleFor(request => request.Tratamiento).MaximumLength(500);
    }
}

