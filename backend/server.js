const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import database connection
const db = require('./config/db');

// Import controllers
const studentController = require('./controllers/studentController');
const courseController = require('./controllers/courseController');
const absenceController = require('./controllers/absenceController');
const userController = require('./controllers/userController');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes for students
app.get('/api/students', studentController.getAllStudents);
app.get('/api/students/:id', studentController.getStudentById);
app.post('/api/students', studentController.createStudent);
app.put('/api/students/:id', studentController.updateStudent);
app.delete('/api/students/:id', studentController.deleteStudent);

// Routes for courses
app.get('/api/courses', courseController.getAllCourses);
app.get('/api/courses/:id', courseController.getCourseById);
app.post('/api/courses', courseController.createCourse);
app.put('/api/courses/:id', courseController.updateCourse);
app.delete('/api/courses/:id', courseController.deleteCourse);

// Routes for absences
app.get('/api/absences', absenceController.getAllAbsences);
app.get('/api/absences/:id', absenceController.getAbsenceById);
app.get('/api/absences/student/:studentId', absenceController.getAbsencesByStudentId);
app.post('/api/absences', absenceController.createAbsence);
app.put('/api/absences/:id', absenceController.updateAbsence);
app.delete('/api/absences/:id', absenceController.deleteAbsence);

// Routes for users
app.get('/api/users', userController.getAllUsers);
app.get('/api/users/:username', userController.getUserByUsername);
app.post('/api/users', userController.createUser);
app.put('/api/users/:id', userController.updateUser);
app.delete('/api/users/:id', userController.deleteUser);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'IEVE Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;