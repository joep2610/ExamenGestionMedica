using System.Net.Mail;

namespace ExamenGestionMedica.Application.Common;

public static class Guard
{
    public static string Required(string? value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new AppValidationException($"{fieldName} es obligatorio.");
        }

        return value.Trim();
    }

    public static string Email(string? value)
    {
        var email = Required(value, "El email");

        try
        {
            _ = new MailAddress(email);
            return email;
        }
        catch (FormatException)
        {
            throw new AppValidationException("El email no tiene un formato valido.");
        }
    }
}

