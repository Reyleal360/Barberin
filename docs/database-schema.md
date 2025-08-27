# Database Schema Design

## Entities

### Students
- id (VARCHAR, PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR)
- course_id (VARCHAR, FOREIGN KEY to Courses.id)
- enrollment_date (DATE)

### Courses
- id (VARCHAR, PRIMARY KEY)
- name (VARCHAR)
- teacher (VARCHAR)
- schedule (VARCHAR)

### Absences
- id (VARCHAR, PRIMARY KEY)
- student_id (VARCHAR, FOREIGN KEY to Students.id)
- course_id (VARCHAR, FOREIGN KEY to Courses.id)
- type (INT)
- category (VARCHAR)
- situation (VARCHAR)
- sanction (VARCHAR)
- date (DATE)
- comments (TEXT)

### Users
- id (VARCHAR, PRIMARY KEY)
- username (VARCHAR)
- role (VARCHAR)

## Relationships

1. Students belong to one Course (many-to-one)
2. Absences belong to one Student and one Course (many-to-one for both)
3. Users are separate entities for authentication

## Schema Diagram

```
Students
--------
id (PK)
name
email
course_id (FK -> Courses.id)
enrollment_date

Courses
-------
id (PK)
name
teacher
schedule

Absences
--------
id (PK)
student_id (FK -> Students.id)
course_id (FK -> Courses.id)
type
category
situation
sanction
date
comments

Users
-----
id (PK)
username
role