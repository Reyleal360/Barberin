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
async function handleLogin(e) {
    e.preventDefault();
    
    try {
        // Get form values
        const username = document.getElementById('username').value.trim();
        const role = document.querySelector('input[name="role"]:checked').value;
        
        // Validate input
        if (!username) {
            alert('Por favor ingresa tu nombre de usuario');
            return;
        }
        
        // Authenticate user
        await authenticateUser(username, role);
    } catch (error) {
        console.error('Error handling login:', error);
        alert('Error al iniciar sesión');
    }
}

/**
 * Authenticate user
 * @param {string} username - Username
 * @param {string} role - User role
 */
async function authenticateUser(username, role) {
    try {
        // In a real application, this would be an API call
        // For this implementation, we'll check against our users in the database
        
        const user = await getUserByUsername(username);
        
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
    } catch (error) {
        console.error('Error authenticating user:', error);
        alert('Error al autenticar el usuario');
    }
}

/**
 * Get user by username
 * @param {string} username - Username
 * @returns {Object|null} User object or null if not found
 */
async function getUserByUsername(username) {
    return await dataManager.getUserByUsername(username);
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