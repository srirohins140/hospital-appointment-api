import prisma from './lib/prisma.js';
import type { Doctor } from '../generated/prisma/client.js';

export type CreateDoctorData = {
  name: string;
  specialty: string;
  email: string;
};

export async function createDoctor(data: CreateDoctorData): Promise<Doctor> {
  return prisma.doctor.create({ data });
}

export async function getDoctor(id: number): Promise<Doctor> {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!doctor) {
    throw new Error(`Doctor with ID ${id} not found`);
  }

  return doctor;
}

export async function listDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
  return prisma.doctor.findMany({
    where: {
      specialty: {
        contains: specialty,
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function deleteDoctor(id: number): Promise<Doctor> {
  return prisma.doctor.delete({
    where: { id },
  });
}
