/**
 * Admin Dashboard Logic
 * REPORTE DE FALTAS IEVE
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated and is admin
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize dashboard
    await initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the admin dashboard
 */
async function initializeDashboard() {
    try {
        // Load statistics
        await loadStatistics();
        
        // Load students table
        await loadStudentsTable();
        
        // Load courses table
        await loadCoursesTable();
        
        // Populate course dropdowns
        await populateCourseDropdowns();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

/**
 * Load dashboard statistics
 */
async function loadStatistics() {
    try {
        const students = await getAllStudents();
        const courses = await getAllCourses();
        const absences = await getAllAbsences();
        
        document.getElementById('studentCount').textContent = students.length;
        document.getElementById('courseCount').textContent = courses.length;
        document.getElementById('absenceCount').textContent = absences.length;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

/**
 * Load students table
 */
async function loadStudentsTable() {
    try {
        const students = await getAllStudents();
        const courses = await getAllCourses();
        const tableBody = document.getElementById('studentsTableBody');
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Add rows for each student
        for (const student of students) {
            const course = courses.find(c => c.id === student.course_id);
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
        }
    } catch (error) {
        console.error('Error loading students table:', error);
    }
}

/**
 * Load courses table
 */
async function loadCoursesTable() {
    try {
        const courses = await getAllCourses();
        const tableBody = document.getElementById('coursesTableBody');
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Add rows for each course
        for (const course of courses) {
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
        }
    } catch (error) {
        console.error('Error loading courses table:', error);
    }
}

/**
 * Populate course dropdowns
 */
async function populateCourseDropdowns() {
    try {
        const courses = await getAllCourses();
        const dropdowns = document.querySelectorAll('#studentCourse');
        
        dropdowns.forEach(dropdown => {
            // Clear existing options except the first one
            dropdown.innerHTML = '<option value="">Selecciona un curso</option>';
            
            // Add course options
            for (const course of courses) {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.name;
                dropdown.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error populating course dropdowns:', error);
    }
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
async function editStudent(studentId) {
    try {
        const student = await getStudentById(studentId);
        if (!student) return;
        
        // Fill form with student data
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentEmail').value = student.email;
        document.getElementById('studentCourse').value = student.course_id;
        document.getElementById('studentEnrollmentDate').value = student.enrollment_date;
        document.getElementById('studentModalTitle').textContent = 'Editar Estudiante';
        
        // Open modal
        document.getElementById('studentModal').classList.add('modal--open');
    } catch (error) {
        console.error('Error editing student:', error);
        alert('Error al cargar los datos del estudiante');
    }
}

/**
 * Save student (create or update)
 */
async function saveStudent() {
    try {
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
        
        let result;
        // Create or update student
        if (id) {
            // Update existing student
            const updatedStudent = {
                id: id,
                name: name,
                email: email,
                course_id: course,
                enrollment_date: enrollmentDate
            };
            result = await updateStudent(id, updatedStudent);
        } else {
            // Create new student
            const newStudent = {
                id: 'student-' + Date.now(),
                name: name,
                email: email,
                course_id: course,
                enrollment_date: enrollmentDate
            };
            result = await createStudent(newStudent);
        }
        
        if (!result) {
            alert('Error al guardar el estudiante');
            return;
        }
        
        // Close modal and refresh table
        closeStudentModal();
        await loadStudentsTable();
        await loadStatistics();
    } catch (error) {
        console.error('Error saving student:', error);
        alert('Error al guardar el estudiante');
    }
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
async function deleteStudentConfirm(studentId) {
    if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
        try {
            const result = await deleteStudent(studentId);
            if (!result) {
                alert('Error al eliminar el estudiante');
                return;
            }
            
            await loadStudentsTable();
            await loadStatistics();
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Error al eliminar el estudiante');
        }
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
async function editCourse(courseId) {
    try {
        const course = await getCourseById(courseId);
        if (!course) return;
        
        // Fill form with course data
        document.getElementById('courseId').value = course.id;
        document.getElementById('courseName').value = course.name;
        document.getElementById('courseTeacher').value = course.teacher;
        document.getElementById('courseSchedule').value = course.schedule;
        document.getElementById('courseModalTitle').textContent = 'Editar Curso';
        
        // Open modal
        document.getElementById('courseModal').classList.add('modal--open');
    } catch (error) {
        console.error('Error editing course:', error);
        alert('Error al cargar los datos del curso');
    }
}

/**
 * Save course (create or update)
 */
async function saveCourse() {
    try {
        const id = document.getElementById('courseId').value;
        const name = document.getElementById('courseName').value.trim();
        const teacher = document.getElementById('courseTeacher').value.trim();
        const schedule = document.getElementById('courseSchedule').value.trim();
        
        // Validate input
        if (!name || !teacher || !schedule) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        let result;
        // Create or update course
        if (id) {
            // Update existing course
            const updatedCourse = {
                id: id,
                name: name,
                teacher: teacher,
                schedule: schedule
            };
            result = await updateCourse(id, updatedCourse);
        } else {
            // Create new course
            const newCourse = {
                id: 'course-' + Date.now(),
                name: name,
                teacher: teacher,
                schedule: schedule
            };
            result = await createCourse(newCourse);
        }
        
        if (!result) {
            alert('Error al guardar el curso');
            return;
        }
        
        // Close modal and refresh table
        closeCourseModal();
        await loadCoursesTable();
        await loadStatistics();
        await populateCourseDropdowns();
    } catch (error) {
        console.error('Error saving course:', error);
        alert('Error al guardar el curso');
    }
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
async function deleteCourseConfirm(courseId) {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
        try {
            const result = await deleteCourse(courseId);
            if (!result) {
                alert('Error al eliminar el curso');
                return;
            }
            
            await loadCoursesTable();
            await loadStatistics();
            await populateCourseDropdowns();
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Error al eliminar el curso');
        }
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
 * Logout function
 */
function logout() {
    localStorage.removeItem('ieve_currentUser');
    window.location.href = 'login.html';
}