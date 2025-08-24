# Project Structure - REPORTE DE FALTAS IEVE

## File Organization

```
REPORTE-DE-FALTAS-IEVE/
│
├── index.html                 # Main entry point
├── login.html                 # Login page
├── admin-dashboard.html       # Admin dashboard
├── teacher-dashboard.html     # Teacher dashboard
├── student-dashboard.html     # Student dashboard
├── student-detail.html        # Student detail view
├── report.html                # Report generation page
│
├── css/
│   ├── styles.css             # Main stylesheet
│   ├── login.css              # Login page styles
│   ├── dashboard.css          # Dashboard styles
│   ├── student-detail.css     # Student detail styles
│   └── report.css             # Report styles
│
├── js/
│   ├── main.js                # Main JavaScript file
│   ├── login.js               # Login functionality
│   ├── admin.js               # Admin dashboard logic
│   ├── teacher.js             # Teacher dashboard logic
│   ├── student.js             # Student dashboard logic
│   ├── student-detail.js      # Student detail logic
│   ├── report.js              # Report generation logic
│   └── data.js                # Mock data and utilities
│
└── assets/
    ├── images/                # Image assets
    └── icons/                 # Icon assets
```

## Color Palette - Doodle Rosa y Negro

### Primary Colors
- Primary Pink: `#FF69B4` (Hot Pink)
- Dark Pink: `#FF1493` (Deep Pink)
- Light Pink: `#FFB6C1` (Light Pink)
- Black: `#000000`
- Dark Gray: `#2F2F2F`
- Light Gray: `#E0E0E0`
- White: `#FFFFFF`

### Accent Colors
- Accent Pink: `#FF6B9D`
- Accent Gray: `#5A5A5A`

## System Components

### 1. Authentication Module
- Simple login simulation with role selection
- Session management with localStorage
- Role-based routing

### 2. Data Models

#### Student Model
```javascript
{
  id: "string",
  name: "string",
  email: "string",
  course: "string",
  enrollmentDate: "date"
}
```

#### Course Model
```javascript
{
  id: "string",
  name: "string",
  teacher: "string",
  schedule: "string"
}
```

#### Absence Model
```javascript
{
  id: "string",
  studentId: "string",
  courseId: "string",
  type: "1|2|3", // 1: Tardanza, 2: Ausencia justificada, 3: Ausencia injustificada
  category: "string", // Académica, Comportamiento, etc.
  situation: "string", // Pendiente, Resuelta, etc.
  sanction: "string", // Advertencia, Suspensión, Expulsión, etc.
  date: "date",
  comments: "string"
}
```

### 3. User Roles and Permissions

#### Administrator
- Can add/remove students
- Can add/remove courses
- Can view all reports

#### Teacher
- Can register/modify/delete absences
- Can view student details
- Can generate reports for their courses

#### Student
- Can view their own information
- Can view their absence history
- Can add comments to their absences

### 4. Pages and Features

#### Login Page
- Role selection (Admin, Teacher, Student)
- Simple authentication simulation

#### Admin Dashboard
- Student management (CRUD)
- Course management (CRUD)
- Navigation to reports

#### Teacher Dashboard
- Absence registration form
- Absence list with filtering options
- Student search functionality
- Quick actions for absence management

#### Student Dashboard
- Personal information display
- Absence history list
- Comment submission form

#### Student Detail View
- Comprehensive student information
- Detailed absence history with all attributes
- Ability to add comments to specific absences

#### Report Generation
- Summary statistics
- Filter by date range, course, student
- Export options (simulated)

## Technical Implementation Details

### Data Storage
- Use localStorage for mock data persistence
- Create initial mock data on first load
- Implement data access utilities

### Responsive Design
- Mobile-first approach
- Flexible grid system
- Media queries for different screen sizes
- Touch-friendly interface elements

### JavaScript Architecture
- Modular approach with separate files for each feature
- Event-driven programming
- DOM manipulation for dynamic content
- Form validation for data integrity

### CSS Architecture
- BEM methodology for class naming
- CSS custom properties for theme management
- Responsive utility classes
- Component-based styling

## Future Backend Integration
- All data operations will use a service layer
- API calls will be simulated with setTimeout
- Easy replacement of mock services with real API calls
- Consistent data structures for seamless transition