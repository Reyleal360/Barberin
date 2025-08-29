const db = require('../config/db');

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM students');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM students WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new student
const createStudent = async (req, res) => {
  try {
    const { id, name, email, course_id, enrollment_date } = req.body;
    
    console.log('Received student creation request:', { id, name, email, course_id, enrollment_date });
    
    // Validate required fields
    if (!id || !name || !email || !course_id || !enrollment_date) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    console.log('Checking if student already exists');
    // Check if student already exists
    const [existingStudent] = await db.execute('SELECT id FROM students WHERE id = ?', [id]);
    console.log('Existing student check result:', existingStudent);
    if (existingStudent.length > 0) {
      console.log('Student already exists');
      return res.status(409).json({ error: 'Student with this ID already exists' });
    }
    
    console.log('Checking if user already exists');
    // Check if user already exists
    const [existingUser] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    console.log('Existing user check result:', existingUser);
    if (existingUser.length > 0) {
      console.log('User already exists');
      return res.status(409).json({ error: 'User with this ID already exists' });
    }
    
    console.log('Inserting student record');
    // Insert new student
    const [studentResult] = await db.execute(
      'INSERT INTO students (id, name, email, course_id, enrollment_date) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, course_id, enrollment_date]
    );
    console.log('Student record inserted:', studentResult);
    
    console.log('Inserting user record');
    // Insert new user with role 'student'
    const [userResult] = await db.execute(
      'INSERT INTO users (id, username, role) VALUES (?, ?, ?)',
      [id, email, 'student']
    );
    console.log('User record inserted:', userResult);
    
    console.log('Student creation successful');
    res.status(201).json({ id, name, email, course_id, enrollment_date });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update student by ID
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, course_id, enrollment_date } = req.body;
    
    // Check if student exists
    const [existing] = await db.execute('SELECT id FROM students WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Update student
    const [result] = await db.execute(
      'UPDATE students SET name = ?, email = ?, course_id = ?, enrollment_date = ? WHERE id = ?',
      [name, email, course_id, enrollment_date, id]
    );
    
    res.status(200).json({ id, name, email, course_id, enrollment_date });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete student by ID
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if student exists
    const [existing] = await db.execute('SELECT id FROM students WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Delete student
    const [result] = await db.execute('DELETE FROM students WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};