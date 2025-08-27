/**
 * Teacher Dashboard Logic
 * REPORTE DE FALTAS IEVE
 */

// Global variables to store data
let allStudents = [];
let allCourses = [];
let allAbsences = [];

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
        
        // Load all data in parallel
        const [students, courses, absences] = await Promise.all([
            getAllStudents(),
            getAllCourses(),
            getAllAbsences()
        ]);
        
        // Store data in global variables
        allStudents = students;
        allCourses = courses;
        allAbsences = absences;
        
        // Load dropdowns
        loadStudentDropdown();
        loadCourseDropdown();
        
        // Load absences table
        loadAbsencesTable();
        
        // Update absence statistics
        updateAbsenceStats();
        
        // Update general absence statistics
        updateGeneralAbsenceStats();
        
        // Create absence chart
        updateAbsenceChart();
        
        // Display absence summary by course
        displayAbsenceSummaryByCourse();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showMessage('Error al inicializar el dashboard. Por favor, recarga la página.', 'error');
    }
}

/**
 * Load student dropdown
 */
function loadStudentDropdown() {
    try {
        const dropdown = document.getElementById('absenceStudent');
        
        // Clear existing options except the first one
        dropdown.innerHTML = '<option value="">Selecciona un estudiante</option>';
        
        // Add student options
        for (const student of allStudents) {
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
function loadCourseDropdown() {
    try {
        const dropdown = document.getElementById('absenceCourse');
        
        // Clear existing options except the first one
        dropdown.innerHTML = '<option value="">Selecciona un curso</option>';
        
        // Add course options
        for (const course of allCourses) {
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
function loadAbsencesTable(filteredAbsences = null) {
    try {
        const absences = filteredAbsences || allAbsences;
        const tableBody = document.getElementById('absencesTableBody');
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Sort absences by date (newest first)
        const sortedAbsences = sortAbsencesByDate([...absences]);
        
        // Add rows for each absence
        for (const absence of sortedAbsences) {
            const student = allStudents.find(s => s.id === absence.student_id);
            const course = allCourses.find(c => c.id === absence.course_id);
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${student ? student.name : 'Estudiante no encontrado'}</td>
                <td>${course ? course.name : 'Curso no encontrado'}</td>
                <td>${getAbsenceTypeLabel(absence.type)}</td>
                <td>${formatDate(absence.date)}</td>
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
    
    // Close student detail modal button
    document.getElementById('closeStudentDetailBtn').addEventListener('click', function() {
        document.getElementById('studentDetailModal').classList.remove('modal--open');
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
    
    // Absence search and filter
    document.getElementById('absenceSearch').addEventListener('input', function() {
        filterAbsences();
    });
    
    // Absence filter
    document.getElementById('absenceFilter').addEventListener('change', function() {
        filterAbsences();
    });
    
    // Student search
    document.getElementById('studentSearch').addEventListener('input', function() {
        filterStudents(this.value);
    });
    
    // Export to CSV button
    document.getElementById('exportCSV').addEventListener('click', exportAbsencesToCSV);
    
    // Filter by date range button
    document.getElementById('filterByDate').addEventListener('click', function() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const filteredAbsences = filterAbsencesByDateRange(startDate, endDate);
        loadAbsencesTable(filteredAbsences);
    });
    
    // Reset date filter button
    document.getElementById('resetDateFilter').addEventListener('click', resetDateFilter);
}

/**
 * Handle absence form submission
 * @param {Event} e - Form submission event
 */
async function handleAbsenceSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateAbsenceForm()) {
        return;
    }
    
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
            showMessage('Error al registrar la falta', 'error');
            return;
        }
        
        // Reset form
        document.getElementById('absenceForm').reset();
        
        // Add new absence to global data
        allAbsences.push(newAbsence);
        
        // Reload absences table
        loadAbsencesTable();
        
        // Update absence statistics
        updateAbsenceStats();
        
        // Update general absence statistics
        updateGeneralAbsenceStats();
        
        // Update absence chart
        updateAbsenceChart();
        
        // Display absence summary by course
        displayAbsenceSummaryByCourse();
        
        // Show success message
        showMessage('Falta registrada correctamente', 'success');
    } catch (error) {
        console.error('Error handling absence submission:', error);
        showMessage('Error al registrar la falta', 'error');
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
        showMessage('Error al cargar los datos de la falta', 'error');
    }
}

/**
 * Save edited absence
 */
async function saveEditAbsence() {
    // Validate form
    if (!validateEditAbsenceForm()) {
        return;
    }
    
    try {
        const id = document.getElementById('editAbsenceId').value;
        const type = parseInt(document.getElementById('editAbsenceType').value);
        const category = document.getElementById('editAbsenceCategory').value.trim();
        const situation = document.getElementById('editAbsenceSituation').value.trim();
        const sanction = document.getElementById('editAbsenceSanction').value.trim();
        const comments = document.getElementById('editAbsenceComments').value.trim();
        
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
            showMessage('Error al actualizar la falta', 'error');
            return;
        }
        
        // Close modal and refresh table
        closeEditAbsenceModal();
        
        // Update absence in global data
        const index = allAbsences.findIndex(a => a.id === id);
        if (index !== -1) {
            allAbsences[index] = updatedAbsence;
        }
        
        // Refresh table
        loadAbsencesTable();
        
        // Update absence statistics
        updateAbsenceStats();
        
        // Update general absence statistics
        updateGeneralAbsenceStats();
        
        // Update absence chart
        updateAbsenceChart();
        
        // Display absence summary by course
        displayAbsenceSummaryByCourse();
    } catch (error) {
        console.error('Error saving edited absence:', error);
        showMessage('Error al actualizar la falta', 'error');
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
    // In a real application, this would show a modal dialog
    // For now, we'll just use confirm but with a more descriptive message
    if (confirm('¿Estás seguro de que deseas eliminar esta falta? Esta acción no se puede deshacer.')) {
        try {
            const result = await deleteAbsence(absenceId);
            if (!result) {
                showMessage('Error al eliminar la falta', 'error');
                return;
            }
            
            // Remove absence from global data
            allAbsences = allAbsences.filter(a => a.id !== absenceId);
            
            // Refresh table
            loadAbsencesTable();
            
            // Update absence statistics
            updateAbsenceStats();
            
            // Update general absence statistics
            updateGeneralAbsenceStats();
            
            // Update absence chart
            updateAbsenceChart();
            
            // Display absence summary by course
            displayAbsenceSummaryByCourse();
        } catch (error) {
            console.error('Error deleting absence:', error);
            showMessage('Error al eliminar la falta', 'error');
        }
    }
}

/**
 * Show confirmation dialog before deleting absence
 * @param {string} absenceId - Absence ID to delete
 */
function confirmDeleteAbsence(absenceId) {
    // In a real application, this would show a modal dialog
    // For now, we'll just use confirm but with a more descriptive message
    if (confirm('¿Estás seguro de que deseas eliminar esta falta? Esta acción no se puede deshacer.')) {
        deleteAbsence(absenceId);
    }
}

/**
 * View student detail
 * @param {string} studentId - Student ID to view
 */
async function viewStudentDetail(studentId) {
    try {
        // Get student data
        const student = allStudents.find(s => s.id === studentId);
        if (!student) {
            showMessage('Estudiante no encontrado', 'error');
            return;
        }
        
        // Get student's course
        const course = allCourses.find(c => c.id === student.course_id);
        
        // Fill modal with student data
        document.getElementById('detailStudentName').textContent = student.name;
        document.getElementById('detailStudentEmail').textContent = student.email;
        document.getElementById('detailStudentCourse').textContent = course ? course.name : 'Curso no encontrado';
        document.getElementById('detailStudentEnrollmentDate').textContent = student.enrollment_date || '-';
        
        // Show total absences
        const totalAbsences = countStudentAbsences(studentId);
        document.getElementById('detailStudentTotalAbsences').textContent = totalAbsences;
        
        // Show absence summary
        const summary = getStudentAbsenceSummary(studentId);
        document.getElementById('detailStudentTardiness').textContent =
            `${summary.tardiness} (${summary.tardinessPercentage}%)`;
        document.getElementById('detailStudentJustified').textContent =
            `${summary.justified} (${summary.justifiedPercentage}%)`;
        document.getElementById('detailStudentUnjustified').textContent =
            `${summary.unjustified} (${summary.unjustifiedPercentage}%)`;
        
        // Load student's absences
        await loadStudentAbsences(studentId);
        
        // Open modal
        document.getElementById('studentDetailModal').classList.add('modal--open');
    } catch (error) {
        console.error('Error viewing student detail:', error);
        showMessage('Error al cargar los datos del estudiante', 'error');
    }
}

/**
 * Load student absences in the detail modal
 * @param {string} studentId - Student ID to load absences for
 */
async function loadStudentAbsences(studentId) {
    try {
        // Get student's absences
        const studentAbsences = allAbsences.filter(a => a.student_id === studentId);
        const tableBody = document.getElementById('studentAbsencesTableBody');
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Sort absences by date (newest first)
        const sortedAbsences = sortAbsencesByDate([...studentAbsences]);
        
        // Add rows for each absence
        for (const absence of sortedAbsences) {
            const course = allCourses.find(c => c.id === absence.course_id);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course ? course.name : 'Curso no encontrado'}</td>
                <td>${getAbsenceTypeLabel(absence.type)}</td>
                <td>${formatDate(absence.date)}</td>
                <td>${absence.situation}</td>
                <td>${absence.sanction}</td>
            `;
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading student absences:', error);
    }
}

/**
 * Filter absences by search term and type
 */
function filterAbsences() {
    const searchTerm = document.getElementById('absenceSearch').value.toLowerCase();
    const filterType = document.getElementById('absenceFilter').value;
    
    const filteredAbsences = allAbsences.filter(absence => {
        // Filter by type if selected
        if (filterType && absence.type != filterType) {
            return false;
        }
        
        // Filter by search term
        if (searchTerm) {
            const student = allStudents.find(s => s.id === absence.student_id);
            const course = allCourses.find(c => c.id === absence.course_id);
            const studentName = student ? student.name.toLowerCase() : '';
            const courseName = course ? course.name.toLowerCase() : '';
            const typeLabel = getAbsenceTypeLabel(absence.type).toLowerCase();
            const situation = absence.situation.toLowerCase();
            
            if (!studentName.includes(searchTerm) &&
                !courseName.includes(searchTerm) &&
                !typeLabel.includes(searchTerm) &&
                !situation.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    loadAbsencesTable(filteredAbsences);
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
    // In a real application, this would show a message in a designated HTML element
    // For now, we'll just use alert but with a more descriptive message
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)}: ${message}`);
}

/**
 * Validate absence form
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateAbsenceForm() {
    const studentId = document.getElementById('absenceStudent').value;
    const courseId = document.getElementById('absenceCourse').value;
    const type = document.getElementById('absenceType').value;
    const date = document.getElementById('absenceDate').value;
    const category = document.getElementById('absenceCategory').value.trim();
    const situation = document.getElementById('absenceSituation').value.trim();
    const sanction = document.getElementById('absenceSanction').value.trim();
    
    // Check required fields
    if (!studentId) {
        showMessage('Por favor selecciona un estudiante', 'error');
        return false;
    }
    
    if (!courseId) {
        showMessage('Por favor selecciona un curso', 'error');
        return false;
    }
    
    if (!type) {
        showMessage('Por favor selecciona un tipo de falta', 'error');
        return false;
    }
    
    if (!date) {
        showMessage('Por favor ingresa una fecha', 'error');
        return false;
    }
    
    if (!category) {
        showMessage('Por favor ingresa una categoría', 'error');
        return false;
    }
    
    if (!situation) {
        showMessage('Por favor ingresa una situación', 'error');
        return false;
    }
    
    if (!sanction) {
        showMessage('Por favor ingresa una sanción', 'error');
        return false;
    }
    
    return true;
}

/**
 * Validate edit absence form
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateEditAbsenceForm() {
    const type = document.getElementById('editAbsenceType').value;
    const category = document.getElementById('editAbsenceCategory').value.trim();
    const situation = document.getElementById('editAbsenceSituation').value.trim();
    const sanction = document.getElementById('editAbsenceSanction').value.trim();
    
    // Check required fields
    if (!type) {
        showMessage('Por favor selecciona un tipo de falta', 'error');
        return false;
    }
    
    if (!category) {
        showMessage('Por favor ingresa una categoría', 'error');
        return false;
    }
    
    if (!situation) {
        showMessage('Por favor ingresa una situación', 'error');
        return false;
    }
    
    if (!sanction) {
        showMessage('Por favor ingresa una sanción', 'error');
        return false;
    }
    
    
    return true;
}

/**
 * Format date for display
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
function formatDate(dateStr) {
    if (!dateStr) return '-';
    
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

/**
 * Sort absences by date (newest first)
 * @param {Array} absences - Array of absences to sort
 * @returns {Array} Sorted array of absences
 */
function sortAbsencesByDate(absences) {
    return absences.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
}

/**
 * Count student absences
 * @param {string} studentId - Student ID to count absences for
 * @returns {number} Number of absences for the student
 */
function countStudentAbsences(studentId) {
    return allAbsences.filter(a => a.student_id === studentId).length;
}

/**
 * Calculate absence statistics by type
 * @returns {Object} Object containing counts for each absence type
 */
function calculateAbsenceStats() {
    const stats = {
        tardiness: 0,
        justified: 0,
        unjustified: 0
    };
    
    for (const absence of allAbsences) {
        switch (absence.type) {
            case 1:
                stats.tardiness++;
                break;
            case 2:
                stats.justified++;
                break;
            case 3:
                stats.unjustified++;
                break;
        }
    }
    
    return stats;
}

/**
 * Update absence statistics display
 */
function updateAbsenceStats() {
    const stats = calculateAbsenceStats();
    document.getElementById('tardinessCount').textContent = stats.tardiness;
    document.getElementById('justifiedCount').textContent = stats.justified;
    document.getElementById('unjustifiedCount').textContent = stats.unjustified;
}

/**
 * Filter students in dropdown by name
 * @param {string} searchTerm - Term to search for
 */
function filterStudents(searchTerm) {
    const dropdown = document.getElementById('absenceStudent');
    const term = searchTerm.toLowerCase();
    
    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">Selecciona un estudiante</option>';
    
    // Add matching student options
    for (const student of allStudents) {
        if (student.name.toLowerCase().includes(term)) {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            dropdown.appendChild(option);
        }
    }
}

/**
 * Export absences to CSV
 */
function exportAbsencesToCSV() {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Estudiante,Curso,Tipo,Fecha,Categoría,Situación,Sanción,Comentarios\n";
    
    // Add absence data
    for (const absence of allAbsences) {
        const student = allStudents.find(s => s.id === absence.student_id);
        const course = allCourses.find(c => c.id === absence.course_id);
        const typeLabel = getAbsenceTypeLabel(absence.type);
        
        // Escape commas and quotes in data
        const rowData = [
            student ? `"${student.name.replace(/"/g, '""')}"` : '"Estudiante no encontrado"',
            course ? `"${course.name.replace(/"/g, '""')}"` : '"Curso no encontrado"',
            `"${typeLabel.replace(/"/g, '""')}"`,
            `"${absence.date}"`,
            `"${absence.category.replace(/"/g, '""')}"`,
            `"${absence.situation.replace(/"/g, '""')}"`,
            `"${absence.sanction.replace(/"/g, '""')}"`,
            `"${absence.comments.replace(/"/g, '""')}"`,
        ];
        
        csvContent += rowData.join(",") + "\n";
    }
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "faltas.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
}

/**
 * Get absence summary for a student
 * @param {string} studentId - Student ID to get summary for
 * @returns {Object} Object containing absence summary
 */
function getStudentAbsenceSummary(studentId) {
    const studentAbsences = allAbsences.filter(a => a.student_id === studentId);
    
    const summary = {
        total: studentAbsences.length,
        tardiness: 0,
        justified: 0,
        unjustified: 0
    };
    
    for (const absence of studentAbsences) {
        switch (absence.type) {
            case 1:
                summary.tardiness++;
                break;
            case 2:
                summary.justified++;
                break;
            case 3:
                summary.unjustified++;
                break;
        }
    }
    
    // Add percentages
    summary.tardinessPercentage = calculatePercentage(summary.tardiness, summary.total);
    summary.justifiedPercentage = calculatePercentage(summary.justified, summary.total);
    summary.unjustifiedPercentage = calculatePercentage(summary.unjustified, summary.total);
    
    return summary;
}

/**
 * Calculate percentage
 * @param {number} part - Part value
 * @param {number} total - Total value
 * @returns {number} Percentage value
 */
function calculatePercentage(part, total) {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
}

/**
 * Update general absence statistics display
 */
function updateGeneralAbsenceStats() {
    const stats = calculateGeneralAbsenceStats();
    document.getElementById('totalAbsences').textContent = stats.totalAbsences;
    document.getElementById('totalStudents').textContent = stats.totalStudents;
    document.getElementById('averageAbsences').textContent = stats.averageAbsences;
    document.getElementById('studentWithMostAbsences').textContent =
        stats.studentWithMostAbsences ? stats.studentWithMostAbsences.name : '-';
    document.getElementById('maxAbsencesCount').textContent =
        `${stats.maxAbsences} faltas`;
}

/**
 * Create or update absence chart
 */
function updateAbsenceChart() {
    const ctx = document.getElementById('absenceChart').getContext('2d');
    
    // Calculate absence statistics
    const stats = calculateAbsenceStats();
    
    // Destroy existing chart if it exists
    if (window.absenceChart) {
        window.absenceChart.destroy();
    }
    
    // Create new chart
    window.absenceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Tardanzas', 'Ausencias Justificadas', 'Ausencias Injustificadas'],
            datasets: [{
                label: 'Número de Faltas',
                data: [stats.tardiness, stats.justified, stats.unjustified],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

/**
 * Filter absences by date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Array} Filtered absences
 */
function filterAbsencesByDateRange(startDate, endDate) {
    if (!startDate || !endDate) {
        return allAbsences;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return allAbsences.filter(absence => {
        const absenceDate = new Date(absence.date);
        return absenceDate >= start && absenceDate <= end;
    });
}

/**
 * Reset date filter and show all absences
 */
function resetDateFilter() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    loadAbsencesTable();
}

/**
 * Get absence summary by course
 * @returns {Object} Object containing absence summary by course
 */
function getAbsenceSummaryByCourse() {
    const summary = {};
    
    // Initialize summary for each course
    for (const course of allCourses) {
        summary[course.id] = {
            name: course.name,
            total: 0,
            tardiness: 0,
            justified: 0,
            unjustified: 0
        };
    }
    
    // Count absences by course and type
    for (const absence of allAbsences) {
        const courseSummary = summary[absence.course_id];
        if (courseSummary) {
            courseSummary.total++;
            switch (absence.type) {
                case 1:
                    courseSummary.tardiness++;
                    break;
                case 2:
                    courseSummary.justified++;
                    break;
                case 3:
                    courseSummary.unjustified++;
                    break;
            }
        }
    }
    
    return summary;
}

/**
 * Display absence summary by course in a table
 */
function displayAbsenceSummaryByCourse() {
    const summary = getAbsenceSummaryByCourse();
    const tableBody = document.getElementById('courseSummaryTableBody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add rows for each course
    for (const courseId in summary) {
        const courseSummary = summary[courseId];
        
        // Only show courses with absences
        if (courseSummary.total > 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${courseSummary.name}</td>
                <td>${courseSummary.total}</td>
                <td>${courseSummary.tardiness}</td>
                <td>${courseSummary.justified}</td>
                <td>${courseSummary.unjustified}</td>
            `;
            tableBody.appendChild(row);
        }
    }
}

/**
 * Calculate general absence statistics
 * @returns {Object} Object containing general absence statistics
 */
function calculateGeneralAbsenceStats() {
    const totalAbsences = allAbsences.length;
    const totalStudents = allStudents.length;
    
    // Calculate average absences per student
    const averageAbsences = totalStudents > 0 ? (totalAbsences / totalStudents).toFixed(2) : 0;
    
    // Find student with most absences
    let maxAbsences = 0;
    let studentWithMostAbsences = null;
    
    for (const student of allStudents) {
        const studentAbsences = allAbsences.filter(a => a.student_id === student.id);
        if (studentAbsences.length > maxAbsences) {
            maxAbsences = studentAbsences.length;
            studentWithMostAbsences = student;
        }
    }
    
    return {
        totalAbsences,
        totalStudents,
        averageAbsences,
        studentWithMostAbsences,
        maxAbsences
    };
}