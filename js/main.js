/**
 * Main Application Entry Point
 * REPORTE DE FALTAS IEVE
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data storage
    initializeData();
    
    // Check authentication status
    checkAuthStatus();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Check authentication status and redirect if needed
 */
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    
    // If we're not on the login page and there's no authenticated user, redirect to login
    if (!window.location.pathname.includes('login.html') && !currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // If we're on the login page and there is an authenticated user, redirect to their dashboard
    if (window.location.pathname.includes('login.html') && currentUser) {
        redirectToDashboard(currentUser.role);
        return;
    }
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
    // Handle logout button clicks
    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
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
            window.location.href = 'login.html';
    }
}

/**
 * Get current authenticated user
 * @returns {Object|null} Current user object or null if not authenticated
 */
function getCurrentUser() {
    const user = localStorage.getItem('ieve_currentUser');
    return user ? JSON.parse(user) : null;
}

/**
 * Set current authenticated user
 * @param {Object} user - User object to set as current
 */
function setCurrentUser(user) {
    localStorage.setItem('ieve_currentUser', JSON.stringify(user));
}

/**
 * Clear current user session
 */
function logout() {
    localStorage.removeItem('ieve_currentUser');
    window.location.href = 'login.html';
}

/**
 * Initialize data storage with mock data if empty
 */
async function initializeData() {
    // Load data from backend
    await dataManager.loadData();
}

// Student methods
async function getAllStudents() {
    return await dataManager.getAllStudents();
}

async function getStudentById(id) {
    return await dataManager.getStudentById(id);
}

async function createStudent(student) {
    return await dataManager.createStudent(student);
}

async function updateStudent(id, updatedStudent) {
    return await dataManager.updateStudent(id, updatedStudent);
}

async function deleteStudent(id) {
    return await dataManager.deleteStudent(id);
}

async function getStudentsByCourseId(courseId) {
    return await dataManager.getStudentsByCourseId(courseId);
}

// Course methods
async function getAllCourses() {
    return await dataManager.getAllCourses();
}

async function getCourseById(id) {
    return await dataManager.getCourseById(id);
}

async function createCourse(course) {
    return await dataManager.createCourse(course);
}

async function updateCourse(id, updatedCourse) {
    return await dataManager.updateCourse(id, updatedCourse);
}

async function deleteCourse(id) {
    return await dataManager.deleteCourse(id);
}

// Absence methods
async function getAllAbsences() {
    return await dataManager.getAllAbsences();
}

async function getAbsenceById(id) {
    return await dataManager.getAbsenceById(id);
}

async function getAbsencesByStudentId(studentId) {
    return await dataManager.getAbsencesByStudentId(studentId);
}

async function createAbsence(absence) {
    return await dataManager.createAbsence(absence);
}

async function updateAbsence(id, updatedAbsence) {
    return await dataManager.updateAbsence(id, updatedAbsence);
}

async function deleteAbsence(id) {
    return await dataManager.deleteAbsence(id);
}

// User methods
async function getAllUsers() {
    return await dataManager.getAllUsers();
}

async function getUserByUsername(username) {
    return await dataManager.getUserByUsername(username);
}

async function createUser(user) {
    return await dataManager.createUser(user);
}

async function updateUser(id, updatedUser) {
    return await dataManager.updateUser(id, updatedUser);
}

async function deleteUser(id) {
    return await dataManager.deleteUser(id);
}

/**
 * Get absence type label
 * @param {number} type - Absence type number
 * @returns {string} Absence type label
 */
function getAbsenceTypeLabel(type) {
    switch(type) {
        case 1:
            return "Tardanza";
        case 2:
            return "Ausencia justificada";
        case 3:
            return "Ausencia injustificada";
        default:
            return "Desconocido";
    }
}