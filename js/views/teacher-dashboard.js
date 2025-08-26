/**
 * Teacher Dashboard Logic
 * REPORTE DE FALTAS IEVE
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated and is teacher
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize dashboard
    await initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the teacher dashboard
 */
async function initializeDashboard() {
    try {
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('absenceDate').value = today;
        
        // Load dropdowns
        await loadStudentDropdown();
        await loadCourseDropdown();
        
        // Load absences table
        await loadAbsencesTable();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

/**
 * Load student dropdown
 */
async function loadStudentDropdown() {
    try {
        const students = await getAllStudents();
        const dropdown = document.getElementById('absenceStudent');
        
        // Clear existing options except the first one
        dropdown.innerHTML = '<option value="">Selecciona un estudiante</option>';
        
        // Add student options
        for (const student of students) {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            dropdown.appendChild(option);
        }
    } catch (error) {
        console.error('Error loading student dropdown:', error);
    }
}

/**
 * Load course dropdown
 */
async function loadCourseDropdown() {
    try {
        const courses = await getAllCourses();
        const dropdown = document.getElementById('absenceCourse');
        
        // Clear existing options except the first one
        dropdown.innerHTML = '<option value="">Selecciona un curso</option>';
        
        // Add course options
        for (const course of courses) {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            dropdown.appendChild(option);
        }
    } catch (error) {
        console.error('Error loading course dropdown:', error);
    }
}

/**
 * Load absences table
 */
async function loadAbsencesTable() {
    try {
        const absences = await getAllAbsences();
        const students = await getAllStudents();
        const courses = await getAllCourses();
        const tableBody = document.getElementById('absencesTableBody');
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Add rows for each absence
        for (const absence of absences) {
            const student = students.find(s => s.id === absence.student_id);
            const course = courses.find(c => c.id === absence.course_id);
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${student ? student.name : 'Estudiante no encontrado'}</td>
                <td>${course ? course.name : 'Curso no encontrado'}</td>
                <td>${getAbsenceTypeLabel(absence.type)}</td>
                <td>${absence.date}</td>
                <td>${absence.situation}</td>
                <td class="table__actions">
                    <button class="table__action-btn table__action-btn--edit" data-edit="${absence.id}">
                        Editar
                    </button>
                    <button class="table__action-btn table__action-btn--delete" data-delete="${absence.id}">
                        Eliminar
                    </button>
                    <button class="table__action-btn table__action-btn--view" data-view="${absence.student_id}">
                        Ver Detalle
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading absences table:', error);
    }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Absence form submission
    document.getElementById('absenceForm').addEventListener('submit', handleAbsenceSubmit);
    
    // Save edit absence button
    document.getElementById('saveEditAbsenceBtn').addEventListener('click', saveEditAbsence);
    
    // Cancel edit absence button
    document.getElementById('cancelEditAbsenceBtn').addEventListener('click', closeEditAbsenceModal);
    
    // Close modal buttons
    document.querySelectorAll('.modal__close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('modal--open');
        });
    });
    
    // Edit absence buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-edit]') && e.target.closest('#absencesTable')) {
            const absenceId = e.target.closest('[data-edit]').dataset.edit;
            editAbsence(absenceId);
        }
    });
    
    // Delete absence buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-delete]') && e.target.closest('#absencesTable')) {
            const absenceId = e.target.closest('[data-delete]').dataset.delete;
            deleteAbsenceConfirm(absenceId);
        }
    });
    
    // View student detail buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-view]') && e.target.closest('#absencesTable')) {
            const studentId = e.target.closest('[data-view]').dataset.view;
            viewStudentDetail(studentId);
        }
    });
    
    // Absence search
    document.getElementById('absenceSearch').addEventListener('input', function() {
        filterAbsencesTable(this.value);
    });
    
    // Absence filter
    document.getElementById('absenceFilter').addEventListener('change', function() {
        filterAbsencesTableByType(this.value);
    });
}

/**
 * Handle absence form submission
 * @param {Event} e - Form submission event
 */
async function handleAbsenceSubmit(e) {
    e.preventDefault();
    
    try {
        // Get form values
        const studentId = document.getElementById('absenceStudent').value;
        const courseId = document.getElementById('absenceCourse').value;
        const type = parseInt(document.getElementById('absenceType').value);
        const date = document.getElementById('absenceDate').value;
        const category = document.getElementById('absenceCategory').value.trim();
        const situation = document.getElementById('absenceSituation').value.trim();
        const sanction = document.getElementById('absenceSanction').value.trim();
        const comments = document.getElementById('absenceComments').value.trim();
        
        // Validate input
        if (!studentId || !courseId || !type || !date || !category || !situation || !sanction) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }
        
        // Create new absence
        const newAbsence = {
            id: 'absence-' + Date.now(),
            student_id: studentId,
            course_id: courseId,
            type: type,
            category: category,
            situation: situation,
            sanction: sanction,
            date: date,
            comments: comments
        };
        
        // Save absence
        const result = await createAbsence(newAbsence);
        if (!result) {
            alert('Error al registrar la falta');
            return;
        }
        
        // Reset form
        document.getElementById('absenceForm').reset();
        
        // Reload absences table
        await loadAbsencesTable();
        
        // Show success message
        alert('Falta registrada correctamente');
    } catch (error) {
        console.error('Error handling absence submission:', error);
        alert('Error al registrar la falta');
    }
}

/**
 * Open edit absence modal
 * @param {string} absenceId - Absence ID to edit
 */
async function editAbsence(absenceId) {
    try {
        const absence = await getAbsenceById(absenceId);
        if (!absence) return;
        
        // Fill form with absence data
        document.getElementById('editAbsenceId').value = absence.id;
        document.getElementById('editAbsenceType').value = absence.type;
        document.getElementById('editAbsenceCategory').value = absence.category;
        document.getElementById('editAbsenceSituation').value = absence.situation;
        document.getElementById('editAbsenceSanction').value = absence.sanction;
        document.getElementById('editAbsenceComments').value = absence.comments || '';
        
        // Open modal
        document.getElementById('editAbsenceModal').classList.add('modal--open');
    } catch (error) {
        console.error('Error editing absence:', error);
        alert('Error al cargar los datos de la falta');
    }
}

/**
 * Save edited absence
 */
async function saveEditAbsence() {
    try {
        const id = document.getElementById('editAbsenceId').value;
        const type = parseInt(document.getElementById('editAbsenceType').value);
        const category = document.getElementById('editAbsenceCategory').value.trim();
        const situation = document.getElementById('editAbsenceSituation').value.trim();
        const sanction = document.getElementById('editAbsenceSanction').value.trim();
        const comments = document.getElementById('editAbsenceComments').value.trim();
        
        // Validate input
        if (!type || !category || !situation || !sanction) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }
        
        // Get existing absence
        const absence = await getAbsenceById(id);
        if (!absence) return;
        
        // Update absence
        const updatedAbsence = {
            id: id,
            student_id: absence.student_id,
            course_id: absence.course_id,
            type: type,
            category: category,
            situation: situation,
            sanction: sanction,
            date: absence.date,
            comments: comments
        };
        
        const result = await updateAbsence(id, updatedAbsence);
        if (!result) {
            alert('Error al actualizar la falta');
            return;
        }
        
        // Close modal and refresh table
        closeEditAbsenceModal();
        await loadAbsencesTable();
    } catch (error) {
        console.error('Error saving edited absence:', error);
        alert('Error al actualizar la falta');
    }
}

/**
 * Close edit absence modal
 */
function closeEditAbsenceModal() {
    document.getElementById('editAbsenceModal').classList.remove('modal--open');
}

/**
 * Delete absence with confirmation
 * @param {string} absenceId - Absence ID to delete
 */
async function deleteAbsenceConfirm(absenceId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta falta?')) {
        try {
            const result = await deleteAbsence(absenceId);
            if (!result) {
                alert('Error al eliminar la falta');
                return;
            }
            
            await loadAbsencesTable();
        } catch (error) {
            console.error('Error deleting absence:', error);
            alert('Error al eliminar la falta');
        }
    }
}

/**
 * View student detail
 * @param {string} studentId - Student ID to view
 */
async function viewStudentDetail(studentId) {
    try {
        // In a real application, this would navigate to the student detail page
        // For now, we'll just show an alert with student information
        const student = await getStudentById(studentId);
        if (student) {
            alert(`Detalles del estudiante:\nNombre: ${student.name}\nEmail: ${student.email}`);
        }
    } catch (error) {
        console.error('Error viewing student detail:', error);
        alert('Error al cargar los datos del estudiante');
    }
}

/**
 * Filter absences table
 * @param {string} searchTerm - Search term to filter by
 */
function filterAbsencesTable(searchTerm) {
    const rows = document.querySelectorAll('#absencesTableBody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const student = row.cells[0].textContent.toLowerCase();
        const course = row.cells[1].textContent.toLowerCase();
        const type = row.cells[2].textContent.toLowerCase();
        const situation = row.cells[4].textContent.toLowerCase();
        
        if (student.includes(term) || course.includes(term) || type.includes(term) || situation.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Filter absences table by type
 * @param {string} type - Type to filter by
 */
function filterAbsencesTableByType(type) {
    const rows = document.querySelectorAll('#absencesTableBody tr');
    
    rows.forEach(row => {
        if (!type || row.cells[2].textContent === getAbsenceTypeLabel(parseInt(type))) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
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