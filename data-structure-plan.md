# Data Structure Plan

## Overview
This document outlines the plan to move from localStorage-based data storage to a single JSON file approach for the IEVE absence reporting system.

## Current Data Structure
The application currently uses localStorage with separate keys for different data types:
- `ieve_students`: Array of student objects
- `ieve_courses`: Array of course objects
- `ieve_absences`: Array of absence objects
- `ieve_users`: Array of user objects

## Proposed Consolidated JSON Structure
```json
{
  "students": [...],
  "courses": [...],
  "absences": [...],
  "users": [...]
}
```

## Implementation Steps

1. Create a DataManager class with methods to:
   - Load data from the JSON file
   - Save data to the JSON file
   - Get all items of a specific type
   - Get an item by ID
   - Create a new item
   - Update an existing item
   - Delete an item

2. Replace all localStorage operations with DataManager methods

3. Update initialization logic to use the new DataManager

4. Update all view components to use the new DataManager

## DataManager Methods
- `loadData()`: Load data from JSON file
- `saveData()`: Save data to JSON file
- `getAllStudents()`: Get all students
- `getStudentById(id)`: Get a student by ID
- `createStudent(student)`: Create a new student
- `updateStudent(id, student)`: Update an existing student
- `deleteStudent(id)`: Delete a student
- Similar methods for courses, absences, and users

## Execution Instructions
1. Create the data.json file with initial data
2. Create the DataManager class in a separate JavaScript file
3. Update main.js to use DataManager for initialization
4. Update all view files to use DataManager instead of localStorage methods