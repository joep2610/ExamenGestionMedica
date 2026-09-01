/*
    Script SQL Server - Examen Gestion Medica
    Crea la base de datos, tablas, restricciones e indices necesarios para la API.

    Tablas:
      dbo.Pacientes
      dbo.CitasMedicas

    Estados de cita:
      1 = Programada
      2 = Confirmada
      3 = Completada
      4 = Cancelada
*/

IF DB_ID(N'ExamenGestionMedicaDb') IS NULL
BEGIN
    CREATE DATABASE ExamenGestionMedicaDb;
END;
GO

USE ExamenGestionMedicaDb;
GO

IF OBJECT_ID(N'dbo.Pacientes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Pacientes (
        Id INT IDENTITY(1,1) NOT NULL,
        Nombres NVARCHAR(120) NOT NULL,
        Apellidos NVARCHAR(120) NOT NULL,
        FechaNacimiento DATE NOT NULL,
        Genero NVARCHAR(30) NOT NULL,
        Direccion NVARCHAR(200) NOT NULL,
        Telefono NVARCHAR(30) NOT NULL,
        Email NVARCHAR(180) NOT NULL,
        FechaCreacion DATETIME2 NOT NULL CONSTRAINT DF_Pacientes_FechaCreacion DEFAULT SYSUTCDATETIME(),
        FechaActualizacion DATETIME2 NULL,
        CONSTRAINT PK_Pacientes PRIMARY KEY (Id),
        CONSTRAINT CK_Pacientes_Nombres_NoVacio CHECK (LEN(LTRIM(RTRIM(Nombres))) > 0),
        CONSTRAINT CK_Pacientes_Apellidos_NoVacio CHECK (LEN(LTRIM(RTRIM(Apellidos))) > 0),
        CONSTRAINT CK_Pacientes_Genero_NoVacio CHECK (LEN(LTRIM(RTRIM(Genero))) > 0),
        CONSTRAINT CK_Pacientes_Direccion_NoVacio CHECK (LEN(LTRIM(RTRIM(Direccion))) > 0),
        CONSTRAINT CK_Pacientes_Telefono_NoVacio CHECK (LEN(LTRIM(RTRIM(Telefono))) > 0),
        CONSTRAINT CK_Pacientes_Email_NoVacio CHECK (LEN(LTRIM(RTRIM(Email))) > 0)
    );
END;
GO

IF OBJECT_ID(N'dbo.CitasMedicas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CitasMedicas (
        Id INT IDENTITY(1,1) NOT NULL,
        PacienteId INT NOT NULL,
        Medico NVARCHAR(120) NOT NULL,
        FechaHora DATETIME2 NOT NULL,
        Estado INT NOT NULL,
        Motivo NVARCHAR(250) NOT NULL,
        Diagnostico NVARCHAR(500) NULL,
        Tratamiento NVARCHAR(500) NULL,
        FechaCreacion DATETIME2 NOT NULL CONSTRAINT DF_CitasMedicas_FechaCreacion DEFAULT SYSUTCDATETIME(),
        FechaActualizacion DATETIME2 NULL,
        CONSTRAINT PK_CitasMedicas PRIMARY KEY (Id),
        CONSTRAINT FK_CitasMedicas_Pacientes FOREIGN KEY (PacienteId) REFERENCES dbo.Pacientes(Id),
        CONSTRAINT CK_CitasMedicas_Estado CHECK (Estado IN (1, 2, 3, 4)),
        CONSTRAINT CK_CitasMedicas_Medico_NoVacio CHECK (LEN(LTRIM(RTRIM(Medico))) > 0),
        CONSTRAINT CK_CitasMedicas_Motivo_NoVacio CHECK (LEN(LTRIM(RTRIM(Motivo))) > 0)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Pacientes_Email' AND object_id = OBJECT_ID(N'dbo.Pacientes'))
BEGIN
    CREATE UNIQUE INDEX UX_Pacientes_Email
        ON dbo.Pacientes (Email);
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Pacientes_Busqueda' AND object_id = OBJECT_ID(N'dbo.Pacientes'))
BEGIN
    CREATE INDEX IX_Pacientes_Busqueda
        ON dbo.Pacientes (Apellidos, Nombres, Email, Telefono);
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_CitasMedicas_Filtros' AND object_id = OBJECT_ID(N'dbo.CitasMedicas'))
BEGIN
    CREATE INDEX IX_CitasMedicas_Filtros
        ON dbo.CitasMedicas (FechaHora, Medico, Estado);
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_CitasMedicas_PacienteId' AND object_id = OBJECT_ID(N'dbo.CitasMedicas'))
BEGIN
    CREATE INDEX IX_CitasMedicas_PacienteId
        ON dbo.CitasMedicas (PacienteId);
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_CitasMedicas_Medico_HorarioActivo' AND object_id = OBJECT_ID(N'dbo.CitasMedicas'))
BEGIN
    CREATE UNIQUE INDEX UX_CitasMedicas_Medico_HorarioActivo
        ON dbo.CitasMedicas (Medico, FechaHora)
        WHERE Estado <> 4;
END;
GO

/*
-- Datos de prueba opcionales
INSERT INTO dbo.Pacientes (Nombres, Apellidos, FechaNacimiento, Genero, Direccion, Telefono, Email)
VALUES (N'Ana Maria', N'Torres Ruiz', '1992-05-14', N'Femenino', N'Av. Principal 123', N'999888777', N'ana.torres@example.com');

DECLARE @PacienteId INT = SCOPE_IDENTITY();

INSERT INTO dbo.CitasMedicas (PacienteId, Medico, FechaHora, Estado, Motivo, Diagnostico, Tratamiento)
VALUES (@PacienteId, N'Dr. Lopez', '2026-09-01T09:00:00', 1, N'Consulta general', NULL, NULL);
*/
