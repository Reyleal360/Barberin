# Data Structure Plan

## Overview
This document outlines the plan to move from localStorage-based data storage to a MySQL database with a Node.js backend API for the IEVE absence reporting system.

## Current Data Structure
The application currently uses localStorage with separate keys for different data types:
- `ieve_students`: Array of student objects
- `ieve_courses`: Array of course objects
- `ieve_absences`: Array of absence objects
- `ieve_users`: Array of user objects

## Proposed Database Structure
Instead of a single JSON file, we will use a MySQL database with the following tables:
- `students`: Table for student data
- `courses`: Table for course data
- `absences`: Table for absence data
- `users`: Table for user data

## Implementation Steps

1. Create a DataManager class with methods to:
   - Load data from the backend API
   - Save data to the backend API
   - Get all items of a specific type
   - Get an item by ID
   - Create a new item
   - Update an existing item
   - Delete an item

2. Replace all localStorage operations with DataManager methods that use backend API calls

3. Update initialization logic to use the new DataManager

4. Update all view components to use the new DataManager

## DataManager Methods
- `loadData()`: Load data from backend API
- `getAllStudents()`: Get all students
- `getStudentById(id)`: Get a student by ID
- `createStudent(student)`: Create a new student
- `updateStudent(id, student)`: Update an existing student
- `deleteStudent(id)`: Delete a student
- Similar methods for courses, absences, and users

## Execution Instructions
1. Create the MySQL database and initialize it with the database-init.sql script
2. Start the Node.js backend server
3. Create the DataManager class in a separate JavaScript file
4. Update main.js to use DataManager for initialization
5. Update all view files to use DataManager instead of localStorage methods