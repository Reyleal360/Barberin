/**
 * Student Dashboard Logic
 * REPORTE DE FALTAS IEVE
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated and is student
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize dashboard
    await initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the student dashboard
 */
async function initializeDashboard() {
    // Load student information
    await loadStudentInfo();
    
    // Load absences history
    await loadAbsencesHistory();
    
    // Load absence dropdown for comments
    await loadAbsenceDropdown();
}

/**
 * Load student information
 */
async function loadStudentInfo() {
    try {
        const currentUser = getCurrentUser();
        const student = await getStudentById(currentUser.id.replace('user-', 'student-'));
        
        if (student) {
            document.getElementById('studentName').textContent = student.name;
            document.getElementById('studentEmail').textContent = student.email;
            
            // Get course name
            const course = await getCourseById(student.course_id);
            document.getElementById('studentCourse').textContent = course ? course.name : 'Curso no encontrado';
            
            document.getElementById('studentEnrollmentDate').textContent = student.enrollment_date;
        }
    } catch (error) {
        console.error('Error loading student info:', error);
    }
}

/**
 * Load absences history
 */
async function loadAbsencesHistory() {
    try {
        const currentUser = getCurrentUser();
        const studentId = currentUser.id.replace('user-', 'student-');
        const absences = await getAbsencesByStudentId(studentId);
        const courses = await getAllCourses();
        const tableBody = document.getElementById('studentAbsencesTableBody');
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Add rows for each absence
        for (const absence of absences) {
            const course = courses.find(c => c.id === absence.course_id);
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${course ? course.name : 'Curso no encontrado'}</td>
                <td>${getAbsenceTypeLabel(absence.type)}</td>
                <td>${absence.date}</td>
                <td>${absence.situation}</td>
                <td>${absence.sanction}</td>
                <td>${absence.comments || ''}</td>
            `;
            
            tableBody.appendChild(row);
        }
        
        // If no absences, show a message
        if (absences.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" class="text-center">No tienes faltas registradas</td>';
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading absences history:', error);
    }
}

/**
 * Load absence dropdown for comments
 */
async function loadAbsenceDropdown() {
    try {
        const currentUser = getCurrentUser();
        const studentId = currentUser.id.replace('user-', 'student-');
        const absences = await getAbsencesByStudentId(studentId);
        const courses = await getAllCourses();
        const dropdown = document.getElementById('commentAbsence');
        
        // Clear existing options except the first one
        dropdown.innerHTML = '<option value="">Selecciona una falta</option>';
        
        // Add absence options
        for (const absence of absences) {
            const course = courses.find(c => c.id === absence.course_id);
            const option = document.createElement('option');
            option.value = absence.id;
            option.textContent = `${getAbsenceTypeLabel(absence.type)} - ${course ? course.name : 'Curso no encontrado'} - ${absence.date}`;
            dropdown.appendChild(option);
        }
    } catch (error) {
        console.error('Error loading absence dropdown:', error);
    }
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
async function handleCommentSubmit(e) {
    e.preventDefault();
    
    try {
        // Get form values
        const absenceId = document.getElementById('commentAbsence').value;
        const commentText = document.getElementById('commentText').value.trim();
        
        // Validate input
        if (!absenceId || !commentText) {
            alert('Por favor selecciona una falta y escribe un comentario');
            return;
        }
        
        // Get existing absence
        const absence = await getAbsenceById(absenceId);
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
        const result = await updateAbsence(absenceId, updatedAbsence);
        if (!result) {
            alert('Error al actualizar la falta');
            return;
        }
        
        // Reset form
        document.getElementById('commentForm').reset();
        
        // Reload absences history
        await loadAbsencesHistory();
        
        // Show success message
        alert('Comentario agregado correctamente');
    } catch (error) {
        console.error('Error handling comment submission:', error);
        alert('Error al agregar el comentario');
    }
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
 * Logout function
 */
function logout() {
    localStorage.removeItem('ieve_currentUser');
    window.location.href = 'login.html';
}