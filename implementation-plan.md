# Implementation Plan

## Overview
This document details the implementation plan for moving from localStorage-based data storage to a single JSON file approach for the IEVE absence reporting system.

## File Structure Changes
1. Create `data.json` - Contains all application data
2. Create `js/data-manager.js` - Contains the DataManager class
3. Modify `js/main.js` - Update initialization logic
4. Modify all files in `js/views/` - Update to use DataManager

## Detailed Implementation Steps

### Step 1: Create data.json
Create a JSON file with the following structure:
```json
{
  "students": [
    {
      "id": "student-001",
      "name": "María González",
      "email": "maria.gonzalez@example.com",
      "course": "course-001",
      "enrollmentDate": "2025-08-01"
    }
    // ... more students
  ],
  "courses": [
    {
      "id": "course-001",
      "name": "Matemáticas Avanzadas",
      "teacher": "Prof. Elena Ruiz",
      "schedule": "Lunes y Miércoles 8:00-10:00"
    }
    // ... more courses
  ],
  "absences": [
    {
      "id": "absence-001",
      "studentId": "student-001",
      "courseId": "course-001",
      "type": 1,
      "category": "Académica",
      "situation": "Resuelta",
      "sanction": "Advertencia",
      "date": "2025-08-15",
      "comments": "Llegó 15 minutos tarde sin justificación"
    }
    // ... more absences
  ],
  "users": [
    {
      "id": "user-admin-001",
      "username": "admin",
      "role": "admin"
    }
    // ... more users
  ]
}
```

### Step 2: Create DataManager Class
Create `js/data-manager.js` with the following methods:
- `loadData()`: Load data from JSON file
- `saveData()`: Save data to JSON file
- `getAllStudents()`: Get all students
- `getStudentById(id)`: Get a student by ID
- `createStudent(student)`: Create a new student
- `updateStudent(id, student)`: Update an existing student
- `deleteStudent(id)`: Delete a student
- Similar methods for courses, absences, and users

### Step 3: Update main.js
Modify `js/main.js` to:
- Remove localStorage-based initialization
- Use DataManager for data initialization
- Update all data access methods to use DataManager

### Step 4: Update View Files
Update all files in `js/views/` to use DataManager instead of direct localStorage access:
- `js/views/login.js`
- `js/views/admin-dashboard.js`
- `js/views/teacher-dashboard.js`
- `js/views/student-dashboard.js`
- `js/views/student-detail.js`
- `js/views/report.js`

## Execution Order
1. Switch to Code mode
2. Create data.json
3. Create js/data-manager.js
4. Update js/main.js
5. Update all view files
6. Test the application
7. Document execution instructions

## Testing Plan
1. Verify data loads correctly from JSON file
2. Verify all CRUD operations work correctly
3. Verify all dashboards display data correctly
4. Verify authentication still works
5. Verify all forms for creating/editing data work correctly