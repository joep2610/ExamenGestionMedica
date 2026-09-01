const api = '';
const state = { patients: [], appointments: [] };

const byId = (id) => document.getElementById(id);
const toast = byId('toast');

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove('show'), 3200);
}

async function request(url, options = {}) {
  const response = await fetch(api + url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    let detail = 'No se pudo completar la operacion.';
    try {
      const problem = await response.json();
      detail = problem.detail || problem.title || detail;
    } catch { }
    throw new Error(detail);
  }

  if (response.status === 204) return null;
  return response.json();
}

function activate(view) {
  document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === view));
  byId('patients-view').classList.toggle('active', view === 'patients');
  byId('appointments-view').classList.toggle('active', view === 'appointments');
}

function patientPayload() {
  return {
    firstNames: byId('patient-first-names').value,
    lastNames: byId('patient-last-names').value,
    birthDate: byId('patient-birth-date').value,
    gender: byId('patient-gender').value,
    address: byId('patient-address').value,
    phone: byId('patient-phone').value,
    email: byId('patient-email').value
  };
}

function appointmentPayload() {
  return {
    patientId: byId('appointment-patient').value,
    doctor: byId('appointment-doctor').value,
    appointmentDateTime: byId('appointment-date-time').value,
    status: byId('appointment-status').value,
    reason: byId('appointment-reason').value,
    diagnosis: byId('appointment-diagnosis').value || null,
    treatment: byId('appointment-treatment').value || null
  };
}

async function loadPatients() {
  const search = byId('patient-search').value.trim();
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  state.patients = await request(`/api/pacientes${query}`);
  renderPatients();
  renderPatientOptions();
}

async function loadAppointments() {
  const params = new URLSearchParams();
  if (byId('filter-date').value) params.set('date', byId('filter-date').value);
  if (byId('filter-doctor').value.trim()) params.set('doctor', byId('filter-doctor').value.trim());
  if (byId('filter-status').value) params.set('status', byId('filter-status').value);
  const query = params.toString() ? `?${params}` : '';
  state.appointments = await request(`/api/citas-medicas${query}`);
  renderAppointments();
}

function renderPatients() {
  const tbody = byId('patients-table');
  if (!state.patients.length) {
    tbody.innerHTML = '<tr><td colspan="4">Sin pacientes registrados</td></tr>';
    return;
  }

  tbody.innerHTML = state.patients.map((patient) => `
    <tr>
      <td><strong>${patient.firstNames} ${patient.lastNames}</strong><small>${patient.gender}</small></td>
      <td><strong>${patient.email}</strong><small>${patient.phone}</small></td>
      <td>${patient.birthDate}</td>
      <td><div class="row-actions"><button type="button" data-edit-patient="${patient.id}">Editar</button><button class="danger" type="button" data-delete-patient="${patient.id}">Eliminar</button></div></td>
    </tr>
  `).join('');
}

function renderPatientOptions() {
  const select = byId('appointment-patient');
  const selected = select.value;
  select.innerHTML = '<option value="">Seleccione</option>' + state.patients.map((patient) => `<option value="${patient.id}">${patient.firstNames} ${patient.lastNames}</option>`).join('');
  select.value = selected;
}

function renderAppointments() {
  const tbody = byId('appointments-table');
  if (!state.appointments.length) {
    tbody.innerHTML = '<tr><td colspan="5">Sin citas registradas</td></tr>';
    return;
  }

  tbody.innerHTML = state.appointments.map((appointment) => `
    <tr>
      <td><strong>${formatDateTime(appointment.appointmentDateTime)}</strong><small>${appointment.reason}</small></td>
      <td>${appointment.patientFullName}</td>
      <td>${appointment.doctor}</td>
      <td><span class="status ${appointment.status}">${appointment.status}</span></td>
      <td><div class="row-actions"><button type="button" data-edit-appointment="${appointment.id}">Editar</button><button class="warning" type="button" data-cancel-appointment="${appointment.id}">Cancelar</button></div></td>
    </tr>
  `).join('');
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

function resetPatientForm() {
  byId('patient-id').value = '';
  byId('patient-form').reset();
  byId('patient-form-title').textContent = 'Nuevo paciente';
}

function resetAppointmentForm() {
  byId('appointment-id').value = '';
  byId('appointment-form').reset();
  byId('appointment-form-title').textContent = 'Nueva cita';
}

function editPatient(id) {
  const patient = state.patients.find((item) => item.id === id);
  if (!patient) return;
  byId('patient-id').value = patient.id;
  byId('patient-first-names').value = patient.firstNames;
  byId('patient-last-names').value = patient.lastNames;
  byId('patient-birth-date').value = patient.birthDate;
  byId('patient-gender').value = patient.gender;
  byId('patient-address').value = patient.address;
  byId('patient-phone').value = patient.phone;
  byId('patient-email').value = patient.email;
  byId('patient-form-title').textContent = 'Editar paciente';
}

function editAppointment(id) {
  const appointment = state.appointments.find((item) => item.id === id);
  if (!appointment) return;
  byId('appointment-id').value = appointment.id;
  byId('appointment-patient').value = appointment.patientId;
  byId('appointment-doctor').value = appointment.doctor;
  byId('appointment-date-time').value = appointment.appointmentDateTime.slice(0, 16);
  byId('appointment-status').value = appointment.status;
  byId('appointment-reason').value = appointment.reason;
  byId('appointment-diagnosis').value = appointment.diagnosis || '';
  byId('appointment-treatment').value = appointment.treatment || '';
  byId('appointment-form-title').textContent = 'Editar cita';
}

async function savePatient(event) {
  event.preventDefault();
  const id = byId('patient-id').value;
  try {
    if (id) await request(`/api/pacientes/${id}`, { method: 'PUT', body: JSON.stringify(patientPayload()) });
    else await request('/api/pacientes', { method: 'POST', body: JSON.stringify(patientPayload()) });
    resetPatientForm();
    await loadPatients();
    notify('Paciente guardado');
  } catch (error) { notify(error.message); }
}

async function saveAppointment(event) {
  event.preventDefault();
  const id = byId('appointment-id').value;
  try {
    if (id) await request(`/api/citas-medicas/${id}`, { method: 'PUT', body: JSON.stringify(appointmentPayload()) });
    else await request('/api/citas-medicas', { method: 'POST', body: JSON.stringify(appointmentPayload()) });
    resetAppointmentForm();
    await loadAppointments();
    notify('Cita guardada');
  } catch (error) { notify(error.message); }
}

document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => activate(tab.dataset.view)));
byId('patient-form').addEventListener('submit', savePatient);
byId('appointment-form').addEventListener('submit', saveAppointment);
byId('clear-patient').addEventListener('click', resetPatientForm);
byId('clear-appointment').addEventListener('click', resetAppointmentForm);
byId('refresh-patients').addEventListener('click', () => loadPatients().catch((error) => notify(error.message)));
byId('refresh-appointments').addEventListener('click', () => loadAppointments().catch((error) => notify(error.message)));
byId('patient-search').addEventListener('input', () => loadPatients().catch((error) => notify(error.message)));

document.addEventListener('click', async (event) => {
  const editPatientId = event.target.dataset.editPatient;
  const deletePatientId = event.target.dataset.deletePatient;
  const editAppointmentId = event.target.dataset.editAppointment;
  const cancelAppointmentId = event.target.dataset.cancelAppointment;

  try {
    if (editPatientId) editPatient(editPatientId);
    if (deletePatientId) {
      await request(`/api/pacientes/${deletePatientId}`, { method: 'DELETE' });
      await loadPatients();
      notify('Paciente eliminado');
    }
    if (editAppointmentId) editAppointment(editAppointmentId);
    if (cancelAppointmentId) {
      await request(`/api/citas-medicas/${cancelAppointmentId}/cancelar`, { method: 'PATCH' });
      await loadAppointments();
      notify('Cita cancelada');
    }
  } catch (error) { notify(error.message); }
});

Promise.all([loadPatients(), loadAppointments()]).catch((error) => notify(error.message));
