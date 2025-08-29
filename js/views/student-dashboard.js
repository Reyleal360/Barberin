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
        // Map user ID to student ID correctly
        const studentId = currentUser.id.replace('user-student-', 'student-').replace('user-', 'student-');
        const student = await getStudentById(studentId);
        
        if (student) {
            document.getElementById('studentName').textContent = student.name;
            document.getElementById('studentEmail').textContent = student.email;
            
            // Get course name
            const course = await getCourseById(student.course_id);
            document.getElementById('studentCourse').textContent = course ? course.name : 'Curso no encontrado';
            
            document.getElementById('studentEnrollmentDate').textContent = student.enrollment_date;
        } else {
            // Handle case where student is not found
            document.getElementById('studentName').textContent = 'Estudiante no encontrado';
            document.getElementById('studentEmail').textContent = '-';
            document.getElementById('studentCourse').textContent = '-';
            document.getElementById('studentEnrollmentDate').textContent = '-';
            alert('No se encontró la información del estudiante. Por favor, contacte al administrador.');
        }
    } catch (error) {
        console.error('Error loading student info:', error);
        document.getElementById('studentName').textContent = 'Error al cargar';
        document.getElementById('studentEmail').textContent = 'Error al cargar';
        document.getElementById('studentCourse').textContent = 'Error al cargar';
        document.getElementById('studentEnrollmentDate').textContent = 'Error al cargar';
        alert('Error al cargar la información del estudiante. Por favor, intente nuevamente.');
    }
}

/**
 * Load absences history
 */
async function loadAbsencesHistory() {
    try {
        const currentUser = getCurrentUser();
        // Map user ID to student ID correctly
        const studentId = currentUser.id.replace('user-student-', 'student-').replace('user-', 'student-');
        const absences = await getAbsencesByStudentId(studentId);
        const courses = await getAllCourses();
        const tableBody = document.getElementById('studentAbsencesTableBody');
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Add rows for each absence
        for (const absence of absences) {
            const course = courses.find(c => c.id === absence.course_id);
            
            const row = document.createElement('tr');
            
            // Extract student comment from comments
            let studentComment = '';
            let otherComments = '';
            
            if (absence.comments) {
                const commentLines = absence.comments.split('\n');
                const studentCommentIndex = commentLines.findIndex(line => line.includes('Comentario del alumno:'));
                if (studentCommentIndex !== -1) {
                    studentComment = commentLines[studentCommentIndex].replace('Comentario del alumno:', '').trim();
                    // Remove the student comment line from other comments
                    commentLines.splice(studentCommentIndex, 1);
                    otherComments = commentLines.filter(line => line.trim() !== '').join('\n');
                } else {
                    otherComments = absence.comments;
                }
            }
            
            row.innerHTML = `
                <td>${course ? course.name : 'Curso no encontrado'}</td>
                <td>${getAbsenceTypeLabel(absence.type)}</td>
                <td>${absence.date}</td>
                <td>${absence.situation}</td>
                <td>${absence.sanction}</td>
                <td>
                    ${studentComment ? `<div><strong>Alumno:</strong> ${studentComment}</div>` : ''}
                    ${otherComments ? `<div><strong>Profesor:</strong> ${otherComments}</div>` : ''}
                    ${!studentComment && !otherComments ? 'Sin comentarios' : ''}
                </td>
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
        // Show error message in table
        const tableBody = document.getElementById('studentAbsencesTableBody');
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-error">Error al cargar el historial de faltas. Por favor, intente nuevamente.</td></tr>';
        alert('Error al cargar el historial de faltas. Por favor, intente nuevamente.');
    }
}

/**
 * Load absence dropdown for comments
 */
async function loadAbsenceDropdown() {
    try {
        const currentUser = getCurrentUser();
        // Map user ID to student ID correctly
        const studentId = currentUser.id.replace('user-student-', 'student-').replace('user-', 'student-');
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
        // Show error in dropdown
        const dropdown = document.getElementById('commentAbsence');
        dropdown.innerHTML = '<option value="">Error al cargar faltas</option>';
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
            showMessage('Por favor selecciona una falta y escribe un comentario', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = document.querySelector('#commentForm button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        // Get existing absence
        const absence = await getAbsenceById(absenceId);
        if (!absence) {
            showMessage('Falta no encontrada', 'error');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
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
            showMessage('Error al actualizar la falta', 'error');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return;
        }
        
        // Reset form
        document.getElementById('commentForm').reset();
        
        // Reload absences history
        await loadAbsencesHistory();
        
        // Reload absence dropdown
        await loadAbsenceDropdown();
        
        // Show success message
        showMessage('Comentario agregado correctamente', 'success');
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    } catch (error) {
        console.error('Error handling comment submission:', error);
        showMessage('Error al agregar el comentario. Por favor, inténtalo de nuevo.', 'error');
        // Reset button state
        const submitButton = document.querySelector('#commentForm button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = submitButton.textContent === 'Enviando...' ? 'Agregar Comentario' : submitButton.textContent;
            submitButton.disabled = false;
        }
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

/**
 * Show message in HTML element
 * @param {string} message - Message to display
 * @param {string} type - Type of message (success, error, info)
 */
function showMessage(message, type) {
    // Create or get message container
    let messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'messageContainer';
        messageContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 300px;
            min-width: 250px;
        `;
        document.body.appendChild(messageContainer);
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        background-color: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        padding: 12px 16px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        font-family: Arial, sans-serif;
        font-size: 14px;
        position: relative;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    messageEl.innerHTML = `
        <span style="font-weight: bold;">${type.charAt(0).toUpperCase() + type.slice(1)}:</span> ${message}
        <button onclick="this.parentElement.remove()" style="
            position: absolute;
            top: 5px;
            right: 8px;
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: inherit;
            opacity: 0.7;
        ">&times;</button>
    `;

    messageContainer.appendChild(messageEl);

    // Show message with animation
    setTimeout(() => {
        messageEl.style.opacity = '1';
    }, 10);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentElement) {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                if (messageEl.parentElement) {
                    messageEl.remove();
                }
            }, 300);
        }
    }, 5000);
}