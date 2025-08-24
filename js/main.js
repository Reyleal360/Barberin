/**
 * Main Application Entry Point
 * REPORTE DE FALTAS IEVE
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data storage
    initializeData();
    
    // Check authentication status
    checkAuthStatus();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Check authentication status and redirect if needed
 */
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    
    // If we're not on the login page and there's no authenticated user, redirect to login
    if (!window.location.pathname.includes('login.html') && !currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // If we're on the login page and there is an authenticated user, redirect to their dashboard
    if (window.location.pathname.includes('login.html') && currentUser) {
        redirectToDashboard(currentUser.role);
        return;
    }
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
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
 * Redirect user to their appropriate dashboard
 * @param {string} role - User role (admin, teacher, student)
 */
function redirectToDashboard(role) {
    switch(role) {
        case 'admin':
            window.location.href = 'admin-dashboard.html';
            break;
        case 'teacher':
            window.location.href = 'teacher-dashboard.html';
            break;
        case 'student':
            window.location.href = 'student-dashboard.html';
            break;
        default:
            window.location.href = 'login.html';
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
 * Set current authenticated user
 * @param {Object} user - User object to set as current
 */
function setCurrentUser(user) {
    localStorage.setItem('ieve_currentUser', JSON.stringify(user));
}

/**
 * Clear current user session
 */
function logout() {
    localStorage.removeItem('ieve_currentUser');
    window.location.href = 'login.html';
}

/**
 * Initialize data storage with mock data if empty
 */
function initializeData() {
    // Check if we already have data
    if (!localStorage.getItem('ieve_students')) {
        localStorage.setItem('ieve_students', JSON.stringify(getMockStudents()));
    }
    
    if (!localStorage.getItem('ieve_courses')) {
        localStorage.setItem('ieve_courses', JSON.stringify(getMockCourses()));
    }
    
    if (!localStorage.getItem('ieve_absences')) {
        localStorage.setItem('ieve_absences', JSON.stringify(getMockAbsences()));
    }
    
    if (!localStorage.getItem('ieve_users')) {
        localStorage.setItem('ieve_users', JSON.stringify(getMockUsers()));
    }
}

/**
 * Get mock students data
 * @returns {Array} Array of student objects
 */
function getMockStudents() {
    return [
        {
            id: "student-001",
            name: "María González",
            email: "maria.gonzalez@example.com",
            course: "course-001",
            enrollmentDate: "2025-08-01"
        },
        {
            id: "student-002",
            name: "Carlos Rodríguez",
            email: "carlos.rodriguez@example.com",
            course: "course-001",
            enrollmentDate: "2025-08-01"
        },
        {
            id: "student-003",
            name: "Ana Martínez",
            email: "ana.martinez@example.com",
            course: "course-002",
            enrollmentDate: "2025-08-01"
        },
        {
            id: "student-004",
            name: "Luis Fernández",
            email: "luis.fernandez@example.com",
            course: "course-002",
            enrollmentDate: "2025-08-01"
        },
        {
            id: "student-005",
            name: "Sofía López",
            email: "sofia.lopez@example.com",
            course: "course-003",
            enrollmentDate: "2025-08-01"
        },
        {
            id: "student-006",
            name: "Pedro Sánchez",
            email: "pedro.sanchez@example.com",
            course: "course-001",
            enrollmentDate: "2025-08-05"
        },
        {
            id: "student-007",
            name: "Elena Torres",
            email: "elena.torres@example.com",
            course: "course-003",
            enrollmentDate: "2025-08-10"
        },
        {
            id: "student-008",
            name: "Jorge Ramírez",
            email: "jorge.ramirez@example.com",
            course: "course-002",
            enrollmentDate: "2025-08-15"
        },
        {
            id: "student-009",
            name: "Carmen Ruiz",
            email: "carmen.ruiz@example.com",
            course: "course-001",
            enrollmentDate: "2025-08-20"
        },
        {
            id: "student-010",
            name: "Miguel Herrera",
            email: "miguel.herrera@example.com",
            course: "course-003",
            enrollmentDate: "2025-08-25"
        }
    ];
}

/**
 * Get mock courses data
 * @returns {Array} Array of course objects
 */
function getMockCourses() {
    return [
        {
            id: "course-001",
            name: "Matemáticas Avanzadas",
            teacher: "Prof. Elena Ruiz",
            schedule: "Lunes y Miércoles 8:00-10:00"
        },
        {
            id: "course-002",
            name: "Literatura Universal",
            teacher: "Prof. Jorge Pérez",
            schedule: "Martes y Jueves 10:00-12:00"
        },
        {
            id: "course-003",
            name: "Ciencias Naturales",
            teacher: "Prof. Carmen Silva",
            schedule: "Viernes 8:00-12:00"
        },
        {
            id: "course-004",
            name: "Historia del Mundo",
            teacher: "Prof. Miguel Ángel López",
            schedule: "Lunes y Jueves 14:00-16:00"
        },
        {
            id: "course-005",
            name: "Arte y Cultura",
            teacher: "Prof. Ana María González",
            schedule: "Miércoles y Viernes 12:00-14:00"
        }
    ];
}

/**
 * Get mock absences data
 * @returns {Array} Array of absence objects
 */
function getMockAbsences() {
    return [
        {
            id: "absence-001",
            studentId: "student-001",
            courseId: "course-001",
            type: 1, // Tardanza
            category: "Académica",
            situation: "Resuelta",
            sanction: "Advertencia",
            date: "2025-08-15",
            comments: "Llegó 15 minutos tarde sin justificación"
        },
        {
            id: "absence-002",
            studentId: "student-002",
            courseId: "course-001",
            type: 3, // Ausencia injustificada
            category: "Comportamiento",
            situation: "Pendiente",
            sanction: "Pendiente",
            date: "2025-08-18",
            comments: "No asistió a clase sin aviso previo"
        },
        {
            id: "absence-003",
            studentId: "student-003",
            courseId: "course-002",
            type: 2, // Ausencia justificada
            category: "Académica",
            situation: "Resuelta",
            sanction: "Ninguna",
            date: "2025-08-20",
            comments: "Justificada por cita médica"
        },
        {
            id: "absence-004",
            studentId: "student-004",
            courseId: "course-002",
            type: 1, // Tardanza
            category: "Académica",
            situation: "Pendiente",
            sanction: "Pendiente",
            date: "2025-08-22",
            comments: "Llegó 10 minutos tarde"
        },
        {
            id: "absence-005",
            studentId: "student-005",
            courseId: "course-003",
            type: 3, // Ausencia injustificada
            category: "Comportamiento",
            situation: "Resuelta",
            sanction: "Suspensión de actividades extracurriculares por 1 semana",
            date: "2025-08-10",
            comments: "No asistió a clase sin justificación"
        },
        {
            id: "absence-006",
            studentId: "student-006",
            courseId: "course-001",
            type: 2, // Ausencia justificada
            category: "Académica",
            situation: "Resuelta",
            sanction: "Ninguna",
            date: "2025-08-12",
            comments: "Justificada por enfermedad"
        },
        {
            id: "absence-007",
            studentId: "student-007",
            courseId: "course-003",
            type: 1, // Tardanza
            category: "Comportamiento",
            situation: "Resuelta",
            sanction: "Advertencia",
            date: "2025-08-14",
            comments: "Llegó 20 minutos tarde"
        },
        {
            id: "absence-008",
            studentId: "student-008",
            courseId: "course-002",
            type: 3, // Ausencia injustificada
            category: "Académica",
            situation: "Pendiente",
            sanction: "Pendiente",
            date: "2025-08-16",
            comments: "No asistió a clase sin aviso"
        },
        {
            id: "absence-009",
            studentId: "student-001",
            courseId: "course-001",
            type: 2, // Ausencia justificada
            category: "Académica",
            situation: "Resuelta",
            sanction: "Ninguna",
            date: "2025-08-05",
            comments: "Justificada por cita médica"
        },
        {
            id: "absence-010",
            studentId: "student-002",
            courseId: "course-001",
            type: 1, // Tardanza
            category: "Comportamiento",
            situation: "Resuelta",
            sanction: "Advertencia",
            date: "2025-08-08",
            comments: "Llegó 5 minutos tarde"
        },
        {
            id: "absence-011",
            studentId: "student-009",
            courseId: "course-001",
            type: 3, // Ausencia injustificada
            category: "Académica",
            situation: "Pendiente",
            sanction: "Pendiente",
            date: "2025-08-20",
            comments: "No asistió a clase sin justificación"
        },
        {
            id: "absence-012",
            studentId: "student-010",
            courseId: "course-003",
            type: 1, // Tardanza
            category: "Académica",
            situation: "Resuelta",
            sanction: "Advertencia",
            date: "2025-08-18",
            comments: "Llegó 15 minutos tarde"
        }
    ];
}

/**
 * Get mock users data
 * @returns {Array} Array of user objects
 */
function getMockUsers() {
    return [
        {
            id: "user-admin-001",
            username: "admin",
            role: "admin"
        },
        {
            id: "user-teacher-001",
            username: "teacher1",
            role: "teacher"
        },
        {
            id: "user-teacher-002",
            username: "teacher2",
            role: "teacher"
        },
        {
            id: "user-teacher-003",
            username: "teacher3",
            role: "teacher"
        },
        {
            id: "user-teacher-004",
            username: "teacher4",
            role: "teacher"
        },
        {
            id: "user-teacher-005",
            username: "teacher5",
            role: "teacher"
        },
        {
            id: "user-student-001",
            username: "student1",
            role: "student"
        },
        {
            id: "user-student-002",
            username: "student2",
            role: "student"
        },
        {
            id: "user-student-003",
            username: "student3",
            role: "student"
        },
        {
            id: "user-student-004",
            username: "student4",
            role: "student"
        },
        {
            id: "user-student-005",
            username: "student5",
            role: "student"
        },
        {
            id: "user-student-006",
            username: "student6",
            role: "student"
        },
        {
            id: "user-student-007",
            username: "student7",
            role: "student"
        },
        {
            id: "user-student-008",
            username: "student8",
            role: "student"
        },
        {
            id: "user-student-009",
            username: "student9",
            role: "student"
        },
        {
            id: "user-student-010",
            username: "student10",
            role: "student"
        }
    ];
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
 * Create a new student
 * @param {Object} student - Student object to create
 */
function createStudent(student) {
    const students = getAllStudents();
    students.push(student);
    localStorage.setItem('ieve_students', JSON.stringify(students));
}

/**
 * Update student by ID
 * @param {string} id - Student ID
 * @param {Object} updatedStudent - Updated student object
 */
function updateStudent(id, updatedStudent) {
    const students = getAllStudents();
    const index = students.findIndex(student => student.id === id);
    if (index !== -1) {
        students[index] = updatedStudent;
        localStorage.setItem('ieve_students', JSON.stringify(students));
    }
}

/**
 * Delete student by ID
 * @param {string} id - Student ID
 */
function deleteStudent(id) {
    const students = getAllStudents();
    const filteredStudents = students.filter(student => student.id !== id);
    localStorage.setItem('ieve_students', JSON.stringify(filteredStudents));
}

/**
 * Get all courses from storage
 * @returns {Array} Array of course objects
 */
function getAllCourses() {
    return JSON.parse(localStorage.getItem('ieve_courses')) || [];
}

/**
 * Get course by ID
 * @param {string} id - Course ID
 * @returns {Object|null} Course object or null if not found
 */
function getCourseById(id) {
    const courses = getAllCourses();
    return courses.find(course => course.id === id) || null;
}

/**
 * Create a new course
 * @param {Object} course - Course object to create
 */
function createCourse(course) {
    const courses = getAllCourses();
    courses.push(course);
    localStorage.setItem('ieve_courses', JSON.stringify(courses));
}

/**
 * Update course by ID
 * @param {string} id - Course ID
 * @param {Object} updatedCourse - Updated course object
 */
function updateCourse(id, updatedCourse) {
    const courses = getAllCourses();
    const index = courses.findIndex(course => course.id === id);
    if (index !== -1) {
        courses[index] = updatedCourse;
        localStorage.setItem('ieve_courses', JSON.stringify(courses));
    }
}

/**
 * Delete course by ID
 * @param {string} id - Course ID
 */
function deleteCourse(id) {
    const courses = getAllCourses();
    const filteredCourses = courses.filter(course => course.id !== id);
    localStorage.setItem('ieve_courses', JSON.stringify(filteredCourses));
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
 * Get absences by student ID
 * @param {string} studentId - Student ID
 * @returns {Array} Array of absence objects for the student
 */
function getAbsencesByStudentId(studentId) {
    const absences = getAllAbsences();
    return absences.filter(absence => absence.studentId === studentId);
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

/**
 * Get user by username
 * @param {string} username - Username
 * @returns {Object|null} User object or null if not found
 */
function getUserByUsername(username) {
    const users = JSON.parse(localStorage.getItem('ieve_users')) || [];
    return users.find(user => user.username === username) || null;
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
 * Get all students for a specific course
 * @param {string} courseId - Course ID
 * @returns {Array} Array of student objects in the course
 */
function getStudentsByCourseId(courseId) {
    const students = getAllStudents();
    return students.filter(student => student.course === courseId);
}