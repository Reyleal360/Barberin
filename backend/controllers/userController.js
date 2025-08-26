const db = require('../config/db');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user by username
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { id, username, role } = req.body;
    
    // Validate required fields
    if (!id || !username || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user already exists
    const [existing] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'User with this ID already exists' });
    }
    
    // Check if username already exists
    const [existingUsername] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsername.length > 0) {
      return res.status(409).json({ error: 'User with this username already exists' });
    }
    
    // Insert new user
    const [result] = await db.execute(
      'INSERT INTO users (id, username, role) VALUES (?, ?, ?)',
      [id, username, role]
    );
    
    res.status(201).json({ id, username, role });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body;
    
    // Check if user exists
    const [existing] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if username already exists for another user
    const [existingUsername] = await db.execute('SELECT id FROM users WHERE username = ? AND id != ?', [username, id]);
    if (existingUsername.length > 0) {
      return res.status(409).json({ error: 'User with this username already exists' });
    }
    
    // Update user
    const [result] = await db.execute(
      'UPDATE users SET username = ?, role = ? WHERE id = ?',
      [username, role, id]
    );
    
    res.status(200).json({ id, username, role });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const [existing] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete user
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser
};