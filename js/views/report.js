/**
 * Report Generation Logic
 * REPORTE DE FALTAS IEVE
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize report page
    initializeReport();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the report page
 */
function initializeReport() {
    // Load dropdowns
    loadCourseDropdown();
    loadStudentDropdown();
    
    // Set default date range (last 30 days)
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);
    
    document.getElementById('dateTo').value = today.toISOString().split('T')[0];
    document.getElementById('dateFrom').value = lastMonth.toISOString().split('T')[0];
}

/**
 * Load course dropdown
 */
function loadCourseDropdown() {
    const courses = getAllCourses();
    const dropdown = document.getElementById('reportCourse');
    
    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">Todos los cursos</option>';
    
    // Add course options
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        dropdown.appendChild(option);
    });
}

/**
 * Load student dropdown
 */
function loadStudentDropdown() {
    const students = getAllStudents();
    const dropdown = document.getElementById('reportStudent');
    
    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">Todos los estudiantes</option>';
    
    // Add student options
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        dropdown.appendChild(option);
    });
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Report form submission
    document.getElementById('reportForm').addEventListener('submit', generateReport);
    
    // Print report button
    document.getElementById('printReportBtn').addEventListener('click', printReport);
    
    // Form reset
    document.getElementById('reportForm').addEventListener('reset', function() {
        // Hide report sections
        document.getElementById('reportSummary').style.display = 'none';
        document.getElementById('reportTable').style.display = 'none';
    });
}

/**
 * Generate report based on filters
 * @param {Event} e - Form submission event
 */
function generateReport(e) {
    e.preventDefault();
    
    // Get filter values
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const courseId = document.getElementById('reportCourse').value;
    const studentId = document.getElementById('reportStudent').value;
    const type = document.getElementById('reportType').value;
    const situation = document.getElementById('reportSituation').value;
    
    // Get all absences
    let absences = getAllAbsences();
    
    // Apply date filter
    if (dateFrom) {
        absences = absences.filter(absence => absence.date >= dateFrom);
    }
    
    if (dateTo) {
        absences = absences.filter(absence => absence.date <= dateTo);
    }
    
    // Apply course filter
    if (courseId) {
        absences = absences.filter(absence => absence.courseId === courseId);
    }
    
    // Apply student filter
    if (studentId) {
        absences = absences.filter(absence => absence.studentId === studentId);
    }
    
    // Apply type filter
    if (type) {
        absences = absences.filter(absence => absence.type == type);
    }
    
    // Apply situation filter
    if (situation) {
        absences = absences.filter(absence => absence.situation === situation);
    }
    
    // Display report
    displayReport(absences);
}

/**
 * Display report with filtered absences
 * @param {Array} absences - Filtered absences to display
 */
function displayReport(absences) {
    // Show report sections
    document.getElementById('reportSummary').style.display = 'block';
    document.getElementById('reportTable').style.display = 'block';
    
    // Calculate statistics
    const totalAbsences = absences.length;
    const tardinessCount = absences.filter(a => a.type === 1).length;
    const justifiedCount = absences.filter(a => a.type === 2).length;
    const unjustifiedCount = absences.filter(a => a.type === 3).length;
    
    // Update summary statistics
    document.getElementById('totalAbsences').textContent = totalAbsences;
    document.getElementById('tardinessCount').textContent = tardinessCount;
    document.getElementById('justifiedCount').textContent = justifiedCount;
    document.getElementById('unjustifiedCount').textContent = unjustifiedCount;
    
    // Update chart
    updateChart(totalAbsences, tardinessCount, justifiedCount, unjustifiedCount);
    
    // Load absences table
    loadAbsencesTable(absences);
}

/**
 * Update chart with statistics
 * @param {number} total - Total absences
 * @param {number} tardiness - Tardiness count
 * @param {number} justified - Justified absences count
 * @param {number} unjustified - Unjustified absences count
 */
function updateChart(total, tardiness, justified, unjustified) {
    if (total === 0) {
        document.getElementById('tardinessBar').style.width = '0%';
        document.getElementById('justifiedBar').style.width = '0%';
        document.getElementById('unjustifiedBar').style.width = '0%';
        
        document.getElementById('tardinessValue').textContent = '0';
        document.getElementById('justifiedValue').textContent = '0';
        document.getElementById('unjustifiedValue').textContent = '0';
        return;
    }
    
    const tardinessPercent = Math.round((tardiness / total) * 100);
    const justifiedPercent = Math.round((justified / total) * 100);
    const unjustifiedPercent = Math.round((unjustified / total) * 100);
    
    document.getElementById('tardinessBar').style.width = tardinessPercent + '%';
    document.getElementById('justifiedBar').style.width = justifiedPercent + '%';
    document.getElementById('unjustifiedBar').style.width = unjustifiedPercent + '%';
    
    document.getElementById('tardinessValue').textContent = tardiness + ' (' + tardinessPercent + '%)';
    document.getElementById('justifiedValue').textContent = justified + ' (' + justifiedPercent + '%)';
    document.getElementById('unjustifiedValue').textContent = unjustified + ' (' + unjustifiedPercent + '%)';
}

/**
 * Load absences table
 * @param {Array} absences - Absences to display
 */
function loadAbsencesTable(absences) {
    const students = getAllStudents();
    const courses = getAllCourses();
    const tableBody = document.getElementById('reportAbsencesTableBody');
    
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
            <td>${absence.category}</td>
            <td>${absence.situation}</td>
            <td>${absence.sanction}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // If no absences, show a message
    if (absences.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No se encontraron faltas con los filtros aplicados</td>';
        tableBody.appendChild(row);
    }
}

/**
 * Print report
 */
function printReport() {
    window.print();
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
    return dataManager.getAllStudents();
}

/**
 * Get all courses from storage
 * @returns {Array} Array of course objects
 */
function getAllCourses() {
    return dataManager.getAllCourses();
}

/**
 * Get all absences from storage
 * @returns {Array} Array of absence objects
 */
function getAllAbsences() {
    return dataManager.getAllAbsences();
}