/**
 * Login Page Logic
 * REPORTE DE FALTAS IEVE
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the login form
    const loginForm = document.getElementById('loginForm');
    
    // Add event listener for form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

/**
 * Handle login form submission
 * @param {Event} e - Form submission event
 */
function handleLogin(e) {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;
    
    // Validate input
    if (!username) {
        alert('Por favor ingresa tu nombre de usuario');
        return;
    }
    
    // Authenticate user
    authenticateUser(username, role);
}

/**
 * Authenticate user
 * @param {string} username - Username
 * @param {string} role - User role
 */
function authenticateUser(username, role) {
    // In a real application, this would be an API call
    // For this mock implementation, we'll check against our mock users
    
    const user = getUserByUsername(username);
    
    if (!user) {
        alert('Usuario no encontrado');
        return;
    }
    
    if (user.role !== role) {
        alert('Rol incorrecto para este usuario');
        return;
    }
    
    // Set current user in localStorage
    setCurrentUser(user);
    
    // Redirect to appropriate dashboard
    redirectToDashboard(role);
}

/**
 * Get user by username
 * @param {string} username - Username
 * @returns {Object|null} User object or null if not found
 */
function getUserByUsername(username) {
    const users = JSON.parse(localStorage.getItem('ieve_users')) || [];
    return users.find(user => user.username === username) || null;
}

/**
 * Set current authenticated user
 * @param {Object} user - User object to set as current
 */
function setCurrentUser(user) {
    localStorage.setItem('ieve_currentUser', JSON.stringify(user));
}

/**
 * Redirect user to their appropriate dashboard
 * @param {string} role - User role (admin, teacher, student)
 */
function redirectToDashboard(role) {
    switch(role) {
        case 'admin':
            window.location.href = 'admin-dashboard.html';
            break;
        case 'teacher':
            window.location.href = 'teacher-dashboard.html';
            break;
        case 'student':
            window.location.href = 'student-dashboard.html';
            break;
        default:
            alert('Rol no reconocido');
    }
}