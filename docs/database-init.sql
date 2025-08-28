-- Database initialization script for IEVE absence reporting system

-- Create database
CREATE DATABASE IF NOT EXISTS ieve_system;
USE ieve_system;

-- Create tables
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    teacher VARCHAR(255) NOT NULL,
    schedule VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    course_id VARCHAR(50),
    enrollment_date DATE NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS absences (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    type INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    situation VARCHAR(100) NOT NULL,
    sanction VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    comments TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Insert initial data

-- Insert courses
INSERT INTO courses (id, name, teacher, schedule) VALUES
('course-001', 'Matemáticas Avanzadas', 'Prof. Elena Ruiz', 'Lunes y Miércoles 8:00-10:00'),
('course-002', 'Literatura Universal', 'Prof. Jorge Pérez', 'Martes y Jueves 10:00-12:00'),
('course-003', 'Ciencias Naturales', 'Prof. Carmen Silva', 'Viernes 8:00-12:00'),
('course-004', 'Historia del Mundo', 'Prof. Miguel Ángel López', 'Lunes y Jueves 14:00-16:00'),
('course-005', 'Arte y Cultura', 'Prof. Ana María González', 'Miércoles y Viernes 12:00-14:00');

-- Insert students
INSERT INTO students (id, name, email, course_id, enrollment_date) VALUES
('student-001', 'María González', 'maria.gonzalez@example.com', 'course-001', '2025-08-01'),
('student-002', 'Carlos Rodríguez', 'carlos.rodriguez@example.com', 'course-001', '2025-08-01'),
('student-003', 'Ana Martínez', 'ana.martinez@example.com', 'course-002', '2025-08-01'),
('student-004', 'Luis Fernández', 'luis.fernandez@example.com', 'course-002', '2025-08-01'),
('student-005', 'Sofía López', 'sofia.lopez@example.com', 'course-003', '2025-08-01'),
('student-006', 'Pedro Sánchez', 'pedro.sanchez@example.com', 'course-001', '2025-08-05'),
('student-007', 'Elena Torres', 'elena.torres@example.com', 'course-003', '2025-08-10'),
('student-008', 'Jorge Ramírez', 'jorge.ramirez@example.com', 'course-002', '2025-08-15'),
('student-009', 'Carmen Ruiz', 'carmen.ruiz@example.com', 'course-001', '2025-08-20'),
('student-010', 'Miguel Herrera', 'miguel.herrera@example.com', 'course-003', '2025-08-25'),
('student-011', 'Demo Estudiante', 'demo.estudiante@example.com', 'course-004', '2025-08-27'),
('student-012', 'Valentina Silva', 'valentina.silva@example.com', 'course-002', '2025-08-28'),
('student-013', 'Andrés Morales', 'andres.morales@example.com', 'course-005', '2025-08-28'),
('student-014', 'Isabella Contreras', 'isabella.contreras@example.com', 'course-003', '2025-08-28'),
('student-015', 'Diego Vargas', 'diego.vargas@example.com', 'course-001', '2025-08-28'),
('student-016', 'Camila Rojas', 'camila.rojas@example.com', 'course-004', '2025-08-28');

-- Insert absences
INSERT INTO absences (id, student_id, course_id, type, category, situation, sanction, date, comments) VALUES
('absence-001', 'student-001', 'course-001', 1, 'Académica', 'Resuelta', 'Advertencia', '2025-08-15', 'Llegó 15 minutos tarde sin justificación'),
('absence-002', 'student-002', 'course-001', 3, 'Comportamiento', 'Pendiente', 'Pendiente', '2025-08-18', 'No asistió a clase sin aviso previo'),
('absence-003', 'student-003', 'course-002', 2, 'Académica', 'Resuelta', 'Ninguna', '2025-08-20', 'Justificada por cita médica'),
('absence-004', 'student-004', 'course-002', 1, 'Académica', 'Pendiente', 'Pendiente', '2025-08-22', 'Llegó 10 minutos tarde'),
('absence-005', 'student-005', 'course-003', 3, 'Comportamiento', 'Resuelta', 'Suspensión de actividades extracurriculares por 1 semana', '2025-08-10', 'No asistió a clase sin justificación'),
('absence-006', 'student-006', 'course-001', 2, 'Académica', 'Resuelta', 'Ninguna', '2025-08-12', 'Justificada por enfermedad'),
('absence-007', 'student-007', 'course-003', 1, 'Comportamiento', 'Resuelta', 'Advertencia', '2025-08-14', 'Llegó 20 minutos tarde'),
('absence-008', 'student-008', 'course-002', 3, 'Académica', 'Pendiente', 'Pendiente', '2025-08-16', 'No asistió a clase sin aviso'),
('absence-009', 'student-001', 'course-001', 2, 'Académica', 'Resuelta', 'Ninguna', '2025-08-05', 'Justificada por cita médica'),
('absence-010', 'student-002', 'course-001', 1, 'Comportamiento', 'Resuelta', 'Advertencia', '2025-08-08', 'Llegó 5 minutos tarde'),
('absence-011', 'student-009', 'course-001', 3, 'Académica', 'Pendiente', 'Pendiente', '2025-08-20', 'No asistió a clase sin justificación'),
('absence-012', 'student-010', 'course-003', 1, 'Académica', 'Resuelta', 'Advertencia', '2025-08-18', 'Llegó 15 minutos tarde'),
('absence-013', 'student-011', 'course-004', 1, 'Académica', 'Pendiente', 'Pendiente', '2025-08-27', 'Llegó 10 minutos tarde'),
('absence-014', 'student-011', 'course-004', 2, 'Académica', 'Resuelta', 'Ninguna', '2025-08-26', 'Justificada por cita médica'),
('absence-015', 'student-012', 'course-002', 3, 'Comportamiento', 'Pendiente', 'Pendiente', '2025-08-28', 'No asistió a clase sin aviso previo'),
('absence-016', 'student-013', 'course-005', 1, 'Académica', 'Resuelta', 'Advertencia', '2025-08-28', 'Llegó 15 minutos tarde'),
('absence-017', 'student-014', 'course-003', 2, 'Académica', 'Resuelta', 'Ninguna', '2025-08-28', 'Justificada por cita médica'),
('absence-018', 'student-016', 'course-004', 3, 'Comportamiento', 'Resuelta', 'Suspensión de actividades extracurriculares por 1 semana', '2025-08-28', 'No asistió a clase sin justificación');

-- Insert users
INSERT INTO users (id, username, role) VALUES
('user-admin-001', 'admin', 'admin'),
('user-teacher-001', 'teacher1', 'teacher'),
('user-teacher-002', 'teacher2', 'teacher'),
('user-teacher-003', 'teacher3', 'teacher'),
('user-teacher-004', 'teacher4', 'teacher'),
('user-teacher-005', 'teacher5', 'teacher'),
('user-student-001', 'student1', 'student'),
('user-student-002', 'student2', 'student'),
('user-student-003', 'student3', 'student'),
('user-student-004', 'student4', 'student'),
('user-student-005', 'student5', 'student'),
('user-student-006', 'student6', 'student'),
('user-student-007', 'student7', 'student'),
('user-student-008', 'student8', 'student'),
('user-student-009', 'student9', 'student'),
('user-student-010', 'student10', 'student'),
('user-student-011', 'demo', 'student'),
('user-student-012', 'valentina', 'student'),
('user-student-013', 'andres', 'student'),
('user-student-014', 'isabella', 'student'),
('user-student-015', 'diego', 'student'),
('user-student-016', 'camila', 'student');