# CRM (Customer Relationship Management) System

A modern, full-stack CRM system built with React, Material-UI, Node.js, and MySQL. This system helps manage clients, projects, and team collaboration efficiently.

## Table of Contents
- [CRM (Customer Relationship Management) System](#crm-customer-relationship-management-system)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Authentication \& Authorization](#authentication--authorization)
    - [Client Management](#client-management)
    - [Project Management](#project-management)
    - [User Management](#user-management)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Development Tools](#development-tools)
  - [Prerequisites](#prerequisites)
  - [Installation and Setup](#installation-and-setup)

## Features

### Authentication & Authorization
- Secure user authentication with JWT
- Role-based access control (Admin, Manager, Developer, User)
- Protected routes and API endpoints
- Password encryption with bcrypt
- Session management

### Client Management
- Comprehensive client profiles
- Contact history tracking
- Document management system
- Notes and comments functionality
- Advanced search and filter capabilities
- Status tracking and updates
- Client activity timeline
- Document version control

### Project Management
- Project creation and tracking
- Team assignment and management
- Task creation and assignment
- Progress tracking with milestones
- Deadline management
- Budget tracking and reporting
- Resource allocation
- Project timeline visualization
- Task dependencies
- Project templates

### User Management
- User roles and permissions
- Team management
- Profile management
- Activity tracking
- Performance metrics
- Time tracking
- Skill matrix
- Training records

## Tech Stack

### Frontend
- React.js 18.x (Create React App)
- Material-UI (MUI) v5.x for UI components
- React Router v6.x for navigation
- Axios for API requests
- Context API for state management
- Chart.js for data visualization
- Material Icons
- React PDF viewer
- Date-fns for date manipulation

### Backend
- Node.js 14.x+
- Express.js 4.x
- MySQL 8.x
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- Multer for file uploads
- Nodemailer for email
- Winston for logging
- Express-validator for validation

### Development Tools
- ESLint
- Prettier
- Husky for pre-commit hooks
- Jest for testing
- Supertest for API testing
- Docker for containerization
- PM2 for process management

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- MySQL (v8.0 or later)
- npm or yarn package manager
- Git
- Docker (optional)
- Redis (optional, for caching)

## Installation and Setup

1. Clone the repository
```bash
git clone <repository-url>
cd crm-project