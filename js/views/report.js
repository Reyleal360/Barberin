/**
 * Report Generation Logic
 * REPORTE DE FALTAS IEVE
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize report page
    await initializeReport();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the report page
 */
async function initializeReport() {
    try {
        // Load dropdowns
        await loadCourseDropdown();
        await loadStudentDropdown();
        
        // Set default date range (last 30 days)
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setDate(today.getDate() - 30);
        
        document.getElementById('dateTo').value = today.toISOString().split('T')[0];
        document.getElementById('dateFrom').value = lastMonth.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error initializing report:', error);
    }
}

/**
 * Load course dropdown
 */
async function loadCourseDropdown() {
    try {
        const courses = await getAllCourses();
        const dropdown = document.getElementById('reportCourse');
        
        // Clear existing options except the first one
        dropdown.innerHTML = '<option value="">Todos los cursos</option>';
        
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
 * Load student dropdown
 */
async function loadStudentDropdown() {
    try {
        const students = await getAllStudents();
        const dropdown = document.getElementById('reportStudent');
        
        // Clear existing options except the first one
        dropdown.innerHTML = '<option value="">Todos los estudiantes</option>';
        
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
async function generateReport(e) {
    e.preventDefault();
    
    try {
        // Get filter values
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const courseId = document.getElementById('reportCourse').value;
        const studentId = document.getElementById('reportStudent').value;
        const type = document.getElementById('reportType').value;
        const situation = document.getElementById('reportSituation').value;
        
        // Get all absences
        let absences = await getAllAbsences();
        
        // Apply date filter
        if (dateFrom) {
            absences = absences.filter(absence => absence.date >= dateFrom);
        }
        
        if (dateTo) {
            absences = absences.filter(absence => absence.date <= dateTo);
        }
        
        // Apply course filter
        if (courseId) {
            absences = absences.filter(absence => absence.course_id === courseId);
        }
        
        // Apply student filter
        if (studentId) {
            absences = absences.filter(absence => absence.student_id === studentId);
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
    } catch (error) {
        console.error('Error generating report:', error);
        alert('Error al generar el reporte');
    }
}

/**
 * Display report with filtered absences
 * @param {Array} absences - Filtered absences to display
 */
function displayReport(absences) {
    try {
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
    } catch (error) {
        console.error('Error displaying report:', error);
        alert('Error al mostrar el reporte');
    }
}

/**
 * Update chart with statistics
 * @param {number} total - Total absences
 * @param {number} tardiness - Tardiness count
 * @param {number} justified - Justified absences count
 * @param {number} unjustified - Unjustified absences count
 */
function updateChart(total, tardiness, justified, unjustified) {
    try {
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
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

/**
 * Load absences table
 * @param {Array} absences - Absences to display
 */
function loadAbsencesTable(absences) {
    try {
        // Get students and courses synchronously from the dataManager
        // Since we're in a synchronous function, we can't use await
        // We'll assume the data is already loaded in the dataManager
        const students = dataManager.data.students || [];
        const courses = dataManager.data.courses || [];
        const tableBody = document.getElementById('reportAbsencesTableBody');
        
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
                <td>${absence.category}</td>
                <td>${absence.situation}</td>
                <td>${absence.sanction}</td>
            `;
            
            tableBody.appendChild(row);
        }
        
        // If no absences, show a message
        if (absences.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7" class="text-center">No se encontraron faltas con los filtros aplicados</td>';
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading absences table:', error);
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
 * Logout function
 */
function logout() {
    localStorage.removeItem('ieve_currentUser');
    window.location.href = 'login.html';
}