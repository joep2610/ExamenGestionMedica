# Sistema de Gestión Médica

Aplicación para administrar pacientes y citas médicas. Incluye una API REST en ASP.NET Core 8 con arquitectura limpia/hexagonal y un frontend Angular 21 standalone, responsive y completamente en español.

## Estructura

- `ExamenGestionMedica/`: API REST (`Domain`, `Application`, `Infrastructure` y `Presentation`).
- `frontend/`: aplicación Angular 21 organizada en `core`, `shared`, `layout` y `features`.
- `database/schema.sql`: creación de la base, tablas, restricciones e índices de SQL Server.
- `ExamenGestionMedica/wwwroot/`: interfaz anterior del backend, conservada sin cambios.

## Requisitos

- .NET SDK 8 o superior.
- Node.js compatible con Angular 21 y npm.
- SQL Server accesible.

## Base de datos

Configura `ConnectionStrings:DefaultConnection` en `ExamenGestionMedica/appsettings.json` para tu instancia de SQL Server. La API ejecuta `EnsureCreated()` al iniciar; alternativamente puedes ejecutar `database/schema.sql` desde SQL Server Management Studio o Azure Data Studio.

## Ejecución local

Abre dos terminales en la carpeta raíz del repositorio.

Terminal 1 - API:

```powershell
dotnet restore .\ExamenGestionMedica\ExamenGestionMedica.csproj
dotnet run --project .\ExamenGestionMedica\ExamenGestionMedica.csproj --launch-profile https
```

La API se publica en `https://localhost:7176` y Swagger en `https://localhost:7176/swagger`.

Terminal 2 - Angular:

```powershell
cd .\frontend
npm install
npm start
```

Abre `http://localhost:4200`. En desarrollo, Angular usa `src/environments/environment.ts`, cuya URL base es `https://localhost:7176/api`. El backend ya permite CORS para el servidor local de Angular. La compilación de producción usa `/api` mediante `environment.prod.ts`.

## Comandos del frontend

```powershell
cd .\frontend
npm start
npm run build
npm test -- --watch=false
```

## Endpoints consumidos

Pacientes:

- `GET /api/pacientes?search=texto`
- `GET /api/pacientes/{id}`
- `POST /api/pacientes`
- `PUT /api/pacientes/{id}`
- `DELETE /api/pacientes/{id}`

Citas médicas:

- `GET /api/citas-medicas?date=AAAA-MM-DD&doctor=nombre&status=Scheduled`
- `GET /api/citas-medicas/{id}`
- `POST /api/citas-medicas`
- `PUT /api/citas-medicas/{id}`
- `PATCH /api/citas-medicas/{id}/cancelar`

Los estados enviados a la API son `Scheduled`, `Confirmed`, `Completed` y `Cancelled`; la interfaz los presenta como Programada, Confirmada, Completada y Cancelada.

## Errores y validaciones

La API responde los errores de negocio como `application/problem+json`. El frontend interpreta los estados 400, 404, 409 y 500, presenta mensajes amigables y distingue específicamente los conflictos de horario médico. Los formularios replican los campos obligatorios y longitudes configuradas por el backend y la base de datos.
