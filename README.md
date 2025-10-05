# School Management System (SMS)

## Overview

This is a comprehensive School Management System built with modern web technologies including Next.js, Prisma ORM, and PostgreSQL. The system provides a complete solution for managing academic and administrative processes in educational institutions with a beautiful, animated interface.

## Features Implemented

### Authentication

- User authentication with NextAuth.js
- Role-based access control (Admin, Teacher, Student, Parent)
- Secure password hashing with bcrypt
- Animated login page with demo credentials
- **Session persistence across page reloads**

### Core Modules with Full CRUD Operations

1. **Admin Panel**

   - Dashboard with analytics and recent activity
   - User management

2. **Student Management**

   - Student listing and management
   - Enrollment tracking
   - Search functionality
   - **Full CRUD operations (Create, Read, Update, Delete)**

3. **Teacher Management**

   - Teacher listing and management
   - Subject assignments
   - Search functionality
   - **Full CRUD operations (Create, Read, Update, Delete)**

4. **Class & Subject Management**

   - Class and section management
   - Subject allocation
   - Search functionality
   - **Full CRUD operations (Create, Read, Update, Delete)**

5. **Attendance Management**

   - Attendance tracking
   - Status management (Present, Absent, Late, Excused)
   - **Full CRUD operations (Create, Read, Update, Delete)**

6. **Exam & Grading System**

   - Exam scheduling
   - Result management
   - **Full CRUD operations (Create, Read, Update, Delete)**

7. **Fee Management**

   - Fee tracking
   - Payment status
   - **Full CRUD operations (Create, Read, Update, Delete)**

8. **Library Management**

   - Book catalog
   - Borrowing system
   - _Coming soon_

9. **Transport Management**
   - Bus routes
   - Student tracking
   - _Coming soon_

### Enhanced UI/UX Features

- **Beautiful Animations**: Powered by Framer Motion for smooth transitions and interactions
- **Modern Design**: Clean, responsive interface using Tailwind CSS
- **Dashboard Analytics**: Visual statistics and recent activity tracking
- **Search Functionality**: Real-time filtering across all modules
- **Responsive Layout**: Works on all device sizes
- **Interactive Components**: Hover effects, loading states, and error handling
- **Modal Forms**: Intuitive forms for creating and editing records
- **Collapsible Sidebar**: Expandable/collapsible navigation sidebar
- **Mobile-Friendly**: Optimized for mobile devices with hamburger menu

## Technology Stack

- **Frontend**: Next.js 15 with React Server Components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Animations**: Framer Motion
- **State Management**: React Hooks

## Database Schema

The system includes a comprehensive database schema with the following models:

- User (with role-based access)
- Admin, Teacher, Student, Parent
- Class, Section
- Subject
- Attendance
- Exam, Result
- Fee
- Notification
- Enrollment

## API Endpoints

All endpoints support full CRUD operations:

- `/api/auth/*` - Authentication routes
- `/api/students` - Student management (GET, POST, PUT, DELETE)
- `/api/teachers` - Teacher management (GET, POST, PUT, DELETE)
- `/api/classes` - Class management (GET, POST, PUT, DELETE)
- `/api/sections` - Section management (GET, POST)
- `/api/subjects` - Subject management (GET, POST, PUT, DELETE)
- `/api/attendance` - Attendance tracking (GET, POST, PUT, DELETE)
- `/api/exams` - Exam management (GET, POST, PUT, DELETE)
- `/api/fees` - Fee management (GET, POST, PUT, DELETE)

## Setup Instructions

1. **Database Setup**

   ```bash
   # Start local PostgreSQL
   brew services start postgresql

   # Create database
   createdb school_management
   ```

2. **Environment Configuration**
   Create a `.env` file with:

   ```
   DATABASE_URL="postgresql://postgres:2742@localhost:5432/school?schema=public"
   JWT_SECRET='super-secret'
   PORT=8080
   NEXTAUTH_SECRET="school_management_secret_key_12345"
   ```

3. **Installation**

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   ```

4. **Development**
   ```bash
   npm run dev
   ```

## Seeded Data

The database is pre-populated with:

- Admin user: admin@school.com / admin123
- Sample classes and sections
- Sample subjects

## Session Persistence

The application now properly handles session persistence across page reloads:

- Sessions are stored using JWT with a 30-day expiration
- Session data is preserved in the browser
- Users remain logged in after refreshing the page
- Automatic redirection to login when session expires

## Enhanced Navigation

The application features a modern sidebar navigation system with:

- Collapsible/expandable sidebar
- Mobile-friendly hamburger menu
- Intuitive organization of modules
- Visual indicators for active pages
- User profile and logout functionality

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard pages
│   ├── login/           # Authentication pages
│   └── [module]/        # Module-specific pages
├── components/          # Reusable UI components
├── context/             # React context providers
├── lib/                 # Utility functions and services
│   ├── auth.ts          # Authentication configuration
│   ├── db.ts            # Database client
│   ├── hooks.ts         # Custom React hooks
│   └── password.ts      # Password utilities
├── types/               # TypeScript type definitions
prisma/
├── schema.prisma        # Database schema
└── seed.ts             # Database seeding script
```

## Future Enhancements

- Parent portal with communication features
- Advanced reporting and analytics
- Mobile application
- Payment gateway integration
- SMS/Email notifications
- Library management
- Transportation management
