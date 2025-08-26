/**
 * DataManager Class
 * Handles all data operations for the IEVE absence reporting system
 */
class DataManager {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
        this.data = {
            students: [],
            courses: [],
            absences: [],
            users: []
        };
    }

    /**
     * Load all data from the backend API
     */
    async loadData() {
        try {
            // Load all data in parallel
            const [studentsResponse, coursesResponse, absencesResponse, usersResponse] = await Promise.all([
                fetch(`${this.baseUrl}/students`),
                fetch(`${this.baseUrl}/courses`),
                fetch(`${this.baseUrl}/absences`),
                fetch(`${this.baseUrl}/users`)
            ]);

            // Check if all responses are ok
            if (studentsResponse.ok && coursesResponse.ok && absencesResponse.ok && usersResponse.ok) {
                this.data.students = await studentsResponse.json();
                this.data.courses = await coursesResponse.json();
                this.data.absences = await absencesResponse.json();
                this.data.users = await usersResponse.json();
            } else {
                console.error('Failed to load data from backend API');
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    /**
     * Initialize data from localStorage if available (fallback)
     */
    initializeFromLocalStorage() {
        const savedData = localStorage.getItem('ieve_data');
        if (savedData) {
            this.data = JSON.parse(savedData);
        }
    }

    // Student methods
    async getAllStudents() {
        try {
            const response = await fetch(`${this.baseUrl}/students`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Failed to fetch students');
                return [];
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            return [];
        }
    }

    async getStudentById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/students/${id}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Failed to fetch student with id ${id}`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching student with id ${id}:`, error);
            return null;
        }
    }

    async createStudent(student) {
        try {
            const response = await fetch(`${this.baseUrl}/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Failed to create student');
                return null;
            }
        } catch (error) {
            console.error('Error creating student:', error);
            return null;
        }
    }

    async updateStudent(id, updatedStudent) {
        try {
            const response = await fetch(`${this.baseUrl}/students/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedStudent)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Failed to update student with id ${id}`);
                return null;
            }
        } catch (error) {
            console.error(`Error updating student with id ${id}:`, error);
            return null;
        }
    }

    async deleteStudent(id) {
        try {
            const response = await fetch(`${this.baseUrl}/students/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                return true;
            } else {
                console.error(`Failed to delete student with id ${id}`);
                return false;
            }
        } catch (error) {
            console.error(`Error deleting student with id ${id}:`, error);
            return false;
        }
    }

    async getStudentsByCourseId(courseId) {
        try {
            const response = await fetch(`${this.baseUrl}/students`);
            if (response.ok) {
                const students = await response.json();
                return students.filter(student => student.course_id === courseId);
            } else {
                console.error('Failed to fetch students');
                return [];
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            return [];
        }
    }

    // Course methods
    async getAllCourses() {
        try {
            const response = await fetch(`${this.baseUrl}/courses`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Failed to fetch courses');
                return [];
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    }

    async getCourseById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/${id}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Failed to fetch course with id ${id}`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching course with id ${id}:`, error);
            return null;
        }
    }

    async createCourse(course) {
        try {
            const response = await fetch(`${this.baseUrl}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(course)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Failed to create course');
                return null;
            }
        } catch (error) {
            console.error('Error creating course:', error);
            return null;
        }
    }

    async updateCourse(id, updatedCourse) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCourse)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Failed to update course with id ${id}`);
                return null;
            }
        } catch (error) {
            console.error(`Error updating course with id ${id}:`, error);
            return null;
        }
    }

    async deleteCourse(id) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                return true;
            } else {
                console.error(`Failed to delete course with id ${id}`);
                return false;
            }
        } catch (error) {
            console.error(`Error deleting course with id ${id}:`, error);
            return false;
        }
    }

    // Absence methods
    async getAllAbsences() {
        try {
            const response = await fetch(`${this.baseUrl}/absences`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Failed to fetch absences');
                return [];
            }
        } catch (error) {
            console.error('Error fetching absences:', error);
            return [];
        }
    }

    async getAbsenceById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/absences/${id}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Failed to fetch absence with id ${id}`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching absence with id ${id}:`, error);
            return null;
        }
    }

    async getAbsencesByStudentId(studentId) {
        try {
            const response = await fetch(`${this.baseUrl}/absences/student/${studentId}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Failed to fetch absences for student with id ${studentId}`);
                return [];
            }
        } catch (error) {
            console.error(`Error fetching absences for student with id ${studentId}:`, error);
            return [];
        }
    }

    async createAbsence(absence) {
        try {
            const response = await fetch(`${this.baseUrl}/absences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(absence)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Failed to create absence');
                return null;
            }
        } catch (error) {
            console.error('Error creating absence:', error);
            return null;
        }
    }

    async updateAbsence(id, updatedAbsence) {
        try {
            const response = await fetch(`${this.baseUrl}/absences/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAbsence)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Failed to update absence with id ${id}`);
                return null;
            }
        } catch (error) {
            console.error(`Error updating absence with id ${id}:`, error);
            return null;
        }
    }

    async deleteAbsence(id) {
        try {
            const response = await fetch(`${this.baseUrl}/absences/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                return true;
            } else {
                console.error(`Failed to delete absence with id ${id}`);
                return false;
            }
        } catch (error) {
            console.error(`Error deleting absence with id ${id}:`, error);
            return false;
        }
    }

    // User methods
    async getAllUsers() {
        try {
            const response = await fetch(`${this.baseUrl}/users`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Failed to fetch users');
                return [];
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    async getUserByUsername(username) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${username}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Failed to fetch user with username ${username}`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching user with username ${username}:`, error);
            return null;
        }
    }

    async createUser(user) {
        try {
            const response = await fetch(`${this.baseUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Failed to create user');
                return null;
            }
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }

    async updateUser(id, updatedUser) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Failed to update user with id ${id}`);
                return null;
            }
        } catch (error) {
            console.error(`Error updating user with id ${id}:`, error);
            return null;
        }
    }

    async deleteUser(id) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                return true;
            } else {
                console.error(`Failed to delete user with id ${id}`);
                return false;
            }
        } catch (error) {
            console.error(`Error deleting user with id ${id}:`, error);
            return false;
        }
    }
}

// Create a global instance of DataManager
const dataManager = new DataManager();