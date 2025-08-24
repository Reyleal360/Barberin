# Data Models - REPORTE DE FALTAS IEVE

## Overview

This document defines the data models and mock data structure for the "REPORTE DE FALTAS IEVE" system. All data will be stored in localStorage for simulation purposes, with a clear structure that can be easily replaced with backend API calls in the future.

## Data Models

### 1. Student Model

```javascript
{
  id: string,           // Unique identifier (UUID format)
  name: string,         // Full name of the student
  email: string,        // Email address
  course: string,       // Course ID they are enrolled in
  enrollmentDate: Date  // Date of enrollment
}
```

### 2. Course Model

```javascript
{
  id: string,           // Unique identifier (UUID format)
  name: string,         // Name of the course
  teacher: string,      // Name of the teacher
  schedule: string      // Class schedule (e.g., "Lunes y Miércoles 8:00-10:00")
}
```

### 3. Absence Model

```javascript
{
  id: string,           // Unique identifier (UUID format)
  studentId: string,    // Reference to student ID
  courseId: string,     // Reference to course ID
  type: number,         // 1: Tardanza, 2: Ausencia justificada, 3: Ausencia injustificada
  category: string,     // Category of absence (Académica, Comportamiento, etc.)
  situation: string,    // Current situation (Pendiente, Resuelta, etc.)
  sanction: string,     // Sanction applied (Advertencia, Suspensión, Expulsión, etc.)
  date: Date,           // Date of the absence
  comments: string      // Comments about the absence
}
```

### 4. User Model (for authentication)

```javascript
{
  id: string,           // Unique identifier
  username: string,     // Username for login
  role: string          // Role: "admin", "teacher", or "student"
}
```

## Mock Data Structure

### Initial Mock Data

```javascript
const initialData = {
  students: [
    {
      id: "student-001",
      name: "María González",
      email: "maria.gonzalez@example.com",
      course: "course-001",
      enrollmentDate: "2025-08-01"
    },
    {
      id: "student-002",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      course: "course-001",
      enrollmentDate: "2025-08-01"
    },
    {
      id: "student-003",
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      course: "course-002",
      enrollmentDate: "2025-08-01"
    },
    {
      id: "student-004",
      name: "Luis Fernández",
      email: "luis.fernandez@example.com",
      course: "course-002",
      enrollmentDate: "2025-08-01"
    },
    {
      id: "student-005",
      name: "Sofía López",
      email: "sofia.lopez@example.com",
      course: "course-003",
      enrollmentDate: "2025-08-01"
    }
  ],
  
  courses: [
    {
      id: "course-001",
      name: "Matemáticas Avanzadas",
      teacher: "Prof. Elena Ruiz",
      schedule: "Lunes y Miércoles 8:00-10:00"
    },
    {
      id: "course-002",
      name: "Literatura Universal",
      teacher: "Prof. Jorge Pérez",
      schedule: "Martes y Jueves 10:00-12:00"
    },
    {
      id: "course-003",
      name: "Ciencias Naturales",
      teacher: "Prof. Carmen Silva",
      schedule: "Viernes 8:00-12:00"
    }
  ],
  
  absences: [
    {
      id: "absence-001",
      studentId: "student-001",
      courseId: "course-001",
      type: 1, // Tardanza
      category: "Académica",
      situation: "Resuelta",
      sanction: "Advertencia",
      date: "2025-08-15",
      comments: "Llegó 15 minutos tarde sin justificación"
    },
    {
      id: "absence-002",
      studentId: "student-002",
      courseId: "course-001",
      type: 3, // Ausencia injustificada
      category: "Comportamiento",
      situation: "Pendiente",
      sanction: "Pendiente",
      date: "2025-08-18",
      comments: "No asistió a clase sin aviso previo"
    },
    {
      id: "absence-003",
      studentId: "student-003",
      courseId: "course-002",
      type: 2, // Ausencia justificada
      category: "Académica",
      situation: "Resuelta",
      sanction: "Ninguna",
      date: "2025-08-20",
      comments: "Justificada por cita médica"
    }
  ],
  
  users: [
    {
      id: "user-admin-001",
      username: "admin",
      role: "admin"
    },
    {
      id: "user-teacher-001",
      username: "teacher1",
      role: "teacher"
    },
    {
      id: "user-teacher-002",
      username: "teacher2",
      role: "teacher"
    },
    {
      id: "user-student-001",
      username: "student1",
      role: "student"
    },
    {
      id: "user-student-002",
      username: "student2",
      role: "student"
    }
  ]
};
```

## Data Access Patterns

### Storage Keys

All data will be stored in localStorage with the following keys:
- `ieve_students`: Array of student objects
- `ieve_courses`: Array of course objects
- `ieve_absences`: Array of absence objects
- `ieve_users`: Array of user objects
- `ieve_currentUser`: Current logged in user object

### Data Operations

1. **Initialization**: On first load, check if data exists in localStorage. If not, initialize with mock data.

2. **CRUD Operations**:
   - **Create**: Add new items to the respective array and save to localStorage
   - **Read**: Retrieve arrays from localStorage and filter as needed
   - **Update**: Find item by ID, modify properties, and save updated array
   - **Delete**: Remove item by ID from array and save to localStorage

3. **Relationships**:
   - Students are linked to courses via the `course` property
   - Absences are linked to students via `studentId` and courses via `courseId`
   - All relationships are maintained through ID references

## Future Backend Integration

The data structure is designed to be compatible with RESTful APIs:

- `/api/students` - Student management endpoints
- `/api/courses` - Course management endpoints
- `/api/absences` - Absence management endpoints
- `/api/auth` - Authentication endpoints

The JavaScript service layer will abstract data operations, making it easy to switch from localStorage to API calls.