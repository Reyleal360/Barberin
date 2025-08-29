const db = require('../config/db');

// Get all absences
const getAllAbsences = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM absences');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching absences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get absence by ID
const getAbsenceById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM absences WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Absence not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching absence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get absences by student ID
const getAbsencesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const [rows] = await db.execute('SELECT * FROM absences WHERE student_id = ?', [studentId]);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching absences by student ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new absence
const createAbsence = async (req, res) => {
  try {
    const { id, student_id, course_id, type, category, situation, sanction, date, comments } = req.body;
    
    // Validate required fields
    if (!id || !student_id || !course_id || !type || !category || !situation || !sanction || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if absence already exists
    const [existing] = await db.execute('SELECT id FROM absences WHERE id = ?', [id]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Absence with this ID already exists' });
    }
    
    // Format date for MySQL if it's an ISO string
    let formattedDate = date;
    if (date && typeof date === 'string' && date.includes('T')) {
      // Extract just the date part from ISO string (YYYY-MM-DD)
      formattedDate = date.split('T')[0];
    }
    
    // Insert new absence
    const [result] = await db.execute(
      'INSERT INTO absences (id, student_id, course_id, type, category, situation, sanction, date, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, student_id, course_id, type, category, situation, sanction, formattedDate, comments || null]
    );
    
    res.status(201).json({ id, student_id, course_id, type, category, situation, sanction, date: formattedDate, comments });
  } catch (error) {
    console.error('Error creating absence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update absence by ID
const updateAbsence = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id, course_id, type, category, situation, sanction, date, comments } = req.body;
    
    // Check if absence exists
    const [existing] = await db.execute('SELECT id FROM absences WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Absence not found' });
    }
    
    // Format date for MySQL if it's an ISO string
    let formattedDate = date;
    if (date && typeof date === 'string' && date.includes('T')) {
      // Extract just the date part from ISO string (YYYY-MM-DD)
      formattedDate = date.split('T')[0];
    }
    
    // Update absence
    const [result] = await db.execute(
      'UPDATE absences SET student_id = ?, course_id = ?, type = ?, category = ?, situation = ?, sanction = ?, date = ?, comments = ? WHERE id = ?',
      [student_id, course_id, type, category, situation, sanction, formattedDate, comments || null, id]
    );
    
    res.status(200).json({ id, student_id, course_id, type, category, situation, sanction, date: formattedDate, comments });
  } catch (error) {
    console.error('Error updating absence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete absence by ID
const deleteAbsence = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if absence exists
    const [existing] = await db.execute('SELECT id FROM absences WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Absence not found' });
    }
    
    // Delete absence
    const [result] = await db.execute('DELETE FROM absences WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Absence deleted successfully' });
  } catch (error) {
    console.error('Error deleting absence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllAbsences,
  getAbsenceById,
  getAbsencesByStudentId,
  createAbsence,
  updateAbsence,
  deleteAbsence
};