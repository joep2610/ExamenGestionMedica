using ExamenGestionMedica.Domain.Entities;
using ExamenGestionMedica.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ExamenGestionMedica.Infrastructure.Persistence;

public sealed class MedicalDbContext : DbContext
{
    public MedicalDbContext(DbContextOptions<MedicalDbContext> options) : base(options)
    {
    }

    public DbSet<Patient> Patients => Set<Patient>();

    public DbSet<MedicalAppointment> MedicalAppointments => Set<MedicalAppointment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Patient>(entity =>
        {
            entity.ToTable("Pacientes");
            entity.HasKey(patient => patient.Id).HasName("PK_Pacientes");
            entity.Property(patient => patient.Id).ValueGeneratedOnAdd();

            entity.Property(patient => patient.Nombres).HasMaxLength(120).IsRequired();
            entity.Property(patient => patient.Apellidos).HasMaxLength(120).IsRequired();
            entity.Property(patient => patient.Genero).HasMaxLength(30).IsRequired();
            entity.Property(patient => patient.Direccion).HasMaxLength(200).IsRequired();
            entity.Property(patient => patient.Telefono).HasMaxLength(30).IsRequired();
            entity.Property(patient => patient.Email).HasMaxLength(180).IsRequired();

            entity.HasIndex(patient => patient.Email)
                .IsUnique()
                .HasDatabaseName("UX_Pacientes_Email");

            entity.HasIndex(patient => new { patient.Apellidos, patient.Nombres, patient.Email, patient.Telefono })
                .HasDatabaseName("IX_Pacientes_Busqueda");
        });

        modelBuilder.Entity<MedicalAppointment>(entity =>
        {
            entity.ToTable("CitasMedicas");
            entity.HasKey(appointment => appointment.Id).HasName("PK_CitasMedicas");
            entity.Property(appointment => appointment.Id).ValueGeneratedOnAdd();

            entity.Property(appointment => appointment.Medico).HasMaxLength(120).IsRequired();
            entity.Property(appointment => appointment.Estado).HasConversion<int>().IsRequired();
            entity.Property(appointment => appointment.Motivo).HasMaxLength(250).IsRequired();
            entity.Property(appointment => appointment.Diagnostico).HasMaxLength(500);
            entity.Property(appointment => appointment.Tratamiento).HasMaxLength(500);

            entity.HasOne<Patient>()
                .WithMany()
                .HasForeignKey(appointment => appointment.PacienteId)
                .HasConstraintName("FK_CitasMedicas_Pacientes")
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(appointment => new { appointment.FechaHora, appointment.Medico, appointment.Estado })
                .HasDatabaseName("IX_CitasMedicas_Filtros");

            entity.HasIndex(appointment => new { appointment.PacienteId })
                .HasDatabaseName("IX_CitasMedicas_PacienteId");

            entity.HasIndex(appointment => new { appointment.Medico, appointment.FechaHora })
                .IsUnique()
                .HasFilter($"[Estado] <> {(int)AppointmentStatus.Cancelled}")
                .HasDatabaseName("UX_CitasMedicas_Medico_HorarioActivo");
        });
    }
}


