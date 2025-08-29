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

    // Set up auto-refresh (every 5 minutes)
    setupAutoRefresh();
});

/**
 * Initialize the teacher dashboard
 */
async function initializeDashboard() {
    try {
        // Check backend connectivity first
        await checkBackendConnectivity();

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('absenceDate').value = today;

        // Show loading message
        showMessage('Cargando datos del dashboard...', 'info');

        // Load all data in parallel with error handling
        const [students, courses, absences] = await Promise.allSettled([
            dataManager.getAllStudents(),
            dataManager.getAllCourses(),
            dataManager.getAllAbsences()
        ]);

        // Handle results and collect errors
        const errors = [];
        allStudents = students.status === 'fulfilled' ? students.value : [];
        allCourses = courses.status === 'fulfilled' ? courses.value : [];
        allAbsences = absences.status === 'fulfilled' ? absences.value : [];

        if (students.status === 'rejected') errors.push('estudiantes');
        if (courses.status === 'rejected') errors.push('cursos');
        if (absences.status === 'rejected') errors.push('faltas');

        if (errors.length > 0) {
            showMessage(`Error al cargar: ${errors.join(', ')}. Algunos datos pueden no estar disponibles.`, 'error');
        }

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

        // Show success message if everything loaded
        if (errors.length === 0) {
            showMessage('Dashboard cargado correctamente', 'success');
        }

    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showMessage('Error al conectar con el servidor. Por favor, verifica que el backend esté ejecutándose.', 'error');
    }
}

/**
 * Check backend connectivity
 */
async function checkBackendConnectivity() {
    try {
        const response = await fetch('http://localhost:3000/api/health', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status !== 'OK') {
            throw new Error('Backend responded but is not healthy');
        }

        return true;
    } catch (error) {
        console.error('Backend connectivity check failed:', error);
        throw new Error('No se puede conectar al servidor backend. Por favor, verifica que esté ejecutándose en localhost:3000');
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
        if (allStudents.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay estudiantes disponibles';
            option.disabled = true;
            dropdown.appendChild(option);
        } else {
            for (const student of allStudents) {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = student.name;
                dropdown.appendChild(option);
            }
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
        if (allCourses.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay cursos disponibles';
            option.disabled = true;
            dropdown.appendChild(option);
        } else {
            for (const course of allCourses) {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.name;
                dropdown.appendChild(option);
            }
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
        if (sortedAbsences.length === 0) {
            // Show empty state
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">
                    <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">📝 No hay faltas registradas</div>
                    <div style="font-size: 0.9rem;">Registra tu primera falta usando el formulario de arriba</div>
                </td>
            `;
            tableBody.appendChild(emptyRow);
        } else {
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

    // Modal close button functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal__close')) {
            const modal = e.target.closest('.modal');
            modal.classList.remove('modal--open');
        }
    });

    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('modal--open');
        }
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

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + F for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            document.getElementById('absenceSearch').focus();
        }

        // Ctrl/Cmd + R for refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            refreshDashboard();
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal--open');
            openModals.forEach(modal => modal.classList.remove('modal--open'));
        }
    });

    // Refresh dashboard button
    document.getElementById('refreshDashboard').addEventListener('click', refreshDashboard);

    // Help button
    document.getElementById('helpBtn').addEventListener('click', function() {
        document.getElementById('helpModal').classList.add('modal--open');
    });

    // Close help modal button
    document.getElementById('closeHelpBtn').addEventListener('click', function() {
        document.getElementById('helpModal').classList.remove('modal--open');
    });
    
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
 * Set up auto-refresh functionality
 */
function setupAutoRefresh() {
    // Auto-refresh every 5 minutes (300000 milliseconds)
    setInterval(async () => {
        try {
            await refreshDashboardData();
        } catch (error) {
            console.error('Auto-refresh failed:', error);
            // Don't show error message for auto-refresh to avoid spam
        }
    }, 300000);
}

/**
 * Refresh dashboard data
 */
async function refreshDashboard() {
    const refreshBtn = document.getElementById('refreshDashboard');
    const refreshIcon = document.getElementById('refreshIcon');
    const originalIcon = refreshIcon.textContent;

    // Show loading state
    refreshBtn.disabled = true;
    refreshIcon.classList.add('refresh-rotating');

    try {
        await refreshDashboardData();
        showMessage('Datos actualizados correctamente', 'success');
    } catch (error) {
        console.error('Manual refresh failed:', error);
        showMessage('Error al actualizar los datos', 'error');
    } finally {
        // Restore button state
        refreshBtn.disabled = false;
        refreshIcon.classList.remove('refresh-rotating');
    }
}

/**
 * Refresh dashboard data from server
 */
async function refreshDashboardData() {
    // Load all data in parallel
    const [students, courses, absences] = await Promise.allSettled([
        dataManager.getAllStudents(),
        dataManager.getAllCourses(),
        dataManager.getAllAbsences()
    ]);

    // Update global data
    if (students.status === 'fulfilled') allStudents = students.value;
    if (courses.status === 'fulfilled') allCourses = courses.value;
    if (absences.status === 'fulfilled') allAbsences = absences.value;

    // Refresh UI components
    loadStudentDropdown();
    loadCourseDropdown();
    loadAbsencesTable();
    updateAbsenceStats();
    updateGeneralAbsenceStats();
    updateAbsenceChart();
    displayAbsenceSummaryByCourse();
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

    // Show loading state
    const submitBtn = document.querySelector('#absenceForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span style="display: inline-block; width: 16px; height: 16px; border: 2px solid #ffffff; border-radius: 50%; border-top-color: transparent; animation: spin 1s ease-in-out infinite; margin-right: 8px;"></span>Registrando...';

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
        const result = await dataManager.createAbsence(newAbsence);
        if (!result) {
            throw new Error('Error al guardar la falta en la base de datos');
        }

        // Reset form
        document.getElementById('absenceForm').reset();
        clearFormValidationErrors();

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

        // Reset date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('absenceDate').value = today;

    } catch (error) {
        console.error('Error handling absence submission:', error);
        showMessage(error.message || 'Error al registrar la falta. Por favor, inténtalo de nuevo.', 'error');
    } finally {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

/**
 * Open edit absence modal
 * @param {string} absenceId - Absence ID to edit
 */
async function editAbsence(absenceId) {
    try {
        const absence = await dataManager.getAbsenceById(absenceId);
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

    // Show loading state
    const saveBtn = document.getElementById('saveEditAbsenceBtn');
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span style="display: inline-block; width: 16px; height: 16px; border: 2px solid #ffffff; border-radius: 50%; border-top-color: transparent; animation: spin 1s ease-in-out infinite; margin-right: 8px;"></span>Guardando...';

    try {
        const id = document.getElementById('editAbsenceId').value;
        const type = parseInt(document.getElementById('editAbsenceType').value);
        const category = document.getElementById('editAbsenceCategory').value.trim();
        const situation = document.getElementById('editAbsenceSituation').value.trim();
        const sanction = document.getElementById('editAbsenceSanction').value.trim();
        const comments = document.getElementById('editAbsenceComments').value.trim();

        // Get existing absence
        const absence = await dataManager.getAbsenceById(id);
        if (!absence) {
            throw new Error('No se pudo encontrar la falta a actualizar');
        }

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

        const result = await dataManager.updateAbsence(id, updatedAbsence);
        if (!result) {
            throw new Error('Error al actualizar la falta en la base de datos');
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

        // Show success message
        showMessage('Falta actualizada correctamente', 'success');

    } catch (error) {
        console.error('Error saving edited absence:', error);
        showMessage(error.message || 'Error al actualizar la falta. Por favor, inténtalo de nuevo.', 'error');
    } finally {
        // Restore button state
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
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
            const result = await dataManager.deleteAbsence(absenceId);
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
        dataManager.deleteAbsence(absenceId);
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
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course ? course.name : 'Curso no encontrado'}</td>
                <td>${getAbsenceTypeLabel(absence.type)}</td>
                <td>${formatDate(absence.date)}</td>
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

/**
 * Validate absence form
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateAbsenceForm() {
    // Clear previous validation errors
    clearFormValidationErrors();

    const studentId = document.getElementById('absenceStudent').value;
    const courseId = document.getElementById('absenceCourse').value;
    const type = document.getElementById('absenceType').value;
    const date = document.getElementById('absenceDate').value;
    const category = document.getElementById('absenceCategory').value.trim();
    const situation = document.getElementById('absenceSituation').value.trim();
    const sanction = document.getElementById('absenceSanction').value.trim();

    let isValid = true;
    let firstInvalidField = null;

    // Check required fields
    if (!studentId) {
        showFieldError('absenceStudent', 'Por favor selecciona un estudiante');
        if (!firstInvalidField) firstInvalidField = 'absenceStudent';
        isValid = false;
    }

    if (!courseId) {
        showFieldError('absenceCourse', 'Por favor selecciona un curso');
        if (!firstInvalidField) firstInvalidField = 'absenceCourse';
        isValid = false;
    }

    if (!type) {
        showFieldError('absenceType', 'Por favor selecciona un tipo de falta');
        if (!firstInvalidField) firstInvalidField = 'absenceType';
        isValid = false;
    }

    if (!date) {
        showFieldError('absenceDate', 'Por favor ingresa una fecha');
        if (!firstInvalidField) firstInvalidField = 'absenceDate';
        isValid = false;
    } else {
        // Validate date is not in the future
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            showFieldError('absenceDate', 'La fecha no puede ser futura');
            if (!firstInvalidField) firstInvalidField = 'absenceDate';
            isValid = false;
        }
    }

    if (!category || category.length < 2) {
        showFieldError('absenceCategory', 'Por favor ingresa una categoría (mínimo 2 caracteres)');
        if (!firstInvalidField) firstInvalidField = 'absenceCategory';
        isValid = false;
    }

    if (!situation || situation.length < 5) {
        showFieldError('absenceSituation', 'Por favor ingresa una situación detallada (mínimo 5 caracteres)');
        if (!firstInvalidField) firstInvalidField = 'absenceSituation';
        isValid = false;
    }

    if (!sanction || sanction.length < 3) {
        showFieldError('absenceSanction', 'Por favor ingresa una sanción (mínimo 3 caracteres)');
        if (!firstInvalidField) firstInvalidField = 'absenceSanction';
        isValid = false;
    }

    // Focus on first invalid field
    if (firstInvalidField) {
        const field = document.getElementById(firstInvalidField);
        if (field) {
            field.focus();
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid;
}

/**
 * Show validation error for a specific field
 * @param {string} fieldId - ID of the field
 * @param {string} message - Error message
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Add error class to field
    field.classList.add('form-control--error');

    // Create or update error message
    let errorEl = field.parentNode.querySelector('.field-error');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        errorEl.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 4px;
            font-weight: 500;
        `;
        field.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;

    // Remove error after 5 seconds if field is corrected
    field.addEventListener('input', function clearError() {
        field.classList.remove('form-control--error');
        if (errorEl) errorEl.remove();
        field.removeEventListener('input', clearError);
    });
}

/**
 * Clear all form validation errors
 */
function clearFormValidationErrors() {
    // Remove error classes
    document.querySelectorAll('.form-control--error').forEach(el => {
        el.classList.remove('form-control--error');
    });

    // Remove error messages
    document.querySelectorAll('.field-error').forEach(el => {
        el.remove();
    });
}

/**
 * Validate edit absence form
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateEditAbsenceForm() {
    // Clear previous validation errors
    clearEditFormValidationErrors();

    const type = document.getElementById('editAbsenceType').value;
    const category = document.getElementById('editAbsenceCategory').value.trim();
    const situation = document.getElementById('editAbsenceSituation').value.trim();
    const sanction = document.getElementById('editAbsenceSanction').value.trim();

    let isValid = true;
    let firstInvalidField = null;

    // Check required fields
    if (!type) {
        showFieldError('editAbsenceType', 'Por favor selecciona un tipo de falta');
        if (!firstInvalidField) firstInvalidField = 'editAbsenceType';
        isValid = false;
    }

    if (!category || category.length < 2) {
        showFieldError('editAbsenceCategory', 'Por favor ingresa una categoría (mínimo 2 caracteres)');
        if (!firstInvalidField) firstInvalidField = 'editAbsenceCategory';
        isValid = false;
    }

    if (!situation || situation.length < 5) {
        showFieldError('editAbsenceSituation', 'Por favor ingresa una situación detallada (mínimo 5 caracteres)');
        if (!firstInvalidField) firstInvalidField = 'editAbsenceSituation';
        isValid = false;
    }

    if (!sanction || sanction.length < 3) {
        showFieldError('editAbsenceSanction', 'Por favor ingresa una sanción (mínimo 3 caracteres)');
        if (!firstInvalidField) firstInvalidField = 'editAbsenceSanction';
        isValid = false;
    }

    // Focus on first invalid field
    if (firstInvalidField) {
        const field = document.getElementById(firstInvalidField);
        if (field) {
            field.focus();
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid;
}

/**
 * Clear all edit form validation errors
 */
function clearEditFormValidationErrors() {
    // Remove error classes
    document.querySelectorAll('#editAbsenceModal .form-control--error').forEach(el => {
        el.classList.remove('form-control--error');
    });

    // Remove error messages
    document.querySelectorAll('#editAbsenceModal .field-error').forEach(el => {
        el.remove();
    });
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
    try {
        if (allAbsences.length === 0) {
            showMessage('No hay faltas para exportar', 'error');
            return;
        }

        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Estudiante,Curso,Tipo,Fecha,Categoría,Situación,Sanción,Comentarios\n";

        // Add absence data
        for (const absence of allAbsences) {
            const student = allStudents.find(s => s.id === absence.student_id);
            const course = allCourses.find(c => c.id === absence.course_id);
            const typeLabel = getAbsenceTypeLabel(absence.type);

            // Escape commas and quotes in data, handle empty values
            const escapeCSV = (value) => {
                if (value == null || value === undefined) return '""';
                const stringValue = String(value);
                return `"${stringValue.replace(/"/g, '""')}"`;
            };

            const rowData = [
                student ? escapeCSV(student.name) : '"Estudiante no encontrado"',
                course ? escapeCSV(course.name) : '"Curso no encontrado"',
                escapeCSV(typeLabel),
                escapeCSV(absence.date),
                escapeCSV(absence.category),
                escapeCSV(absence.situation),
                escapeCSV(absence.sanction),
                escapeCSV(absence.comments)
            ];

            csvContent += rowData.join(",") + "\n";
        }

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);

        // Generate filename with current date
        const today = new Date().toISOString().split('T')[0];
        link.setAttribute("download", `faltas_${today}.csv`);
        document.body.appendChild(link);

        // Trigger download
        link.click();

        // Clean up
        document.body.removeChild(link);

        showMessage(`Se exportaron ${allAbsences.length} faltas correctamente`, 'success');

    } catch (error) {
        console.error('Error exporting CSV:', error);
        showMessage('Error al exportar las faltas a CSV', 'error');
    }
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
    try {
        const ctx = document.getElementById('absenceChart');
        if (!ctx) {
            console.warn('Chart canvas element not found');
            return;
        }
        
        const ctx2d = ctx.getContext('2d');
        if (!ctx2d) {
            console.warn('Unable to get 2D context for chart');
            return;
        }
        
        // Calculate absence statistics
        const stats = calculateAbsenceStats();
        
        // Destroy existing chart if it exists
        if (window.absenceChart) {
            window.absenceChart.destroy();
        }
        
        // Create new chart
        window.absenceChart = new Chart(ctx2d, {
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
                            stepSize: 1,
                            precision: 0
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    } catch (error) {
        console.error('Error creating absence chart:', error);
        // Show error message in chart container
        const chartContainer = document.getElementById('absenceChart')?.parentElement;
        if (chartContainer) {
            chartContainer.innerHTML = '<p class="text-error text-center">Error al cargar el gráfico</p>';
        }
    }
}

/**
 * Filter absences by date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Array} Filtered absences
 */
function filterAbsencesByDateRange(startDate, endDate) {
    if (!startDate || !endDate) {
        showMessage('Por favor selecciona ambas fechas para filtrar', 'error');
        return allAbsences;
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
        showMessage('La fecha de inicio no puede ser posterior a la fecha de fin', 'error');
        return allAbsences;
    }

    const filteredAbsences = allAbsences.filter(absence => {
        const absenceDate = new Date(absence.date);
        return absenceDate >= start && absenceDate <= end;
    });

    showMessage(`Se encontraron ${filteredAbsences.length} faltas en el rango de fechas seleccionado`, 'info');
    return filteredAbsences;
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