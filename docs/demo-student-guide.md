# Demonstration Student Guide

## Overview
This guide explains how to use the demonstration student account that has been added to the system for testing and demonstration purposes.

## Student Accounts
### Demonstration Student
- **Name**: Demo Estudiante
- **Username**: demo
- **Role**: student
- **Course**: Historia del Mundo (course-004)
- **Email**: demo.estudiante@example.com
- **Enrollment Date**: 2025-08-27

### Additional Students
1. **Valentina Silva**
   - Username: valentina
   - Course: Literatura Universal (course-002)
   - Email: valentina.silva@example.com

2. **Andrés Morales**
   - Username: andres
   - Course: Arte y Cultura (course-005)
   - Email: andres.morales@example.com

3. **Isabella Contreras**
   - Username: isabella
   - Course: Ciencias Naturales (course-003)
   - Email: isabella.contreras@example.com

4. **Diego Vargas**
   - Username: diego
   - Course: Matemáticas Avanzadas (course-001)
   - Email: diego.vargas@example.com

5. **Camila Rojas**
   - Username: camila
   - Course: Historia del Mundo (course-004)
   - Email: camila.rojas@example.com

## How to Use the Demonstration Student

### 1. Login Process
1. Navigate to the login page (`login.html`)
2. Enter the username: `demo`
3. Select the role: `Alumno` (student)
4. Click "Continuar"
5. You will be redirected to the student dashboard

### 2. Troubleshooting
If you encounter an error that the student is not found:
- Make sure the database has been reinitialized with the updated script
- Verify that the student record exists in the database
- The system should now correctly map the user ID to the student ID

You can verify the student records exist by running:
```bash
cd backend && node test_Conection.js
```

This will show the updated counts:
- Students: 16 (was 11)
- Users: 22 (was 17)
- Absences: 19 (was 14)

### 2. Dashboard Features
The demonstration student dashboard will show:
- Student's name: "Demo Estudiante"
- Email: "demo.estudiante@example.com"
- Course: "Historia del Mundo"
- Enrollment date: "2025-08-27"
- Two sample absences:
  1. A tardiness incident from 2025-08-27
  2. A justified absence from 2025-08-26

### 3. Testing Functionality
You can test the following features with the demonstration account:
- View personal information
- View absence history
- Add comments to existing absences
- Logout and login again

## Database Records
The students have the following database records:

### Students Table
```sql
('student-011', 'Demo Estudiante', 'demo.estudiante@example.com', 'course-004', '2025-08-27')
('student-012', 'Valentina Silva', 'valentina.silva@example.com', 'course-002', '2025-08-28')
('student-013', 'Andrés Morales', 'andres.morales@example.com', 'course-005', '2025-08-28')
('student-014', 'Isabella Contreras', 'isabella.contreras@example.com', 'course-003', '2025-08-28')
('student-015', 'Diego Vargas', 'diego.vargas@example.com', 'course-001', '2025-08-28')
('student-016', 'Camila Rojas', 'camila.rojas@example.com', 'course-004', '2025-08-28')
```

### Users Table
```sql
('user-student-011', 'demo', 'student')
('user-student-012', 'valentina', 'student')
('user-student-013', 'andres', 'student')
('user-student-014', 'isabella', 'student')
('user-student-015', 'diego', 'student')
('user-student-016', 'camila', 'student')
```

### Absences Table
```sql
('absence-013', 'student-011', 'course-004', 1, 'Académica', 'Pendiente', 'Pendiente', '2025-08-27', 'Llegó 10 minutos tarde')
('absence-014', 'student-011', 'course-004', 2, 'Académica', 'Resuelta', 'Ninguna', '2025-08-26', 'Justificada por cita médica')
('absence-015', 'student-012', 'course-002', 3, 'Comportamiento', 'Pendiente', 'Pendiente', '2025-08-28', 'No asistió a clase sin aviso previo')
('absence-016', 'student-013', 'course-005', 1, 'Académica', 'Resuelta', 'Advertencia', '2025-08-28', 'Llegó 15 minutos tarde')
('absence-017', 'student-014', 'course-003', 2, 'Académica', 'Resuelta', 'Ninguna', '2025-08-28', 'Justificada por cita médica')
('absence-018', 'student-016', 'course-004', 3, 'Comportamiento', 'Resuelta', 'Suspensión de actividades extracurriculares por 1 semana', '2025-08-28', 'No asistió a clase sin justificación')
```

## Testing Different Scenarios
You can use these accounts to demonstrate:
- Normal student login flow
- Dashboard information display
- Absence history viewing
- Comment submission functionality
- Logout process

Each student account has different characteristics:
- **Demo student**: Has 2 absences with different statuses
- **Valentina**: Has 1 pending absence
- **Andrés**: Has 1 resolved absence
- **Isabella**: Has 1 resolved absence
- **Diego**: No absences (to test empty absence history)
- **Camila**: Has 1 resolved absence with sanction

## Applying Database Updates
To apply the new student data to an existing database without reinitializing:

1. Run the update script:
```bash
cd backend && mysql -h localhost -u root -pQwe.123* ieve_system < update_database.sql
```

This will add the new students, users, and absences while preserving existing data.

## Resetting the Database
If you need to completely reset the database with all students:
1. Run the database initialization script
2. All students will be available immediately
3. Login with any of the student usernames and role "student"