# REPORTE DE FALTAS IEVE - Frontend System

## Overview

This repository contains the frontend implementation of the "REPORTE DE FALTAS IEVE" system, a web application for managing student absences in an educational institution. The system is designed for three user roles: administrators, teachers, and students.

## System Features

### User Roles

1. **Administrators**
   - Manage students (add, edit, delete)
   - Manage courses (add, edit, delete)
   - View system reports

2. **Teachers**
   - Register, modify, and delete student absences
   - View student details and absence history
   - Generate reports for their courses

3. **Students**
   - View personal information
   - View absence history
   - Add comments to their absences

### Core Functionality

- Role-based authentication system
- Student and course management
- Absence registration and tracking
- Detailed student views with absence history
- Comment system for students
- Report generation and filtering
- Responsive design for all device sizes

## Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Styling with a custom "doodle rosa y negro" theme
- **JavaScript (ES6+)**: Interactivity and data management
- **LocalStorage**: Client-side data persistence (simulated backend)
- **No external libraries**: Pure vanilla implementation

## Project Structure

```
REPORTE-DE-FALTAS-IEVE/
│
├── index.html                 # Entry point
├── login.html                 # Authentication page
├── admin-dashboard.html       # Admin interface
├── teacher-dashboard.html     # Teacher interface
├── student-dashboard.html     # Student interface
├── student-detail.html        # Student detail view
├── report.html                # Report generation interface
│
├── css/                       # Stylesheets
│   ├── base.css               # Base styles and reset
│   ├── components.css         # Reusable component styles
│   ├── layout.css             # Layout and grid system
│   ├── themes.css             # Theme variables and doodle styles
│   ├── utilities.css          # Utility classes
│   └── views/                 # View-specific styles
│
├── js/                        # JavaScript files
│   ├── utils/                 # Utility functions
│   ├── services/              # Data service layer
│   ├── components/            # Reusable components
│   └── views/                 # View-specific logic
│
└── assets/                    # Static assets
    ├── images/                # Static images
    └── icons/                 # Icon assets
```

## Color Palette - Doodle Rosa y Negro

- **Primary Pink**: `#FF69B4` (Hot Pink)
- **Dark Pink**: `#FF1493` (Deep Pink)
- **Light Pink**: `#FFB6C1` (Light Pink)
- **Black**: `#000000`
- **Dark Gray**: `#2F2F2F`
- **Light Gray**: `#E0E0E0`
- **White**: `#FFFFFF`

## Data Models

### Student
```javascript
{
  id: string,
  name: string,
  email: string,
  course: string,
  enrollmentDate: Date
}
```

### Course
```javascript
{
  id: string,
  name: string,
  teacher: string,
  schedule: string
}
```

### Absence
```javascript
{
  id: string,
  studentId: string,
  courseId: string,
  type: number,         // 1: Tardanza, 2: Ausencia justificada, 3: Ausencia injustificada
  category: string,     // Académica, Comportamiento, etc.
  situation: string,    // Pendiente, Resuelta, etc.
  sanction: string,     // Advertencia, Suspensión, Expulsión, etc.
  date: Date,
  comments: string
}
```

## Implementation Progress

- [x] Project structure and file organization
- [x] Color palette and theme design
- [x] Data models and mock data structure
- [x] UI/UX design specifications
- [x] Technical specification
- [x] Development plan
- [x] Login page implementation
- [x] Admin dashboard implementation
- [x] Teacher dashboard implementation
- [x] Student dashboard implementation
- [x] Student detail view implementation
- [x] Report generation implementation
- [x] Responsive design
- [x] Testing and refinement
- [x] Documentation

## Getting Started

1. Clone the repository
2. Open `index.html` in a web browser
3. Use the following credentials for testing:
   - Admin: username "admin"
   - Teacher: username "teacher1" or "teacher2"
   - Student: username "student1" or "student2"

## Documentation

- [Project Structure](project-structure.md)
- [System Architecture](system-architecture.md)
- [Data Models](data-models.md)
- [UI/UX Design](ui-ux-design.md)
- [Technical Specification](technical-specification.md)
- [Development Plan](development-plan.md)
- [Test Plan](test-plan.md)
- [Backend Integration Guide](backend-integration.md)
- [User Guide](user-guide.md)

## Contributing

This project is currently in development. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is for educational purposes and does not have a formal license.

## Contact

For questions about this project, please open an issue in the repository.