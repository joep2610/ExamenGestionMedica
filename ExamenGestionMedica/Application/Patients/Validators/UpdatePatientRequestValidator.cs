using ExamenGestionMedica.Application.Patients.Dtos;
using FluentValidation;

namespace ExamenGestionMedica.Application.Patients.Validators;

public sealed class UpdatePatientRequestValidator : AbstractValidator<UpdatePatientRequest>
{
    public UpdatePatientRequestValidator()
    {
        Include(new CreatePatientRulesValidator());
    }

    private sealed class CreatePatientRulesValidator : AbstractValidator<UpdatePatientRequest>
    {
        public CreatePatientRulesValidator()
        {
            RuleFor(request => request.Nombres).NotEmpty().WithMessage("Los nombres son obligatorios.").MaximumLength(120);
            RuleFor(request => request.Apellidos).NotEmpty().WithMessage("Los apellidos son obligatorios.").MaximumLength(120);
            RuleFor(request => request.FechaNacimiento).NotEmpty().WithMessage("La fecha de nacimiento es obligatoria.").LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today)).WithMessage("La fecha de nacimiento no puede ser futura.");
            RuleFor(request => request.Genero).NotEmpty().WithMessage("El género es obligatorio.").MaximumLength(30);
            RuleFor(request => request.Direccion).NotEmpty().WithMessage("La dirección es obligatoria.").MaximumLength(200);
            RuleFor(request => request.Telefono).NotEmpty().WithMessage("El teléfono es obligatorio.").MaximumLength(30).Matches(@"^[+\d][\d\s()-]{6,29}$").WithMessage("El teléfono no tiene un formato válido.");
            RuleFor(request => request.Email).NotEmpty().WithMessage("El correo electrónico es obligatorio.").MaximumLength(180).EmailAddress().WithMessage("El correo electrónico no tiene un formato válido.");
        }
    }
}

