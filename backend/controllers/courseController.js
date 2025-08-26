const db = require('../config/db');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM courses');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM courses WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { id, name, teacher, schedule } = req.body;
    
    // Validate required fields
    if (!id || !name || !teacher || !schedule) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if course already exists
    const [existing] = await db.execute('SELECT id FROM courses WHERE id = ?', [id]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Course with this ID already exists' });
    }
    
    // Insert new course
    const [result] = await db.execute(
      'INSERT INTO courses (id, name, teacher, schedule) VALUES (?, ?, ?, ?)',
      [id, name, teacher, schedule]
    );
    
    res.status(201).json({ id, name, teacher, schedule });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update course by ID
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, teacher, schedule } = req.body;
    
    // Check if course exists
    const [existing] = await db.execute('SELECT id FROM courses WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Update course
    const [result] = await db.execute(
      'UPDATE courses SET name = ?, teacher = ?, schedule = ? WHERE id = ?',
      [name, teacher, schedule, id]
    );
    
    res.status(200).json({ id, name, teacher, schedule });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete course by ID
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if course exists
    const [existing] = await db.execute('SELECT id FROM courses WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Delete course
    const [result] = await db.execute('DELETE FROM courses WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};