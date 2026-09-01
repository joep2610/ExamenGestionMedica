namespace ExamenGestionMedica.Application.Common;

public sealed class AppValidationException : Exception
{
    public AppValidationException(string message) : base(message)
    {
    }
}

