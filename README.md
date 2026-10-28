# Hospital Appointment API

A TypeScript + Prisma CRUD backend module for the hospital appointment domain with PostgreSQL.

## Features

- **Patients CRUD**: Create patient, get patient by ID, search patients by name, update phone number, delete patient.
- **Doctors CRUD**: Create doctor, get doctor by ID, list doctors by specialty, delete doctor.
- **Appointments CRUD**: Book appointment with relations (`connect` + `include`), fetch full appointment details, get upcoming doctor appointments, update status, cancel all appointments for a patient, delete appointment.
- **Prisma ORM 7.10**: Cleaned schema with PascalCase models and `@map` for PostgreSQL snake_case columns.
- **Type Safety**: Strictly typed TypeScript implementations with zero `any` types.

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Database**:
   Set `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hospital_api?schema=public"
   ```

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Seed the Database**:
   ```bash
   npx prisma db seed
   ```

5. **Run the Test Suite**:
   ```bash
   npx tsx src/test.ts
   ```
