# IEVE Absence Reporting System

## Overview
The IEVE Absence Reporting System is a web application designed to manage student absences in an educational institution. This system allows administrators to manage students, courses, and users, while teachers can record and manage student absences, and students can view their absence history.

## Features
- **Admin Dashboard**: Manage students, courses, and users
- **Teacher Dashboard**: Record and manage student absences
- **Student Dashboard**: View absence history and add comments
- **Reporting**: Generate reports on student absences
- **Authentication**: Role-based access control for admins, teachers, and students

## System Architecture
The application uses a modern architecture with:
- **Frontend**: HTML, CSS, and JavaScript for the user interface
- **Backend**: Node.js with Express for REST API
- **Database**: MySQL for data storage
- **Data Management**: DataManager class for handling all data operations through API calls

## Prerequisites
- Node.js (version 12 or higher)
- MySQL database server
- A modern web browser (Chrome, Firefox, Edge, Safari)

## Installation

### 1. Database Setup
1. Create a MySQL database
2. Execute the `database-init.sql` script to initialize the database with initial data
3. Update the database connection parameters in `backend/.env` if needed

### 2. Backend Setup
1. Navigate to the `backend` directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start the backend server

### 3. Frontend Setup
1. Open the `index.html` file in your web browser
2. The application will automatically redirect you to the login page

## Usage

### Login
Use one of the following credentials to log in:
- **Admin**: Username "admin", Role "Administrador"
- **Teacher**: Username "teacher1", Role "Maestro"
- **Student**: Username "student1", Role "Alumno"

### Admin Dashboard
As an admin, you can:
- Manage students (create, read, update, delete)
- Manage courses (create, read, update, delete)
- View statistics about the system

### Teacher Dashboard
As a teacher, you can:
- Record student absences
- Manage existing absences (edit, delete)
- View student details

### Student Dashboard
As a student, you can:
- View your absence history
- Add comments to your absences

### Reporting
All users can generate reports on student absences with various filters.

## API Endpoints
The backend provides the following REST endpoints:

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a student by ID
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update an existing student
- `DELETE /api/students/:id` - Delete a student

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a course by ID
- `POST /api/courses` - Create a new course
- `PUT /api/courses/:id` - Update an existing course
- `DELETE /api/courses/:id` - Delete a course

### Absences
- `GET /api/absences` - Get all absences
- `GET /api/absences/:id` - Get an absence by ID
- `GET /api/absences/student/:studentId` - Get absences for a specific student
- `POST /api/absences` - Create a new absence
- `PUT /api/absences/:id` - Update an existing absence
- `DELETE /api/absences/:id` - Delete an absence

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:username` - Get a user by username
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update an existing user
- `DELETE /api/users/:id` - Delete a user

## File Structure
```
├── backend/                 # Backend Node.js application
│   ├── server.js             # Main server file
│   ├── package.json          # Backend dependencies
│   ├── .env                  # Database configuration
│   ├── config/
│   │   └── db.js             # Database connection
│   └── controllers/
│       ├── studentController.js
│       ├── courseController.js
│       ├── absenceController.js
│       └── userController.js
├── database-init.sql        # Database initialization script
├── index.html               # Main entry point
├── login.html               # Login page
├── admin-dashboard.html     # Admin dashboard
├── student-dashboard.html   # Student dashboard
├── report.html              # Report generation page
├── css/                     # Stylesheets
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

## Development

### Frontend Development
The frontend is built with vanilla JavaScript and uses a DataManager class to handle all data operations. The DataManager makes API calls to the backend for all CRUD operations.

### Backend Development
The backend is built with Node.js and Express. It provides REST endpoints for all entities in the system. The backend connects to a MySQL database for data storage.

### Database Development
The database schema is defined in `database-schema.md` and the initialization script is in `database-init.sql`. The database uses the following tables:
- `students`: Student information
- `courses`: Course information
- `absences`: Student absence records
- `users`: User authentication information

## Troubleshooting
1. If data doesn't load, check that the backend server is running
2. If changes aren't saved, check the backend server logs for errors
3. Clear browser cache if you're not seeing updates
4. Ensure MySQL database is running and accessible

## Contributing
We welcome contributions to the IEVE Absence Reporting System. Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
This project is licensed under the MIT License.

## Contact
For questions or support, please contact the development team.