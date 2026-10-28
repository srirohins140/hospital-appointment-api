import prisma from './lib/prisma.js';
import type { Appointment, Prisma } from '../generated/prisma/client.js';

export type BookedAppointment = Prisma.AppointmentGetPayload<{
  include: {
    patient: { select: { name: true; email: true } };
    doctor: { select: { name: true; specialty: true } };
  };
}>;

export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: {
    patient: true;
    doctor: true;
  };
}>;

export type DoctorUpcomingAppointment = Prisma.AppointmentGetPayload<{
  include: {
    patient: { select: { name: true; phone: true } };
  };
}>;

export async function bookAppointment(
  patientId: number,
  doctorId: number,
  appointmentDate: Date,
  notes?: string
): Promise<BookedAppointment> {
  return prisma.appointment.create({
    data: {
      appointmentDate,
      notes: notes ?? null,
      patient: {
        connect: { id: patientId },
      },
      doctor: {
        connect: { id: doctorId },
      },
    },
    include: {
      patient: {
        select: {
          name: true,
          email: true,
        },
      },
      doctor: {
        select: {
          name: true,
          specialty: true,
        },
      },
    },
  });
}

export async function getAppointmentFull(id: number): Promise<AppointmentWithRelations> {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
    },
  });

  if (!appointment) {
    throw new Error(`Appointment with ID ${id} not found`);
  }

  return appointment;
}

export async function getDoctorUpcomingAppointments(
  doctorId: number
): Promise<DoctorUpcomingAppointment[]> {
  return prisma.appointment.findMany({
    where: {
      doctorId,
      status: 'scheduled',
      appointmentDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      appointmentDate: 'asc',
    },
    include: {
      patient: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
  });
}

export async function setAppointmentStatus(
  id: number,
  status: 'scheduled' | 'completed' | 'cancelled' | string
): Promise<Appointment> {
  return prisma.appointment.update({
    where: { id },
    data: { status },
  });
}

export async function cancelAllPatientAppointments(patientId: number): Promise<number> {
  const result = await prisma.appointment.updateMany({
    where: {
      patientId,
      status: 'scheduled',
    },
    data: {
      status: 'cancelled',
    },
  });

  return result.count;
}

export async function deleteAppointment(id: number): Promise<Appointment> {
  return prisma.appointment.delete({
    where: { id },
  });
}
