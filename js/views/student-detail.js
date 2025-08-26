/**
 * Student Detail View Logic
 * REPORTE DE FALTAS IEVE
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated and is teacher
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
        window.location.href = 'login.html';
        return;
    }
    
    // Get student ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');
    
    if (!studentId) {
        alert('No se especificó un estudiante');
        window.location.href = 'teacher-dashboard.html';
        return;
    }
    
    // Initialize student detail view
    await initializeStudentDetail(studentId);
});

/**
 * Initialize the student detail view
 * @param {string} studentId - Student ID to display
 */
async function initializeStudentDetail(studentId) {
    try {
        // Load student information
        await loadStudentInfo(studentId);
        
        // Load absences history
        await loadAbsencesHistory(studentId);
    } catch (error) {
        console.error('Error initializing student detail:', error);
        alert('Error al cargar los datos del estudiante');
    }
}

/**
 * Load student information
 * @param {string} studentId - Student ID
 */
async function loadStudentInfo(studentId) {
    try {
        const student = await getStudentById(studentId);
        
        if (student) {
            document.getElementById('studentName').textContent = student.name;
            document.getElementById('studentEmail').textContent = student.email;
            
            // Get course name
            const course = await getCourseById(student.course_id);
            document.getElementById('studentCourse').textContent = course ? course.name : 'Curso no encontrado';
            
            document.getElementById('studentEnrollmentDate').textContent = student.enrollment_date;
        } else {
            alert('Estudiante no encontrado');
            window.location.href = 'teacher-dashboard.html';
        }
    } catch (error) {
        console.error('Error loading student info:', error);
        alert('Error al cargar los datos del estudiante');
    }
}

/**
 * Load absences history
 * @param {string} studentId - Student ID
 */
async function loadAbsencesHistory(studentId) {
    try {
        const absences = await getAbsencesByStudentId(studentId);
        const courses = await getAllCourses();
        const absencesList = document.getElementById('absencesList');
        const noAbsencesMessage = document.getElementById('noAbsencesMessage');
        
        // Clear existing content
        absencesList.innerHTML = '';
        
        // Show/hide no absences message
        if (absences.length === 0) {
            noAbsencesMessage.style.display = 'block';
            return;
        }
        
        noAbsencesMessage.style.display = 'none';
        
        // Add cards for each absence
        for (const absence of absences) {
            const course = courses.find(c => c.id === absence.course_id);
            
            const card = document.createElement('div');
            card.className = 'absence-card';
            
            // Get type label and badge class
            const typeLabel = getAbsenceTypeLabel(absence.type);
            let badgeClass = '';
            switch(absence.type) {
                case 1: // Tardanza
                    badgeClass = 'badge--tardanza';
                    break;
                case 2: // Ausencia justificada
                    badgeClass = 'badge--justificada';
                    break;
                case 3: // Ausencia injustificada
                    badgeClass = 'badge--injustificada';
                    break;
            }
            
            card.innerHTML = `
                <div class="absence-card__header">
                    <h3 class="absence-card__title">${typeLabel}</h3>
                    <span class="absence-card__date">${absence.date}</span>
                </div>
                <div class="absence-card__body">
                    <div class="absence-card__item">
                        <div class="absence-card__label">Curso</div>
                        <div class="absence-card__value">${course ? course.name : 'Curso no encontrado'}</div>
                    </div>
                    <div class="absence-card__item">
                        <div class="absence-card__label">Categoría</div>
                        <div class="absence-card__value">${absence.category}</div>
                    </div>
                    <div class="absence-card__item">
                        <div class="absence-card__label">Situación</div>
                        <div class="absence-card__value">${absence.situation}</div>
                    </div>
                    <div class="absence-card__item">
                        <div class="absence-card__label">Sanción</div>
                        <div class="absence-card__value">${absence.sanction}</div>
                    </div>
                    <div class="absence-card__item absence-card__comments">
                        <div class="absence-card__label">Comentarios</div>
                        <div class="absence-card__value">${absence.comments || 'Sin comentarios'}</div>
                    </div>
                </div>
                <div class="absence-card__actions">
                    <button class="absence-card__action-btn absence-card__action-btn--edit" data-edit="${absence.id}">
                        Editar
                    </button>
                    <button class="absence-card__action-btn absence-card__action-btn--delete" data-delete="${absence.id}">
                        Eliminar
                    </button>
                </div>
            `;
            
            absencesList.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading absences history:', error);
        alert('Error al cargar el historial de faltas');
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