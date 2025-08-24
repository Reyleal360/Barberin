# Backend Integration Guide - REPORTE DE FALTAS IEVE

## Overview

This document provides guidance for integrating the "REPORTE DE FALTAS IEVE" frontend with a backend API. The frontend is designed with a service layer abstraction that makes it easy to replace localStorage with REST API calls.

## Architecture

### Service Layer Abstraction

All data operations are implemented through service functions that can be easily replaced with API calls. The service layer is located in the `js/services/` directory.

### Current Implementation (localStorage)

```javascript
// Current localStorage implementation
function getAllStudents() {
    return JSON.parse(localStorage.getItem('ieve_students')) || [];
}

function createStudent(student) {
    const students = getAllStudents();
    students.push(student);
    localStorage.setItem('ieve_students', JSON.stringify(students));
}
```

### Future API Implementation

```javascript
// Future API implementation
async function getAllStudents() {
    try {
        const response = await fetch('/api/students');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

async function createStudent(student) {
    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user information

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Absences
- `GET /api/absences` - Get all absences
- `GET /api/absences/:id` - Get absence by ID
- `GET /api/absences/student/:studentId` - Get absences by student ID
- `POST /api/absences` - Create new absence
- `PUT /api/absences/:id` - Update absence
- `DELETE /api/absences/:id` - Delete absence

### Reports
- `GET /api/reports` - Get report data with filters
- `GET /api/reports/export` - Export report data

## Data Models

### Student Model
```json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "courseId": "string",
    "enrollmentDate": "date"
}
```

### Course Model
```json
{
    "id": "string",
    "name": "string",
    "teacher": "string",
    "schedule": "string"
}
```

### Absence Model
```json
{
    "id": "string",
    "studentId": "string",
    "courseId": "string",
    "type": "number", // 1: Tardanza, 2: Ausencia justificada, 3: Ausencia injustificada
    "category": "string",
    "situation": "string",
    "sanction": "string",
    "date": "date",
    "comments": "string"
}
```

### User Model
```json
{
    "id": "string",
    "username": "string",
    "role": "string" // "admin", "teacher", or "student"
}
```

## Integration Steps

### 1. Update Service Files

Replace the localStorage-based implementations in the following files:
- `js/services/auth.js`
- `js/services/students.js`
- `js/services/courses.js`
- `js/services/absences.js`
- `js/services/storage.js`

### 2. Update Authentication

Modify `js/services/auth.js` to make API calls instead of checking localStorage:

```javascript
// Before (localStorage)
function login(username, password) {
    const user = getUserByUsername(username);
    if (user && user.password === password) {
        setCurrentUser(user);
        return user;
    }
    return null;
}

// After (API)
async function login(username, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        if (!response.ok) {
            throw new Error('Invalid credentials');
        }
        
        const user = await response.json();
        setCurrentUser(user);
        return user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}
```

### 3. Update Data Services

Replace each function in the service files with API calls:

```javascript
// Before (localStorage)
function getAllStudents() {
    return JSON.parse(localStorage.getItem('ieve_students')) || [];
}

// After (API)
async function getAllStudents() {
    const response = await fetch('/api/students');
    return await response.json();
}
```

### 4. Handle Errors

Add proper error handling for network issues and API errors:

```javascript
async function getAllStudents() {
    try {
        const response = await fetch('/api/students');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching students:', error);
        // Show user-friendly error message
        throw new Error('Failed to load students. Please try again later.');
    }
}
```

### 5. Update UI for Loading States

Add loading indicators to improve user experience:

```javascript
async function loadStudentsTable() {
    // Show loading indicator
    showLoadingIndicator();
    
    try {
        const students = await getAllStudents();
        // Populate table
        populateStudentsTable(students);
    } catch (error) {
        // Show error message
        showError(error.message);
    } finally {
        // Hide loading indicator
        hideLoadingIndicator();
    }
}
```

## Security Considerations

### Authentication Tokens

Implement JWT or session-based authentication:

```javascript
// Store token after login
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

// Include token in API requests
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };
    
    return fetch(url, mergedOptions);
}
```

### Data Validation

Validate data both on frontend and backend:

```javascript
// Frontend validation
function validateStudent(student) {
    const errors = [];
    
    if (!student.name) {
        errors.push('Name is required');
    }
    
    if (!student.email || !isValidEmail(student.email)) {
        errors.push('Valid email is required');
    }
    
    return errors;
}
```

## Performance Optimization

### Caching

Implement caching to reduce API calls:

```javascript
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedData(key, fetchFunction) {
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    
    const data = await fetchFunction();
    cache.set(key, {
        data,
        timestamp: Date.now(),
    });
    
    return data;
}
```

### Pagination

For large datasets, implement pagination:

```javascript
async function getStudents(page = 1, limit = 10) {
    const response = await fetch(`/api/students?page=${page}&limit=${limit}`);
    return await response.json();
}
```

## Testing

### Unit Tests

Test each service function with mock API responses:

```javascript
// Mock fetch for testing
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([{ id: '1', name: 'Test Student' }]),
        ok: true,
    })
);

test('getAllStudents fetches students', async () => {
    const students = await getAllStudents();
    expect(students).toEqual([{ id: '1', name: 'Test Student' }]);
});
```

### Integration Tests

Test the complete flow from UI to API:

```javascript
test('login flow', async () => {
    // Mock successful login response
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ id: 'user1', username: 'test', role: 'admin' }),
            ok: true,
        })
    );
    
    // Test login function
    const user = await login('test', 'password');
    
    // Verify user is set
    expect(user).toEqual({ id: 'user1', username: 'test', role: 'admin' });
});
```

## Deployment Considerations

### Environment Variables

Use environment variables for API endpoints:

```javascript
// config.js
const config = {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
};

export default config;
```

### CORS Configuration

Ensure backend is configured to accept requests from frontend domain:

```javascript
// Express.js example
app.use(cors({
    origin: 'http://your-frontend-domain.com',
    credentials: true,
}));
```

## Migration Checklist

- [ ] Update all service files to use API calls
- [ ] Implement authentication with tokens
- [ ] Add error handling for network issues
- [ ] Add loading states to UI
- [ ] Implement caching for better performance
- [ ] Update validation to match backend requirements
- [ ] Test all functionality with backend
- [ ] Update documentation with API endpoint details
- [ ] Deploy frontend and backend together
- [ ] Monitor for any integration issues