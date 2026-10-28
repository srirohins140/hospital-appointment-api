import prisma from './lib/prisma.js';
import type { Patient } from '../generated/prisma/client.js';

export type CreatePatientData = {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
};

export async function createPatient(data: CreatePatientData): Promise<Patient> {
  return prisma.patient.create({ data });
}

export async function getPatient(id: number): Promise<Patient> {
  const patient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!patient) {
    throw new Error(`Patient with ID ${id} not found`);
  }

  return patient;
}

export async function searchPatients(nameFragment: string): Promise<Patient[]> {
  return prisma.patient.findMany({
    where: {
      name: {
        contains: nameFragment,
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function updatePatientPhone(id: number, phone: string): Promise<Patient> {
  return prisma.patient.update({
    where: { id },
    data: { phone },
  });
}

export async function deletePatient(id: number): Promise<Patient> {
  return prisma.patient.delete({
    where: { id },
  });
}
