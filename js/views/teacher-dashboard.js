/**
 * Teacher Dashboard Logic
 * REPORTE DE FALTAS IEVE
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated and is teacher
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the teacher dashboard
 */
function initializeDashboard() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('absenceDate').value = today;
    
    // Load dropdowns
    loadStudentDropdown();
    loadCourseDropdown();
    
    // Load absences table
    loadAbsencesTable();
}

/**
 * Load student dropdown
 */
function loadStudentDropdown() {
    const students = getAllStudents();
    const dropdown = document.getElementById('absenceStudent');
    
    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">Selecciona un estudiante</option>';
    
    // Add student options
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        dropdown.appendChild(option);
    });
}

/**
 * Load course dropdown
 */
function loadCourseDropdown() {
    const courses = getAllCourses();
    const dropdown = document.getElementById('absenceCourse');
    
    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">Selecciona un curso</option>';
    
    // Add course options
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        dropdown.appendChild(option);
    });
}

/**
 * Load absences table
 */
function loadAbsencesTable() {
    const absences = getAllAbsences();
    const students = getAllStudents();
    const courses = getAllCourses();
    const tableBody = document.getElementById('absencesTableBody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add rows for each absence
    absences.forEach(absence => {
        const student = students.find(s => s.id === absence.studentId);
        const course = courses.find(c => c.id === absence.courseId);
        
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
                <button class="table__action-btn table__action-btn--view" data-view="${absence.studentId}">
                    Ver Detalle
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
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
function handleAbsenceSubmit(e) {
    e.preventDefault();
    
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
        studentId: studentId,
        courseId: courseId,
        type: type,
        category: category,
        situation: situation,
        sanction: sanction,
        date: date,
        comments: comments
    };
    
    // Save absence
    createAbsence(newAbsence);
    
    // Reset form
    document.getElementById('absenceForm').reset();
    
    // Reload absences table
    loadAbsencesTable();
    
    // Show success message
    alert('Falta registrada correctamente');
}

/**
 * Open edit absence modal
 * @param {string} absenceId - Absence ID to edit
 */
function editAbsence(absenceId) {
    const absence = getAbsenceById(absenceId);
    if (!absence) return;
    
    // Fill form with absence data
    document.getElementById('editAbsenceId').value = absence.id;
    document.getElementById('editAbsenceType').value = absence.type;
    document.getElementById('editAbsenceCategory').value = absence.category;
    document.getElementById('editAbsenceSituation').value = absence.situation;
    document.getElementById('editAbsenceSanction').value = absence.sanction;
    document.getElementById('editAbsenceComments').value = absence.comments;
    
    // Open modal
    document.getElementById('editAbsenceModal').classList.add('modal--open');
}

/**
 * Save edited absence
 */
function saveEditAbsence() {
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
    const absence = getAbsenceById(id);
    if (!absence) return;
    
    // Update absence
    const updatedAbsence = {
        id: id,
        studentId: absence.studentId,
        courseId: absence.courseId,
        type: type,
        category: category,
        situation: situation,
        sanction: sanction,
        date: absence.date,
        comments: comments
    };
    
    updateAbsence(id, updatedAbsence);
    
    // Close modal and refresh table
    closeEditAbsenceModal();
    loadAbsencesTable();
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
function deleteAbsenceConfirm(absenceId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta falta?')) {
        deleteAbsence(absenceId);
        loadAbsencesTable();
    }
}

/**
 * View student detail
 * @param {string} studentId - Student ID to view
 */
function viewStudentDetail(studentId) {
    // In a real application, this would navigate to the student detail page
    // For now, we'll just show an alert with student information
    const student = getStudentById(studentId);
    if (student) {
        alert(`Detalles del estudiante:\nNombre: ${student.name}\nEmail: ${student.email}`);
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
 * Get all students from storage
 * @returns {Array} Array of student objects
 */
function getAllStudents() {
    return JSON.parse(localStorage.getItem('ieve_students')) || [];
}

/**
 * Get student by ID
 * @param {string} id - Student ID
 * @returns {Object|null} Student object or null if not found
 */
function getStudentById(id) {
    const students = getAllStudents();
    return students.find(student => student.id === id) || null;
}

/**
 * Get all courses from storage
 * @returns {Array} Array of course objects
 */
function getAllCourses() {
    return JSON.parse(localStorage.getItem('ieve_courses')) || [];
}

/**
 * Get all absences from storage
 * @returns {Array} Array of absence objects
 */
function getAllAbsences() {
    return JSON.parse(localStorage.getItem('ieve_absences')) || [];
}

/**
 * Get absence by ID
 * @param {string} id - Absence ID
 * @returns {Object|null} Absence object or null if not found
 */
function getAbsenceById(id) {
    const absences = getAllAbsences();
    return absences.find(absence => absence.id === id) || null;
}

/**
 * Create a new absence
 * @param {Object} absence - Absence object to create
 */
function createAbsence(absence) {
    const absences = getAllAbsences();
    absences.push(absence);
    localStorage.setItem('ieve_absences', JSON.stringify(absences));
}

/**
 * Update absence by ID
 * @param {string} id - Absence ID
 * @param {Object} updatedAbsence - Updated absence object
 */
function updateAbsence(id, updatedAbsence) {
    const absences = getAllAbsences();
    const index = absences.findIndex(absence => absence.id === id);
    if (index !== -1) {
        absences[index] = updatedAbsence;
        localStorage.setItem('ieve_absences', JSON.stringify(absences));
    }
}

/**
 * Delete absence by ID
 * @param {string} id - Absence ID
 */
function deleteAbsence(id) {
    const absences = getAllAbsences();
    const filteredAbsences = absences.filter(absence => absence.id !== id);
    localStorage.setItem('ieve_absences', JSON.stringify(filteredAbsences));
}