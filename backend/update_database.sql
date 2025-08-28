-- Script to update the database with new student data
-- This script adds new students, users, and absences without removing existing data

-- Add new students
INSERT INTO students (id, name, email, course_id, enrollment_date) VALUES
('student-012', 'Valentina Silva', 'valentina.silva@example.com', 'course-002', '2025-08-28'),
('student-013', 'Andrés Morales', 'andres.morales@example.com', 'course-005', '2025-08-28'),
('student-014', 'Isabella Contreras', 'isabella.contreras@example.com', 'course-003', '2025-08-28'),
('student-015', 'Diego Vargas', 'diego.vargas@example.com', 'course-001', '2025-08-28'),
('student-016', 'Camila Rojas', 'camila.rojas@example.com', 'course-004', '2025-08-28')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
email = VALUES(email),
course_id = VALUES(course_id),
enrollment_date = VALUES(enrollment_date);

-- Add new users
INSERT INTO users (id, username, role) VALUES
('user-student-012', 'valentina', 'student'),
('user-student-013', 'andres', 'student'),
('user-student-014', 'isabella', 'student'),
('user-student-015', 'diego', 'student'),
('user-student-016', 'camila', 'student')
ON DUPLICATE KEY UPDATE
username = VALUES(username),
role = VALUES(role);

-- Add new absences
INSERT INTO absences (id, student_id, course_id, type, category, situation, sanction, date, comments) VALUES
('absence-015', 'student-012', 'course-002', 3, 'Comportamiento', 'Pendiente', 'Pendiente', '2025-08-28', 'No asistió a clase sin aviso previo'),
('absence-016', 'student-013', 'course-005', 1, 'Académica', 'Resuelta', 'Advertencia', '2025-08-28', 'Llegó 15 minutos tarde'),
('absence-017', 'student-014', 'course-003', 2, 'Académica', 'Resuelta', 'Ninguna', '2025-08-28', 'Justificada por cita médica'),
('absence-018', 'student-016', 'course-004', 3, 'Comportamiento', 'Resuelta', 'Suspensión de actividades extracurriculares por 1 semana', '2025-08-28', 'No asistió a clase sin justificación')
ON DUPLICATE KEY UPDATE
student_id = VALUES(student_id),
course_id = VALUES(course_id),
type = VALUES(type),
category = VALUES(category),
situation = VALUES(situation),
sanction = VALUES(sanction),
date = VALUES(date),
comments = VALUES(comments);