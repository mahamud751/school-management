# System Architecture

## High-Level Architecture

```mermaid
graph TB
    A[Client Browser] --> B[Next.js Frontend]
    B --> C[Next.js API Routes]
    C --> D[(PostgreSQL Database)]
    C --> E[Prisma ORM]
    B --> F[NextAuth.js]
    F --> D
    F --> E

    subgraph Frontend
        B
    end

    subgraph Backend
        C
        E
        F
    end

    subgraph Data
        D
    end
```

## Module Architecture

```mermaid
graph TD
    A[User Interface] --> B[Authentication]
    A --> C[Dashboard]
    A --> D[Student Management]
    A --> E[Teacher Management]
    A --> F[Class Management]
    A --> G[Attendance Management]
    A --> H[Exam Management]
    A --> I[Fee Management]

    B --> J[NextAuth API]
    C --> K[Dashboard API]
    D --> L[Student API]
    E --> M[Teacher API]
    F --> N[Class API]
    G --> O[Attendance API]
    H --> P[Exam API]
    I --> Q[Fee API]

    J --> R[Database]
    K --> R
    L --> R
    M --> R
    N --> R
    O --> R
    P --> R
    Q --> R

    subgraph "Frontend Layer"
        A
    end

    subgraph "API Layer"
        B
        C
        D
        E
        F
        G
        H
        I
    end

    subgraph "Service Layer"
        J
        K
        L
        M
        N
        O
        P
        Q
    end

    subgraph "Data Layer"
        R[PostgreSQL Database]
    end
```

## Database Schema Overview

```mermaid
erDiagram
    USER ||--o{ ADMIN : has
    USER ||--o{ TEACHER : has
    USER ||--o{ STUDENT : has
    USER ||--o{ PARENT : has
    USER ||--o{ NOTIFICATION : receives
    STUDENT ||--o{ ATTENDANCE : records
    STUDENT ||--o{ RESULT : achieves
    STUDENT ||--o{ FEE : pays
    STUDENT ||--o{ ENROLLMENT : enrolls
    TEACHER ||--o{ ATTENDANCE : takes
    CLASS ||--o{ STUDENT : contains
    CLASS ||--o{ SECTION : divided_into
    CLASS ||--o{ EXAM : schedules
    SUBJECT ||--o{ CLASS_SUBJECT : belongs_to
    CLASS ||--o{ CLASS_SUBJECT : has
    EXAM ||--o{ RESULT : generates
```

## Technology Stack

```mermaid
graph LR
    A[Next.js] --> B[React 19]
    A --> C[TypeScript]
    A --> D[Tailwind CSS]
    A --> E[NextAuth.js]
    F[Prisma] --> G[PostgreSQL]
    A --> F
    H[Headless UI] --> A
    I[Heroicons] --> A
    J[Framer Motion] --> A
```

## Component Architecture

```mermaid
graph TD
    A[App Layout] --> B[Sidebar Navigation]
    A --> C[Main Content]
    C --> D[Page Components]
    D --> E[Dashboard Page]
    D --> F[Module Pages]
    E --> G[Stat Cards]
    E --> H[Animated Cards]
    F --> I[Data Tables]
    F --> J[Search Components]
    G --> K[Framer Motion]
    H --> K
    I --> K
    J --> K

    subgraph "UI Components"
        B
        G
        H
        I
        J
    end

    subgraph "Animation Library"
        K
    end
```
