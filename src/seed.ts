import prisma from './lib/prisma.js';

async function main() {
  // Clear existing data in dependency order
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  // Seed doctors
  const drPriya = await prisma.doctor.create({
    data: {
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      email: 'priya.sharma@hospital.io',
    },
  });

  const drVikram = await prisma.doctor.create({
    data: {
      name: 'Dr. Vikram Rao',
      specialty: 'Neurology',
      email: 'vikram.rao@hospital.io',
    },
  });

  // Seed patients
  const aditi = await prisma.patient.create({
    data: {
      name: 'Aditi Mehra',
      email: 'aditi@example.com',
      phone: '9876543210',
      dateOfBirth: new Date('1990-04-12'),
    },
  });

  const rahul = await prisma.patient.create({
    data: {
      name: 'Rahul Singh',
      email: 'rahul@example.com',
      phone: '9876543211',
      dateOfBirth: new Date('1995-08-25'),
    },
  });

  // Seed appointments
  await prisma.appointment.create({
    data: {
      appointmentDate: new Date('2026-11-15T10:00:00'),
      status: 'scheduled',
      notes: 'Annual cardiac checkup',
      patientId: aditi.id,
      doctorId: drPriya.id,
    },
  });

  await prisma.appointment.create({
    data: {
      appointmentDate: new Date('2026-11-16T14:30:00'),
      status: 'scheduled',
      notes: 'Neurological evaluation',
      patientId: rahul.id,
      doctorId: drVikram.id,
    },
  });

  console.log('Seed complete:');
  console.log('  Doctors: 2');
  console.log('  Patients: 2');
  console.log('  Appointments: 2');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
