/**
 * Admin Dashboard Logic
 * REPORTE DE FALTAS IEVE
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated and is admin
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the admin dashboard
 */
function initializeDashboard() {
    // Load statistics
    loadStatistics();
    
    // Load students table
    loadStudentsTable();
    
    // Load courses table
    loadCoursesTable();
    
    // Populate course dropdowns
    populateCourseDropdowns();
}

/**
 * Load dashboard statistics
 */
function loadStatistics() {
    const studentCount = getAllStudents().length;
    const courseCount = getAllCourses().length;
    const absenceCount = getAllAbsences().length;
    
    document.getElementById('studentCount').textContent = studentCount;
    document.getElementById('courseCount').textContent = courseCount;
    document.getElementById('absenceCount').textContent = absenceCount;
}

/**
 * Load students table
 */
function loadStudentsTable() {
    const students = getAllStudents();
    const courses = getAllCourses();
    const tableBody = document.getElementById('studentsTableBody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add rows for each student
    students.forEach(student => {
        const course = courses.find(c => c.id === student.course);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${course ? course.name : 'Curso no encontrado'}</td>
            <td class="table__actions">
                <button class="table__action-btn table__action-btn--edit" data-edit="${student.id}">
                    Editar
                </button>
                <button class="table__action-btn table__action-btn--delete" data-delete="${student.id}">
                    Eliminar
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Load courses table
 */
function loadCoursesTable() {
    const courses = getAllCourses();
    const tableBody = document.getElementById('coursesTableBody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add rows for each course
    courses.forEach(course => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.teacher}</td>
            <td>${course.schedule}</td>
            <td class="table__actions">
                <button class="table__action-btn table__action-btn--edit" data-edit="${course.id}">
                    Editar
                </button>
                <button class="table__action-btn table__action-btn--delete" data-delete="${course.id}">
                    Eliminar
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Populate course dropdowns
 */
function populateCourseDropdowns() {
    const courses = getAllCourses();
    const dropdowns = document.querySelectorAll('#studentCourse');
    
    dropdowns.forEach(dropdown => {
        // Clear existing options except the first one
        dropdown.innerHTML = '<option value="">Selecciona un curso</option>';
        
        // Add course options
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            dropdown.appendChild(option);
        });
    });
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Add student button
    document.getElementById('addStudentBtn').addEventListener('click', function() {
        openStudentModal();
    });
    
    // Add course button
    document.getElementById('addCourseBtn').addEventListener('click', function() {
        openCourseModal();
    });
    
    // Save student button
    document.getElementById('saveStudentBtn').addEventListener('click', saveStudent);
    
    // Save course button
    document.getElementById('saveCourseBtn').addEventListener('click', saveCourse);
    
    // Cancel buttons
    document.getElementById('cancelStudentBtn').addEventListener('click', closeStudentModal);
    document.getElementById('cancelCourseBtn').addEventListener('click', closeCourseModal);
    
    // Close modal buttons
    document.querySelectorAll('.modal__close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('modal--open');
        });
    });
    
    // Edit student buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-edit]') && e.target.closest('#studentsTable')) {
            const studentId = e.target.closest('[data-edit]').dataset.edit;
            editStudent(studentId);
        }
    });
    
    // Delete student buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-delete]') && e.target.closest('#studentsTable')) {
            const studentId = e.target.closest('[data-delete]').dataset.delete;
            deleteStudentConfirm(studentId);
        }
    });
    
    // Edit course buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-edit]') && e.target.closest('#coursesTable')) {
            const courseId = e.target.closest('[data-edit]').dataset.edit;
            editCourse(courseId);
        }
    });
    
    // Delete course buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-delete]') && e.target.closest('#coursesTable')) {
            const courseId = e.target.closest('[data-delete]').dataset.delete;
            deleteCourseConfirm(courseId);
        }
    });
    
    // Student search
    document.getElementById('studentSearch').addEventListener('input', function() {
        filterStudentsTable(this.value);
    });
    
    // Course search
    document.getElementById('courseSearch').addEventListener('input', function() {
        filterCoursesTable(this.value);
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
 * Open student modal for adding
 */
function openStudentModal() {
    // Reset form
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('studentModalTitle').textContent = 'Agregar Estudiante';
    
    // Open modal
    document.getElementById('studentModal').classList.add('modal--open');
}

/**
 * Open student modal for editing
 * @param {string} studentId - Student ID to edit
 */
function editStudent(studentId) {
    const student = getStudentById(studentId);
    if (!student) return;
    
    // Fill form with student data
    document.getElementById('studentId').value = student.id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentEmail').value = student.email;
    document.getElementById('studentCourse').value = student.course;
    document.getElementById('studentEnrollmentDate').value = student.enrollmentDate;
    document.getElementById('studentModalTitle').textContent = 'Editar Estudiante';
    
    // Open modal
    document.getElementById('studentModal').classList.add('modal--open');
}

/**
 * Save student (create or update)
 */
function saveStudent() {
    const id = document.getElementById('studentId').value;
    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const course = document.getElementById('studentCourse').value;
    const enrollmentDate = document.getElementById('studentEnrollmentDate').value;
    
    // Validate input
    if (!name || !email || !course || !enrollmentDate) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingresa un email válido');
        return;
    }
    
    // Create or update student
    if (id) {
        // Update existing student
        const updatedStudent = {
            id: id,
            name: name,
            email: email,
            course: course,
            enrollmentDate: enrollmentDate
        };
        updateStudent(id, updatedStudent);
    } else {
        // Create new student
        const newStudent = {
            id: 'student-' + Date.now(),
            name: name,
            email: email,
            course: course,
            enrollmentDate: enrollmentDate
        };
        createStudent(newStudent);
    }
    
    // Close modal and refresh table
    closeStudentModal();
    loadStudentsTable();
    loadStatistics();
}

/**
 * Close student modal
 */
function closeStudentModal() {
    document.getElementById('studentModal').classList.remove('modal--open');
}

/**
 * Delete student with confirmation
 * @param {string} studentId - Student ID to delete
 */
function deleteStudentConfirm(studentId) {
    if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
        deleteStudent(studentId);
        loadStudentsTable();
        loadStatistics();
    }
}

/**
 * Open course modal for adding
 */
function openCourseModal() {
    // Reset form
    document.getElementById('courseForm').reset();
    document.getElementById('courseId').value = '';
    document.getElementById('courseModalTitle').textContent = 'Agregar Curso';
    
    // Open modal
    document.getElementById('courseModal').classList.add('modal--open');
}

/**
 * Open course modal for editing
 * @param {string} courseId - Course ID to edit
 */
function editCourse(courseId) {
    const course = getCourseById(courseId);
    if (!course) return;
    
    // Fill form with course data
    document.getElementById('courseId').value = course.id;
    document.getElementById('courseName').value = course.name;
    document.getElementById('courseTeacher').value = course.teacher;
    document.getElementById('courseSchedule').value = course.schedule;
    document.getElementById('courseModalTitle').textContent = 'Editar Curso';
    
    // Open modal
    document.getElementById('courseModal').classList.add('modal--open');
}

/**
 * Save course (create or update)
 */
function saveCourse() {
    const id = document.getElementById('courseId').value;
    const name = document.getElementById('courseName').value.trim();
    const teacher = document.getElementById('courseTeacher').value.trim();
    const schedule = document.getElementById('courseSchedule').value.trim();
    
    // Validate input
    if (!name || !teacher || !schedule) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Create or update course
    if (id) {
        // Update existing course
        const updatedCourse = {
            id: id,
            name: name,
            teacher: teacher,
            schedule: schedule
        };
        updateCourse(id, updatedCourse);
    } else {
        // Create new course
        const newCourse = {
            id: 'course-' + Date.now(),
            name: name,
            teacher: teacher,
            schedule: schedule
        };
        createCourse(newCourse);
    }
    
    // Close modal and refresh table
    closeCourseModal();
    loadCoursesTable();
    loadStatistics();
    populateCourseDropdowns();
}

/**
 * Close course modal
 */
function closeCourseModal() {
    document.getElementById('courseModal').classList.remove('modal--open');
}

/**
 * Delete course with confirmation
 * @param {string} courseId - Course ID to delete
 */
function deleteCourseConfirm(courseId) {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
        deleteCourse(courseId);
        loadCoursesTable();
        loadStatistics();
        populateCourseDropdowns();
    }
}

/**
 * Filter students table
 * @param {string} searchTerm - Search term to filter by
 */
function filterStudentsTable(searchTerm) {
    const rows = document.querySelectorAll('#studentsTableBody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[1].textContent.toLowerCase();
        const course = row.cells[2].textContent.toLowerCase();
        
        if (name.includes(term) || email.includes(term) || course.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Filter courses table
 * @param {string} searchTerm - Search term to filter by
 */
function filterCoursesTable(searchTerm) {
    const rows = document.querySelectorAll('#coursesTableBody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const teacher = row.cells[1].textContent.toLowerCase();
        const schedule = row.cells[2].textContent.toLowerCase();
        
        if (name.includes(term) || teacher.includes(term) || schedule.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
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
 * Get student by ID
 * @param {string} id - Student ID
 * @returns {Object|null} Student object or null if not found
 */
function getStudentById(id) {
    return dataManager.getStudentById(id);
}

/**
 * Update student by ID
 * @param {string} id - Student ID
 * @param {Object} updatedStudent - Updated student object
 */
function updateStudent(id, updatedStudent) {
    dataManager.updateStudent(id, updatedStudent);
}

/**
 * Create a new student
 * @param {Object} student - Student object to create
 */
function createStudent(student) {
    dataManager.createStudent(student);
}

/**
 * Delete student by ID
 * @param {string} id - Student ID
 */
function deleteStudent(id) {
    dataManager.deleteStudent(id);
}

/**
 * Get all courses from storage
 * @returns {Array} Array of course objects
 */
function getAllCourses() {
    return dataManager.getAllCourses();
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
 * Update course by ID
 * @param {string} id - Course ID
 * @param {Object} updatedCourse - Updated course object
 */
function updateCourse(id, updatedCourse) {
    dataManager.updateCourse(id, updatedCourse);
}

/**
 * Create a new course
 * @param {Object} course - Course object to create
 */
function createCourse(course) {
    dataManager.createCourse(course);
}

/**
 * Delete course by ID
 * @param {string} id - Course ID
 */
function deleteCourse(id) {
    dataManager.deleteCourse(id);
}

/**
 * Get all absences from storage
 * @returns {Array} Array of absence objects
 */
function getAllAbsences() {
    return dataManager.getAllAbsences();
}