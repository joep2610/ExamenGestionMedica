using ExamenGestionMedica.Application.Patients.Dtos;
using FluentValidation;

namespace ExamenGestionMedica.Application.Patients.Validators;

public sealed class CreatePatientRequestValidator : AbstractValidator<CreatePatientRequest>
{
    public CreatePatientRequestValidator()
    {
        RuleFor(request => request.Nombres)
            .NotEmpty().WithMessage("Los nombres son obligatorios.")
            .MaximumLength(120).WithMessage("Los nombres no pueden superar los 120 caracteres.");
        RuleFor(request => request.Apellidos)
            .NotEmpty().WithMessage("Los apellidos son obligatorios.")
            .MaximumLength(120).WithMessage("Los apellidos no pueden superar los 120 caracteres.");
        RuleFor(request => request.FechaNacimiento)
            .NotEmpty().WithMessage("La fecha de nacimiento es obligatoria.")
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today))
            .WithMessage("La fecha de nacimiento no puede ser futura.");
        RuleFor(request => request.Genero)
            .NotEmpty().WithMessage("El género es obligatorio.")
            .MaximumLength(30).WithMessage("El género no puede superar los 30 caracteres.");
        RuleFor(request => request.Direccion)
            .NotEmpty().WithMessage("La dirección es obligatoria.")
            .MaximumLength(200).WithMessage("La dirección no puede superar los 200 caracteres.");
        RuleFor(request => request.Telefono)
            .NotEmpty().WithMessage("El teléfono es obligatorio.")
            .MaximumLength(30).WithMessage("El teléfono no puede superar los 30 caracteres.")
            .Matches(@"^[+\d][\d\s()-]{6,29}$").WithMessage("El teléfono no tiene un formato válido.");
        RuleFor(request => request.Email)
            .NotEmpty().WithMessage("El correo electrónico es obligatorio.")
            .MaximumLength(180).WithMessage("El correo electrónico no puede superar los 180 caracteres.")
            .EmailAddress().WithMessage("El correo electrónico no tiene un formato válido.");
    }
}

