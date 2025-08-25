# Execution Instructions

## Overview
This document provides instructions on how to execute and use the updated IEVE absence reporting system that now uses a centralized JSON data file and DataManager class instead of localStorage.

## System Architecture
The system now uses:
1. `data.json` - A single JSON file containing all application data
2. `js/data-manager.js` - A DataManager class that handles all data operations
3. Updated JavaScript view files that use the DataManager instead of direct localStorage access

## How to Execute the System

### 1. Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A local web server (optional but recommended for full functionality)

### 2. Running the Application
1. Open the `index.html` file in your web browser
2. The application will automatically redirect you to the login page
3. Use one of the following credentials to log in:
   - Admin: Username "admin", Role "Administrador"
   - Teacher: Username "teacher1", Role "Maestro"
   - Student: Username "student1", Role "Alumno"

### 3. Data Management
All data is now managed through the DataManager class:
- Data is initially loaded from `data.json`
- Changes are saved to localStorage as a fallback mechanism
- In a production environment, this would connect to a backend server

## DataManager Methods

### Student Methods
- `getAllStudents()` - Get all students
- `getStudentById(id)` - Get a student by ID
- `createStudent(student)` - Create a new student
- `updateStudent(id, student)` - Update an existing student
- `deleteStudent(id)` - Delete a student

### Course Methods
- `getAllCourses()` - Get all courses
- `getCourseById(id)` - Get a course by ID
- `createCourse(course)` - Create a new course
- `updateCourse(id, course)` - Update an existing course
- `deleteCourse(id)` - Delete a course

### Absence Methods
- `getAllAbsences()` - Get all absences
- `getAbsenceById(id)` - Get an absence by ID
- `getAbsencesByStudentId(studentId)` - Get absences for a specific student
- `createAbsence(absence)` - Create a new absence
- `updateAbsence(id, absence)` - Update an existing absence
- `deleteAbsence(id)` - Delete an absence

### User Methods
- `getAllUsers()` - Get all users
- `getUserByUsername(username)` - Get a user by username
- `createUser(user)` - Create a new user
- `updateUser(id, user)` - Update an existing user
- `deleteUser(id)` - Delete a user

## File Structure
```
├── data.json                 # Centralized data file
├── index.html                # Main entry point
├── login.html                # Login page
├── admin-dashboard.html      # Admin dashboard
├── student-dashboard.html    # Student dashboard
├── report.html               # Report generation page
├── css/                      # Stylesheets
│   ├── base.css
│   ├── components.css
│   ├── layout.css
│   ├── themes.css
│   ├── utilities.css
│   └── views/
│       ├── dashboard.css
│       ├── login.css
│       ├── report.css
│       └── student-detail.css
└── js/
    ├── data-manager.js       # DataManager class
    ├── main.js               # Main application logic
    └── views/
        ├── admin-dashboard.js
        ├── login.js
        ├── report.js
        ├── student-dashboard.js
        ├── student-detail.js
        └── teacher-dashboard.js
```

## Updating Data
To update the initial data in the system:
1. Edit the `data.json` file directly
2. The changes will be loaded when the application starts
3. For existing users, data will be loaded from localStorage if available

## Troubleshooting
1. If data doesn't load, check that `data.json` is in the root directory
2. If changes aren't saved, check browser console for errors
3. Clear browser cache if you're not seeing updates

## Development Notes
1. All view files now use the DataManager instead of direct localStorage access
2. The DataManager provides a consistent interface for all data operations
3. Data is still saved to localStorage as a fallback mechanism
4. In a production environment, the DataManager would connect to a backend API