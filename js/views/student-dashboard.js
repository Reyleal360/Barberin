/**
 * Student Dashboard Logic
 * REPORTE DE FALTAS IEVE
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated and is student
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the student dashboard
 */
function initializeDashboard() {
    // Load student information
    loadStudentInfo();
    
    // Load absences history
    loadAbsencesHistory();
    
    // Load absence dropdown for comments
    loadAbsenceDropdown();
}

/**
 * Load student information
 */
function loadStudentInfo() {
    const currentUser = getCurrentUser();
    const student = getStudentById(currentUser.id.replace('user-', 'student-'));
    
    if (student) {
        document.getElementById('studentName').textContent = student.name;
        document.getElementById('studentEmail').textContent = student.email;
        
        // Get course name
        const course = getCourseById(student.course);
        document.getElementById('studentCourse').textContent = course ? course.name : 'Curso no encontrado';
        
        document.getElementById('studentEnrollmentDate').textContent = student.enrollmentDate;
    }
}

/**
 * Load absences history
 */
function loadAbsencesHistory() {
    const currentUser = getCurrentUser();
    const studentId = currentUser.id.replace('user-', 'student-');
    const absences = getAbsencesByStudentId(studentId);
    const courses = getAllCourses();
    const tableBody = document.getElementById('studentAbsencesTableBody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add rows for each absence
    absences.forEach(absence => {
        const course = courses.find(c => c.id === absence.courseId);
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${course ? course.name : 'Curso no encontrado'}</td>
            <td>${getAbsenceTypeLabel(absence.type)}</td>
            <td>${absence.date}</td>
            <td>${absence.situation}</td>
            <td>${absence.sanction}</td>
            <td>${absence.comments}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // If no absences, show a message
    if (absences.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" class="text-center">No tienes faltas registradas</td>';
        tableBody.appendChild(row);
    }
}

/**
 * Load absence dropdown for comments
 */
function loadAbsenceDropdown() {
    const currentUser = getCurrentUser();
    const studentId = currentUser.id.replace('user-', 'student-');
    const absences = getAbsencesByStudentId(studentId);
    const courses = getAllCourses();
    const dropdown = document.getElementById('commentAbsence');
    
    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">Selecciona una falta</option>';
    
    // Add absence options
    absences.forEach(absence => {
        const course = courses.find(c => c.id === absence.courseId);
        const option = document.createElement('option');
        option.value = absence.id;
        option.textContent = `${getAbsenceTypeLabel(absence.type)} - ${course ? course.name : 'Curso no encontrado'} - ${absence.date}`;
        dropdown.appendChild(option);
    });
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Comment form submission
    document.getElementById('commentForm').addEventListener('submit', handleCommentSubmit);
    
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
 * Handle comment form submission
 * @param {Event} e - Form submission event
 */
function handleCommentSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const absenceId = document.getElementById('commentAbsence').value;
    const commentText = document.getElementById('commentText').value.trim();
    
    // Validate input
    if (!absenceId || !commentText) {
        alert('Por favor selecciona una falta y escribe un comentario');
        return;
    }
    
    // Get existing absence
    const absence = getAbsenceById(absenceId);
    if (!absence) {
        alert('Falta no encontrada');
        return;
    }
    
    // Add comment to absence (in a real app, this would be a separate comments array)
    const updatedComments = absence.comments ? 
        `${absence.comments}\n\nComentario del alumno: ${commentText}` : 
        `Comentario del alumno: ${commentText}`;
    
    const updatedAbsence = {
        ...absence,
        comments: updatedComments
    };
    
    // Update absence
    updateAbsence(absenceId, updatedAbsence);
    
    // Reset form
    document.getElementById('commentForm').reset();
    
    // Reload absences history
    loadAbsencesHistory();
    
    // Show success message
    alert('Comentario agregado correctamente');
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
 * Get current authenticated user
 * @returns {Object|null} Current user object or null if not authenticated
 */
function getCurrentUser() {
    const user = localStorage.getItem('ieve_currentUser');
    return user ? JSON.parse(user) : null;
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
 * Get course by ID
 * @param {string} id - Course ID
 * @returns {Object|null} Course object or null if not found
 */
function getCourseById(id) {
    return dataManager.getCourseById(id);
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
 * Update absence by ID
 * @param {string} id - Absence ID
 * @param {Object} updatedAbsence - Updated absence object
 */
function updateAbsence(id, updatedAbsence) {
    dataManager.updateAbsence(id, updatedAbsence);
}