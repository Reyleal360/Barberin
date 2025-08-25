/**
 * DataManager Class
 * Handles all data operations for the IEVE absence reporting system
 */

class DataManager {
    constructor() {
        this.data = {
            students: [],
            courses: [],
            absences: [],
            users: []
        };
        this.loadData();
    }

    /**
     * Load data from the JSON file
     */
    async loadData() {
        try {
            const response = await fetch('data.json');
            if (response.ok) {
                this.data = await response.json();
            } else {
                console.error('Failed to load data from data.json');
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    /**
     * Save data to localStorage as a fallback
     * In a real application, this would send data to a server
     */
    saveData() {
        // For this implementation, we'll save to localStorage as a fallback
        // since we can't directly write to the JSON file from the browser
        localStorage.setItem('ieve_data', JSON.stringify(this.data));
    }

    /**
     * Initialize data from localStorage if available
     */
    initializeFromLocalStorage() {
        const savedData = localStorage.getItem('ieve_data');
        if (savedData) {
            this.data = JSON.parse(savedData);
        }
    }

    // Student methods
    getAllStudents() {
        return this.data.students || [];
    }

    getStudentById(id) {
        return this.data.students.find(student => student.id === id) || null;
    }

    createStudent(student) {
        this.data.students.push(student);
        this.saveData();
    }

    updateStudent(id, updatedStudent) {
        const index = this.data.students.findIndex(student => student.id === id);
        if (index !== -1) {
            this.data.students[index] = updatedStudent;
            this.saveData();
        }
    }

    deleteStudent(id) {
        this.data.students = this.data.students.filter(student => student.id !== id);
        this.saveData();
    }

    getStudentsByCourseId(courseId) {
        return this.data.students.filter(student => student.course === courseId);
    }

    // Course methods
    getAllCourses() {
        return this.data.courses || [];
    }

    getCourseById(id) {
        return this.data.courses.find(course => course.id === id) || null;
    }

    createCourse(course) {
        this.data.courses.push(course);
        this.saveData();
    }

    updateCourse(id, updatedCourse) {
        const index = this.data.courses.findIndex(course => course.id === id);
        if (index !== -1) {
            this.data.courses[index] = updatedCourse;
            this.saveData();
        }
    }

    deleteCourse(id) {
        this.data.courses = this.data.courses.filter(course => course.id !== id);
        this.saveData();
    }

    // Absence methods
    getAllAbsences() {
        return this.data.absences || [];
    }

    getAbsenceById(id) {
        return this.data.absences.find(absence => absence.id === id) || null;
    }

    getAbsencesByStudentId(studentId) {
        return this.data.absences.filter(absence => absence.studentId === studentId);
    }

    createAbsence(absence) {
        this.data.absences.push(absence);
        this.saveData();
    }

    updateAbsence(id, updatedAbsence) {
        const index = this.data.absences.findIndex(absence => absence.id === id);
        if (index !== -1) {
            this.data.absences[index] = updatedAbsence;
            this.saveData();
        }
    }

    deleteAbsence(id) {
        this.data.absences = this.data.absences.filter(absence => absence.id !== id);
        this.saveData();
    }

    // User methods
    getAllUsers() {
        return this.data.users || [];
    }

    getUserByUsername(username) {
        return this.data.users.find(user => user.username === username) || null;
    }

    createUser(user) {
        this.data.users.push(user);
        this.saveData();
    }

    updateUser(id, updatedUser) {
        const index = this.data.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.data.users[index] = updatedUser;
            this.saveData();
        }
    }

    deleteUser(id) {
        this.data.users = this.data.users.filter(user => user.id !== id);
        this.saveData();
    }
}

// Create a global instance of DataManager
const dataManager = new DataManager();