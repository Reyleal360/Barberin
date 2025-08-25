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
function initializeData() {
    // Initialize data manager
    dataManager.initializeFromLocalStorage();
}





/**
 * Get all students from storage
 * @returns {Array} Array of student objects
 */
function getAllStudents() {
    return dataManager.getAllStudents();
}

/**
 * Get student by ID
 * @param {string} id - Student ID
 * @returns {Object|null} Student object or null if not found
 */
function getStudentById(id) {
    return dataManager.getStudentById(id);
}

/**
 * Create a new student
 * @param {Object} student - Student object to create
 */
function createStudent(student) {
    dataManager.createStudent(student);
}

/**
 * Update student by ID
 * @param {string} id - Student ID
 * @param {Object} updatedStudent - Updated student object
 */
function updateStudent(id, updatedStudent) {
    dataManager.updateStudent(id, updatedStudent);
}

/**
 * Delete student by ID
 * @param {string} id - Student ID
 */
function deleteStudent(id) {
    dataManager.deleteStudent(id);
}

/**
 * Get all courses from storage
 * @returns {Array} Array of course objects
 */
function getAllCourses() {
    return dataManager.getAllCourses();
}

/**
 * Get course by ID
 * @param {string} id - Course ID
 * @returns {Object|null} Course object or null if not found
 */
function getCourseById(id) {
    return dataManager.getCourseById(id);
}

/**
 * Create a new course
 * @param {Object} course - Course object to create
 */
function createCourse(course) {
    dataManager.createCourse(course);
}

/**
 * Update course by ID
 * @param {string} id - Course ID
 * @param {Object} updatedCourse - Updated course object
 */
function updateCourse(id, updatedCourse) {
    dataManager.updateCourse(id, updatedCourse);
}

/**
 * Delete course by ID
 * @param {string} id - Course ID
 */
function deleteCourse(id) {
    dataManager.deleteCourse(id);
}

/**
 * Get all absences from storage
 * @returns {Array} Array of absence objects
 */
function getAllAbsences() {
    return dataManager.getAllAbsences();
}

/**
 * Get absence by ID
 * @param {string} id - Absence ID
 * @returns {Object|null} Absence object or null if not found
 */
function getAbsenceById(id) {
    return dataManager.getAbsenceById(id);
}

/**
 * Get absences by student ID
 * @param {string} studentId - Student ID
 * @returns {Array} Array of absence objects for the student
 */
function getAbsencesByStudentId(studentId) {
    return dataManager.getAbsencesByStudentId(studentId);
}

/**
 * Create a new absence
 * @param {Object} absence - Absence object to create
 */
function createAbsence(absence) {
    dataManager.createAbsence(absence);
}

/**
 * Update absence by ID
 * @param {string} id - Absence ID
 * @param {Object} updatedAbsence - Updated absence object
 */
function updateAbsence(id, updatedAbsence) {
    dataManager.updateAbsence(id, updatedAbsence);
}

/**
 * Delete absence by ID
 * @param {string} id - Absence ID
 */
function deleteAbsence(id) {
    dataManager.deleteAbsence(id);
}

/**
 * Get user by username
 * @param {string} username - Username
 * @returns {Object|null} User object or null if not found
 */
function getUserByUsername(username) {
    return dataManager.getUserByUsername(username);
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

/**
 * Get all students for a specific course
 * @param {string} courseId - Course ID
 * @returns {Array} Array of student objects in the course
 */
function getStudentsByCourseId(courseId) {
    return dataManager.getStudentsByCourseId(courseId);
}