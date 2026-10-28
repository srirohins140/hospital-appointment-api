import prisma from './lib/prisma.js';
import {
  createPatient,
  getPatient,
  searchPatients,
  updatePatientPhone,
  deletePatient,
} from './patients.js';
import {
  createDoctor,
  getDoctor,
  listDoctorsBySpecialty,
  deleteDoctor,
} from './doctors.js';
import {
  bookAppointment,
  getAppointmentFull,
  getDoctorUpcomingAppointments,
  setAppointmentStatus,
  cancelAllPatientAppointments,
  deleteAppointment,
} from './appointments.js';

async function runTests() {
  console.log('====================================');
  console.log(' Hospital Appointment API CRUD Test ');
  console.log('====================================\n');

  // --- 1. PATIENTS CRUD ---
  console.log('--- 1. Testing Patients CRUD ---');
  const patient = await createPatient({
    name: 'Vikram Malhotra',
    email: `vikram.${Date.now()}@example.com`,
    phone: '9888877771',
    dateOfBirth: new Date('1988-06-20'),
  });
  console.log('✔ createPatient:', patient.id, '-', patient.name);

  const fetchedPatient = await getPatient(patient.id);
  console.log('✔ getPatient:', fetchedPatient.id, '-', fetchedPatient.name, `(${fetchedPatient.email})`);

  const updatedPatient = await updatePatientPhone(patient.id, '9999900000');
  console.log('✔ updatePatientPhone:', updatedPatient.id, '- new phone:', updatedPatient.phone);

  const searchResults = await searchPatients('Vikram');
  console.log('✔ searchPatients ("Vikram"):', searchResults.length, 'match(es) found');

  // Temporary patient for deletePatient test
  const tempPatient = await createPatient({
    name: 'Temporary Patient',
    email: `temp.${Date.now()}@example.com`,
    phone: '9000000000',
  });
  const deletedTempPatient = await deletePatient(tempPatient.id);
  console.log('✔ deletePatient:', deletedTempPatient.id, '-', deletedTempPatient.name, 'deleted successfully\n');

  // --- 2. DOCTORS CRUD ---
  console.log('--- 2. Testing Doctors CRUD ---');
  const doctor = await createDoctor({
    name: 'Dr. Ananya Ray',
    specialty: 'Pediatrics',
    email: `ananya.${Date.now()}@hospital.io`,
  });
  console.log('✔ createDoctor:', doctor.id, '-', doctor.name, `[${doctor.specialty}]`);

  const fetchedDoctor = await getDoctor(doctor.id);
  console.log('✔ getDoctor:', fetchedDoctor.id, '-', fetchedDoctor.name, `(${fetchedDoctor.email})`);

  const pediatricians = await listDoctorsBySpecialty('Pediatrics');
  console.log('✔ listDoctorsBySpecialty ("Pediatrics"):', pediatricians.length, 'doctor(s) found');

  // Temporary doctor for deleteDoctor test
  const tempDoctor = await createDoctor({
    name: 'Dr. Temp Delete',
    specialty: 'Dermatology',
    email: `tempdoc.${Date.now()}@hospital.io`,
  });
  const deletedTempDoc = await deleteDoctor(tempDoctor.id);
  console.log('✔ deleteDoctor:', deletedTempDoc.id, '-', deletedTempDoc.name, 'deleted successfully\n');

  // --- 3. APPOINTMENTS CRUD ---
  console.log('--- 3. Testing Appointments CRUD ---');
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  const appointment = await bookAppointment(
    patient.id,
    doctor.id,
    futureDate,
    'Routine checkup for child'
  );
  console.log('✔ bookAppointment (with connect + include):', appointment.id);
  console.log('   Patient:', appointment.patient.name, `(${appointment.patient.email})`);
  console.log('   Doctor: ', appointment.doctor.name, `(${appointment.doctor.specialty})`);

  const fullAppt = await getAppointmentFull(appointment.id);
  console.log('✔ getAppointmentFull:', fullAppt.id);
  console.log('   Patient full details:', fullAppt.patient.name, '| Phone:', fullAppt.patient.phone);
  console.log('   Doctor full details: ', fullAppt.doctor.name, '| Specialty:', fullAppt.doctor.specialty);

  const upcoming = await getDoctorUpcomingAppointments(doctor.id);
  console.log('✔ getDoctorUpcomingAppointments:', upcoming.length, 'upcoming appointment(s) for', doctor.name);

  const updatedStatus = await setAppointmentStatus(appointment.id, 'completed');
  console.log('✔ setAppointmentStatus:', updatedStatus.id, '- new status:', updatedStatus.status);

  // Book a second appointment to test cancelAllPatientAppointments
  const futureDate2 = new Date();
  futureDate2.setDate(futureDate2.getDate() + 14);
  const secondAppt = await bookAppointment(patient.id, doctor.id, futureDate2, 'Follow-up visit');
  console.log('   Booked second appointment:', secondAppt.id, 'status:', secondAppt.status);

  const cancelledCount = await cancelAllPatientAppointments(patient.id);
  console.log('✔ cancelAllPatientAppointments:', cancelledCount, 'appointment(s) cancelled for patient', patient.id);

  const deletedAppt1 = await deleteAppointment(appointment.id);
  const deletedAppt2 = await deleteAppointment(secondAppt.id);
  console.log('✔ deleteAppointment: Deleted appointments', deletedAppt1.id, 'and', deletedAppt2.id);

  // Clean up remaining test patient and doctor
  await deletePatient(patient.id);
  await deleteDoctor(doctor.id);
  console.log('✔ Cleaned up test patient', patient.id, 'and test doctor', doctor.id);

  console.log('\n====================================');
  console.log(' All CRUD tests executed successfully! ');
  console.log('====================================');
}

runTests()
  .catch((e) => {
    console.error('Test execution error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
