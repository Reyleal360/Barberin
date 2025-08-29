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
    
    // Validate required fields
    if (!id || !name || !email || !course_id || !enrollment_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if student already exists
    const [existingStudent] = await db.execute('SELECT id FROM students WHERE id = ?', [id]);
    if (existingStudent.length > 0) {
      return res.status(409).json({ error: 'Student with this ID already exists' });
    }
    
    // Check if user already exists
    const [existingUser] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User with this ID already exists' });
    }
    
    // Start transaction
    await db.execute('START TRANSACTION');
    
    try {
      // Insert new student
      const [studentResult] = await db.execute(
        'INSERT INTO students (id, name, email, course_id, enrollment_date) VALUES (?, ?, ?, ?, ?)',
        [id, name, email, course_id, enrollment_date]
      );
      
      // Insert new user with role 'student'
      const [userResult] = await db.execute(
        'INSERT INTO users (id, username, role) VALUES (?, ?, ?)',
        [id, email, 'student']
      );
      
      // Commit transaction
      await db.execute('COMMIT');
      
      res.status(201).json({ id, name, email, course_id, enrollment_date });
    } catch (error) {
      // Rollback transaction on error
      await db.execute('ROLLBACK');
      throw error;
    }
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